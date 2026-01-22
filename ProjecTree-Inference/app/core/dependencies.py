"""의존성 주입 관리 모듈

FastAPI의 Depends를 통해 서비스 인스턴스를 제공합니다.
"""

from functools import lru_cache
from typing import Generator

from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import SessionLocal, AsyncSessionLocal
from app.db.repository.node_repository import NodeRepository, node_repository
from app.services.candidate_service import CandidateService
from app.services.recommendation_service import RecommendationService
from app.services.node_service import NodeService


# ==================== Database Dependencies ====================

def get_db() -> Generator[Session, None, None]:
    """동기 DB 세션 의존성"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db() -> AsyncSession:
    """비동기 DB 세션 의존성"""
    async with AsyncSessionLocal() as db:
        yield db


# ==================== Repository Dependencies ====================

def get_node_repository() -> NodeRepository:
    """NodeRepository 인스턴스 제공"""
    return node_repository


# ==================== Service Dependencies ====================

@lru_cache()
def get_candidate_service() -> CandidateService:
    """CandidateService 싱글톤 인스턴스 제공"""
    return CandidateService(node_repository=node_repository)


@lru_cache()
def get_recommendation_service() -> RecommendationService:
    """RecommendationService 싱글톤 인스턴스 제공"""
    return RecommendationService(node_repository=node_repository)


@lru_cache()
def get_node_service() -> NodeService:
    """NodeService 싱글톤 인스턴스 제공"""
    return NodeService()

