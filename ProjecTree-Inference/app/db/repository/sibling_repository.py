"""
Sibling Node Repository

형제 노드 및 형제 후보 노드 조회를 위한 DB 쿼리 함수들을 정의합니다.
"""

from typing import List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import text


def fetch_sibling_nodes(db: Session, node_id: int) -> List[Dict]:
    """
    특정 노드의 형제 노드들을 조회합니다.
    형제 노드란 같은 부모 노드를 공유하는 노드들입니다.
    
    node_tree 테이블에서 ancestor_id가 동일한 노드들을 찾습니다.
    depth가 1인 관계가 직접적인 부모-자식 관계입니다.
    
    Args:
        db: SQLAlchemy 세션
        node_id: 현재 노드의 ID
        
    Returns:
        List[Dict]: 형제 노드 목록 (id, name, description, node_type, status 포함)
    """
    # 현재 노드의 부모 노드 ID를 찾음
    parent_stmt = text("""
        SELECT ancestor_id 
        FROM public.node_tree 
        WHERE descendant_id = :node_id AND depth = 1
    """)
    parent_result = db.execute(parent_stmt, {"node_id": node_id}).fetchone()
    
    if parent_result is None:
        return []
    
    parent_id = parent_result.ancestor_id
    
    # 같은 부모를 가진 형제 노드들을 조회 (자기 자신 제외)
    sibling_stmt = text("""
        SELECT n.id, n.name, n.description, n.node_type, n.status
        FROM public.node n
        INNER JOIN public.node_tree nt ON n.id = nt.descendant_id
        WHERE nt.ancestor_id = :parent_id 
          AND nt.depth = 1
          AND n.id != :node_id
          AND n.deleted_at IS NULL
        ORDER BY n.created_at
    """)
    sibling_results = db.execute(sibling_stmt, {
        "parent_id": parent_id,
        "node_id": node_id
    }).fetchall()
    
    return [
        {
            "id": row.id,
            "name": row.name,
            "description": row.description,
            "node_type": row.node_type,
            "status": row.status
        }
        for row in sibling_results
    ]


def fetch_child_nodes(db: Session, node_id: int) -> List[Dict]:
    """
    특정 노드의 자식 노드들을 조회합니다.
    자식 노드란 현재 노드의 직접적인 하위 노드들입니다.
    
    node_tree 테이블에서 ancestor_id가 현재 노드이고 depth가 1인 노드들을 찾습니다.
    
    Args:
        db: SQLAlchemy 세션
        node_id: 현재 노드의 ID
        
    Returns:
        List[Dict]: 자식 노드 목록 (id, name, description, node_type, status 포함)
    """
    # 현재 노드의 자식 노드들을 조회
    child_stmt = text("""
        SELECT n.id, n.name, n.description, n.node_type, n.status
        FROM public.node n
        INNER JOIN public.node_tree nt ON n.id = nt.descendant_id
        WHERE nt.ancestor_id = :node_id 
          AND nt.depth = 1
          AND n.deleted_at IS NULL
        ORDER BY n.created_at
    """)
    child_results = db.execute(child_stmt, {"node_id": node_id}).fetchall()
    
    return [
        {
            "id": row.id,
            "name": row.name,
            "description": row.description,
            "node_type": row.node_type,
            "status": row.status
        }
        for row in child_results
    ]


def fetch_candidates(db: Session, node_id: int) -> List[Dict]:
    """
    특정 노드의 후보(Candidate) 노드들을 조회합니다.
    candidate 테이블에서 같은 node_id를 가진 후보들을 반환합니다.
    
    Args:
        db: SQLAlchemy 세션
        node_id: 현재 노드의 ID
        
    Returns:
        List[Dict]: 형제 후보 목록 (id, name, description, is_selected 포함)
    """
    # 같은 node_id를 가진 모든 candidate를 조회
    candidate_stmt = text("""
        SELECT c.id, c.name, c.description, c.is_selected
        FROM public.candidate c
        WHERE c.node_id = :node_id
        AND c.deleted_at IS NULL
        ORDER BY c.created_at
    """)
    candidate_results = db.execute(candidate_stmt, {"node_id": node_id}).fetchall()
    
    return [
        {
            "id": row.id,
            "name": row.name,
            "description": row.description,
            "is_selected": row.is_selected
        }
        for row in candidate_results
    ]
