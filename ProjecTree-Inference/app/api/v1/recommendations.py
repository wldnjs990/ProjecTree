"""기술 스택 추천 API 엔드포인트"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas.recommendations import TechStackRecommendRequest, TechStackRecommendResponse
from app.services.recommendation_service import RecommendationService
from app.core.dependencies import get_recommendation_service, get_db

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.post(
    "/tech-stack",
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
    try:
        return await service.recommend_tech_stack(db=db, request=request)
    except NotImplementedError as e:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"기술 스택 추천 중 오류 발생: {str(e)}"
        )

