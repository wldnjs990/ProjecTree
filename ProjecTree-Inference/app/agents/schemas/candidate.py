from typing import Literal, Optional, TypedDict,List
from pydantic import Field

class Candidate(TypedDict):
    name: str = Field(description="후보 노드의 이름")
    description: str = Field(description="후보 노드의 설명")
    task_type: Optional[Literal["FE", "BE"]] = Field(default=None, description="만약 STORY 노드에서 후보 노드를 생성할 경우 세부 유형")

class CandidateList(TypedDict):
    candidates: List[Candidate]