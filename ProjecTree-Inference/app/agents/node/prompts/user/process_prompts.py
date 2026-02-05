EPIC_USER_PROMPT = """
[입력 정보]
Workspace(Project): {workspace_info}
Candidate: {candidate_info}

위 정보를 바탕으로 EPIC 상세 명세 중 이름(Name)을 생성하세요.
"""

STORY_USER_PROMPT = """
[입력 정보]
Workspace(Project): {workspace_info}
Parent(Epic): {parent_info}
Candidate: {candidate_info}

위 정보를 바탕으로 Story 상세 명세 중 이름(Name)을 생성하세요.
"""

TASK_USER_PROMPT = """
[입력 정보]
Workspace(Project): {workspace_info}
Parent(Story): {parent_info}
Candidate: {candidate_info}

위 정보를 바탕으로 Task 상세 명세(Name, Difficulty, Type)를 생성하세요.
"""

ADVANCE_USER_PROMPT = """
[입력 정보]
Workspace(Project): {workspace_info}
Parent(Node): {parent_info}
Candidate: {candidate_info}

위 정보를 바탕으로 Advance Task 상세 명세(Name, Difficulty)를 생성하세요.
"""

DESCRIPTION_USER_PROMPT = """
[입력 정보]
Workspace(Project): {workspace_info}
Parent(Node): {parent_info}
Current Node Info: {node_info}

위 정보를 바탕으로 Current Node의 상세 명세(Description)를 생성하세요.
반드시 1500자 이내로 제한하고, validate_description 도구를 통과해야 합니다.
"""
