from typing import TypedDict,List
from pydantic import Field

class Candidate(TypedDict):
    name: str = Field(description="후보 노드의 이름")
    description: str = Field(description="후보 노드의 설명")

class CandidateList(TypedDict):
    candidates: List[Candidate]