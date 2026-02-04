"""
Integrator node for tech stack DB integration.
"""

from app.agents.recommend.state import RecommendationState
from app.agents.recommend.schemas.expert import TechList
from app.agents.tools.tech_db import insert_official_tech_name
import logging

logger = logging.getLogger(__name__)


def tech_stack_integrator(state: RecommendationState) -> RecommendationState:
    """기술 스택을 DB에 통합하는 노드"""
    tech_list = state.get("tech_list")

    if tech_list is None:
        return {"tech_list": TechList(techs=[], comparison="")}

    for tech in tech_list.techs:
        tech_name = tech.name.replace(" ", "")
        # insert_official_tech_name이 내부적으로 중복 체크(get or create)를 수행하므로 바로 호출
        result = insert_official_tech_name.func(tech_name)
        tech_id = result.get("id")

        # Pydantic 모델의 id 필드는 str | None 타입이므로 문자열로 변환
        if tech_id is not None:
            tech.id = str(tech_id)
    return {"tech_list": tech_list}
