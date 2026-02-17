"""포트폴리오 생성 API 스키마"""

from typing import List, Optional
from pydantic import BaseModel, Field


class TaskTechStackSchema(BaseModel):
    """기술 스택 정보"""

    name: str = Field(..., description="기술 스택 이름")
    advantage: str = Field(..., description="기술 스택 장점")
    disadvantage: str = Field(..., description="기술 스택 단점")
    description: str = Field(..., description="기술 스택 설명")


class UserTaskSchema(BaseModel):
    """사용자가 수행한 작업 정보"""

    task_name: str = Field(..., alias="taskName", description="작업 이름")
    task_description: str = Field(..., alias="taskDescription", description="작업 설명")
    task_note: Optional[str] = Field(
        None, alias="taskNote", description="작업 노트/메모"
    )
    tech_stack: Optional[TaskTechStackSchema] = Field(
        None, alias="techStack", description="사용된 기술 스택"
    )
    comparison: Optional[str] = Field(
        None, alias="comparison", description="기술 스택 비교"
    )

    class Config:
        populate_by_name = True


class PortfolioGenerateRequest(BaseModel):
    """포트폴리오 생성 요청 스키마"""

    project_title: str = Field(..., alias="projectTitle", description="프로젝트 제목")
    project_description: str = Field(
        ..., alias="projectDescription", description="프로젝트 설명"
    )
    project_head_count: int = Field(
        ..., alias="projectHeadCount", description="프로젝트 인원수"
    )
    project_start_date: Optional[str] = Field(
        None, alias="projectStartDate", description="프로젝트 시작일"
    )
    project_end_date: Optional[str] = Field(
        None, alias="projectEndDate", description="프로젝트 종료일"
    )
    project_tech_stack: Optional[List[str]] = Field(
        None, alias="projectTechStack", description="프로젝트 기술 스택 리스트"
    )
    user_task_schemas: List[UserTaskSchema] = Field(
        default_factory=list,
        alias="userTaskSchemas",
        description="사용자가 수행한 작업 목록",
    )
    workspace_id: int = Field(..., alias="workspaceId", description="워크스페이스 ID")
    member_id: int = Field(..., alias="memberId", description="멤버 ID")

    class Config:
        populate_by_name = True


class PortfolioGenerateResponse(BaseModel):
    """포트폴리오 생성 응답 스키마"""

    content: str = Field(
        ..., alias="content", description="생성된 포트폴리오 내용 (Markdown)"
    )
    
    class Config:
        populate_by_name = True
        by_alias = True
