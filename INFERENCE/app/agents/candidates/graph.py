from langgraph.graph import StateGraph, END, START
from app.agents.candidates.state import CandidateNodeState
from app.agents.candidates.nodes.fetch import fetch_sibling_context
from app.agents.candidates.nodes.generate import generate_candidates
from app.agents.candidates.nodes.validate import validate_candidates


def should_retry(state: CandidateNodeState) -> str:
    """검증 결과에 따라 다음 노드를 결정하는 라우터 함수"""
    is_valid = state.get("is_valid", False)
    if is_valid:
        return "end"
    else:
        return "retry"


# Candidate Graph Builder
candidate_graph_builder = StateGraph(CandidateNodeState)

# 노드 추가
candidate_graph_builder.add_node("fetch_sibling_context", fetch_sibling_context)
candidate_graph_builder.add_node("generate_candidates", generate_candidates)
candidate_graph_builder.add_node("validate_candidates", validate_candidates)

# 엣지 설정
candidate_graph_builder.add_edge(START, "fetch_sibling_context")
candidate_graph_builder.add_edge("fetch_sibling_context", "generate_candidates")
candidate_graph_builder.add_edge("generate_candidates", "validate_candidates")

# 조건부 엣지: 검증 통과 시 END, 실패 시 generate_candidates로 복귀
candidate_graph_builder.add_conditional_edges(
    "validate_candidates",
    should_retry,
    {
        "end": END,
        "retry": "generate_candidates"
    }
)

candidate_graph = candidate_graph_builder.compile()
