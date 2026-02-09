CANDIDATE_USER_PROMPT = """
현재 작업 타입: {node_type}
서비스 타입: {service_type}
노드 명: {node_name}
노드 설명: {node_description}

## 생성할 후보 개수
{count_instruction}

## [필수 실행 규칙 - Summary 중복 방지]
각 후보(Item)는 서로 다른 내용(`description`)을 가지고 있습니다.
따라서 `validate_summary` 도구를 **각 후보마다 개별적으로 실행(Execute Separately)**해야 합니다.

**[검증 로직]**
만약 생성된 후보 1, 2, 3의 `summary`가 모두 똑같다면, 당신은 지시를 어긴 것입니다.
각 후보의 설명에 맞는 **고유한(Unique) 요약문**을 생성하세요.
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
