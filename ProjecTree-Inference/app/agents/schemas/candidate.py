from app.agents.enums import TaskType
from typing import List
from pydantic import BaseModel, Field


class Candidate(BaseModel):
    name: str = Field(description="후보 노드의 이름")
    description: str = Field(description="후보 노드의 설명")
    summary: str = Field(
        description="[필수] 후보 노드 설명의 핵심 요약. 반드시 60자 이내의 한 문장으로 작성해야 합니다. 이 필드는 필수이며 절대 생략할 수 없습니다.",
        min_length=1,
        max_length=60
    )


class TaskCandidate(Candidate):
    task_type: TaskType = Field(description="작업의 유형")

class CandidateList(BaseModel):
    candidates: List[Candidate] = Field(default_factory=list, description="후보 노드 리스트")

class TaskCandidateList(CandidateList):
    candidates: List[TaskCandidate] = Field(default_factory=list, description="후보 노드 리스트")