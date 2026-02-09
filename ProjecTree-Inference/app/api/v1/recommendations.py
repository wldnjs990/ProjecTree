"""기술 스택 추천 API 엔드포인트"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
import traceback

from app.api.schemas.recommendations import TechStackRecommendRequest, TechStackRecommendResponse
from app.services.recommendation_service import RecommendationService
from app.core.dependencies import get_recommendation_service, get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tech-stacks", tags=["TechStack"])


@router.post(
    "",
    response_model=TechStackRecommendResponse,
    summary="기술 스택 추천",
    description="노드 정보를 기반으로 적합한 기술 스택을 추천합니다.",
    responses={
        200: {"description": "기술 스택 추천 성공"},
        500: {"description": "서버 오류"},
        501: {"description": "서비스 미구현"},
    }
)
async def recommend_tech_stack(
    request: TechStackRecommendRequest,
    db: Session = Depends(get_db),
    service: RecommendationService = Depends(get_recommendation_service)
) -> TechStackRecommendResponse:
    """기술 스택 추천 엔드포인트
    
    태스크 노드의 타입(FE/BE)과 설명을 기반으로 
    적합한 기술 스택을 추천하고 비교 분석을 제공합니다.
    recommend_graph를 활용하여 LLM 기반 추천을 수행합니다.
    """
    logger.info(f"[Recommendations API] 기술 스택 추천 요청 시작 - node_id: {request.node_id}")
    try:
        result = await service.recommend_tech_stack(db=db, request=request, workspace_id=request.workspace_id)
        logger.info(f"[Recommendations API] 기술 스택 추천 성공 - node_id: {request.node_id}, 추천된 기술 수: {len(result.techs)}")
        return result
    except NotImplementedError as e:
        logger.warning(f"[Recommendations API] 서비스 미구현 - node_id: {request.node_id}, error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"[Recommendations API] 기술 스택 추천 중 오류 발생 - node_id: {request.node_id}")
        logger.error(f"[Recommendations API] Error Type: {type(e).__name__}")
        logger.error(f"[Recommendations API] Error Message: {str(e)}")
        logger.error(f"[Recommendations API] Traceback:\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"기술 스택 추천 중 오류 발생: {str(e)}"
        )

