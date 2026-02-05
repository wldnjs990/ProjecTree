from app.agents.node.state import NodeState
from app.core.llm import openai_mini_llm, opendai_reasoning_llm, openai_nano_llm
from app.agents.tools.validator import validate_description, validate_summary
from langchain.agents import create_agent
from langchain.agents.structured_output import ProviderStrategy
from langchain_core.messages import HumanMessage
from langchain_core.runnables import RunnableConfig
from langchain.output_parsers import PydanticOutputParser
from langchain_core.exceptions import OutputParserException
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

llm = openai_nano_llm


async def _process_node(
    state: NodeState,
    user_prompt: str,
    system_prompt: str,
    schema: Type[BaseNodeProcessResult],
    config: RunnableConfig = None,
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
        # Agent 동적 생성 및 실행
        parser = PydanticOutputParser(pydantic_object=schema)

        # System Prompt에 포맷 가이드 추가
        system_prompt_with_format = f"{system_prompt}\n\n{parser.get_format_instructions()}\n\n반드시 위의 JSON 형식을 엄수하여 최종 답변을 작성하세요."

        # create_agent에서 response_format 제거 -> ReAct/Tool 모드 활성화
        agent = create_agent(
            llm,
            tools=[validate_description],
            system_prompt=system_prompt_with_format,
        )

        # 3. 비동기 실행 (ainvoke)
        response = await agent.ainvoke(
            {"messages": [HumanMessage(content=formatted_user_prompt)]}, config=config
        )

        # 응답 처리: AgentExecutor 스타일 vs LangGraph 스타일 대응
        output_text = ""
        if isinstance(response, dict):
            if "output" in response:
                output_text = response["output"]
            elif "messages" in response and response["messages"]:
                output_text = response["messages"][-1].content

        # 파싱
        try:
            result = parser.parse(output_text)
            return {"generated_node": result.model_dump()}
        except OutputParserException as e:
            return {
                "generated_node": None,
                "last_error": f"Parsing failed: {str(e)}",
            }

    except Exception as e:
        return {"generated_node": None, "last_error": str(e)}


async def epic_node_process(
    state: NodeState, config: RunnableConfig = None
) -> NodeState:
    return await _process_node(
        state, EPIC_USER_PROMPT, EPIC_PROCESS_PROMPT, EpicProcessResult, config
    )


async def story_node_process(
    state: NodeState, config: RunnableConfig = None
) -> NodeState:
    return await _process_node(
        state, STORY_USER_PROMPT, STORY_PROCESS_PROMPT, StoryProcessResult, config
    )


async def task_node_process(
    state: NodeState, config: RunnableConfig = None
) -> NodeState:
    """Candidate와 부모 정보를 기반으로 상세 태스크 정보를 생성합니다."""
    return await _process_node(
        state, TASK_USER_PROMPT, TASK_PROCESS_PROMPT, TaskProcessResult, config
    )


async def advance_node_process(
    state: NodeState, config: RunnableConfig = None
) -> NodeState:
    return await _process_node(
        state, ADVANCE_USER_PROMPT, ADVANCE_PROCESS_PROMPT, AdvanceProcessResult, config
    )
