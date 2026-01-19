from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.tools import TavilySearchResults
from app.core.llm import mini_llm
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from app.agents.states.state import PlanNodeState

load_dotenv()

llm = mini_llm
tools = [TavilySearchResults()]

from app.agents.prompts.expert_prompts import (
    FE_SYSTEM_PROMPT,
    BE_SYSTEM_PROMPT,
    SEARCH_SYSTEM_PROMPT,
)


def create_expert_agent(system_prompt: str):
    return create_agent(llm, tools, system_prompt=system_prompt)


frontend_executor = create_expert_agent(FE_SYSTEM_PROMPT)
backend_executor = create_expert_agent(BE_SYSTEM_PROMPT)
web_search_executor = create_expert_agent(SEARCH_SYSTEM_PROMPT)


from typing import Any


def run_expert_node(state: PlanNodeState, executor: Any):
    # Determine input based on state
    # Use 'question' or node description
    user_input = state.get("question")
    if not user_input:
        node_data = state.get("node_data") or {}
        user_input = node_data.get("description", "기술 스택을 추천해주세요.")

    # create_react_agent input expects 'messages' key
    response = executor.invoke({"messages": [HumanMessage(content=user_input)]})

    # Response is the final state, extract last message
    output_text = response["messages"][-1].content

    return {
        "messages": [
            HumanMessage(content=user_input),
            AIMessage(content=output_text, name="expert"),
        ]
    }


def frontend_expert(state: PlanNodeState) -> PlanNodeState:
    return run_expert_node(state, frontend_executor)


def backend_expert(state: PlanNodeState) -> PlanNodeState:
    return run_expert_node(state, backend_executor)


def web_search_agent(state: PlanNodeState) -> PlanNodeState:
    return run_expert_node(state, web_search_executor)
