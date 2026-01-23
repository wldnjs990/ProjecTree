import asyncio
import sys
import os
from unittest.mock import MagicMock, patch

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
from app.db.models import Node, Member, NodeType, TaskNode
from app.core.dependencies import (
    get_node_repository,
    get_tech_vocabulary_repository,
    get_tech_stack_info_repository,
    get_node_tech_stack_repository,
    get_recommendation_service,
)
from app.api.schemas.recommendations import TechStackRecommendRequest

def log(msg):
    print(msg)
    with open("verification_result.txt", "a", encoding="utf-8") as f:
        f.write(msg + "\n")

async def verify_tech_stack_save():
    # Clear previous log
    with open("verification_result.txt", "w", encoding="utf-8") as f:
        f.write("Starting verification...\n")
        
    db = SessionLocal()
    
    try:
        # 1. Create dummy data
        log("Creating dummy Member...")
        member = db.query(Member).first()
        if not member:
            member = Member(email="test@example.com", name="Test User", oauth_provider="GOOGLE")
            db.add(member)
            db.commit()
            db.refresh(member)
        else:
            log(f"Using existing Member ID: {member.id}")

        log("Creating dummy Node and TaskNode...")
        node = Node(
            user_id=member.id,
            node_type=NodeType.TASK,
            name="Test Task Node",
            description="Test Description",
            status="TODO",
            priority="P1"
        )
        db.add(node)
        db.commit()
        db.refresh(node)
        
        task_node = TaskNode(
            node_id=node.id,
            type="BE"
        )
        db.add(task_node)
        db.commit()
        
        log(f"Created Node ID: {node.id}")
        
        # 2. Mock recommend_graph
        mock_result = {
            "tech_list": {
                "techs": [
                    {
                        "name": "Test-Tech-A",
                        "advantage": "Fast",
                        "disadvantage": "Complex",
                        "description": "It is fast",
                        "recommendation_score": 5,
                        "ref": "http://example.com"
                    },
                    {
                        "name": "Test-Tech-B",
                        "advantage": "Simple",
                        "disadvantage": "Slow",
                        "description": "It is simple",
                        "recommendation_score": 4,
                        "ref": None
                    }
                ],
                "comparison": "Comparison text"
            }
        }
        
        # It's an async mock for ainvoke
        mock_graph = MagicMock()
        mock_graph.ainvoke.return_value = mock_result
        
        # 3. Get service and inject mock
        service = get_recommendation_service()
        
        # Patching app.services.recommendation_service.recommend_graph
        with patch("app.services.recommendation_service.recommend_graph", mock_graph):
            request = TechStackRecommendRequest(workspace_id=1, node_id=node.id)
            log("Calling recommend_tech_stack...")
            response = await service.recommend_tech_stack(db, request)
            
            log("Service call finished.")
            log(f"Response techs count: {len(response.techs)}")
            
            # 4. Verify DB
            log("Verifying DB records...")
            
            # Check TechVocabulary
            tech_repo = get_tech_vocabulary_repository()
            tech_a = tech_repo.search_by_keyword(db, "Test-Tech-A")
            tech_b = tech_repo.search_by_keyword(db, "Test-Tech-B")
            
            if tech_a and tech_b:
                log("SUCCESS: TechVocabulary records found.")
            else:
                log("FAILURE: TechVocabulary records NOT found.")
                
            # Check NodeTechStack
            from app.db.models import NodeTechStack
            links = db.query(NodeTechStack).filter(NodeTechStack.node_id == node.id).all()
            if len(links) == 2:
                 log(f"SUCCESS: Found {len(links)} NodeTechStack records.")
            else:
                 log(f"FAILURE: Found {len(links)} NodeTechStack records, expected 2.")
                 
            # Check TechStackInfo
            from app.db.models import TechStackInfo
            info_ids = [link.tech_stack_info_id for link in links]
            infos = db.query(TechStackInfo).filter(TechStackInfo.id.in_(info_ids)).all()
            if len(infos) == 2:
                log(f"SUCCESS: Found {len(infos)} TechStackInfo records.")
                for info in infos:
                    log(f" - Info: score={info.recommendation}, desc={info.description}")
            else:
                log(f"FAILURE: Found {len(infos)} TechStackInfo records, expected 2.")

    except Exception as e:
        log(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(verify_tech_stack_save())
