"""
Expert nodes for tech stack recommendation.
"""
from dotenv import load_dotenv
from app.core.llm import openai_nano_llm, openai_mini_llm
from deepagents import create_deep_agent
from langchain.agents.structured_output import ProviderStrategy
from app.agents.recommend.state import RecommendationState
from app.agents.tools.search import restricted_search
from app.agents.recommend.schemas.expert import TechList
from typing import Any
from app.agents.recommend.prompts.user_prompts import EXPERT_USER_PROMPT
from app.agents.recommend.prompts.system_prompts import (
    FE_SYSTEM_PROMPT,
    BE_SYSTEM_PROMPT,
    ADVANCE_SYSTEM_PROMPT,
)
from app.agents.prompts.system.global_context import GLOBAL_CONTEXT
import logging

logger = logging.getLogger(__name__)

load_dotenv()

llm = openai_mini_llm
tools = [restricted_search]


def create_expert_agent(system_prompt: str):
    return create_deep_agent(
        llm, 
        tools, 
        system_prompt=system_prompt, 
        response_format=ProviderStrategy(TechList),
    )


frontend_executor = create_expert_agent(FE_SYSTEM_PROMPT)
backend_executor = create_expert_agent(BE_SYSTEM_PROMPT)
advance_executor = create_expert_agent(ADVANCE_SYSTEM_PROMPT)


def run_expert_node(state: RecommendationState, executor: Any):
    from langchain.agents.structured_output import StructuredOutputValidationError
    
    task_type = state.get("task_type")
    user_task = state.get("node_name")
    task_description = state.get("node_description")
    feedback = state.get("feedback")
    
    workspace_info = state.get("workspace_info")
    headcount = state.get("headcount")
    excluded_tech_stacks = state.get("excluded_tech_stacks")

    if workspace_info:
        workspace_context = GLOBAL_CONTEXT.format(
            project_tech_stack=[
                tech.name for tech in workspace_info.workspace_tech_stacks
            ],
            project_headcount=headcount,
            project_purpose=workspace_info.purpose,
            start_date=workspace_info.start_date,
            end_date=workspace_info.end_date,
            project_description=workspace_info.description,
        )
    else:
        workspace_context = "[프로젝트 정보가 없습니다.]"

    
    # 제외할 기술 스택 컨텍스트 생성
    if excluded_tech_stacks and len(excluded_tech_stacks) > 0:
        excluded_context = f"""[제외할 기술 스택]
    다음 기술들은 이미 이전에 추천받은 기술입니다. 이 기술들을 제외하고 다른 기술을 추천해 주세요:
    - {', '.join(excluded_tech_stacks)}
    """
    else:
        excluded_context = ""
    
    prompt_msg = EXPERT_USER_PROMPT.format(
        task_type=task_type, 
        user_task=user_task, 
        task_description=task_description, 
        workspace_info=workspace_context, 
        excluded_tech_stacks=excluded_context,
    )
    
    if feedback:
        prompt_msg += f"\n\n[이전 추천에 대한 피드백]\n{feedback}\n\n위 피드백을 반영하여 다시 추천해주세요."

    try:
        response = executor.invoke(
            {
                "messages": [
                    (
                        "user",
                        prompt_msg,
                    )
                ]
            }
        )
        output = response.get("structured_response")
        if output is None:
            logger.warning(f"경고: {user_task}에 대한 구조화된 응답(Tool Call)이 없습니다.")
            return {"tech_list": TechList(techs=[], comparison=""), "last_error": None}
        logger.info(output)
        return {"tech_list": output, "last_error": None}
    
    except StructuredOutputValidationError as e:
        error_message = str(e)
        logger.error(f"구조화된 출력 검증 실패: {error_message}")
        return {"last_error": error_message}


def frontend_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, frontend_executor)


def backend_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, backend_executor)


def advance_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, advance_executor)


def expert_route(state: RecommendationState) -> RecommendationState:
    """초기화 노드 - last_error를 초기화"""
    return {"last_error": None}
