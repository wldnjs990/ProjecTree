from pydantic import BaseModel, Field
from typing import List, Optional
from app.agents.enums import TaskType


class BaseNodeProcessResult(BaseModel):
    name: str = Field(description="정제된 노드 이름 (명확하고 간결하게)")
    description: str = Field(description="노드에 대한 상세 설명 및 구현 가이드")


class EpicProcessResult(BaseNodeProcessResult):
    pass


class StoryProcessResult(BaseNodeProcessResult):
    pass


class TaskProcessResult(BaseNodeProcessResult):
    difficulty: int = Field(default=3, description="구현 난이도 (1-5)")
    task_type: TaskType = Field(description="태스크 타입 (FE/BE)")


class AdvanceProcessResult(BaseNodeProcessResult):
    difficulty: int = Field(default=3, description="구현 난이도 (1-5)")