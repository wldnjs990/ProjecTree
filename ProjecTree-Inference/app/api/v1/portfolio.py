"""포트폴리오 생성 API 엔드포인트"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
import traceback

from app.api.schemas.portfolio import PortfolioGenerateRequest, PortfolioGenerateResponse
from app.services.portfolio_service import PortfolioService
from app.core.dependencies import get_portfolio_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])


@router.post(
    "",
    response_model=PortfolioGenerateResponse,
    summary="포트폴리오 생성",
    description="사용자의 프로젝트 정보와 수행한 작업들을 기반으로 포트폴리오를 생성합니다.",
    responses={
        200: {"description": "포트폴리오 생성 성공"},
        500: {"description": "서버 오류"},
    }
)
async def generate_portfolio(
    request: PortfolioGenerateRequest,
    service: PortfolioService = Depends(get_portfolio_service)
) -> PortfolioGenerateResponse:
    """포트폴리오 생성 엔드포인트
    
    사용자의 프로젝트 정보, 수행한 작업 목록, 사용된 기술 스택 정보를 기반으로
    LLM을 활용하여 포트폴리오를 생성합니다.
    """
    logger.info(f"[Portfolio API] 포트폴리오 생성 요청 시작 - project_title: {request.project_title}")
    try:
        result = await service.generate_portfolio(request=request)
        logger.info(f"[Portfolio API] 포트폴리오 생성 성공 - project_title: {request.project_title}")
        return result
    except Exception as e:
        logger.error(f"[Portfolio API] 포트폴리오 생성 중 오류 발생 - project_title: {request.project_title}")
        logger.error(f"[Portfolio API] Error Type: {type(e).__name__}")
        logger.error(f"[Portfolio API] Error Message: {str(e)}")
        logger.error(f"[Portfolio API] Traceback:\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"포트폴리오 생성 중 오류 발생: {str(e)}"
        )
