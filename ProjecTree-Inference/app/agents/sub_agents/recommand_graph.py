from langgraph.graph import StateGraph, END, START
from app.agents.states.state import RecommendationState
from app.agents.nodes.integrator import tech_stack_integrator
from app.agents.routers import route_task
from app.agents.sub_agents.experts import (
    frontend_expert,
    backend_expert,
    web_search_agent,
)

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
recommend_graph_builder.add_edge("tech_stack_integrator", END)

recommend_graph = recommend_graph_builder.compile()
