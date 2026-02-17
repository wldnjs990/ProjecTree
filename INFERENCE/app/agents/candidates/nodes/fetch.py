"""
Fetch sibling context for candidate generation.
"""
from app.agents.candidates.state import CandidateNodeState
from app.agents.candidates.tools.duplicate_check import get_duplicate_check_context


def fetch_sibling_context(state: CandidateNodeState) -> CandidateNodeState:
    """
    형제 노드를 조회하여 중복 검사를 수행하는 노드.

    현재 노드의 형제 노드들을 DB에서 조회하고, LLM을 통해 중복 가능성을 분석합니다.
    분석 결과는 sibling_context에 저장되어 후보 생성 시 활용됩니다.
    """
    node_id = state.get("current_node_id")
    node_name = state.get("current_node_name", "")
    node_description = state.get("current_node_description", "")
    node_type = state.get("current_node_type", "")

    # node_id가 없으면 중복 검사를 건너뜀
    if node_id is None:
        return {"sibling_context": None}

    try:
        # 형제 노드 중복 검사 수행
        context = get_duplicate_check_context(
            node_id=node_id,
            node_name=node_name,
            node_description=node_description,
            node_type=(
                str(node_type.value) if hasattr(node_type, "value") else str(node_type)
            ),
        )
        return {"sibling_context": context}
    except Exception as e:
        return {"sibling_context": None}
