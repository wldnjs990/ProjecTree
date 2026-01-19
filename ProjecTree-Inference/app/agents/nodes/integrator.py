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
    tech_lists = state.get("tech_list", [])

    # Flatten the list of techs from multiple experts
    all_techs = []
    for t_list in tech_lists:
        all_techs.extend(t_list.techs)

    # Format techs for the prompt
    techs_str = "\n".join(
        [f"- {t.name} ({t.tech_type}): {t.description}" for t in all_techs]
    )

    # Get project spec or node description as fallback
    spec = state.get("project_spec", state.get("node_description", "N/A"))

    comment = chain.invoke({"spec": spec, "techs": techs_str})

    return {"tech_comment": comment}
