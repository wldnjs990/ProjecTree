import operator
from typing import Annotated, TypedDict, List, Dict, Any, Optional
from langgraph.graph.message import add_messages
from app.agents.schemas.expert import TechList


class RecommendationState(TypedDict):
    current_node_type: str
    task_type: str
    node_name: str
    node_description: str
    tech_list: TechList
    messages: Annotated[list, add_messages]  # 대화 기록


class PlanNodeState(RecommendationState):
    parent_info: str
    node_type: str  # Epic, Story, Task, SubTask
    node_data: Dict[str, Any]  # current node content
    candidates: List[Dict[str, Any]]  # generated candidates
    tech_recommendations: List[Dict[str, Any]]  # tech stack recommendations
    project_spec: Dict[str, Any]  # project specification
    tech_vocab_ids: Optional[List[int]]  # Temporary storage for mapped tech IDs
