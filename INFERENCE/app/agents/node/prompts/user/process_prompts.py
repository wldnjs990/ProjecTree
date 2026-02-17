EPIC_USER_PROMPT = """
[입력 정보]
Workspace(Project): {workspace_info}
Candidate: {candidate_info}

위 정보를 바탕으로 EPIC 상세 명세를 생성하세요.
"""

STORY_USER_PROMPT = """
[입력 정보]
Workspace(Project): {workspace_info}
Parent(Epic): {parent_info}
Candidate: {candidate_info}

위 정보를 바탕으로 Story 상세 명세를 생성하세요.
"""

TASK_USER_PROMPT = """
[입력 정보]
Workspace(Project): {workspace_info}
Parent(Story): {parent_info}
Candidate: {candidate_info}

위 정보를 바탕으로 Task 상세 명세를 생성하세요.
"""

ADVANCE_USER_PROMPT = """
[입력 정보]
Workspace(Project): {workspace_info}
Parent(Node): {parent_info}
Candidate: {candidate_info}

위 정보를 바탕으로 Advance Task 상세 명세를 생성하세요.
"""
