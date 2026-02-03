from app.agents.enums import NodeType
from app.db.schemas.node import NodeResponse
from app.db.schemas.candidate import CandidateResponse
from app.db.schemas.workspace import WorkspaceResponse
from app.agents.enums import TaskType
from typing import TypedDict, List, Dict, Any, Optional
from app.agents.node.schemas.process import BaseNodeProcessResult
from app.agents.states.state import GlobalState


class NodeState(GlobalState):
    """메인 그래프의 전체 상태"""

    parent_id: int
    parent_info: NodeResponse
    candidate_id: int
    current_candidate_info: CandidateResponse
    task_type: TaskType
    generated_node: BaseNodeProcessResult
    is_parse_error: Optional[bool]
