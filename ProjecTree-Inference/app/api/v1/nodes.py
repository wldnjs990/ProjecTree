"""노드 생성 API 엔드포인트"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas.nodes import NodeCreateRequest, NodeCreateResponse
from app.services.node_service import NodeService
from app.core.dependencies import get_node_service, get_db

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
    try:
        return await service.create_node(db=db, request=request)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"노드 생성 중 오류 발생: {str(e)}"
        )

