"""후보 노드 생성 API 엔드포인트"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
import traceback

from app.api.schemas.candidates import CandidateGenerateRequest, CandidateGenerateResponse
from app.services.candidate_service import CandidateService
from app.core.dependencies import get_candidate_service, get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/candidates", tags=["Candidates"])


@router.post(
    "/generate",
    response_model=CandidateGenerateResponse,
    summary="후보 노드 생성",
    description="현재 노드 정보를 기반으로 하위 후보 노드들을 생성합니다.",
    responses={
        200: {"description": "후보 노드 생성 성공"},
        500: {"description": "서버 오류"},
        501: {"description": "서비스 미구현"},
    }
)
async def generate_candidates(
    request: CandidateGenerateRequest,
    db: Session = Depends(get_db),
    service: CandidateService = Depends(get_candidate_service)
) -> CandidateGenerateResponse:
    """후보 노드 생성 엔드포인트
    
    현재 노드의 타입과 정보를 기반으로 하위 후보 노드들을 생성합니다.
    candidate_graph를 활용하여 LLM 기반 추천을 수행합니다.
    """
    logger.info(f"[Candidates API] 후보 노드 생성 요청 시작 - node_id: {request.node_id}, candidate_count: {request.candidate_count}")
    try:
        result = await service.generate_candidates(db=db, request=request)
        logger.info(f"[Candidates API] 후보 노드 생성 성공 - node_id: {request.node_id}, 생성된 후보 수: {len(result.candidates)}")
        return result
    except NotImplementedError as e:
        logger.warning(f"[Candidates API] 서비스 미구현 - node_id: {request.node_id}, error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"[Candidates API] 후보 노드 생성 중 오류 발생 - node_id: {request.node_id}")
        logger.error(f"[Candidates API] Error Type: {type(e).__name__}")
        logger.error(f"[Candidates API] Error Message: {str(e)}")
        logger.error(f"[Candidates API] Traceback:\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"후보 노드 생성 중 오류 발생: {str(e)}"
        )

