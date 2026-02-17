from app.agents.node.state import NodeState


def sub_node_info_create(state: NodeState) -> NodeState:
    """현재 노드의 정보를 생성하는 노드 (분기점) 하위 태스크로의 전달 역할

    실제 로직은 routers.py의 route_sub_node_creation에서 처리됩니다.
    이 노드는 그래프 상의 분기점 역할을 합니다.
    """
    return state
