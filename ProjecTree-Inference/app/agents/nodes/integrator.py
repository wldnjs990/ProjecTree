from app.agents.states.state import PlanNodeState
from app.core.llm import mini_llm
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.services.db_service import link_node_tech_stack, get_db

llm = mini_llm

from app.agents.prompts.integrator_prompts import integrator_prompt

chain = integrator_prompt | llm | StrOutputParser()


def tech_stack_integrator(state: PlanNodeState) -> PlanNodeState:
    """추천된 기술 스택의 정보를 통합하고 비교 분석 코멘트를 생성하는 노드"""
    recs = state.get("tech_recommendations", [])
    spec = state.get("project_spec", {})

    if not recs:
        return state

    tech_descriptions = "\n".join(
        [
            f"- {r['tech_name']}: {r['details'].get('description')} (Score: {r['details'].get('recommendation_score')})"
            for r in recs
        ]
    )

    comment = chain.invoke({"spec": str(spec), "techs": tech_descriptions})

    # Save relation to DB
    node_id = state.get("node_data", {}).get("id")
    if node_id:
        db = next(get_db())
        try:
            for r in recs:
                link_node_tech_stack(
                    db, node_id, r["tech_vocab_id"], r["info_id"], is_recommended=True
                )
        finally:
            db.close()

    # Update the last recommendation or separate field?
    # User asked for "AI comment comparing the three".
    # I will add it to the state. Since 'node_data' is a dict, I'll add it there.
    node_data = state.get("node_data") or {}
    node_data["tech_comment"] = comment

    return {"node_data": node_data}
