from sqlalchemy.orm import Session
from sqlalchemy import select, update, insert
from app.db.session import SessionLocal, get_db
from typing import List, Optional, Dict, Any
from sqlalchemy import text


def fetch_tech_info(db: Session, name: str) -> Dict:
    """Fetch all matching tech vocabularies by name."""
    
    # 대소문자 구분 없이 검색하려면 PostgreSQL의 경우 'ILIKE'를 사용하세요.
    # stmt = text("SELECT id, name FROM public.tech_vocabulary WHERE name ILIKE :name")
    stmt = text("SELECT id, name FROM public.tech_vocabulary WHERE name = :name")
    
    # fetchall()을 사용하여 모든 매칭 결과 가져오기
    result = db.execute(stmt, {"name": name}).fetchone()
    
    if result is None:
        return {}
    
    # 리스트 컴프리헨션으로 결과 변환
    return {"id": result.id, "name": result.name}


def create_tech_info(db: Session, name: str) -> Dict:
    """Create new tech vocabulary (kebab-case)."""
    kebab_name = name.lower().replace(" ", "-")  # Simple Kebab conversion

    # Check exist again to be safe
    existing = fetch_tech_info(db, kebab_name)
    if existing:
        return existing

    stmt = text(
        "INSERT INTO public.tech_vocabulary (created_at, name) VALUES (NOW(), :name) RETURNING id, name"
    )
    result = db.execute(stmt, {"name": kebab_name}).fetchone()
    db.commit()
    return {"id": result.id, "name": result.name}


def create_tech_stack_info(db: Session, info_data: Dict) -> int:
    """Create tech stack info entry."""
    stmt = text(
        """
        INSERT INTO public.tech_stack_info 
        (created_at, advantage, description, disadvantage, is_selected, recommendation) 
        VALUES (NOW(), :advantage, :description, :disadvantage, :is_selected, :recommendation)
        RETURNING id
    """
    )
    result = db.execute(
        stmt,
        {
            "advantage": info_data.get("advantage"),
            "description": info_data.get("description"),
            "disadvantage": info_data.get("disadvantage"),  # Raw text
            "is_selected": info_data.get("is_selected", False),
            "recommendation": info_data.get("recommendation", 0),
        },
    ).fetchone()
    db.commit()
    return result.id


def link_node_tech_stack(
    db: Session,
    node_id: int,
    tech_vocab_id: int,
    info_id: int,
    is_recommended: bool = True,
):
    """Link node to tech stack."""
    stmt = text(
        """
        INSERT INTO public.node_tech_stack
        (created_at, is_recommended, node_id, tech_stack_info_id, tech_vocab_id)
        VALUES (NOW(), :is_recommended, :node_id, :info_id, :tech_vocab_id)
    """
    )
    db.execute(
        stmt,
        {
            "is_recommended": is_recommended,
            "node_id": node_id,
            "info_id": info_id,
            "tech_vocab_id": tech_vocab_id,
        },
    )
    db.commit()


def create_candidate(db: Session, node_id: int, candidates: List[Dict]):
    """Batch insert candidates."""
    if not candidates:
        return

    stmt = text(
        """
        INSERT INTO public.candidate
        (created_at, description, is_selected, name, node_id)
        VALUES (NOW(), :description, :is_selected, :name, :node_id)
    """
    )

    for cand in candidates:
        db.execute(
            stmt,
            {
                "description": cand.get("description", ""),
                "is_selected": False,
                "name": cand.get("name"),
                "node_id": node_id,
            },
        )
    db.commit()


def _create_base_node(db: Session, node_data: Dict) -> int:
    """Helper to create base node."""
    stmt = text(
        """
        INSERT INTO public.node 
        (created_at, node_type, name, description, status, priority, user_id)
        VALUES (NOW(), :node_type, :name, :description, 'TODO', 'P1', :user_id)
        RETURNING id
    """
    )
    # user_id is FK, need a valid one. Assuming 1 for now or passed in node_data.
    # User requested specific handling?
    # "The user's description says: user_id references public.member".
    # I'll default to 1 or None if nullable (but DDL says user_id is referenced, implies not null? DDL doesn't say NOT NULL for user_id, actually it does `user_id bigint schema references public.member`. It DOES NOT say NOT NULL in the provided DDL snippet for `node` table `user_id`).
    # Wait, `user_id` in `node` table DDL: `user_id bigint constraint ... references ...`. No `not null`.
    # So I can pass NULL if I don't have it.

    result = db.execute(
        stmt,
        {
            "node_type": node_data.get("type", "Task"),  # Node type string e.g. "Epic"
            "name": node_data.get("name"),
            "description": node_data.get("description"),
            "user_id": node_data.get("user_id"),
        },
    ).fetchone()
    return result.id


def _link_node_tree(db: Session, ancestor_id: Optional[int], descendant_id: int):
    """Link parent and child in node_tree."""
    if not ancestor_id:
        return

    stmt = text(
        """
        INSERT INTO public.node_tree (ancestor_id, descendant_id, depth)
        VALUES (:ancestor_id, :descendant_id, 1)
    """
    )
    db.execute(stmt, {"ancestor_id": ancestor_id, "descendant_id": descendant_id})


def create_epic_node(db: Session, node_data: Dict) -> int:
    node_id = _create_base_node(db, {**node_data, "type": "Epic"})

    stmt = text("INSERT INTO public.epic_node (node_id) VALUES (:id)")
    db.execute(stmt, {"id": node_id})

    if node_data.get("parent_id"):
        _link_node_tree(db, node_data["parent_id"], node_id)

    db.commit()
    return node_id


def create_story_node(db: Session, node_data: Dict) -> int:
    node_id = _create_base_node(db, {**node_data, "type": "Story"})

    stmt = text("INSERT INTO public.story_node (node_id) VALUES (:id)")
    db.execute(stmt, {"id": node_id})

    if node_data.get("parent_id"):
        _link_node_tree(db, node_data["parent_id"], node_id)

    db.commit()
    return node_id


def create_task_node(db: Session, node_data: Dict) -> int:
    node_id = _create_base_node(db, {**node_data, "type": "Task"})

    stmt = text(
        """
        INSERT INTO public.task_node (node_id, type, comparison, difficult)
        VALUES (:id, :type, :comparison, :difficult)
    """
    )
    db.execute(
        stmt,
        {
            "id": node_id,
            "type": node_data.get("task_type", "BE"),  # FE or BE
            "comparison": node_data.get("comparison"),
            "difficult": node_data.get("difficult", 1),
        },
    )

    if node_data.get("parent_id"):
        _link_node_tree(db, node_data["parent_id"], node_id)

    db.commit()
    return node_id


def create_subtask_node(db: Session, node_data: Dict) -> int:
    node_id = _create_base_node(db, {**node_data, "type": "SubTask"})

    stmt = text(
        """
        INSERT INTO public.subtask_node (node_id, comparison, difficult)
        VALUES (:id, :comparison, :difficult)
    """
    )
    db.execute(
        stmt,
        {
            "id": node_id,
            "comparison": node_data.get("comparison"),
            "difficult": node_data.get("difficult", 1),
        },
    )

    if node_data.get("parent_id"):
        _link_node_tree(db, node_data["parent_id"], node_id)

    db.commit()
    return node_id
