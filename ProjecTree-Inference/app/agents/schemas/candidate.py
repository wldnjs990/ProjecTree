from app.agents.enums import TaskType
from typing import Literal, Optional, TypedDict,List
from pydantic import Field

class Candidate(TypedDict):
    name: str = Field(description="후보 노드의 이름")
    description: str = Field(description="후보 노드의 설명")

class TaskCandidate(Candidate):
    task_type: TaskType = Field(description="작업의 유형")

class CandidateList(TypedDict):
    candidates: List[Candidate] = Field(default_factory=list, description="후보 노드 리스트")

class TaskCandidateList(CandidateList):
    candidates: List[TaskCandidate] = Field(default_factory=list, description="후보 노드 리스트")