from typing import List
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage
from app.core.llm import mini_llm
from app.agents.states.state import RecommendationState
from app.agents.tools.tech_db import search_official_tech_name, insert_candidate_tool
from app.services.db_service import create_tech_info, create_tech_stack_info, get_db
from sqlalchemy.orm import Session
from app.agents.schemas.tech import TechName
from langchain.agents.structured_output import ToolStrategy
llm = mini_llm

extractor_agent = create_agent(
    model=llm, tools=[search_official_tech_name, insert_candidate_tool],  
    response_format=ToolStrategy(TechName)
)


def tech_name_agent(state: RecommendationState) -> RecommendationState:
    """
    Extracts tech names from the last message, maps them to DB,
    and updates state with mapped IDs and details.
    """
    tech_list = state["tech_list"]
    if not tech_list:
        return state

    # Extract structural data
    try:
        result = extractor_agent.invoke({"tech_names": tech_list})
        tech_list = result.get("structured_response")
        techs = tech_list.techs if tech_list else []
    except Exception as e:
        print(f"Extraction failed: {e}")
        return state
    