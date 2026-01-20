EXPERT_USER_PROMPT = """
저는 주니어 개발자입니다. 제가 구현해야하는 기능과 작업 영역은은 다음과 같습니다.
task_type: {task_type}
user_task: {user_task}
task_description: {task_description}
이 기능을 구현하기 위한 상세한 기술을 3가지 추천해주세요.
각 기술에 대한 기술적 의사결정이 가능하도록 장단점등을 명확하게 제시해주세요.
프레임워크 단위의 기술이 아닌 각 기능을 구현할 수 있는 '상세 기술 스택'만을 추천해주세요.
"""