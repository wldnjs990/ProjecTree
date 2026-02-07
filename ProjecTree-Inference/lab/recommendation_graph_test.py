import sys
import os
print("Starting verification script (simplified)...")
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), '..')))

from app.agents.enums import TaskType
from app.agents.recommend.graph import recommend_graph

print("Invoking recommend_graph...")
output = recommend_graph.invoke({
    "workspace_id":1,
    "task_type": TaskType.BACKEND, 
    "node_name": "N : M 채팅 기능 구현", 
    "node_description": """
    1. 사용자가 입력한 채팅 메시지를 처리하고 응답을 생성
    2. 사용자의 채팅 메시지가 포함된 대화를 데이터베이스에 저장
    """
}, config={})

print("Invocation complete. Processing output...")
# indent=4를 주어 예쁘게 출력
if output and 'tech_list' in output:
    json_string = output['tech_list'].model_dump_json(indent=2)
    print(json_string)
else:
    print("No tech_list in output", output)
