from app.agents.enums import NodeType
from app.db.models import Workspace
from typing import TypedDict, List, Dict, Any, Optional
from app.agents.schemas.expert import TechList
from app.agents.schemas.candidate import Candidate

#현재 노드로 부터 후보노드 추천을 위한 State
class CandidateNodeState(TypedDict):
    current_node_type: NodeType
    candidates: List[Candidate]  # generated candidates
    current_node_name: str
    current_node_description: str
    

class RecommendationState(TypedDict):
    current_node_type: NodeType
    task_type: str
    node_name: str
    node_description: str
    tech_list: TechList


class PlanNodeState(RecommendationState):
    parent_info: str
    node_data: Dict[str, Any]  # current node content
    workspace_id: int
    workspace_info: Optional[Workspace] #워크스페이스에 대한 정보. 없을 수도 있음 ReadOnly임
