from app.agents.states.state import NodeState

from app.core.llm import mini_llm
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage
from app.agents.schemas.analysis import TaskAnalysis

llm = mini_llm


def _get_db_session():
    return next(get_db())


def epic_node_process(state: NodeState) -> NodeState:
    pass


def story_node_process(state: NodeState) -> NodeState:
    pass


def fe_task_node_process(state: NodeState) -> NodeState:
    pass


def be_task_node_process(state: NodeState) -> NodeState:
    pass


def advance_node_process(state: NodeState) -> NodeState:
    pass
