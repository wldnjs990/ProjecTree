"""노드 생성 API 엔드포인트 (미완성)"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.schemas.nodes import NodeCreateRequest, NodeCreateResponse
from app.services.node_service import NodeService
from app.core.dependencies import get_node_service

router = APIRouter(prefix="/nodes", tags=["Nodes"])


@router.post(
    "/create",
    response_model=NodeCreateResponse,
    summary="노드 생성",
    description="워크스페이스에 새로운 노드를 생성합니다. (미완성)",
    responses={
        200: {"description": "노드 생성 성공"},
        500: {"description": "서버 오류"},
        501: {"description": "서비스 미구현"},
    }
)
async def create_node(
    request: NodeCreateRequest,
    service: NodeService = Depends(get_node_service)
) -> NodeCreateResponse:
    """노드 생성 엔드포인트 (미완성)
    
    워크스페이스 ID와 노드 데이터를 받아 새로운 노드를 생성합니다.
    메인 그래프를 활용하여 노드 생성 워크플로우를 실행합니다.
    
    TODO: 실제 구현 필요
    """
    try:
        return await service.create_node(request)
    except NotImplementedError as e:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"노드 생성 중 오류 발생: {str(e)}"
        )
