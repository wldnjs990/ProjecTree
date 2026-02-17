from typing import List, Dict
from sqlalchemy.orm import Session
from app.db.repository.base_repository import BaseRepository
from app.db.models import Candidate
from app.db.schemas.candidate import CandidateCreate, CandidateUpdate

class CandidateRepository(BaseRepository[Candidate, CandidateCreate, CandidateUpdate]):
    """후보(Candidate) 노드 관련 DB 쿼리를 처리하는 레포지토리"""
    
    def create_multiple(self, db: Session, node_id: int, candidates: List[Dict[str, str]]) -> List[Dict]:
        """
        후보(Candidate) 노드들을 데이터베이스에 저장합니다.
        
        Args:
            db: SQLAlchemy 세션
            node_id: 현재 노드의 ID (Parent Node ID)
            candidates: 저장할 후보 리스트. 각 후보는 {"name": "...", "description": "..."} 형태여야 합니다.
            
        Returns:
            List[Dict]: 생성된 후보들의 정보
        """
        created_candidates = []
        
        for candidate_data in candidates:
            new_candidate = self.model(
                node_id=node_id,
                name=candidate_data.get("name"),
                description=candidate_data.get("description"),
                summary=candidate_data.get("summary"),
                is_selected=False
            )
            db.add(new_candidate)
            created_candidates.append(new_candidate)
        
        db.commit()
        
        # refresh all candidates to get their IDs
        result = []
        for candidate in created_candidates:
            db.refresh(candidate)
            result.append({
                "id": candidate.id,
                "node_id": candidate.node_id,
                "name": candidate.name,
                "description": candidate.description,
                "summary": candidate.summary,
                "is_selected": candidate.is_selected
            })
        
        return result
    
    def get_by_node_id(self, db: Session, node_id: int) -> List[Candidate]:
        """
        특정 노드의 모든 후보를 조회합니다.
        
        Args:
            db: SQLAlchemy 세션
            node_id: 노드 ID
            
        Returns:
            List[Candidate]: 해당 노드의 후보 목록
        """
        return db.query(self.model).filter(self.model.node_id == node_id).all()

# 레포지토리 인스턴스 생성
candidate_repository = CandidateRepository(Candidate)
