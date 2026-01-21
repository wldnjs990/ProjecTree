from langchain.agents.structured_output import ProviderStrategy 
from app.agents.sub_agents.candidates.state import CandidateNodeState
from app.agents.enums import NodeType
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage
from app.core.llm import openai_nano_llm
from app.agents.schemas.candidate import CandidateList
from app.agents.sub_agents.candidates.prompts.system_prompts import (
    EPIC_SYS,
    STORY_SYS,
    TASK_SYS,
    PROJECT_SYS
)

llm = openai_nano_llm
tools = []

def create_candidate_agent(system_prompt: str):
    return create_agent(
        llm, tools, system_prompt=system_prompt, 
        response_format=ProviderStrategy(CandidateList)
    )


epic_agent = create_candidate_agent(EPIC_SYS)
story_agent = create_candidate_agent(STORY_SYS)
task_agent = create_candidate_agent(TASK_SYS)
project_agent = create_candidate_agent(PROJECT_SYS)


def generate_candidates(state: CandidateNodeState) -> CandidateNodeState:
    """후보 노드를 생성하는 노드"""
    node_type = state.get("current_node_type", "")
    node_name = state.get("current_node_name", "")
    node_description = state.get("current_node_description", "")

    if not node_name or not node_description:
        return {"candidates": CandidateList(candidates=[])}

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
            output = response.get("structured_response")
            if output:
                return {"candidates": output}
        except Exception as e:
            print(f"Candidate generation agent failed: {e}")

    return {"candidates": CandidateList(candidates=[])}
