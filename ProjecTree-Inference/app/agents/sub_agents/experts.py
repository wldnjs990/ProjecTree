from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from app.core.llm import mini_llm,large_llm
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from app.agents.states.state import PlanNodeState, RecommendationState
from app.agents.tools.tavily import search_tool
from app.agents.schemas.expert import TechList
from typing import Any
from app.agents.tools.tech_db import search_official_tech_name  
from app.agents.prompts.expert_prompts import (
    FE_SYSTEM_PROMPT,
    BE_SYSTEM_PROMPT,
    SEARCH_SYSTEM_PROMPT,
)

load_dotenv()

llm = mini_llm

tools = [search_tool, search_official_tech_name]

def create_expert_agent(system_prompt: str):
    return create_agent(llm, 
    tools, 
    system_prompt=system_prompt, 
    response_format=TechList)


frontend_executor = create_expert_agent(FE_SYSTEM_PROMPT)
backend_executor = create_expert_agent(BE_SYSTEM_PROMPT)
web_search_executor = create_expert_agent(SEARCH_SYSTEM_PROMPT)



def run_expert_node(state: RecommendationState, executor: Any):
    user_task = state.get("node_name")
    task_description = state.get("node_description")
    response = executor.invoke(
        {"user_task": user_task, "task_description": task_description}    
    )
    print(response)
    output = response.get("structured_response")
    if output is None:
        print(f"⚠️ 경고: {user_task}에 대한 구조화된 응답(Tool Call)이 없습니다.")
        # 모델이 그냥 텍스트로 답했을 경우를 대비해 로그를 찍어봅니다.
        # print(response.get("messages")[-1].content)
        
        # 에러를 내지 않고 넘어가려면 빈 리스트 반환
        return {"tech_list": []}
    print(output)
    return {"tech_list": output}


def frontend_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, frontend_executor)


def backend_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, backend_executor)


def web_search_agent(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, web_search_executor)
