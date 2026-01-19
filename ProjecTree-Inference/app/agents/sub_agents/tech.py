from typing import List
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage
from app.core.llm import mini_llm
from app.agents.states.state import PlanNodeState
from app.services.db_service import create_tech_info, create_tech_stack_info, get_db
from sqlalchemy.orm import Session
from app.schemas.tech import TechList

llm = mini_llm

SYSTEM_PROMPT = "You are a technical analyst. Extract the recommended technologies from the text. Ensure names are precise."

extractor_agent = create_agent(
    model=llm, tools=[], system_prompt=SYSTEM_PROMPT, response_format=TechList
)


def tech_name_agent(state: PlanNodeState) -> PlanNodeState:
    """
    Extracts tech names from the last message, maps them to DB,
    and updates state with mapped IDs and details.
    """
    messages = state["messages"]
    if not messages:
        return state

    last_msg = messages[-1].content

    # Extract structural data
    try:
        result = extractor_agent.invoke({"messages": [HumanMessage(content=last_msg)]})
        tech_list = result.get("structured_response")
        techs = tech_list.techs if tech_list else []
    except Exception as e:
        print(f"Extraction failed: {e}")
        return state

    mapped_recs = []
    vocab_ids = []

    # DB Interaction
    db: Session = next(get_db())
    try:
        for tech in techs:
            # 1. Tech Vocabulary (Upsert/Get)
            vocab = create_tech_info(db, tech.name)

            # 2. Tech Stack Info (Create)
            info_id = create_tech_stack_info(
                db,
                {
                    "advantage": tech.advantage,
                    "disadvantage": tech.disadvantage,
                    "description": tech.description,
                    "recommendation": tech.recommendation_score,
                    "is_selected": False,
                },
            )

            mapped_recs.append(
                {
                    "tech_vocab_id": vocab["id"],
                    "tech_name": vocab["name"],  # Normalized name
                    "info_id": info_id,
                    "details": tech.dict(),
                }
            )
            vocab_ids.append(vocab["id"])

    finally:
        db.close()

    return {"tech_recommendations": mapped_recs, "tech_vocab_ids": vocab_ids}
