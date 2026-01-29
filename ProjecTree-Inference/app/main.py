"""ProjecTree Inference API

FastAPI 기반 추론 서버 메인 진입점
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import uvicorn
from app.api.v1 import api_router
from app.core.config import settings
import logging

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

# FastAPI 앱 인스턴스 생성
app = FastAPI(
    title="ProjecTree Inference API",
    description="""
## ProjecTree 추론 API

프로젝트 개발 로드맵 생성을 위한 AI 기반 추론 서비스입니다.

### 주요 기능

- **후보 노드 생성**: 현재 노드를 기반으로 하위 후보 노드 추천
- **기술 스택 추천**: 태스크에 적합한 기술 스택 추천 및 비교 분석
- **노드 생성**: 워크스페이스에 새로운 노드 생성 (미완성)

### API 버전

현재 API 버전: v1
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인으로 제한 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(api_router)


@app.get("/", tags=["Health"])
async def root():
    """API 상태 확인"""
    return {
        "status": "healthy",
        "service": "ProjecTree Inference API",
        "version": "1.0.0"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "ok"}


if __name__ == "__main__":
    
    # 부모 디렉토리를 Python 경로에 추가
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
