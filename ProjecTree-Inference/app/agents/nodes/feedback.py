from app.agents.states.state import NodeState


def node_feedback(state: NodeState) -> NodeState:
    """생성된 노드 정보에 대한 피드백을 수행하는 노드"""
    
    return {
        "is_valid": True,
    }


def struct_feedback(state: NodeState) -> NodeState:
    """구조화된 출력에 대한 피드백을 수행하는 노드"""
    return {
        "is_parse_error": False,
    }
