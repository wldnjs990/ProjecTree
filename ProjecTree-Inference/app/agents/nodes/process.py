from app.agents.states.state import PlanNodeState

from app.core.llm import mini_llm
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage
from app.agents.schemas.analysis import TaskAnalysis

llm = mini_llm


def _get_db_session():
    return next(get_db())


SYSTEM_PROMPT = "You are a technical lead. Analyze the task and provide a technical comparison of approaches and difficulty level (1-5)."

analyzer_agent = create_agent(
    model=llm, tools=[], system_prompt=SYSTEM_PROMPT, response_format=TaskAnalysis
)


def epic_node_process(state: PlanNodeState) -> PlanNodeState:
    pass

def story_node_process(state: PlanNodeState) -> PlanNodeState:
    pass

def fe_task_node_process(state: PlanNodeState) -> PlanNodeState:
    pass

def be_task_node_process(state: PlanNodeState) -> PlanNodeState:
    pass

def task_node_process(state: PlanNodeState) -> PlanNodeState:
    pass 


def advance_node_process(state: PlanNodeState) -> PlanNodeState:
    pass
