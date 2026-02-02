"""노드 생성 API 엔드포인트"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
import traceback

from app.api.schemas.nodes import NodeCreateRequest, NodeCreateResponse
from app.services.node_service import NodeService
from app.core.dependencies import get_node_service, get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/nodes", tags=["Nodes"])


@router.post(
    "/create",
    response_model=NodeCreateResponse,
    summary="노드 생성",
    description="워크스페이스에 새로운 노드를 생성합니다. 메인 그래프를 활용하여 노드 생성 워크플로우를 실행합니다.",
    responses={
        200: {"description": "노드 생성 성공"},
        500: {"description": "서버 오류"},
    }
)
async def create_node(
    request: NodeCreateRequest,
    db: Session = Depends(get_db),
    service: NodeService = Depends(get_node_service)
) -> NodeCreateResponse:
    """노드 생성 엔드포인트
    
    현재 후보 노드(candidate)와 부모 노드 정보를 기반으로 새로운 노드를 생성합니다.
    메인 그래프를 활용하여 노드 생성 및 정제 워크플로우를 실행합니다.
    """
    logger.info(f"[Nodes API] 노드 생성 요청 시작 - candidate_id: {request.candidate_id}, parent_id: {request.parent_id}")
    try:
        result = await service.create_node(db=db, request=request)
        logger.info(f"[Nodes API] 노드 생성 성공 - candidate_id: {request.candidate_id}, 생성된 node_id: {result.node_id}")
        return result
    except ValueError as e:
        logger.warning(f"[Nodes API] 잘못된 요청 - candidate_id: {request.candidate_id}, error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"[Nodes API] 노드 생성 중 오류 발생 - candidate_id: {request.candidate_id}, parent_id: {request.parent_id}")
        logger.error(f"[Nodes API] Error Type: {type(e).__name__}")
        logger.error(f"[Nodes API] Error Message: {str(e)}")
        logger.error(f"[Nodes API] Traceback:\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"노드 생성 중 오류 발생: {str(e)}"
        )

