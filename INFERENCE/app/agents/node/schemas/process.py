from pydantic import BaseModel, Field
from app.agents.enums import TaskType


class BaseNodeProcessResult(BaseModel):
    name: str = Field(description="정제된 노드 이름 (명확하고 간결하게)")
    description: str = Field(
        description="[필수] 노드에 대한 설명 및 구현 가이드. 반드시 700token 이내(약 3000자)로 핵심 내용만 간결하게 작성하세요. 700token을 초과하면 안됩니다.",
        min_length=1,
        max_length=4000,
    )


class EpicProcessResult(BaseNodeProcessResult):
    pass


class StoryProcessResult(BaseNodeProcessResult):
    pass


class TaskProcessResult(BaseNodeProcessResult):
    difficulty: int = Field(default=3, description="구현 난이도 (1-5)")
    task_type: TaskType = Field(description="태스크 타입 (FE/BE)")


class AdvanceProcessResult(BaseNodeProcessResult):
    difficulty: int = Field(default=3, description="구현 난이도 (1-5)")
