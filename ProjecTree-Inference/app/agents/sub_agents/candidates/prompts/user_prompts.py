CANDIDATE_USER_PROMPT = """
현재 작업 타입: {node_type}
서비스 타입: {service_type}
노드 명: {node_name}
노드 설명: {node_description}

## 생성할 후보 개수
{count_instruction}
"""


DUPLICATE_CHECK_USER_PROMPT = """
## 현재 노드 정보
- 이름: {node_name}
- 설명: {node_description}
- 타입: {node_type}

## 기존 자식 노드들
{sibling_nodes}

## 기존 후보 노드들
{sibling_candidates}

위 정보를 바탕으로 새로운 후보 노드를 생성할 때 기존 자식 노드 및 후보 노드와 중복되는 작업이 있는지 분석하고,
중복을 피하기 위한 권장 사항을 제공해주세요.
"""

