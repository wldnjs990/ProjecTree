from app.agents.states.state import PlanNodeState
from app.services.db_service import (
    create_epic_node,
    create_story_node,
    create_task_node,
    create_subtask_node,
    get_db,
)
from app.core.llm import mini_llm
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage
from app.schemas.analysis import TaskAnalysis

llm = mini_llm


def _get_db_session():
    return next(get_db())


SYSTEM_PROMPT = "You are a technical lead. Analyze the task and provide a technical comparison of approaches and difficulty level (1-5)."

analyzer_agent = create_agent(
    model=llm, tools=[], system_prompt=SYSTEM_PROMPT, response_format=TaskAnalysis
)


def epic_node_process(state: PlanNodeState) -> PlanNodeState:
    """Create Epic Node in DB."""
    node_data = state.get("node_data", {})
    # Assuming node_data has 'name', 'description', 'parent_id'

    db = _get_db_session()
    try:
        node_id = create_epic_node(db, node_data)
    finally:
        db.close()

    return {"node_data": {**node_data, "id": node_id}}  # Update with ID


def story_node_process(state: PlanNodeState) -> PlanNodeState:
    """Create Story Node in DB."""
    node_data = state.get("node_data", {})

    db = _get_db_session()
    try:
        node_id = create_story_node(db, node_data)
    finally:
        db.close()

    return {"node_data": {**node_data, "id": node_id}}


def task_node_process(state: PlanNodeState) -> PlanNodeState:
    """Create Task Node in DB with analysis."""
    node_data = state.get("node_data", {})

    # Analyze Task
    try:
        msg = f"Task: {node_data.get('name')}\nDescription: {node_data.get('description')}\nType: {node_data.get('type', 'BE')}"
        result = analyzer_agent.invoke({"messages": [HumanMessage(content=msg)]})
        analysis = result.get("structured_response")

        node_data["comparison"] = analysis.comparison if analysis else ""
        node_data["difficult"] = analysis.difficult if analysis else 1
    except Exception as e:
        print(f"Task Analysis failed: {e}")

    db = _get_db_session()
    try:
        # Map 'type' to 'task_type' if needed by db_service
        node_data["task_type"] = node_data.get("type", "BE")
        node_id = create_task_node(db, node_data)
    finally:
        db.close()

    return {"node_data": {**node_data, "id": node_id}}


def sub_task_node_process(state: PlanNodeState) -> PlanNodeState:
    """Create SubTask Node in DB."""
    node_data = state.get("node_data", {})

    # Reuse Task Analyzer or simple logic
    try:
        msg = f"Task: {node_data.get('name')}\nDescription: {node_data.get('description')}\nType: SubTask"
        result = analyzer_agent.invoke({"messages": [HumanMessage(content=msg)]})
        analysis = result.get("structured_response")

        node_data["comparison"] = analysis.comparison if analysis else ""
        node_data["difficult"] = analysis.difficult if analysis else 1
    except:
        pass

    db = _get_db_session()
    try:
        node_id = create_subtask_node(db, node_data)
    finally:
        db.close()

    return {"node_data": {**node_data, "id": node_id}}
