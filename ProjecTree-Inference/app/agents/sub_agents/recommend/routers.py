from app.agents.enums import TaskType
from app.agents.sub_agents.recommend.state import RecommendationState

from app.agents.sub_agents.recommend.nodes import MAX_RETRIES




def should_retry(state: RecommendationState) -> str:
    """route_feedback 노드 후 재시도 여부 결정"""
    last_error = state.get("last_error")
    retry_count = state.get("retry_count", 0)
    # LLM을 통해 구조화된 출력에 대한 피드백을 생성하는 것도 고려해야됨.
    if last_error and retry_count < MAX_RETRIES:
        print(f"구조화된 출력 실패로 재시도 중... (시도 {retry_count}/{MAX_RETRIES})")
        return "init"
    return "tech_stack_integrator"

def route_task(state: RecommendationState) -> str:
    """Task 노드일 경우 FE/BE/Advance 전문가로 라우팅"""
    task_type = state.get("task_type", "")
    if task_type == TaskType.FRONTEND:
        return "frontend_expert"
    elif task_type == TaskType.BACKEND:
        return "backend_expert"
    elif task_type == TaskType.ADVANCE:
        return "advance_expert"
    # 기본값
    return "backend_expert"
