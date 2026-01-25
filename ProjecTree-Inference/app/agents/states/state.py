from app.agents.enums import NodeType
from app.db.models import Workspace, Node, Candidate
from app.agents.enums import TaskType
from typing import TypedDict, List, Dict, Any, Optional


class GlobalState(TypedDict):
    """전역 상태"""

    workspace_id: int
    workspace_info: Optional[
        Workspace
    ]  # 워크스페이스에 대한 정보. 없을 수도 있음 ReadOnly임

    # 피드백 루프 관련 State
    feedback: Optional[str]  # 검증 실패 시 피드백 메시지
    retry_count: Optional[int]  # 현재 재시도 횟수
    max_retries: Optional[int]  # 최대 재시도 횟수 (기본값 2)
    is_valid: Optional[bool]  # 후보 검증 통과 여부
    last_error: Optional[str]  # 마지막 에러 메시지


class NodeState(GlobalState):
    """메인 그래프의 전체 상태"""

    parent_id: int
    parent_info: Node
    candidate_id: int
    current_candidate_info: Candidate
    task_type: TaskType
