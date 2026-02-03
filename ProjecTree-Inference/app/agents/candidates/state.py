from app.agents.enums import NodeType
from typing import TypedDict, Optional
from app.agents.candidates.schemas.candidate import CandidateList
from app.agents.states.state import GlobalState


class CandidateNodeState(GlobalState):
    """현재 노드로부터 후보노드 추천을 위한 State"""
    current_node_id: Optional[int]  # 현재 노드의 DB ID (형제 노드 조회용)
    current_node_type: NodeType
    candidates: CandidateList  # generated candidates
    current_node_name: str
    current_node_description: str
    service_type: Optional[str]  # 서비스 타입 (WEB/APP)
    sibling_context: Optional[str]  # 형제 노드 중복 검사 결과 컨텍스트
    candidate_count: Optional[int]  # 생성할 후보 개수 (k), STORY->TASK의 경우 FE k개 + BE k개
