from app.agents.states.state import RecommendationState
from app.core.llm import mini_llm
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.agents.tools.tech_db import search_official_tech_name, insert_official_tech_name

def tech_stack_integrator(state: RecommendationState) -> RecommendationState:
    tech_list = state.get("tech_list")
    
    for tech in tech_list.techs:
        tech_name = tech.name
        tech_id = search_official_tech_name.func(tech_name).get("id")
        if tech_id is None:
            tech_id = insert_official_tech_name.func(tech_name).get("id")
        tech.id = tech_id
    return {"tech_list": tech_list}
