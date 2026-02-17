from typing import Dict, Optional, List
from sqlalchemy.orm import Session
from app.db.repository.base_repository import BaseRepository
from app.db.models import TechVocabulary
from app.db.schemas.tech import TechVocabularyCreate, TechVocabularyUpdate

class TechVocabularyRepository(BaseRepository[TechVocabulary, TechVocabularyCreate, TechVocabularyUpdate]):
    """기술 스택 관련 DB 쿼리를 처리하는 레포지토리"""
    
    def search_by_keyword(self, db: Session, keyword: str) -> Optional[Dict]:
        """
        기술 스택의 공식 영문 명칭을 데이터베이스에서 부분 일치로 검색합니다.
        
        Args:
            db: SQLAlchemy 세션
            keyword: 검색할 기술 스택의 이름
            
        Returns:
            Optional[Dict]: 검색된 기술의 id와 name을 포함한 딕셔너리. 결과가 없으면 빈 딕셔너리를 반환합니다.
        """
        results = db.query(self.model).filter(
            self.model.name.ilike(f"%{keyword}%")
        ).all()
        
        if not results:
            return {}
        
        return {
            "results": [
                {"id": tech.id, "name": tech.name}
                for tech in results
            ]
        }
    
    def create_with_duplicate_check(self, db: Session, tech_name: str) -> Dict:
        """
        새로운 기술 스택을 데이터베이스에 삽입합니다. 중복 체크 포함.
        
        Args:
            db: SQLAlchemy 세션
            tech_name: 삽입할 기술 스택의 공식 명칭 (kebab-case)
            
        Returns:
            Dict: 삽입된 기술의 id와 name을 포함한 딕셔너리
        """
        # 이미 존재하는지 확인
        existing = db.query(self.model).filter(
            self.model.name == tech_name
        ).first()
        
        if existing:
            return {"id": existing.id, "name": existing.name, "status": "already_exists"}
        
        # 새로운 기술 스택 생성
        new_tech = self.model(name=tech_name)
        db.add(new_tech)
        db.commit()
        db.refresh(new_tech)
        
        return {"id": new_tech.id, "name": new_tech.name, "status": "created"}

# 레포지토리 인스턴스 생성
tech_vocabulary_repository = TechVocabularyRepository(TechVocabulary)
