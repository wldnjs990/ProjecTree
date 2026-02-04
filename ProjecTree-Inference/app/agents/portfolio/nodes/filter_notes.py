"""노트 필터링 노드 - 기술적 의사결정이 포함된 노트만 필터링 (배치 처리)"""

from app.agents.portfolio.state import PortfolioState
from app.agents.portfolio.schemas.note import NoteFilterBatchResult
from app.agents.portfolio.prompts.system.filter_system import NOTE_FILTER_SYSTEM_PROMPT
from app.agents.portfolio.prompts.user.filter_user import NOTE_FILTER_USER_PROMPT
from app.core.llm import openai_nano_llm
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableConfig
import logging

logger = logging.getLogger(__name__)


def _build_notes_list(tasks_with_notes: list[tuple[int, dict]]) -> str:
    """노트 목록을 프롬프트용 문자열로 포맷팅"""
    lines = []
    for idx, task in tasks_with_notes:
        lines.append(f"### 태스크 {idx}")
        lines.append(f"- 태스크 이름: {task.get('task_name', '')}")
        lines.append(f"- 태스크 설명: {task.get('task_description', '')}")
        lines.append(f"- 노트: {task.get('task_note', '')}")
        lines.append("")
    return "\n".join(lines)


async def filter_notes_node(state: PortfolioState, config: RunnableConfig = None) -> PortfolioState:
    """기술적 의사결정이 포함된 노트만 필터링하는 노드 (배치 처리)"""
    logger.info("[Portfolio] 노트 필터링 시작")
    
    user_tasks = state.get("user_tasks", [])
    if not user_tasks:
        return state
    
    # 노트가 있는 태스크만 추출 (인덱스와 함께)
    tasks_with_notes = [
        (idx, task) for idx, task in enumerate(user_tasks)
        if task.get("task_note") and task.get("task_note", "").strip()
    ]
    
    # 필터링할 노트가 없으면 그대로 반환
    if not tasks_with_notes:
        logger.info("[Portfolio] 필터링할 노트 없음")
        return state
    
    logger.info(f"[Portfolio] {len(tasks_with_notes)}개 노트 배치 필터링 시작")
    
    try:
        # LLM을 사용하여 배치로 필터링
        llm = openai_nano_llm.with_structured_output(NoteFilterBatchResult)
        combined_prompt = NOTE_FILTER_SYSTEM_PROMPT + "\n\n" + NOTE_FILTER_USER_PROMPT
        prompt = ChatPromptTemplate.from_template(combined_prompt)
        chain = prompt | llm
        
        # 노트 목록 포맷팅
        notes_list = _build_notes_list(tasks_with_notes)
        
        # 단일 LLM 호출로 모든 노트 처리
        result = await chain.ainvoke({"notes_list": notes_list}, config=config)
        
        # 결과를 딕셔너리로 변환 (빠른 조회용)
        filter_results = {item.task_index: item.is_technical for item in result.results}
        
        # 태스크 목록 재구성
        filtered_tasks = []
        for idx, task in enumerate(user_tasks):
            if idx in filter_results:
                if filter_results[idx]:
                    # 기술적 의사결정 → 노트 유지
                    logger.debug(f"[Portfolio] 노트 유지: {task.get('task_name')}")
                    filtered_tasks.append(task)
                else:
                    # 비기술적 → 노트 제거
                    logger.debug(f"[Portfolio] 노트 제거: {task.get('task_name')}")
                    filtered_tasks.append({**task, "task_note": None})
            else:
                # 원래 노트가 없던 태스크
                filtered_tasks.append(task)
        
        logger.info(f"[Portfolio] 노트 필터링 완료 - {len(filtered_tasks)}개 태스크 처리")
        
    except Exception as e:
        logger.warning(f"[Portfolio] 노트 필터링 실패, 원본 유지: {e}")
        filtered_tasks = user_tasks
    
    return {
        **state,
        "user_tasks": filtered_tasks
    }
