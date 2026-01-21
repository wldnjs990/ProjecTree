from app.agents.enums import NodeType
from typing import TypedDict
from app.agents.schemas.candidate import CandidateList


class CandidateNodeState(TypedDict):
    """현재 노드로부터 후보노드 추천을 위한 State"""
    current_node_type: NodeType
    candidates: CandidateList  # generated candidates
    current_node_name: str
    current_node_description: str
