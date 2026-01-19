from app.agents.states.state import RecommendationState
from app.core.llm import mini_llm
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.services.db_service import link_node_tech_stack, get_db

llm = mini_llm

from app.agents.prompts.integrator_prompts import integrator_prompt

chain = integrator_prompt | llm | StrOutputParser()


def tech_stack_integrator(state: RecommendationState) -> RecommendationState:
    """추천된 기술 스택의 정보를 통합하고 비교 분석 코멘트를 생성하는 노드"""
    recs = state.get("tech_list", {})
    return state.update({"tech_comment": comment})
