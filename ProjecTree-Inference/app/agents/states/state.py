from app.agents.enums import NodeType
from app.db.models import Workspace
from typing import TypedDict, List, Dict, Any, Optional

# 새 패키지에서 import
from app.agents.sub_agents.recommend.state import RecommendationState
from app.agents.sub_agents.candidates.state import CandidateNodeState

# Re-export for backward compatibility
__all__ = ["RecommendationState", "CandidateNodeState", "PlanNodeState"]


class PlanNodeState(RecommendationState):
    """메인 그래프의 전체 상태"""
    parent_info: str
    node_data: Dict[str, Any]  # current node content
    workspace_id: int
    workspace_info: Optional[Workspace]  # 워크스페이스에 대한 정보. 없을 수도 있음 ReadOnly임

