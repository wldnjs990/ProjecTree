from dotenv import load_dotenv
from app.core.llm import openai_nano_llm
from langchain.agents import create_agent
from langchain.agents.structured_output import ProviderStrategy
from app.agents.sub_agents.recommend.state import RecommendationState
from app.agents.tools.tavily import search_tool
from app.agents.schemas.expert import TechList
from app.agents.tools.tech_db import search_official_tech_name, insert_official_tech_name
from typing import Any
from app.agents.sub_agents.recommend.prompts.user_prompts import EXPERT_USER_PROMPT
from app.agents.sub_agents.recommend.prompts.system_prompts import (
    FE_SYSTEM_PROMPT,
    BE_SYSTEM_PROMPT,
    ADVANCE_SYSTEM_PROMPT,
)

load_dotenv()

llm = openai_nano_llm
tools = [search_tool]

MAX_RETRIES = 5  # 최대 재시도 횟수


def create_expert_agent(system_prompt: str):
    return create_agent(
        llm, tools, system_prompt=system_prompt, response_format=ProviderStrategy(TechList)
    )


frontend_executor = create_expert_agent(FE_SYSTEM_PROMPT)
backend_executor = create_expert_agent(BE_SYSTEM_PROMPT)
advance_executor = create_expert_agent(ADVANCE_SYSTEM_PROMPT)


def run_expert_node(state: RecommendationState, executor: Any):
    from langchain.agents.structured_output import StructuredOutputValidationError
    
    task_type = state.get("task_type")
    user_task = state.get("node_name")
    task_description = state.get("node_description")
    
    try:
        response = executor.invoke(
            {
                "messages": [
                    (
                        "user",
                        EXPERT_USER_PROMPT.format(task_type=task_type.value, user_task=user_task, task_description=task_description),
                    )
                ]
            }
        )
        output = response.get("structured_response")
        if output is None:
            print(f"경고: {user_task}에 대한 구조화된 응답(Tool Call)이 없습니다.")
            return {"tech_list": TechList(techs=[], comparison=""), "last_error": None}
        print(output)
        return {"tech_list": output, "last_error": None}
    
    except StructuredOutputValidationError as e:
        error_message = str(e)
        print(f"구조화된 출력 검증 실패: {error_message}")
        return {"last_error": error_message}


def frontend_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, frontend_executor)


def backend_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, backend_executor)


def advance_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, advance_executor)


def init_node(state: RecommendationState) -> RecommendationState:
    """초기화 노드 - last_error를 초기화"""
    return {"last_error": None}


def route_feedback(state: RecommendationState) -> RecommendationState:
    """에러를 확인하고 retry_count를 관리하는 노드"""
    last_error = state.get("last_error")
    retry_count = state.get("retry_count", 0)
    
    if last_error:
        new_retry_count = retry_count + 1
        print(f"구조화된 출력 검증 실패 (시도 {new_retry_count}/{MAX_RETRIES}): {last_error[:100]}...")
        
        if new_retry_count >= MAX_RETRIES:
            print(f"최대 재시도 횟수 초과. 빈 결과를 반환합니다.")
            return {
                "tech_list": TechList(techs=[], comparison=""),
                "retry_count": new_retry_count,
                "last_error": last_error
            }
        
        return {"retry_count": new_retry_count}
    
    # 성공 시 retry_count 초기화
    return {"retry_count": 0}


def tech_stack_integrator(state: RecommendationState) -> RecommendationState:
    """기술 스택을 DB에 통합하는 노드"""
    tech_list = state.get("tech_list")
    
    if tech_list is None:
        return {"tech_list": TechList(techs=[], comparison="")}
    
    for tech in tech_list.techs:
        tech_name = tech.name.replace(' ', '')
        tech_id = search_official_tech_name.func(tech_name).get("id")
        if tech_id is None:
            tech_id = insert_official_tech_name.func(tech_name).get("id")
        tech.id = tech_id
    return {"tech_list": tech_list}
