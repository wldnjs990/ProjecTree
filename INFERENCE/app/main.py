"""ProjecTree Inference API
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import uvicorn
from app.api.v1 import api_router
from app.core.config import settings
import logging
from fastapi import Request
from fastapi.responses import JSONResponse
import traceback

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


# 로깅 미들웨어 (디버깅용)
@app.middleware("http")
async def log_request_info(request: Request, call_next):
    print(f"Incoming Request: {request.method} {request.url}")

    # Body 스트림 읽기
    body_bytes = await request.body()
    print(f"Request Body Size: {len(body_bytes)} bytes")
    print(
        f"Request Body Content: {body_bytes.decode('utf-8') if body_bytes else 'EMPTY'}"
    )

    # Body 스트림 복구 (FastAPI가 다시 읽을 수 있도록)
    async def receive():
        return {"type": "http.request", "body": body_bytes}

    request._receive = receive

    response = await call_next(request)
    return response


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


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """모든 예외를 잡아서 로깅하고 500 에러를 반환합니다."""
    # 에러 로그 상세 기록
    logging.error(f"Global Exception Handler Caught: {str(exc)}")
    logging.error(f"Request: {request.method} {request.url}")
    logging.error(f"Client: {request.client.host if request.client else 'Unknown'}")
    logging.error(traceback.format_exc())

    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)},
    )


@app.get("/", tags=["Health"])
async def root():
    """API 상태 확인"""
    return {
        "status": "healthy",
        "service": "ProjecTree Inference API",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "ok"}


if __name__ == "__main__":

    # 부모 디렉토리를 Python 경로에 추가
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    uvicorn.run(
        "app.main:app", host="0.0.0.0", port=8000, reload=True, log_level="info"
    )
