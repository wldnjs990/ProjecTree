"""
Validate generated candidate nodes.
"""
from app.agents.candidates.state import CandidateNodeState
from app.agents.enums import NodeType
from app.core.llm import openai_nano_llm
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from typing import List
from app.agents.candidates.prompts.validation_prompts import (
    CANDIDATE_VALIDATION_SYSTEM_PROMPT,
    CANDIDATE_VALIDATION_USER_PROMPT,
)
import logging

logger = logging.getLogger(__name__)

llm = openai_nano_llm


class ValidationResult(BaseModel):
    """LLM 검증 결과"""
    is_valid: bool = Field(description="검증 통과 여부 (score >= 7)")
    score: int = Field(description="품질 점수 (1-10)")
    issues: List[str] = Field(default_factory=list, description="발견된 문제점들")
    feedback: str = Field(description="전체적인 피드백")


def validate_candidates(state: CandidateNodeState) -> CandidateNodeState:
    """
    생성된 후보 노드를 검증하는 노드.
    검증 항목:
    1. Rule-based 검증: 개수, 빈 값, 접두사, 중복
    2. LLM-based 검증: 명확성, 적절성, 구체성, 내용 품질
    검증 실패 시 피드백 메시지를 생성하여 재생성을 유도합니다.
    """

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
