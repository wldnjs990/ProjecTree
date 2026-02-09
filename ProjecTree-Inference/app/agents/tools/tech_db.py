from typing import List, Dict, Optional
from langchain_core.tools import tool
from app.db.session import get_db
from app.db.repository.tech_repository import tech_vocabulary_repository
from app.db.repository.candidate_repository import candidate_repository


@tool
def insert_official_tech_name(tech_name: str) -> Dict:
    """
    만약 search_official_tech_name 도구로 검색한 기술 스택이 데이터베이스에 존재하지 않는다면,
    기술 스택의 공식 영문 명칭을 데이터베이스에 삽입합니다.
    새로운 기술 스택을 추가할 때 이 도구를 사용하세요.

    Args:
        tech_name (str): 삽입할 기술 스택의 공식 명칭 (kebab-case, 예: 'react', 'spring-boot')
    """
    with next(get_db()) as db:
        return tech_vocabulary_repository.create_with_duplicate_check(db, tech_name)


@tool
def search_official_tech_name(keyword: str) -> Optional[Dict]:
    """
    기술 스택의 공식 영문 명칭을 데이터베이스에서 부분 일치로 검색합니다.
    기술의 정확한 이름을 모르거나, 유사한 공식 명칭 후보들을 확인하고 싶을 때 사용하세요.
    검색된 기술 중 가장 적합한 것을 선택하여 출력에 반영하세요.
    
    Args:
        keyword (str): 검색할 기술 스택의 이름 (예: 'react' -> 'react', 'react-native' 등 검색됨)
    Returns:
        Optional[Dict]: 검색된 기술의 id와 name을 포함한 딕셔너리. 결과가 없으면 빈 딕셔너리를 반환합니다.
    """
    with next(get_db()) as db:
        return tech_vocabulary_repository.search_by_keyword(db, keyword)


@tool
def insert_candidate_tool(node_id: int, candidates: List[Dict[str, str]]) -> str:
    """
    생성된 후보(Candidate) 노드들을 데이터베이스에 저장합니다.
    Epic, Story, Task 등의 하위 노드를 제안할 때 사용하세요.

    Args:
        node_id (int): 현재 노드의 ID (Parent Node ID).
        candidates (List[Dict[str, str]]): 저장할 후보 리스트. 각 후보는 {"name": "...", "description": "...", "type": "..."} 형태여야 합니다.
    """
    with next(get_db()) as db:
        candidate_repository.create_multiple(db, node_id, candidates)
        return "Candidates inserted successfully."
