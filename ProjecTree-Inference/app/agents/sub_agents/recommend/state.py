from app.agents.enums import NodeType
from typing import TypedDict, Optional
from app.agents.schemas.expert import TechList


class RecommendationState(TypedDict):
    """기술 스택 추천을 위한 State"""
    current_node_type: NodeType
    task_type: str
    node_name: str
    node_description: str
    tech_list: TechList
    retry_count: int  # 재시도 횟수
    last_error: Optional[str]  # 마지막 에러 메시지
