from app.agents.node.state import NodeState
from app.core.llm import openai_mini_llm, opendai_reasoning_llm, openai_nano_llm
from app.agents.tools.validator import validate_description, validate_summary
from langchain.agents import create_agent
from langchain.agents.structured_output import ProviderStrategy
from langchain_core.messages import HumanMessage
from app.agents.prompts.system.global_context import GLOBAL_CONTEXT
from app.agents.node.prompts.system.process_prompts import (
    EPIC_PROCESS_PROMPT,
    STORY_PROCESS_PROMPT,
    TASK_PROCESS_PROMPT,
    ADVANCE_PROCESS_PROMPT,
)
from app.agents.node.prompts.user.process_prompts import (
    EPIC_USER_PROMPT,
    STORY_USER_PROMPT,
    TASK_USER_PROMPT,
    ADVANCE_USER_PROMPT,
)
from app.agents.node.schemas.process import (
    BaseNodeProcessResult,
    EpicProcessResult,
    StoryProcessResult,
    TaskProcessResult,
    AdvanceProcessResult,
)
from typing import Type, Any
from langchain_core.runnables import Runnable

llm = opendai_reasoning_llm


async def _process_node(
    state: NodeState,
    user_prompt: str,
    system_prompt: str,
    schema: Type[BaseNodeProcessResult],
) -> NodeState:
    """공통 노드 처리 로직 (비동기)"""
    workspace_info = state.get("workspace_info")
    parent_info = state.get("parent_info")
    candidate_info = state.get("current_candidate_info")
    headcount = state.get("headcount")

    if not candidate_info:
        raise ValueError("current_candidate_info가 없습니다.")

    parent_context = f"""[부모 노드의 정보]
    Name:{parent_info.name}, Description:{parent_info.description}
    """
    candidate_context = f"""[현재 구현해야할 후보 노드의 정보]
    이번 작업에서 실제로 구체화 해야할 후보 노드의 정보입니다. 노드의 이름과 설명을 보고 설명을 구체화 해주세요.
    Name:{candidate_info.name}, Description:{candidate_info.description}
    """


    if workspace_info:
        workspace_context = GLOBAL_CONTEXT.format(
            project_tech_stack=[tech.name for tech in workspace_info.workspace_tech_stacks],
            project_headcount=headcount,
            project_purpose=workspace_info.purpose,
            start_date=workspace_info.start_date,
            end_date=workspace_info.end_date,
            project_description=workspace_info.description,
        )
    else:
        workspace_context = "[프로젝트 정보가 없습니다.]"

    # User Prompt 포맷팅
    formatted_user_prompt = user_prompt.format(
        workspace_info=workspace_context,
        parent_info=parent_context,
        candidate_info=candidate_context,
    )

    try:
        # Agent 동적 생성 및 실행
        # 1. Tool 비동기 획득
        # 2. Agent 생성 (매번 생성하는 비용이 크다면 캐싱 고려 가능하지만, Context 관리가 더 중요함)
        agent = create_agent(
            llm,
            tools=[validate_description],
            system_prompt=system_prompt,
            response_format=ProviderStrategy(schema),
        )

        # 3. 비동기 실행 (ainvoke)
        response = await agent.ainvoke(
            {"messages": [HumanMessage(content=formatted_user_prompt)]}
        )
        result = response.get("structured_response")

        if result:
            # 결과 반환
            return {"generated_node": result.model_dump()}
        else:
            return {
                "generated_node": None,
                "last_error": "No structured response",
            }

    except Exception as e:
        return {"generated_node": None, "last_error": str(e)}


async def epic_node_process(state: NodeState) -> NodeState:
    return await _process_node(
        state, EPIC_USER_PROMPT, EPIC_PROCESS_PROMPT, EpicProcessResult
    )


async def story_node_process(state: NodeState) -> NodeState:
    return await _process_node(
        state, STORY_USER_PROMPT, STORY_PROCESS_PROMPT, StoryProcessResult
    )


async def task_node_process(state: NodeState) -> NodeState:
    """Candidate와 부모 정보를 기반으로 상세 태스크 정보를 생성합니다."""
    return await _process_node(
        state, TASK_USER_PROMPT, TASK_PROCESS_PROMPT, TaskProcessResult
    )


async def advance_node_process(state: NodeState) -> NodeState:
    return await _process_node(
        state, ADVANCE_USER_PROMPT, ADVANCE_PROCESS_PROMPT, AdvanceProcessResult
    )
