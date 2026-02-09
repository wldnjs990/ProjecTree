from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class NodeCreateRequest(BaseModel):
    """노드 생성 요청 스키마"""
    workspace_id: int = Field(..., description="워크스페이스 ID")
    candidate_id: int = Field(..., description="후보 노드 ID")
    parent_id: int = Field(..., description="부모 노드 ID")
    x_pos: float = Field(..., description="노드 X 좌표")
    y_pos: float = Field(..., description="노드 Y 좌표")


class NodeCreateResponse(BaseModel):
    """노드 생성 응답 스키마"""
    node_id: Optional[int] = Field(None, description="생성된 노드 ID")
    parent_id: Optional[int] = Field(None, description="부모 노드 ID")
    candidate_id: Optional[int] = Field(None, description="후보 노드 ID")
    x_pos: Optional[float] = Field(None, description="노드 X 좌표")
    y_pos: Optional[float] = Field(None, description="노드 Y 좌표")
    
