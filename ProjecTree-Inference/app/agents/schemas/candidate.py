from pydantic import BaseModel, Field

class Candidate(TypedDict):
    name: str = Field(description="후보 노드의 이름")
    description: str = Field(description="후보 노드의 설명")