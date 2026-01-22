from typing import List, Optional
from pydantic import BaseModel, Field
from app.agents.enums import NodeType


class CandidateItem(BaseModel):
    """개별 후보 노드 정보"""
    name: str = Field(..., description="후보 노드의 이름")
    description: str = Field(..., description="후보 노드의 설명")


class CandidateGenerateRequest(BaseModel):
    """후보 노드 생성 요청 스키마"""
    node_id: Optional[int] = Field(None, description="현재 노드의 DB ID (형제 노드 조회용)")
    node_type: NodeType = Field(..., description="현재 노드 타입")
    name: str = Field(..., description="현재 노드 이름")
    description: str = Field(..., description="현재 노드 설명")
    service_type: Optional[str] = Field(None, description="서비스 타입 (WEB/APP)")
    candidate_count: Optional[int] = Field(3, description="생성할 후보 개수")


class CandidateGenerateResponse(BaseModel):
    """후보 노드 생성 응답 스키마"""
    candidates: List[CandidateItem] = Field(default_factory=list, description="생성된 후보 노드 목록")
    status: str = Field("success", description="응답 상태")
    message: Optional[str] = Field(None, description="추가 메시지")
