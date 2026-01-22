from typing import List, Optional
from pydantic import BaseModel, Field
from app.agents.enums import NodeType


class TechRecommendationItem(BaseModel):
    """개별 기술 추천 정보"""
    name: str = Field(..., description="기술 명칭 (kebab-case)")
    advantage: str = Field(..., description="해당 기술의 핵심 장점")
    disadvantage: str = Field(..., description="해당 기술의 핵심 단점")
    description: str = Field(..., description="해당 기술에 대한 설명")
    ref: Optional[str] = Field(None, description="해당 기술에 대한 문서 URL")
    recommendation_score: int = Field(..., description="추천 점수 (1-5)")


class TechStackRecommendRequest(BaseModel):
    """기술 스택 추천 요청 스키마"""
    node_type: NodeType = Field(..., description="현재 노드 타입")
    task_type: str = Field(..., description="태스크 타입 (FE/BE/ADVANCE)")
    node_name: str = Field(..., description="노드 이름")
    node_description: str = Field(..., description="노드 설명")


class TechStackRecommendResponse(BaseModel):
    """기술 스택 추천 응답 스키마"""
    techs: List[TechRecommendationItem] = Field(default_factory=list, description="추천 기술 목록")
    comparison: str = Field("", description="기술 비교 설명 (Markdown 형식)")
    status: str = Field("success", description="응답 상태")
    message: Optional[str] = Field(None, description="추가 메시지")
