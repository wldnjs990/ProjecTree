"""
Feedback nodes for tech stack validation.
"""
from app.agents.recommend.state import RecommendationState
from app.agents.recommend.schemas.expert import TechList
from app.agents.recommend.routers import MAX_RETRIES
from app.core.llm import openai_mini_llm
import logging

logger = logging.getLogger(__name__)

llm = openai_nano_llm


def route_feedback(state: RecommendationState) -> RecommendationState:
    """추천 결과 검증 및 피드백 라우팅 노드"""
    from langchain_core.prompts import ChatPromptTemplate
    from pydantic import BaseModel, Field
    from typing import List
    from app.agents.recommend.prompts.validation_prompts import (
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
