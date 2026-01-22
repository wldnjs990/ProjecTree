from typing import List, Optional
from pydantic import BaseModel, Field
from app.agents.enums import NodeType
from app.agents.schemas.candidate import Candidate



class CandidateGenerateRequest(BaseModel):
    """후보 노드 생성 요청 스키마"""
    node_id: Optional[int] = Field(None, description="현재 노드의 DB ID (형제 노드 조회용)")
    candidate_count: Optional[int] = Field(3, description="생성할 후보 개수")


class CandidateGenerateResponse(BaseModel):
    """후보 노드 생성 응답 스키마"""
    candidates: List[Candidate] = Field(default_factory=list, description="생성된 후보 노드 목록")

