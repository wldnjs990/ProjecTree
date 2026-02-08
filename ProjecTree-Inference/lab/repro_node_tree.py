# Add project root to path
import sys
import os
print("Starting script...", flush=True)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.services.node_service import NodeService
from app.db.repository.node_repository import NodeRepository
from app.db.repository.candidate_repository import CandidateRepository
from app.db.models import Node, node_tree
from app.agents.enums import NodeType

async def reproduce_issue():
    async with AsyncSessionLocal() as db:
        print("--- Starting Reproduction Script ---")
        
        # 1. Create a dummy parent node
        parent_node = Node(
            node_type=NodeType.PROJECT,
            name="Test Parent Project",
            description="Test Description",
            status="TODO"
        )
        db.add(parent_node)
        await db.flush()
        print(f"Created Parent Node: {parent_node.id}")
        
        # 2. Create a dummy child node to simulate the service logic
        # We can't easily call NodeService.create_node because it triggers the whole graph.
        # Instead, we will manually call _create_node_tree_relation using a temporary service instance.
        
        child_node = Node(
            node_type=NodeType.EPIC,
            name="Test Child Epic",
            description="Test Child Description",
            status="TODO"
        )
        db.add(child_node)
        await db.flush()
        print(f"Created Child Node: {child_node.id}")
        
        # Initialize Service
        # We need sync session for _create_node_tree_relation as it is written in sync style in the service??
        # Wait, let's check NodeService. It takes a Session, not AsyncSession.
        # The project seems to use mixed sync/async. NodeService methods take 'db: Session'.
        # But here I am using AsyncSession.
        # Let's check app/db/session.py again. It has both.
        # NodeService.create_node takes 'db: Session'.
        pass

if __name__ == "__main__":
    # The existing code in NodeService is sync (uses Session, not AsyncSession).
    # validation:
    # def create_node(self, db: Session, ...):
    
    # So I should use sync session for this test to match the service signature.
    from app.db.session import SessionLocal
    
    db = SessionLocal()
    try:
        print("--- Starting Reproduction Script (Sync) ---")
        
        # 1. Create Parent
        parent = Node(
            node_type=NodeType.PROJECT,
            name="Test Parent",
            description="Desc",
            status="TODO"
        )
        db.add(parent)
        db.flush()
        print(f"Parent ID: {parent.id}")
        
        # 2. Create Child
        child = Node(
            node_type=NodeType.EPIC,
            name="Test Child",
            description="Desc",
            status="TODO"
        )
        db.add(child)
        db.flush()
        print(f"Child ID: {child.id}")
        
        # 3. Call _create_node_tree_relation
        repo = NodeRepository(db)
        # candidate_repo is not needed for this specific method but required for init
        candidate_repo = CandidateRepository(db) 
        service = NodeService(repo, candidate_repo)
        
        print("Calling _create_node_tree_relation...")
        service._create_node_tree_relation(db, parent.id, child.id)
        db.commit()
        
        # 4. Verify node_tree content
        print("Verifying node_tree content...")
        
        # Check parent-child relation (depth=1)
        stmt = select(node_tree).where(
            (node_tree.c.ancestor_id == parent.id) & 
            (node_tree.c.descendant_id == child.id)
        )
        # SQLAlchemy Core select execution
        result = db.execute(stmt).fetchone()
        if result:
            print(f"SUCCESS: Found parent-child relation: {result}")
        else:
            print(f"FAILURE: Missing parent-child relation")

        # Check self-reference for child (depth=0)
        stmt_self = select(node_tree).where(
            (node_tree.c.ancestor_id == child.id) & 
            (node_tree.c.descendant_id == child.id) &
            (node_tree.c.depth == 0)
        )
        result_self = db.execute(stmt_self).fetchone()
        if result_self:
            print(f"SUCCESS: Found self-reference (depth=0): {result_self}")
        else:
            print(f"FAILURE: Missing self-reference (depth=0) for child {child.id}")
            
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        # Cleanup
        # db.delete(child)
        # db.delete(parent)
        # db.commit()
        db.close()
