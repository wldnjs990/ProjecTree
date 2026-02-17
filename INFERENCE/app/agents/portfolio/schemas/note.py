"""노트 필터링 스키마 정의"""

from pydantic import BaseModel, Field
from typing import List


class NoteFilterItem(BaseModel):
    """개별 노트 필터링 결과"""
    task_index: int = Field(description="태스크 인덱스 (0부터 시작)")
    is_technical: bool = Field(description="기술적 의사결정이 포함된 노트인지 여부")


class NoteFilterBatchResult(BaseModel):
    """배치 노트 필터링 결과"""
    results: List[NoteFilterItem] = Field(description="각 노트의 필터링 결과 리스트")
