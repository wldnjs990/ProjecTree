import sys
import os

sys.path.append(os.getcwd())

try:
    from app.agents.graph import builder

    print("SUCCESS: Imported builder from app.agents.graph")
except ImportError as e:
    print(f"FAILURE: {e}")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
