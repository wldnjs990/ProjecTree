from langgraph.graph import StateGraph, END, START
from app.agents.states.state import RecommendationState, PlanNodeState
from app.agents.nodes.fetch import (
    parent_node_fetch,
    project_spec_fetch,
    contributor_info_fetch,
    candidate_node_fetch,
    sibiling_node_fetch,
    ReturnNodeValue,
)
from app.agents.nodes.process import (
    epic_node_process,
    story_node_process,
    task_node_process,
    advance_node_process,
)
from app.agents.nodes.creation import sub_node_info_create
from app.agents.nodes.feedback import node_feedback, struct_feedback
from app.agents.nodes.parser import structured_output_parser
from app.agents.sub_agents.candidate_graph import generate_candidates
from app.agents.nodes.integrator import tech_stack_integrator
from app.agents.routers import (
    route_task,
    route_node,
    route_feedback_loop,
    route_struct_feedback,
    loop_condition,
)
from app.agents.sub_agents.experts import (
    frontend_expert,
    backend_expert,
    web_search_agent,
)
from app.agents.sub_agents.tech import tech_name_agent

# Recommendation Graph Builder
recommend_graph_builder = StateGraph(RecommendationState)

recommend_graph_builder.add_node("frontend_expert", frontend_expert)
recommend_graph_builder.add_node("backend_expert", backend_expert)
recommend_graph_builder.add_node("web_search_agent", web_search_agent)
recommend_graph_builder.add_node("tech_stack_integrator", tech_stack_integrator)

recommend_graph_builder.add_conditional_edges(
    START, route_task, ["frontend_expert", "backend_expert", "web_search_agent"]
)
recommend_graph_builder.add_edge("frontend_expert", "tech_stack_integrator")
recommend_graph_builder.add_edge("backend_expert", "tech_stack_integrator")
recommend_graph_builder.add_edge("web_search_agent", "tech_stack_integrator")
#recommend_graph_builder.add_edge("tech_name_agent", "tech_stack_integrator")
recommend_graph_builder.add_edge("tech_stack_integrator", END)

recommend_graph = recommend_graph_builder.compile()

# Main Graph Builder
builder = StateGraph(PlanNodeState)
builder.add_node("parent_node_fetch", ReturnNodeValue("parent_node_fetch"))
builder.add_node("project_spec_fetch", ReturnNodeValue("project_spec_fetch"))
builder.add_node("contributor_info_fetch", ReturnNodeValue("contributor_info_fetch"))
builder.add_node("candidate_node_fetch", ReturnNodeValue("candidate_node_fetch"))
builder.add_node("epic_node_process", epic_node_process)
builder.add_node("story_node_process", story_node_process)
builder.add_node("sub_node_info_create", sub_node_info_create)
builder.add_node("task_node_process", task_node_process)
builder.add_node("advance_node_process", advance_node_process)
builder.add_node("tech_stack_recommendation", recommend_graph)
builder.add_node("structured_output_parser", structured_output_parser)
builder.add_node("node_feedback", node_feedback)
builder.add_node("struct_feedback", struct_feedback)
builder.add_node("sibiling_node_fetch", sibiling_node_fetch)
builder.add_node("generate_candidates", generate_candidates)

builder.add_edge(START, "parent_node_fetch")
builder.add_edge(START, "project_spec_fetch")
builder.add_edge(START, "contributor_info_fetch")
builder.add_edge(START, "sibiling_node_fetch")
builder.add_edge(START, "candidate_node_fetch")
builder.add_edge("parent_node_fetch", "sub_node_info_create")
builder.add_edge("project_spec_fetch", "sub_node_info_create")
builder.add_edge("contributor_info_fetch", "sub_node_info_create")
builder.add_edge("sibiling_node_fetch", "sub_node_info_create")
builder.add_edge("candidate_node_fetch", "sub_node_info_create")

builder.add_conditional_edges(
    "sub_node_info_create",
    route_node,
    [
        "epic_node_process",
        "story_node_process",
        "task_node_process",
        "advance_node_process",
    ],
)
builder.add_edge("epic_node_process", "node_feedback")
builder.add_edge("story_node_process", "node_feedback")
builder.add_edge("task_node_process", "tech_stack_recommendation")
builder.add_edge("advance_node_process", "tech_stack_recommendation")
builder.add_edge("tech_stack_recommendation", "node_feedback")

builder.add_conditional_edges(
    "node_feedback",
    route_feedback_loop,
    ["sub_node_info_create", "generate_candidates"],
)
builder.add_edge("generate_candidates", "structured_output_parser")
builder.add_edge("structured_output_parser", "struct_feedback")
builder.add_conditional_edges(
    "struct_feedback", route_struct_feedback, ["structured_output_parser", END]
)
builder.add_conditional_edges(
    "struct_feedback", loop_condition, ["sub_node_info_create", END]
)
