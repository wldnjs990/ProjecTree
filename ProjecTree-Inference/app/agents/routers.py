from app.agents.states.state import RecommendationState, PlanNodeState


def route_task(state: PlanNodeState) -> str:
    node_type = state.get("node_type", "")
    if node_type == "Task":
        task_type = state.get("node_data", {}).get(
            "type", "BE"
        )  # Default or error handle?
        if task_type == "FE":
            return "frontend_expert"
        elif task_type == "BE":
            return "backend_expert"
        else:
            return "web_search_agent"  # Fallback
    elif node_type == "SubTask":
        return "web_search_agent"
    return "web_search_agent"


def route_fetch(state: PlanNodeState) -> str:
    return "parent_node_fetch"


def route_node(state: PlanNodeState) -> str:
    node_type = state.get("node_type", "Epic")
    if node_type == "Epic":
        return "epic_node_process"
    elif node_type == "Story":
        return "story_node_process"
    elif node_type == "Task":
        return "task_node_process"
    elif node_type == "SubTask":
        return "sub_task_node_process"
    return "epic_node_process"


def route_agent_node(state: PlanNodeState) -> str:
    return "web_search_agent"


def route_teck_stack(state: PlanNodeState) -> str:
    return "tech_steck_create"


def route_sub_task_tech_stack(state: PlanNodeState) -> str:
    return "sub_task_tech_stack_create"


def route_feedback_loop(state: PlanNodeState) -> str:
    return "node_feedback"


def route_struct_feedback(state: PlanNodeState) -> str:
    return "struct_feedback"


def route_agent_result(state: PlanNodeState) -> str:
    return "structured_output_parser"


def loop_condition(state: PlanNodeState) -> bool:
    return False
