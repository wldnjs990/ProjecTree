from langgraph.graph import StateGraph, END, START
from app.agents.states.state import NodeState
from app.agents.nodes.fetch import (
    parent_node_fetch,
    project_spec_fetch,
    candidate_node_fetch,
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

from app.agents.routers import (
    route_node,
    route_feedback_loop,
    route_struct_feedback,
    loop_condition,
)

# Main Graph Builder
builder = StateGraph(NodeState)
builder.add_node("parent_node_fetch", parent_node_fetch)
builder.add_node("project_spec_fetch", project_spec_fetch)
builder.add_node("candidate_node_fetch", candidate_node_fetch)
builder.add_node("epic_node_process", epic_node_process)
builder.add_node("story_node_process", story_node_process)
builder.add_node("sub_node_info_create", sub_node_info_create)
builder.add_node("task_node_process", task_node_process)
builder.add_node("advance_node_process", advance_node_process)
builder.add_node("structured_output_parser", structured_output_parser)
builder.add_node("node_feedback", node_feedback)
builder.add_node("struct_feedback", struct_feedback)

builder.add_edge(START, "parent_node_fetch")
builder.add_edge(START, "project_spec_fetch")
builder.add_edge(START, "candidate_node_fetch")
builder.add_edge("parent_node_fetch", "sub_node_info_create")
builder.add_edge("project_spec_fetch", "sub_node_info_create")
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
builder.add_edge("task_node_process", "node_feedback")
builder.add_edge("advance_node_process", "node_feedback")

builder.add_conditional_edges(
    "node_feedback",
    route_feedback_loop,
    ["sub_node_info_create", "structured_output_parser"],
)
builder.add_edge("structured_output_parser", "struct_feedback")
builder.add_conditional_edges(
    "struct_feedback", route_struct_feedback, 
    ["structured_output_parser", END]
)
builder.add_edge(
    "struct_feedback", END
)
