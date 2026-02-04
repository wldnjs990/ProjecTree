"""포트폴리오 생성 State 정의"""

from typing import TypedDict, List, Optional
from pydantic import BaseModel, Field


class TechStackInfo(TypedDict):
    """기술 스택 정보"""
    name: str
    advantage: str
    disadvantage: str
    description: str


class UserTask(TypedDict):
    """사용자가 수행한 작업 정보"""
    task_name: str
    task_description: str
    task_note: Optional[str]
    combination: Optional[str]
    comparison: Optional[str]
    tech_stack: Optional[TechStackInfo]


class PortfolioState(TypedDict):
    """포트폴리오 생성 State"""
    # 입력 정보
    project_title: str
    project_description: str
    project_head_count: int
    project_start_date: Optional[str]  # 프로젝트 시작일
    project_end_date: Optional[str]  # 프로젝트 종료일
    project_tech_stack: Optional[List[str]]  # 프로젝트 기술 스택 리스트
    user_tasks: List[UserTask]
    
    # 생성 과정에서 사용되는 중간 상태
    formatted_tasks: Optional[str]  # 작업 목록을 포맷팅한 문자열
    tech_summary: Optional[str]  # 기술 스택 요약
    
    # 출력 정보
    portfolio_content: Optional[str]  # 생성된 포트폴리오 마크다운
    summary: Optional[str]  # 포트폴리오 요약
    
    # 에러 및 재시도 관련
    last_error: Optional[str]
    retry_count: int
