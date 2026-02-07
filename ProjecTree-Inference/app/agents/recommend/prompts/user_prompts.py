EXPERT_USER_PROMPT = """
저는 주니어 개발자입니다. 현재 프로젝트에서 아래 기능을 구현해야 하는데, **어떤 기술을 선택해야 할지 고민입니다.**
전체 아키텍처를 추천하지 말고, **이 기능을 구현하는 데 가장 핵심적인 기술 1가지를 정해서 그 대안(Alternatives)들을 비교**해 주세요.

[작업 정보]
- Task Type: {task_type} (BE/FE/Advance)
- Task Name: {user_task}
- Task Description: {task_description}

{workspace_info}

{excluded_tech_stacks}

[요청 사항]
1. 위 기능을 구현하기 위한 핵심 기술 카테고리(예: 프로토콜, DB, 라이브러리 등)를 먼저 판단하세요.
2. 해당 카테고리 내에서 현업에서 가장 많이 비교되는 3가지 기술을 선정하여 장단점을 비교해 주세요.
3. 기술 A, B, C는 서로 **대체 가능한 관계**여야 합니다. (함께 쓰는 조합 금지)
"""