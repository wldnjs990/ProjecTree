import sys
import os

# Add app to path
sys.path.append(os.getcwd())

try:
    from app.agents.graph import builder

    print("Imported builder successfully.")

    graph = builder.compile()
    print("Graph compiled successfully.")

    # Optional: Print graph structure
    print(graph.get_graph().print_ascii())

except Exception as e:
    print(f"Verification failed: {e}")
    sys.exit(1)
