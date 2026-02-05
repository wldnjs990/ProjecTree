from app.agents.node.state import NodeState
from app.core.llm import openai_mini_llm, opendai_reasoning_llm, openai_nano_llm
from app.agents.tools.validator import validate_description, validate_summary
from langchain.agents import create_agent
from langchain.agents.structured_output import ProviderStrategy
from langchain_core.messages import HumanMessage
from langchain_core.runnables import RunnableConfig
from app.agents.prompts.system.global_context import GLOBAL_CONTEXT
from app.agents.node.prompts.system.process_prompts import (
    EPIC_PROCESS_PROMPT,
    STORY_PROCESS_PROMPT,
    TASK_PROCESS_PROMPT,
    ADVANCE_PROCESS_PROMPT,
    DESCRIPTION_PROCESS_PROMPT,
)
from app.agents.node.prompts.user.process_prompts import (
    EPIC_USER_PROMPT,
    STORY_USER_PROMPT,
    TASK_USER_PROMPT,
    ADVANCE_USER_PROMPT,
    DESCRIPTION_USER_PROMPT,
)
from app.agents.node.schemas.process import (
    BaseNodeInitResult,
    EpicInitResult,
    StoryInitResult,
    TaskInitResult,
    AdvanceInitResult,
    NodeDescriptionResult,
)
from typing import Type, Any

llm = openai_nano_llm


async def _process_node(
    state: NodeState,
    user_prompt: str,
    system_prompt: str,
    schema: Type[BaseNodeInitResult],
    config: RunnableConfig = None,
) -> NodeState:
    """공통 노드 처리 로직 (비동기) - 초기화(Init) 단계"""
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
    이번 작업에서 실제로 구체화 해야할 후보 노드의 정보입니다. 노드의 이름과 설명을 보고 구체화 해주세요.
    Name:{candidate_info.name}, Description:{candidate_info.description}
    """

    if workspace_info:
        workspace_context = GLOBAL_CONTEXT.format(
            project_tech_stack=[
                tech.tech_vocabulary.name
                for tech in workspace_info.workspace_tech_stacks
                if tech.tech_vocabulary
            ],
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
        # Agent: Init 단계이므로 max_tokens은 적당히 유지 (900)
        # validator는 Description 단계에서 사용하므로 여기서는 필요 없을 수 있으나,
        # 혹시 모를 검증을 위해 유지하거나 제거 가능. Init에는 description이 없으므로 validate_description은 필요 없음.
        agent = create_agent(
            llm.bind(max_tokens=900),
            tools=[],  # Init 단계에서는 tool 불필요
            system_prompt=system_prompt,
            response_format=ProviderStrategy(schema),
        )

        response = await agent.ainvoke(
            {"messages": [HumanMessage(content=formatted_user_prompt)]}, config=config
        )
        result = response.get("structured_response")

        if result:
            # 1단계 결과 반환 (description 없음)
            return {"generated_node": result.model_dump()}
        else:
            return {
                "generated_node": None,
                "last_error": "No structured response in Init step",
            }

    except Exception as e:
        return {"generated_node": None, "last_error": str(e)}


async def node_description_process(
    state: NodeState, config: RunnableConfig = None
) -> NodeState:
    """공통 노드 처리 로직 (비동기) - Description 생성 단계"""
    generated_node = state.get("generated_node")
    if not generated_node:
        return {"last_error": "No generated_node found for description step"}

    workspace_info = state.get("workspace_info")
    parent_info = state.get("parent_info")
    headcount = state.get("headcount")

    # Context 재구성
    parent_context = (
        f"Name:{parent_info.name}, Description:{parent_info.description}"
        if parent_info
        else "No Parent Info"
    )
    node_info_context = f"Name: {generated_node.get('name')}, Type: {generated_node.get('node_type', 'N/A')}"

    if workspace_info:
        workspace_context = GLOBAL_CONTEXT.format(
            project_tech_stack=[
                t.tech_vocabulary.name
                for t in workspace_info.workspace_tech_stacks
                if t.tech_vocabulary
            ],
            project_headcount=headcount,
            project_purpose=workspace_info.purpose,
            start_date=workspace_info.start_date,
            end_date=workspace_info.end_date,
            project_description=workspace_info.description,
        )
    else:
        workspace_context = "[프로젝트 정보 없음]"

    formatted_user_prompt = DESCRIPTION_USER_PROMPT.format(
        workspace_info=workspace_context,
        parent_info=parent_context,
        node_info=node_info_context,
    )

    try:
        # Agent: Description 생성 전용. Max Tokens 650.
        agent = create_agent(
            llm.bind(max_tokens=650),
            tools=[validate_description],
            system_prompt=DESCRIPTION_PROCESS_PROMPT,
            response_format=ProviderStrategy(NodeDescriptionResult),
        )

        response = await agent.ainvoke(
            {"messages": [HumanMessage(content=formatted_user_prompt)]}, config=config
        )
        result = response.get("structured_response")

        if result and result.description:
            # 기존 generated_node에 description 병합
            updated_node = generated_node.copy()
            updated_node["description"] = result.description
            return {"generated_node": updated_node}
        else:
            return {"last_error": "Failed to generate description"}

    except Exception as e:
        return {"last_error": f"Description generation error: {str(e)}"}


async def epic_node_process(
    state: NodeState, config: RunnableConfig = None
) -> NodeState:
    return await _process_node(
        state, EPIC_USER_PROMPT, EPIC_PROCESS_PROMPT, EpicInitResult, config
    )


async def story_node_process(
    state: NodeState, config: RunnableConfig = None
) -> NodeState:
    return await _process_node(
        state, STORY_USER_PROMPT, STORY_PROCESS_PROMPT, StoryInitResult, config
    )


async def task_node_process(
    state: NodeState, config: RunnableConfig = None
) -> NodeState:
    """Candidate와 부모 정보를 기반으로 상세 태스크 정보를 생성합니다."""
    return await _process_node(
        state, TASK_USER_PROMPT, TASK_PROCESS_PROMPT, TaskInitResult, config
    )


async def advance_node_process(
    state: NodeState, config: RunnableConfig = None
) -> NodeState:
    return await _process_node(
        state, ADVANCE_USER_PROMPT, ADVANCE_PROCESS_PROMPT, AdvanceInitResult, config
    )
