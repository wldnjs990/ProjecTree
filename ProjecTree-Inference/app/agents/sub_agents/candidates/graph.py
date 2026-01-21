from langgraph.graph import StateGraph, END, START
from app.agents.sub_agents.candidates.state import CandidateNodeState
from app.agents.sub_agents.candidates.nodes import generate_candidates


# Candidate Graph Builder
candidate_graph_builder = StateGraph(CandidateNodeState)

candidate_graph_builder.add_node("generate_candidates", generate_candidates)

candidate_graph_builder.add_edge(START, "generate_candidates")
candidate_graph_builder.add_edge("generate_candidates", END)

candidate_graph = candidate_graph_builder.compile()
