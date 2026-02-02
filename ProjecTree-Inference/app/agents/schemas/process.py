from pydantic import BaseModel, Field
from typing import List, Optional
from app.agents.enums import TaskType


class BaseNodeProcessResult(BaseModel):
    name: str = Field(description="정제된 노드 이름 (명확하고 간결하게)")
    description: str = Field(description="노드에 대한 설명 및 구현 가이드", min_length=1, max_length=1000)
    summary: str = Field(description="노드에 대한 핵심 키워드 중심 한 줄 요약. 반드시 60자 이내. 예시: '유스케이스별 트랜잭션 경계와 동시성 제어 및 복구 정책을 정의하고, 격리 수준과 DB 흐름도를 포함한다.'", min_length=1, max_length=60)


class EpicProcessResult(BaseNodeProcessResult):
    pass


class StoryProcessResult(BaseNodeProcessResult):
    pass


class TaskProcessResult(BaseNodeProcessResult):
    difficulty: int = Field(default=3, description="구현 난이도 (1-5)")
    task_type: TaskType = Field(description="태스크 타입 (FE/BE)")


class AdvanceProcessResult(BaseNodeProcessResult):
    difficulty: int = Field(default=3, description="구현 난이도 (1-5)")