"""
Duplicate check tools for candidate generation.
"""
from typing import List, Dict
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from app.db.session import get_db
from app.db.repository.sibling_repository import (
    fetch_child_nodes,
    fetch_candidates
)
from app.core.llm import openai_nano_llm
from app.agents.candidates.prompts.system_prompts import (
    DUPLICATE_CHECK_SYSTEM_PROMPT
)
from app.agents.candidates.prompts.user_prompts import (
    DUPLICATE_CHECK_USER_PROMPT
)


# ---------------------------------------------------------------------------
# Pydantic Schemas for LLM Output
# ---------------------------------------------------------------------------

class DuplicateCheckResult(BaseModel):
    """중복 검사 결과"""
    has_overlap: bool = Field(description="기존 항목과 중복되는 부분이 있는지 여부")
    overlap_items: List[str] = Field(
        default_factory=list,
        description="중복되는 기존 항목의 이름 목록"
    )
    recommendation: str = Field(
        description="중복을 피하기 위한 권장 사항 또는 새로운 후보 생성 방향"
    )
    unique_areas: List[str] = Field(
        default_factory=list,
        description="기존 항목에서 다루지 않는 영역이나 작업들"
    )


# ---------------------------------------------------------------------------
# LLM Chain for Duplicate Detection
# ---------------------------------------------------------------------------

def create_duplicate_check_chain():
    """중복 검사를 위한 LLM 체인을 생성합니다."""
    prompt = ChatPromptTemplate.from_messages([
        ("system", DUPLICATE_CHECK_SYSTEM_PROMPT),
        ("user", DUPLICATE_CHECK_USER_PROMPT)
    ])
    
    llm_with_structure = openai_nano_llm.with_structured_output(DuplicateCheckResult)
    chain = prompt | llm_with_structure
    
    return chain


@tool
def check_duplicate_work(
    node_id: int,
    node_name: str,
    node_description: str,
    node_type: str
) -> Dict:
    """
    새로운 후보 노드를 생성하기 전에 형제 노드들과의 중복 여부를 확인합니다.
    LLM을 사용하여 기존 노드들과의 중복 가능성을 분석하고,
    중복을 피하기 위한 권장 사항을 제공합니다.
    
    Args:
        node_id (int): 현재 노드의 ID
        node_name (str): 현재 노드의 이름
        node_description (str): 현재 노드의 설명
        node_type (str): 현재 노드의 타입 (PROJECT, EPIC, STORY, TASK 등)
        
    Returns:
        Dict: 중복 검사 결과
            - has_overlap: 중복 여부
            - overlap_items: 중복되는 항목 목록
            - recommendation: 권장 사항
            - unique_areas: 기존에 다루지 않는 영역들
    """
    with next(get_db()) as db:
        # 현재 노드의 자식 노드와 후보 노드 조회
        child_nodes = fetch_child_nodes(db, node_id)
        candidates = fetch_candidates(db, node_id)
    
    # 자식 노드 정보를 문자열로 변환
    if child_nodes:
        child_nodes_str = "\n".join([
            f"- {node['name']}: {node['description'] or '설명 없음'} (상태: {node['status']})"
            for node in child_nodes
        ])
    else:
        child_nodes_str = "없음"
    
    # 후보 노드 정보를 문자열로 변환
    if candidates:
        candidates_str = "\n".join([
            f"- {cand['name']}: {cand['description'] or '설명 없음'} (선택됨: {'예' if cand['is_selected'] else '아니오'})"
            for cand in candidates
        ])
    else:
        candidates_str = "없음"
    
    # LLM 체인 실행
    chain = create_duplicate_check_chain()
    result = chain.invoke({
        "node_name": node_name,
        "node_description": node_description,
        "node_type": node_type,
        "sibling_nodes": child_nodes_str,
        "sibling_candidates": candidates_str
    })
    
    # Pydantic 모델을 딕셔너리로 변환
    return result.model_dump()


# ---------------------------------------------------------------------------
# Utility Functions
# ---------------------------------------------------------------------------

def get_duplicate_check_context(
    node_id: int,
    node_name: str,
    node_description: str,
    node_type: str
) -> str:
    """
    후보 생성 에이전트에 전달할 중복 검사 컨텍스트 문자열을 생성합니다.
    
    PROJECT/EPIC 레벨: 단순히 기존 자식/후보 노드 목록만 제공
    STORY/TASK 레벨: LLM을 통한 상세 중복 분석 수행
    
    Args:
        node_id: 현재 노드의 ID
        node_name: 현재 노드의 이름
        node_description: 현재 노드의 설명
        node_type: 현재 노드의 타입
        
    Returns:
        str: 중복 검사 결과를 포함한 컨텍스트 문자열
    """
    try:
        # DB에서 자식 노드와 후보 노드 조회
        with next(get_db()) as db:
            child_nodes = fetch_child_nodes(db, node_id)
            candidates = fetch_candidates(db, node_id)
        
        # 자식 노드도 후보 노드도 없으면 빈 컨텍스트
        if not child_nodes and not candidates:
            return ""
        
        # PROJECT, EPIC 레벨: 단순 목록만 제공
        if node_type.upper() in ["PROJECT", "EPIC"]:
            context_parts = []
            
            if child_nodes:
                context_parts.append("## 기존 자식 노드")
                for node in child_nodes:
                    context_parts.append(f"- {node['name']}")
            
            if candidates:
                context_parts.append("\n## 기존 후보 노드")
                for cand in candidates:
                    context_parts.append(f"- {cand['name']}")
            
            context_parts.append("\n위 항목들과 중복되지 않는 새로운 후보를 생성하세요.")
            return "\n".join(context_parts)
        
        # STORY, TASK 레벨: LLM을 통한 상세 분석
        result = check_duplicate_work.invoke({
            "node_id": node_id,
            "node_name": node_name,
            "node_description": node_description,
            "node_type": node_type
        })
        
        context_parts = []
        
        if result.get("has_overlap"):
            context_parts.append("## ⚠️ 중복 주의")
            context_parts.append(f"다음 항목들과 중복될 수 있습니다: {', '.join(result.get('overlap_items', []))}")
        
        if result.get("recommendation"):
            context_parts.append(f"\n## 권장 사항\n{result['recommendation']}")
        
        if result.get("unique_areas"):
            context_parts.append(f"\n## 집중할 영역\n" + "\n".join([f"- {area}" for area in result['unique_areas']]))
        
        return "\n".join(context_parts) if context_parts else ""
        
    except Exception as e:
        return f"중복 검사 중 오류 발생: {str(e)}"
