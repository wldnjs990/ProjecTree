from typing import List, Dict, Optional
from langchain_core.tools import tool
from app.services.db_service import (
    get_db,
    create_tech_info,
    fetch_tech_info,
    create_candidate,
)


@tool
def insert_official_tech_name(tech_name: str) -> Dict:
    """
    만약 search_official_tech_name 도구로 검색한 기술 스택이 데이터베이스에 존재하지 않는다면,
    기술 스택의 공식 영문 명칭을 데이터베이스에 삽입합니다.
    새로운 기술 스택을 추가할 때 이 도구를 사용하세요.

    Args:
        tech_name (str): 삽입할 기술 스택의 공식 명칭 (kebab-case, 예: 'react', 'spring-boot')
    """
    db = next(get_db())
    try:
        return create_tech_info(db, tech_name)
    finally:
        db.close()


@tool
def search_official_tech_name(keyword: str) -> Optional[Dict]:
    """
    기술 스택의 공식 영문 명칭을 데이터베이스에서 검색합니다.
    기술의 이름이 확실하지 않거나, 공식 명칭을 확인해야 할 때 이 도구를 사용하세요.
    Args:
        keyword (str): 검색할 기술 스택의 이름 (kebab-case, 예: 'react', 'spring')
    """
    db = next(get_db())
    try:
        return fetch_tech_info(db, keyword)
    finally:
        db.close()


@tool
def insert_candidate_tool(node_id: int, candidates: List[Dict[str, str]]) -> str:
    """
    생성된 후보(Candidate) 노드들을 데이터베이스에 저장합니다.
    Epic, Story, Task 등의 하위 노드를 제안할 때 사용하세요.

    Args:
        node_id (int): 현재 노드의 ID (Parent Node ID).
        candidates (List[Dict[str, str]]): 저장할 후보 리스트. 각 후보는 {"name": "...", "description": "...", "type": "..."} 형태여야 합니다.
    """
    db = next(get_db())
    try:
        create_candidate(db, node_id, candidates)
        return "Candidates inserted successfully."
    except Exception as e:
        return f"Error inserting candidates: {e}"
    finally:
        db.close()
