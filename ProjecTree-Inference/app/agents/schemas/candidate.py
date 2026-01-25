from typing import Literal, Optional, TypedDict,List
from pydantic import Field

class Candidate(TypedDict):
    name: str = Field(description="후보 노드의 이름")
    description: str = Field(description="후보 노드의 설명")

class TaskCandidate(Candidate):
    task_type: Literal["FE", "BE"] = Field(description="작업의 세부 유형")

class CandidateList(TypedDict):
    candidates: List[Candidate]

class TaskCandidateList(TypedDict):
    candidates: List[TaskCandidate]