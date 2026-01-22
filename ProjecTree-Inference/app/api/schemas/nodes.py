from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class NodeCreateRequest(BaseModel):
    """노드 생성 요청 스키마"""
    workspace_id: int = Field(..., description="워크스페이스 ID")
    node_data: Dict[str, Any] = Field(..., description="노드 데이터")


class NodeCreateResponse(BaseModel):
    """노드 생성 응답 스키마"""
    node_id: Optional[int] = Field(None, description="생성된 노드 ID")
    status: str = Field("success", description="응답 상태")
    message: Optional[str] = Field(None, description="추가 메시지")
