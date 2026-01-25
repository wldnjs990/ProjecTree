"""의존성 주입 관리 모듈

FastAPI의 Depends를 통해 서비스 인스턴스를 제공합니다.
"""

from functools import lru_cache
from typing import Generator

from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import SessionLocal, AsyncSessionLocal
from app.db.repository.node_repository import NodeRepository, node_repository
from app.db.repository.candidate_repository import (
    CandidateRepository,
    candidate_repository,
)
from app.db.repository.tech_repository import (
    TechVocabularyRepository,
    tech_vocabulary_repository,
)
from app.db.repository.tech_stack_info_repository import (
    TechStackInfoRepository,
    tech_stack_info_repository,
)
from app.db.repository.node_tech_stack_repository import (
    NodeTechStackRepository,
    node_tech_stack_repository,
)
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


def get_candidate_repository() -> CandidateRepository:
    """CandidateRepository 인스턴스 제공"""
    return candidate_repository


def get_tech_vocabulary_repository() -> TechVocabularyRepository:
    """TechVocabularyRepository 인스턴스 제공"""
    return tech_vocabulary_repository


def get_tech_stack_info_repository() -> TechStackInfoRepository:
    """TechStackInfoRepository 인스턴스 제공"""
    return tech_stack_info_repository


def get_node_tech_stack_repository() -> NodeTechStackRepository:
    """NodeTechStackRepository 인스턴스 제공"""
    return node_tech_stack_repository


# ==================== Service Dependencies ====================


@lru_cache()
def get_candidate_service() -> CandidateService:
    """CandidateService 싱글톤 인스턴스 제공"""
    return CandidateService(
        node_repository=node_repository, candidate_repository=candidate_repository
    )


@lru_cache()
def get_recommendation_service() -> RecommendationService:
    """RecommendationService 싱글톤 인스턴스 제공"""
    return RecommendationService(
        node_repository=node_repository,
        tech_vocabulary_repository=tech_vocabulary_repository,
        tech_stack_info_repository=tech_stack_info_repository,
        node_tech_stack_repository=node_tech_stack_repository,
    )


@lru_cache()
def get_node_service() -> NodeService:
    """NodeService 싱글톤 인스턴스 제공"""
    return NodeService()
