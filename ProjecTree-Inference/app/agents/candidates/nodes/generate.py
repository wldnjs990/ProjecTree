"""
Generate candidate nodes.
"""

from langchain.agents.structured_output import ProviderStrategy
from langchain_core.runnables import RunnableConfig
from app.agents.candidates.state import CandidateNodeState
from app.agents.enums import NodeType
from langchain.agents import create_agent
from app.agents.tools.validator import validate_summary
from langchain_core.messages import HumanMessage
from app.core.llm import openai_nano_llm, openai_mini_llm
from app.agents.candidates.schemas.candidate import CandidateList, TaskCandidateList
from app.agents.candidates.prompts.system_prompts import (
    EPIC_SYS,
    STORY_SYS,
    TASK_SYS,
    PROJECT_CANDIDATE_SYS,
)
from app.agents.candidates.prompts.user_prompts import CANDIDATE_USER_PROMPT
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


def generate_candidates(state: CandidateNodeState, config: RunnableConfig = None) -> CandidateNodeState:
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
            # Invoke agent with config (callbacks are passed through config)
            response = executor.invoke(
                {"messages": [HumanMessage(content=prompt_msg)]},
                config=config
            )
            output = response.get("structured_response")
            if output:
                return {"candidates": output}
        except Exception as e:
            logger.error(f"Candidate generation agent failed: {e}")
    return {"candidates": CandidateList(candidates=[])}
