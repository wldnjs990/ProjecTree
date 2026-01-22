from langgraph.graph import StateGraph, END, START
from app.agents.sub_agents.recommend.state import RecommendationState
from app.agents.sub_agents.recommend.routers import route_task
from app.agents.sub_agents.recommend.nodes import (
    frontend_expert,
    backend_expert,
    advance_expert,
    init_node,
    route_feedback,
    tech_stack_integrator,
)
from app.agents.sub_agents.recommend.routers import should_retry



# Recommendation Graph Builder
recommend_graph_builder = StateGraph(RecommendationState)

recommend_graph_builder.add_node("init", init_node)
recommend_graph_builder.add_node("frontend_expert", frontend_expert)
recommend_graph_builder.add_node("backend_expert", backend_expert)
recommend_graph_builder.add_node("advance_expert", advance_expert)
recommend_graph_builder.add_node("route_feedback", route_feedback)
recommend_graph_builder.add_node("tech_stack_integrator", tech_stack_integrator)

# START -> init -> expert 노드들 (조건부)
recommend_graph_builder.add_edge(START, "init")
recommend_graph_builder.add_conditional_edges(
    "init",
    route_task,
    ["frontend_expert", "backend_expert", "advance_expert"]
)

# expert 노드들 -> route_feedback
recommend_graph_builder.add_edge("frontend_expert", "route_feedback")
recommend_graph_builder.add_edge("backend_expert", "route_feedback")
recommend_graph_builder.add_edge("advance_expert", "route_feedback")

# route_feedback -> 재시도 또는 tech_stack_integrator
recommend_graph_builder.add_conditional_edges(
    "route_feedback", 
    should_retry,
    ["init", "tech_stack_integrator"]
)

recommend_graph_builder.add_edge("tech_stack_integrator", END)

recommend_graph = recommend_graph_builder.compile()
