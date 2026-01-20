from langchain.agents.structured_output import AutoStrategy
from app.agents.states.state import CandidateNodeState
from app.agents.enums import NodeType
from typing import Dict, Any, List, Literal
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage
from app.core.llm import mini_llm, openai_nano_llm
from app.agents.states.state import PlanNodeState
from app.agents.tools.tech_db import insert_candidate_tool
from app.agents.schemas.candidate import Candidate


llm = openai_nano_llm
tools = [insert_candidate_tool]


from app.agents.prompts.system.candidate_prompts import (
    EPIC_SYS,
    STORY_SYS,
    TASK_SYS,
    PROJECT_SYS
)

def create_candidate_agent(system_prompt: str):
    return create_agent(llm, tools, system_prompt=system_prompt, 
    response_format=AutoStrategy(List[Candidate]))


epic_agent = create_candidate_agent(EPIC_SYS)
story_agent = create_candidate_agent(STORY_SYS)
task_agent = create_candidate_agent(TASK_SYS)
project_agent = create_candidate_agent(PROJECT_SYS)


def generate_candidates(state: CandidateNodeState) -> CandidateNodeState:
    node_type = state.get("current_node_type", "")
    node_name = state.get("current_node_name", "")
    node_description = state.get("current_node_description", "")

    if not node_name or not node_description:
        return {"candidates": []}

    # Pass node_id in the prompt so the model extracts it for the tool argument
    prompt_msg = f"Node Name: {node_name}\nNode Description: {node_description}"

    executor = None
    if node_type == NodeType.PROJECT:
        executor = project_agent
    elif node_type == NodeType.EPIC:
        executor = epic_agent
    elif node_type == NodeType.STORY:
        executor = story_agent
    elif node_type == NodeType.TASK:
        executor = task_agent

    if executor:
        try:
            # Invoke agent. The agent should call the tool.
            response = executor.invoke({"messages": [HumanMessage(content=prompt_msg)]})
        except Exception as e:
            print(f"Candidate generation agent failed: {e}")

    return {"candidates": []}  # Candidates are in DB
