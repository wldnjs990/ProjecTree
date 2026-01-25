from app.agents.states.state import NodeState
from app.db.session import get_db
from app.db.repository.workspace_repository import workspace_repository
from app.db.repository.candidate_repository import candidate_repository
from typing import Any


def _get_db_session():
    """DB 세션을 가져오는 헬퍼 함수"""
    return next(get_db())


def parent_node_fetch(state: NodeState) -> NodeState:
    """부모 노드의 정보를 조회하는 노드"""
    parent_id = state.get("parent_id")

    if parent_id is None:
        raise ValueError("parent_id가 state에 존재하지 않습니다.")

    db = _get_db_session()
    try:
        from app.db.repository.node_repository import node_repository

        parent = node_repository.get_by_id(db, parent_id)

        if parent is None:
            raise ValueError(
                f"parent_id {parent_id}에 해당하는 Node를 찾을 수 없습니다."
            )

        return {"parent_info": parent}
    finally:
        db.close()


def project_spec_fetch(state: NodeState) -> NodeState:
    """현재 프로젝트의 스펙을 조회하는 노드

    state의 workspace_id를 기반으로 Workspace 정보를 조회하여
    workspace_info에 저장합니다.
    """
    workspace_id = state.get("workspace_id")

    if workspace_id is None:
        raise ValueError("workspace_id가 state에 존재하지 않습니다.")

    db = _get_db_session()
    try:
        workspace = workspace_repository.get_by_id(db, workspace_id)

        if workspace is None:
            raise ValueError(
                f"workspace_id {workspace_id}에 해당하는 Workspace를 찾을 수 없습니다."
            )

        return {"workspace_info": workspace}
    finally:
        db.close()


def candidate_node_fetch(state: NodeState) -> NodeState:
    """이번 흐름에서 구현될 후보 노드의 정보를 가져옵니다. (실제 정보가 채워질 후보 노드의 정보)"""
    candidate_id = state.get("candidate_id")

    if candidate_id is None:
        raise ValueError("candidate_id가 state에 존재하지 않습니다.")

    db = _get_db_session()
    try:
        candidate = candidate_repository.get_by_id(db, candidate_id)

        if candidate is None:
            raise ValueError(
                f"candidate_id {candidate_id}에 해당하는 Candidate를 찾을 수 없습니다."
            )

        return {"current_candidate_info": candidate}
    finally:
        db.close()


def contributor_info_fetch(state: NodeState) -> NodeState:
    """기여자 정보를 조회하는 노드 - 기여자의 기술 스택, 경험등을 기반으로 기술 스택을 추천합니다. 만약 기여자 정보가 없을경우 건너뜁니다."""
    pass
