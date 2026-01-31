from app.agents.enums import NodeType
from typing import TypedDict, Optional, List
from app.agents.schemas.expert import TechList
from app.agents.states.state import GlobalState

class RecommendationState(GlobalState):
    """기술 스택 추천을 위한 State"""
    node_type: NodeType
    task_type: str
    node_name: str
    node_description: str
    tech_list: TechList
    retry_count: int  # 재시도 횟수
    last_error: Optional[str]  # 마지막 에러 메시지
    feedback: Optional[str]  # 검증 피드백
    excluded_tech_stacks: Optional[List[str]]  # 제외할 기술 스택 이름 목록

