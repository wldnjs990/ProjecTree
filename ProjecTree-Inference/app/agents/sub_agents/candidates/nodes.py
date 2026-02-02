from langchain.agents.structured_output import ProviderStrategy
from app.agents.sub_agents.candidates.state import CandidateNodeState
from app.agents.enums import NodeType
from langchain.agents import create_agent
from app.agents.tools.validator import validate_description, validate_summary
from langchain_core.messages import HumanMessage
from app.core.llm import openai_nano_llm, openai_mini_llm
from app.agents.schemas.candidate import CandidateList, TaskCandidateList
from app.agents.sub_agents.candidates.prompts.system_prompts import (
    EPIC_SYS,
    STORY_SYS,
    TASK_SYS,
    PROJECT_CANDIDATE_SYS,
)
from app.agents.sub_agents.candidates.prompts.user_prompts import CANDIDATE_USER_PROMPT
from app.agents.sub_agents.candidates.tools import get_duplicate_check_context
import logging

logger = logging.getLogger(__name__)

llm = openai_mini_llm
tools = [validate_summary]


def create_candidate_agent(system_prompt: str, response_format):
    return create_agent(
        llm,
        tools,
        system_prompt=system_prompt,
        response_format=ProviderStrategy(response_format),
    )


project_agent = create_candidate_agent(PROJECT_CANDIDATE_SYS, CandidateList)
epic_agent = create_candidate_agent(EPIC_SYS, CandidateList)
story_agent = create_candidate_agent(STORY_SYS, CandidateList)
task_agent = create_candidate_agent(TASK_SYS, CandidateList)


def fetch_sibling_context(state: CandidateNodeState) -> CandidateNodeState:
    """
    형제 노드를 조회하여 중복 검사를 수행하는 노드.

    현재 노드의 형제 노드들을 DB에서 조회하고, LLM을 통해 중복 가능성을 분석합니다.
    분석 결과는 sibling_context에 저장되어 후보 생성 시 활용됩니다.
    """
    node_id = state.get("current_node_id")
    node_name = state.get("current_node_name", "")
    node_description = state.get("current_node_description", "")
    node_type = state.get("current_node_type", "")

    # node_id가 없으면 중복 검사를 건너뜀
    if node_id is None:
        return {"sibling_context": None}

    try:
        # 형제 노드 중복 검사 수행
        context = get_duplicate_check_context(
            node_id=node_id,
            node_name=node_name,
            node_description=node_description,
            node_type=(
                str(node_type.value) if hasattr(node_type, "value") else str(node_type)
            ),
        )
        return {"sibling_context": context}
    except Exception as e:
        return {"sibling_context": None}


def generate_candidates(state: CandidateNodeState) -> CandidateNodeState:
    """후보 노드를 생성하는 노드"""
    node_type = state.get("current_node_type", "")
    node_name = state.get("current_node_name", "")
    node_description = state.get("current_node_description", "")
    service_type = state.get("service_type", "")
    sibling_context = state.get("sibling_context", "")
    candidate_count = state.get("candidate_count", 3)  # 기본값 3개
    feedback = state.get("feedback")  # 이전 시도의 피드백
    retry_count = state.get("retry_count", 0) or 0

    if not node_name or not node_description:
        return {"candidates": CandidateList(candidates=[])}

    # 노드 타입에 따른 생성 개수 지시 생성
    if node_type == NodeType.STORY:
        # STORY -> TASK: FE k개 + BE k개 = 총 2k개
        count_instruction = f"[FE] 프론트엔드 태스크 {candidate_count}개와 [BE] 백엔드 태스크 {candidate_count}개를 생성하세요. (총 {candidate_count * 2}개)"
    else:
        # 그 외: k개 생성
        count_instruction = f"총 {candidate_count}개의 후보를 생성하세요."

    # 프롬프트에 형제 노드 컨텍스트 포함
    prompt_msg = CANDIDATE_USER_PROMPT.format(
        node_type=node_type,
        service_type=service_type,
        node_name=node_name,
        node_description=node_description,
        count_instruction=count_instruction,
    )
    if sibling_context:
        prompt_msg += f"\n\n---\n{sibling_context}\n---\n위의 중복 검사 결과를 참고하여 기존 노드들과 중복되지 않는 새로운 후보를 생성하세요."

    # 피드백이 있으면 프롬프트에 추가 (재시도 시)
    if feedback and retry_count > 0:
        prompt_msg += f"\n\n**이전 시도 피드백 (재시도 {retry_count}회차)**\n{feedback}\n\n위 피드백을 반영하여 다시 생성해주세요."
    
    executor = None
    if node_type == NodeType.PROJECT:
        executor = project_agent
    elif node_type == NodeType.EPIC:
        executor = epic_agent
    elif node_type == NodeType.STORY:
        executor = story_agent
    elif node_type == NodeType.TASK:
        executor = task_agent
    if executor:
        try:
            # Invoke agent. The agent should call the tool.
            response = executor.invoke({"messages": [HumanMessage(content=prompt_msg)]})
            output = response.get("structured_response")
            if output:
                return {"candidates": output}
        except Exception as e:
            logger.error(f"Candidate generation agent failed: {e}")
    return {"candidates": CandidateList(candidates=[])}


def validate_candidates(state: CandidateNodeState) -> CandidateNodeState:
    """
    생성된 후보 노드를 검증하는 노드.
    검증 항목:
    1. Rule-based 검증: 개수, 빈 값, 접두사, 중복
    2. LLM-based 검증: 명확성, 적절성, 구체성, 내용 품질
    검증 실패 시 피드백 메시지를 생성하여 재생성을 유도합니다.
    """

    from langchain_core.prompts import ChatPromptTemplate
    from pydantic import BaseModel, Field
    from typing import List
    from app.agents.sub_agents.candidates.prompts.validation_prompts import (
        CANDIDATE_VALIDATION_SYSTEM_PROMPT,
        CANDIDATE_VALIDATION_USER_PROMPT,
    )

    candidates_obj = state.get("candidates", {})
    if isinstance(candidates_obj, dict):
        candidate_list = candidates_obj.get("candidates", [])
    else:
        candidate_list = candidates_obj.candidates if candidates_obj else []
    node_type = state.get("current_node_type", "")
    node_name = state.get("current_node_name", "")
    node_description = state.get("current_node_description", "")
    candidate_count = state.get("candidate_count", 3)
    retry_count = state.get("retry_count", 0) or 0
    max_retries = state.get("max_retries", 2) or 2
    feedback_parts = []

    # ========================================
    # Phase 1: Rule-based 검증
    # ========================================
    # 1. 개수 검증
    expected_count = candidate_count
    if node_type == NodeType.STORY:
        expected_count = candidate_count * 2  # FE k개 + BE k개
    if len(candidate_list) < expected_count:
        feedback_parts.append(
            f"[규칙] 후보 개수가 부족합니다. 요청: {expected_count}개, 생성: {len(candidate_list)}개."
        )
    # Helper for safe access
    def _get(item, field_name):
        if isinstance(item, dict):
            return item.get(field_name)
        return getattr(item, field_name, None)

    # 2. 빈 이름/설명 검증
    empty_items = []
    for i, cand in enumerate(candidate_list):
        name = _get(cand, "name")
        desc = _get(cand, "description")
        if not name or not name.strip():
            empty_items.append(f"후보 {i+1}: 이름 누락")
        if not desc or not desc.strip():
            empty_items.append(f"후보 {i+1}: 설명 누락")
    if empty_items:
        feedback_parts.append(f"[규칙] 빈 항목: {', '.join(empty_items)}")
    # 3. STORY->TASK의 경우 [FE]/[BE] 접두사 검증
    if node_type == NodeType.STORY and candidate_list:
        fe_count = sum(
            1 for c in candidate_list if (_get(c, "name") or "").startswith("[FE]")
        )
        be_count = sum(
            1 for c in candidate_list if (_get(c, "name") or "").startswith("[BE]")
        )

        if fe_count < candidate_count:
            feedback_parts.append(
                f"[규칙] [FE] 태스크 부족: {fe_count}/{candidate_count}개"
            )

        if be_count < candidate_count:
            feedback_parts.append(
                f"[규칙] [BE] 태스크 부족: {be_count}/{candidate_count}개"
            )

    # 4. 중복 이름 검증
    names = [_get(c, "name") for c in candidate_list]
    duplicates = set([name for name in names if names.count(name) > 1])
    if duplicates:
        feedback_parts.append(f"[규칙] 중복된 이름: {', '.join(duplicates)}")
    # Rule-based 검증 실패 시 즉시 피드백 반환
    if feedback_parts:
        if retry_count >= max_retries:
            return {
                "is_valid": True,
                "feedback": f"최대 재시도 횟수({max_retries}) 초과. 현재 결과로 종료.",
                "retry_count": retry_count,
            }
        return {
            "is_valid": False,
            "feedback": "\n".join(feedback_parts),
            "retry_count": retry_count + 1,
        }

    # =======================================
    # Phase 2: LLM-based 내용 검증
    # ========================================

    class ValidationResult(BaseModel):
        """LLM 검증 결과"""
        is_valid: bool = Field(description="검증 통과 여부 (score >= 7)")
        score: int = Field(description="품질 점수 (1-10)")
        issues: List[str] = Field(default_factory=list, description="발견된 문제점들")
        feedback: str = Field(description="전체적인 피드백")

    try:
        # 후보 목록을 문자열로 변환
        candidates_str = "\n".join(
            [f"- {_get(c, 'name')}: {_get(c, 'description')}" for c in candidate_list]
        )

        validation_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", CANDIDATE_VALIDATION_SYSTEM_PROMPT),
                ("user", CANDIDATE_VALIDATION_USER_PROMPT),
            ]
        )

        llm_with_structure = llm.with_structured_output(ValidationResult)
        chain = validation_prompt | llm_with_structure
        result = chain.invoke(
            {
                "node_name": node_name,
                "node_description": node_description,
                "node_type": node_type,
                "candidates_str": candidates_str,
            }
        )

        if not result.is_valid:
            # LLM 검증 실패
            if retry_count >= max_retries:
                return {
                    "is_valid": True,
                    "feedback": f"최대 재시도 횟수({max_retries}) 초과. 현재 결과로 종료. (점수: {result.score}/10)",
                    "retry_count": retry_count,
                }
            llm_feedback = f"[내용 검증] 점수: {result.score}/10\n"
            if result.issues:
                llm_feedback += "문제점:\n" + "\n".join(
                    [f"  - {issue}" for issue in result.issues]
                )
            llm_feedback += f"\n\n피드백: {result.feedback}"
            return {
                "is_valid": False,
                "feedback": llm_feedback,
                "retry_count": retry_count + 1,
            }

        # 모든 검증 통과
        return {
            "is_valid": True,
            "feedback": f"검증 통과 (점수: {result.score}/10)",
            "retry_count": retry_count,
        }
    except Exception as e:
        logger.error(f"LLM validation failed: {e}")
        # LLM 검증 실패 시 Rule-based 통과했으므로 통과 처리
        return {
            "is_valid": True,
            "feedback": "Rule-based 검증 통과 (LLM 검증 스킵)",
            "retry_count": retry_count,
        }
