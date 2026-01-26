from app.agents.states.state import NodeState
from langgraph.graph import END
from app.agents.enums import NodeType, get_child_node_type


def route_node(state: NodeState) -> str:
    """노드 타입에 따른 프로세스 라우팅"""
    parent_info = state.get("parent_info")
    candidate_info = state.get("current_candidate_info")
    node_type = get_child_node_type(parent_info.node_type)

    if node_type == NodeType.EPIC:
        return "epic_node_process"
    elif node_type == NodeType.STORY:
        return "story_node_process"
    elif node_type == NodeType.TASK:
        return "task_node_process"
    elif node_type == NodeType.ADVANCE:
        return "advance_node_process"
    return "epic_node_process"


def route_agent_node(state: NodeState) -> str:
    """Agent 노드 라우팅"""
    return "advance_expert"


def route_teck_stack(state: NodeState) -> str:
    """기술 스택 관련 라우팅"""
    return "tech_steck_create"


def route_advance_tech_stack(state: NodeState) -> str:
    """서브 태스크 기술 스택 라우팅"""
    return "advance_tech_stack_create"


def route_feedback_loop(state: NodeState) -> str:
    """피드백 루프 라우팅
    - 피드백 결과 재시도가 필요하면 sub_node_info_create로 이동
    - 정상이면 structured_output_parser로 이동
    """
    is_valid = state.get("is_valid", True)
    if not is_valid:
        return "sub_node_info_create"
    return "structured_output_parser"


def route_struct_feedback(state: NodeState) -> str:
    """구조적 피드백 라우팅
    - 파싱 에러가 있으면 structured_output_parser로 재시도
    - 정상이면 END (또는 loop_condition에서 처리)
    """
    if state.get("is_parse_error", False):
        return "structured_output_parser"
    return END


def route_agent_result(state: NodeState) -> str:
    """Agent 결과 처리 라우팅"""
    return "structured_output_parser"


def loop_condition(state: NodeState) -> bool:
    """루프 종료 조건 검사
    - 콘텐츠 에러나 재시도 플래그가 있으면 False (계속 루프 -> sub_node_info_create)
    - 정상이면 True (종료 -> END)
    """
    if state.get("is_content_error", False) or state.get("feedback_retry", False):
        return False  # Loop back to sub_node_info_create
    return True  # End
