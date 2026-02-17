"""
Search tools for sibling nodes and candidates.
"""
from typing import List, Dict
from langchain_core.tools import tool

from app.db.session import get_db
from app.db.repository.sibling_repository import (
    fetch_sibling_nodes,
    fetch_candidates
)


@tool
def search_sibling_nodes(node_id: int) -> List[Dict]:
    """
    현재 노드의 형제 노드들을 데이터베이스에서 조회합니다.
    형제 노드란 같은 부모 노드를 공유하는 노드들입니다.
    
    Args:
        node_id (int): 현재 노드의 ID
        
    Returns:
        List[Dict]: 형제 노드 목록 (id, name, description, node_type, status 포함)
    """
    with next(get_db()) as db:
        siblings = fetch_sibling_nodes(db, node_id)
        if not siblings:
            return []
        return siblings


@tool
def search_sibling_candidates(node_id: int) -> List[Dict]:
    """
    현재 노드의 형제 후보(Candidate) 노드들을 데이터베이스에서 조회합니다.
    같은 부모 노드에서 생성된 후보들을 반환합니다.
    
    Args:
        node_id (int): 현재 노드의 ID
        
    Returns:
        List[Dict]: 형제 후보 목록 (id, name, description, is_selected 포함)
    """
    with next(get_db()) as db:
        candidates = fetch_candidates(db, node_id)
        if not candidates:
            return []
        return candidates
