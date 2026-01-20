from app.agents.prompts.user.expert_prompts import EXPERT_USER_PROMPT
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from app.core.llm import mini_llm, large_llm, openai_mini_llm, openai_nano_llm
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy, AutoStrategy
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from app.agents.states.state import PlanNodeState, RecommendationState
from app.agents.tools.tavily import search_tool
from app.agents.schemas.expert import TechList
from typing import Any
from app.agents.tools.tech_db import search_official_tech_name, insert_official_tech_name
from app.agents.prompts.system.expert_prompts import (
    FE_SYSTEM_PROMPT,
    BE_SYSTEM_PROMPT,
    SEARCH_SYSTEM_PROMPT,
)
from app.agents.prompts.user.expert_prompts import EXPERT_USER_PROMPT

load_dotenv()

llm = openai_nano_llm

tools = [search_tool]


def create_expert_agent(system_prompt: str):
    return create_agent(
        llm, tools, system_prompt=system_prompt, response_format=AutoStrategy(TechList)
    )


frontend_executor = create_expert_agent(FE_SYSTEM_PROMPT)
backend_executor = create_expert_agent(BE_SYSTEM_PROMPT)
web_search_executor = create_expert_agent(SEARCH_SYSTEM_PROMPT)


def run_expert_node(state: RecommendationState, executor: Any):
    task_type = state.get("task_type")
    user_task = state.get("node_name")
    task_description = state.get("node_description")
    response = executor.invoke(
        {
            "messages": [
                (
                    "user",
                    EXPERT_USER_PROMPT.format(task_type=task_type, user_task=user_task, task_description=task_description),
                )
            ]
        }
    )
    output = response.get("structured_response")
    if output is None:
        print(f"경고: {user_task}에 대한 구조화된 응답(Tool Call)이 없습니다.")
        return {"tech_list": TechList()}
    print(output)
    return {"tech_list": output}


def frontend_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, frontend_executor)


def backend_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, backend_executor)


def web_search_agent(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, web_search_executor)
