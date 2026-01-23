import sys
import os

# Add the project root to python path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine
from app.db.base_class import Base
from app.db.models import TechVocabulary, TechStackInfo, WorkspaceTechStack, NodeTechStack

# Drop tables in dependency order (reverse of creation)
print("Dropping tech stack related tables...")
try:
    NodeTechStack.__table__.drop(engine)
    print("- Dropped node_tech_stack")
except Exception as e:
    print(f"- Warning: Could not drop node_tech_stack: {e}")

try:
    WorkspaceTechStack.__table__.drop(engine)
    print("- Dropped workspace_tech_stack")
except Exception as e:
    print(f"- Warning: Could not drop workspace_tech_stack: {e}")

try:
    TechStackInfo.__table__.drop(engine)
    print("- Dropped tech_stack_info")
except Exception as e:
    print(f"- Warning: Could not drop tech_stack_info: {e}")

try:
    TechVocabulary.__table__.drop(engine)
    print("- Dropped tech_vocabulary")
except Exception as e:
    print(f"- Warning: Could not drop tech_vocabulary: {e}")

# Recreate all tables defined in Base.metadata
# This will only create tables that don't exist
print("\nRecreating tables with new schema (autoincrement=True)...")
Base.metadata.create_all(bind=engine)
print("Done! Tech stack tables have been reset.")
