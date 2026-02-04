"""포트폴리오 생성 그래프"""

from langgraph.graph import StateGraph, END, START
from app.agents.portfolio.state import PortfolioState
from app.agents.portfolio.nodes.generate import generate_portfolio_node


# Portfolio Graph Builder
portfolio_graph_builder = StateGraph(PortfolioState)

# 노드 추가
portfolio_graph_builder.add_node("generate_portfolio", generate_portfolio_node)

# 엣지 정의
portfolio_graph_builder.add_edge(START, "generate_portfolio")
portfolio_graph_builder.add_edge("generate_portfolio", END)

# 그래프 컴파일
portfolio_graph = portfolio_graph_builder.compile()
