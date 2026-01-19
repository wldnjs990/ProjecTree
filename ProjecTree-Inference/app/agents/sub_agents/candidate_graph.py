from typing import Dict, Any, List, Literal
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage
from app.core.llm import mini_llm
from app.agents.states.state import PlanNodeState
from app.agents.tools.tech_db import insert_candidate_tool
from langchain_community.tools import (
    TavilySearchResults,
)  # Use if needed, or just insert_candidate_tool

llm = mini_llm
tools = [insert_candidate_tool]

from app.agents.prompts.candidate_prompts import (
    EPIC_SYS,
    STORY_SYS,
    TASK_SYS,
)


def create_candidate_agent(system_prompt: str):
    return create_agent(llm, tools, system_prompt=system_prompt)


epic_agent = create_candidate_agent(EPIC_SYS)
story_agent = create_candidate_agent(STORY_SYS)
task_agent = create_candidate_agent(TASK_SYS)


def generate_candidates(state: PlanNodeState) -> PlanNodeState:
    node_type = state.get("node_type", "")
    node_data = state.get("node_data", {})
    info = node_data.get("description", "") or node_data.get("name", "")
    node_id = node_data.get("id")

    if not node_id:
        # If no node_id, we can't save to DB. Log error or skip.
        # Ideally, we should have node_id.
        # If testing without DB, returns empty.
        # But system flow guarantees node_id from previous steps.
        return {"candidates": []}

    # Pass node_id in the prompt so the model extracts it for the tool argument
    prompt_msg = f"Node ID: {node_id}\nInfo: {info}"

    executor = None
    if node_type == "Epic":
        executor = epic_agent
    elif node_type == "Story":
        executor = story_agent
    elif node_type == "Task":
        executor = task_agent

    if executor:
        try:
            # Invoke agent. The agent should call the tool.
            response = executor.invoke({"messages": [HumanMessage(content=prompt_msg)]})

            # The tool update is side-effect. We don't necessarily update state['candidates']
            # because the graph flow doesn't strictly depend on it for next steps (it fetches from DB or just ends).
            # If next steps need it, we should query DB or parse response.
            # Given the loop structure, fetching from DB next time is safer.
        except Exception as e:
            print(f"Candidate generation agent failed: {e}")

    return {"candidates": []}  # Candidates are in DB
