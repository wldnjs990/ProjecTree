EXPERT_USER_PROMPT = """
저는 성장하고자 하는 주니어 개발자입니다. 현재 프로젝트에서 아래 기능을 구현해야 합니다.

[작업 정보]
- Task Type: {task_type} (BE/FE/Advance)
- Task Name: {user_task}
- Task Description: {task_description}

{workspace_info}

{candidate_info}

{excluded_tech_stacks}

[요청 사항]
위 기능을 구현하기 위해 현업에서 가장 많이 쓰이거나 학습 가치가 높은 '구현 기술/방식' 3가지를 추천해 주세요.
"""