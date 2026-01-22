from enum import Enum
from typing import Optional


class NodeType(str, Enum):
    """노드 타입 정의 - 계층 구조: Epic > Story > Task > Advance"""
    PROJECT = "PROJECT"
    EPIC = "EPIC"
    STORY = "STORY"
    TASK = "TASK"
    ADVANCE = "ADVANCE"

class TaskType(str, Enum):
    """Task 타입 정의"""
    FRONTEND = "FrontEnd"
    BACKEND = "BackEnd"
    ADVANCE = "Advance"

# 계층 구조 매핑: 부모 타입 -> 자식 타입
NODE_HIERARCHY = {
    NodeType.PROJECT: NodeType.EPIC,
    NodeType.EPIC: NodeType.STORY,
    NodeType.STORY: NodeType.TASK,
    NodeType.TASK: NodeType.ADVANCE,
    NodeType.ADVANCE: None,  # Advance는 최하위 계층
}

# 역방향 매핑: 자식 타입 -> 부모 타입
NODE_PARENT_MAP = {
    NodeType.STORY: NodeType.EPIC,
    NodeType.TASK: NodeType.STORY,
    NodeType.ADVANCE: NodeType.TASK,
    NodeType.EPIC: NodeType.PROJECT,
    NodeType.PROJECT: None,  # Project는 최상위 계층
}


def get_child_node_type(parent_node_type: str) -> Optional[str]:
    """부모 노드 타입을 기반으로 자식 노드 타입을 반환합니다.
    
    Args:
        parent_node_type: 부모 노드의 타입 (문자열)
        
    Returns:
        자식 노드의 타입 문자열, 또는 최하위 계층인 경우 None
        
    Example:
        >>> get_child_node_type("EPIC")
        "STORY"
        >>> get_child_node_type("STORY")
        "TASK"
        >>> get_child_node_type("TASK")
        "ADVANCE"
        >>> get_child_node_type("ADVANCE")
        None
    """
    try:
        parent_type = NodeType(parent_node_type.upper())
        child_type = NODE_HIERARCHY.get(parent_type)
        return child_type.value if child_type else None
    except ValueError:
        raise ValueError(f"알 수 없는 노드 타입입니다: {parent_node_type}")


def get_parent_node_type(node_type: str) -> Optional[str]:
    """현재 노드 타입을 기반으로 부모 노드 타입을 반환합니다.
    
    Args:
        node_type: 현재 노드의 타입 (문자열)
        
    Returns:
        부모 노드의 타입 문자열, 또는 최상위 계층인 경우 None
        
    Example:
        >>> get_parent_node_type("STORY")
        "EPIC"
        >>> get_parent_node_type("TASK")
        "STORY"
        >>> get_parent_node_type("EPIC")
        None
    """
    try:
        current_type = NodeType(node_type.upper())
        parent_type = NODE_PARENT_MAP.get(current_type)
        return parent_type.value if parent_type else None
    except ValueError:
        raise ValueError(f"알 수 없는 노드 타입입니다: {node_type}")


def get_current_node_type_from_parent(parent_node_type: str) -> str:
    """parent_node_type을 보고 현재 작업 중인 노드의 타입을 반환합니다.
    
    이 함수는 get_child_node_type의 alias로, 의미를 더 명확하게 표현합니다.
    
    Args:
        parent_node_type: 부모 노드의 타입 (문자열)
        
    Returns:
        현재 작업 중인 노드의 타입 문자열
        
    Raises:
        ValueError: 부모 노드가 최하위 계층이거나 알 수 없는 타입인 경우
        
    Example:
        >>> get_current_node_type_from_parent("EPIC")
        "STORY"  # Epic 아래에는 Story를 생성
        >>> get_current_node_type_from_parent("STORY")
        "TASK"   # Story 아래에는 Task를 생성
    """
    child_type = get_child_node_type(parent_node_type)
    if child_type is None:
        raise ValueError(f"{parent_node_type}은 최하위 계층이므로 자식 노드를 생성할 수 없습니다.")
    return child_type


def is_valid_node_type(node_type: str) -> bool:
    """주어진 문자열이 유효한 노드 타입인지 확인합니다.
    
    Args:
        node_type: 확인할 노드 타입 문자열
        
    Returns:
        유효한 노드 타입이면 True, 아니면 False
    """
    try:
        NodeType(node_type.upper())
        return True
    except ValueError:
        return False
