from app.agents.states.state import NodeState
from app.core.llm import mini_llm
from langchain.agents import create_agent
from langchain.agents.structured_output import ProviderStrategy
from langchain_core.messages import HumanMessage
from app.agents.schemas.analysis import TaskAnalysis

llm = mini_llm


from app.agents.prompts.system.process_prompts import (
    EPIC_PROCESS_PROMPT,
    STORY_PROCESS_PROMPT,
    TASK_PROCESS_PROMPT,
    ADVANCE_PROCESS_PROMPT,
)
from app.agents.prompts.user.process_prompts import (
    EPIC_USER_PROMPT,
    STORY_USER_PROMPT,
    TASK_USER_PROMPT,
    ADVANCE_USER_PROMPT,
)
from app.agents.schemas.process import (
    BaseNodeProcessResult,
    EpicProcessResult,
    StoryProcessResult,
    TaskProcessResult,
    AdvanceProcessResult,
)
from typing import Type, Any
from langchain_core.runnables import Runnable


def create_process_agent(
    system_prompt: str, schema: Type[BaseNodeProcessResult]
) -> Runnable:
    """프로세스 노드용 에이전트 생성 팩토리"""
    # tools 리스트가 비어있어도 create_agent는 동작합니다 (LLM 전용)
    return create_agent(
        llm,
        tools=[],
        system_prompt=system_prompt,
        response_format=ProviderStrategy(schema),
    )


# 각 노드 타입별 에이전트 사전 생성 (Static)
epic_agent = create_process_agent(EPIC_PROCESS_PROMPT, EpicProcessResult)
story_agent = create_process_agent(STORY_PROCESS_PROMPT, StoryProcessResult)
task_agent = create_process_agent(TASK_PROCESS_PROMPT, TaskProcessResult)
advance_agent = create_process_agent(ADVANCE_PROCESS_PROMPT, AdvanceProcessResult)


def _process_node(state: NodeState, user_prompt: str, agent: Runnable) -> NodeState:
    """공통 노드 처리 로직"""
    workspace_info = state.get("workspace_info")
    parent_info = state.get("parent_info")
    candidate_info = state.get("current_candidate_info")

    if not candidate_info:
        raise ValueError("current_candidate_info가 없습니다.")

    # User Prompt 포맷팅
    formatted_user_prompt = user_prompt.format(
        workspace_info=workspace_info,
        parent_info=parent_info,
        candidate_info=candidate_info,
    )

    try:
        # Agent 실행
        response = agent.invoke(
            {"messages": [HumanMessage(content=formatted_user_prompt)]}
        )
        result = response.get("structured_response")

        if result:
            # 결과 반환
            return {"generated_node_detail": result.model_dump()}
        else:
            print("Node processing returned no structured response")
            return {
                "generated_node_detail": None,
                "last_error": "No structured response",
            }

    except Exception as e:
        print(f"Node processing failed: {e}")
        return {"generated_node_detail": None, "last_error": str(e)}


def epic_node_process(state: NodeState) -> NodeState:
    return _process_node(state, EPIC_USER_PROMPT, epic_agent)


def story_node_process(state: NodeState) -> NodeState:
    return _process_node(state, STORY_USER_PROMPT, story_agent)


def task_node_process(state: NodeState) -> NodeState:
    """Candidate와 부모 정보를 기반으로 상세 태스크 정보를 생성합니다."""
    return _process_node(state, TASK_USER_PROMPT, task_agent)


def advance_node_process(state: NodeState) -> NodeState:
    return _process_node(state, ADVANCE_USER_PROMPT, advance_agent)
