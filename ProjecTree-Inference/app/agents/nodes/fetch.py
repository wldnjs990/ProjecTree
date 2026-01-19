from app.agents.states.state import PlanNodeState
from typing import Any


def parent_node_fetch(state: PlanNodeState) -> PlanNodeState:
    """부모 노드의 정보를 조회하는 노드"""
    pass


def project_spec_fetch(state: PlanNodeState) -> PlanNodeState:
    """현재 프로젝트의 스펙을 조회하는 노드"""
    pass


def candidate_node_fetch(state: PlanNodeState) -> PlanNodeState:
    """이번 흐름에서 구현될 후보 노드의 정보를 가져옵니다. (실제 정보가 채워질 후보 노드의 정보)"""
    pass


def contributor_info_fetch(state: PlanNodeState) -> PlanNodeState:
    """기여자 정보를 조회하는 노드 - 기여자의 기술 스택, 경험등을 기반으로 기술 스택을 추천합니다. 만약 기여자 정보가 없을경우 건너뜁니다."""
    pass


def sibiling_node_fetch(state: PlanNodeState) -> PlanNodeState:
    """현재 노드의 형제 노드 정보를 조회하는 노드(중복 기능을 제거하는 용도)"""
    pass


class ReturnNodeValue:
    # 초기화
    def __init__(self, node_secret: str):
        self._value = node_secret

    # 호출시 상태 업데이트
    def __call__(self, state: PlanNodeState) -> Any:
        print(f"Adding {self._value} to {state.get('aggregate')}")
        return {"aggregate": [self._value]}
