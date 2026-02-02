from dotenv import load_dotenv
from app.core.llm import openai_nano_llm, openai_mini_llm
from langchain.agents import create_agent
from deepagents import create_deep_agent
from langchain.agents.structured_output import ProviderStrategy
from app.agents.sub_agents.recommend.state import RecommendationState
from app.agents.tools.search import restricted_search
from app.agents.schemas.expert import TechList
from app.agents.tools.tech_db import  insert_official_tech_name
from typing import Any
from app.agents.sub_agents.recommend.prompts.user_prompts import EXPERT_USER_PROMPT
from app.agents.sub_agents.recommend.prompts.system_prompts import (
    FE_SYSTEM_PROMPT,
    BE_SYSTEM_PROMPT,
    ADVANCE_SYSTEM_PROMPT,
)
from app.agents.prompts.system.global_context import GLOBAL_CONTEXT
from pathlib import Path
import logging
import os

logger = logging.getLogger(__name__)

load_dotenv()

llm = openai_mini_llm
tools = [restricted_search]

MAX_RETRIES = 5  # 최대 재시도 횟수

def create_expert_agent(system_prompt: str):
    return create_deep_agent(
        llm, 
        tools, 
        system_prompt=system_prompt, 
        response_format=ProviderStrategy(TechList),
    )


frontend_executor = create_expert_agent(FE_SYSTEM_PROMPT)
backend_executor = create_expert_agent(BE_SYSTEM_PROMPT)
advance_executor = create_expert_agent(ADVANCE_SYSTEM_PROMPT)


def run_expert_node(state: RecommendationState, executor: Any):
    from langchain.agents.structured_output import StructuredOutputValidationError
    
    task_type = state.get("task_type")
    user_task = state.get("node_name")
    task_description = state.get("node_description")
    feedback = state.get("feedback")
    
    workspace_info = state.get("workspace_info")
    headcount = state.get("headcount")
    excluded_tech_stacks = state.get("excluded_tech_stacks")

    if workspace_info:
        workspace_context = GLOBAL_CONTEXT.format(
            project_tech_stack=[
                tech.name for tech in workspace_info.workspace_tech_stacks
            ],
            project_headcount=headcount,
            project_purpose=workspace_info.purpose,
            start_date=workspace_info.start_date,
            end_date=workspace_info.end_date,
            project_description=workspace_info.description,
        )
    else:
        workspace_context = "[프로젝트 정보가 없습니다.]"

    
    # 제외할 기술 스택 컨텍스트 생성
    if excluded_tech_stacks and len(excluded_tech_stacks) > 0:
        excluded_context = f"""[제외할 기술 스택]
    다음 기술들은 이미 이전에 추천받은 기술입니다. 이 기술들을 제외하고 다른 기술을 추천해 주세요:
    - {', '.join(excluded_tech_stacks)}
    """
    else:
        excluded_context = ""
    
    prompt_msg = EXPERT_USER_PROMPT.format(
        task_type=task_type, 
        user_task=user_task, 
        task_description=task_description, 
        workspace_info=workspace_context, 
        excluded_tech_stacks=excluded_context,
    )
    
    if feedback:
        prompt_msg += f"\n\n[이전 추천에 대한 피드백]\n{feedback}\n\n위 피드백을 반영하여 다시 추천해주세요."

    try:
        response = executor.invoke(
            {
                "messages": [
                    (
                        "user",
                        prompt_msg,
                    )
                ]
            }
        )
        output = response.get("structured_response")
        if output is None:
            logger.warning(f"경고: {user_task}에 대한 구조화된 응답(Tool Call)이 없습니다.")
            return {"tech_list": TechList(techs=[], comparison=""), "last_error": None}
        logger.info(output)
        return {"tech_list": output, "last_error": None}
    
    except StructuredOutputValidationError as e:
        error_message = str(e)
        logger.error(f"구조화된 출력 검증 실패: {error_message}")
        return {"last_error": error_message}


def frontend_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, frontend_executor)


def backend_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, backend_executor)


def advance_expert(state: RecommendationState) -> RecommendationState:
    return run_expert_node(state, advance_executor)


def expert_route(state: RecommendationState) -> RecommendationState:
    """초기화 노드 - last_error를 초기화"""
    return {"last_error": None}


def route_feedback(state: RecommendationState) -> RecommendationState:
    """추천 결과 검증 및 피드백 라우팅 노드"""
    from langchain_core.prompts import ChatPromptTemplate
    from pydantic import BaseModel, Field
    from typing import List
    from app.agents.sub_agents.recommend.prompts.validation_prompts import (
        TECH_VALIDATION_SYSTEM_PROMPT,
        TECH_VALIDATION_USER_PROMPT
    )
    
    last_error = state.get("last_error")
    retry_count = state.get("retry_count", 0)
    tech_list = state.get("tech_list")
    
    # 1. 구조적 에러(Structured Output Failure) 처리
    if last_error:
        new_retry_count = retry_count + 1
        logger.warning(f"구조화된 출력 검증 실패 (시도 {new_retry_count}/{MAX_RETRIES}): {last_error[:100]}...")
        
        if new_retry_count >= MAX_RETRIES:
            logger.warning(f"최대 재시도 횟수 초과. 빈 결과를 반환합니다.")
            return {
                "tech_list": TechList(techs=[], comparison=""),
                "retry_count": new_retry_count,
                "last_error": last_error,
                "feedback": "구조적 에러로 인한 실패"
            }
        
        return {"retry_count": new_retry_count, "feedback": f"출력 형식이 잘못되었습니다: {last_error}"}

    # 2. 내용 검증 (LLM-based Validation)
    if not tech_list or not tech_list.techs:
        # 기술 스택이 없으면 통과시킬지, 재시도할지 결정해야 함. 여기서는 일단 빈 결과로 간주하고 통과(또는 에러)
        return {"retry_count": 0}

    class ValidationResult(BaseModel):
        """기술 스택 검증 결과"""
        is_valid: bool = Field(description="검증 통과 여부 (score >= 7)")
        score: int = Field(description="품질 점수 (1-10)")
        issues: List[str] = Field(default_factory=list, description="발견된 문제점들")
        feedback: str = Field(description="전체적인 피드백")

    try:
        # 기술 스택 목록을 문자열로 변환
        tech_list_str = "\n".join([
            f"- {tech.name}: {tech.description} (장점: {tech.advantage}, 단점: {tech.disadvantage})"
            for tech in tech_list.techs
        ])
        
        validation_prompt = ChatPromptTemplate.from_messages([
            ("system", TECH_VALIDATION_SYSTEM_PROMPT),
            ("user", TECH_VALIDATION_USER_PROMPT)
        ])
        
        # llm은 전역 변수로 정의되어 있다고 가정 (app.core.llm.openai_nano_llm)
        llm_with_structure = llm.with_structured_output(ValidationResult)
        chain = validation_prompt | llm_with_structure
        
        result = chain.invoke({
            "node_name": state.get("node_name"),
            "node_description": state.get("node_description"),
            "task_type": state.get("task_type"),
            "tech_list_str": tech_list_str
        })
        
        if not result.is_valid:
            new_retry_count = retry_count + 1
            if new_retry_count >= MAX_RETRIES:
                 return {
                    "tech_list": tech_list, # 현재 결과 유지
                    "retry_count": new_retry_count,
                    "feedback": f"최대 재시도 횟수 초과. 현재 결과로 종료. (점수: {result.score})"
                }
            
            # 피드백 구성
            feedback_msg = f"[내용 검증 실패 - 점수: {result.score}]\n피드백: {result.feedback}\n문제점:\n"
            feedback_msg += "\n".join([f"- {issue}" for issue in result.issues])
            
            logger.warning(f"내용 검증 실패 (시도 {new_retry_count}/{MAX_RETRIES}): {feedback_msg[:100]}...")
            return {
                "retry_count": new_retry_count,
                "feedback": feedback_msg,
                "last_error": None # 구조적 에러는 아님
            }
            
        logger.info(f"검증 통과 (점수: {result.score})")
        return {"retry_count": 0, "feedback": None, "last_error": None}

    except Exception as e:
        logger.error(f"LLM validation failed: {str(e)}")
        # 검증 로직 에러 시 일단 통과 처리 (Safe Fail)
        return {"retry_count": 0}


def tech_stack_integrator(state: RecommendationState) -> RecommendationState:
    """기술 스택을 DB에 통합하는 노드"""
    tech_list = state.get("tech_list")
    
    if tech_list is None:
        return {"tech_list": TechList(techs=[], comparison="")}
    
    for tech in tech_list.techs:
        tech_name = tech.name.replace(' ', '')
        # insert_official_tech_name이 내부적으로 중복 체크(get or create)를 수행하므로 바로 호출
        result = insert_official_tech_name.func(tech_name)
        tech_id = result.get("id")
        
        # Pydantic 모델의 id 필드는 str | None 타입이므로 문자열로 변환
        if tech_id is not None:
            tech.id = str(tech_id)
    return {"tech_list": tech_list}
