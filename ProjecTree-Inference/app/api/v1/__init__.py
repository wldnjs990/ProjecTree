"""API v1 라우터 통합 모듈"""

from fastapi import APIRouter

from app.api.v1.candidates import router as candidates_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.nodes import router as nodes_router

# API v1 메인 라우터
api_router = APIRouter(prefix="/api/v1")

# 개별 라우터 등록
api_router.include_router(candidates_router)
api_router.include_router(recommendations_router)
api_router.include_router(nodes_router)
