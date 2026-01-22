EXPERT_USER_PROMPT = """
저는 주니어 개발자입니다. 제가 구현해야하는 기능과 작업 영역은은 다음과 같습니다.
task_type: {task_type}
user_task: {user_task}
task_description: {task_description}
이 기능을 구현하기 위한 상세한 '구현 방법'을 3가지 추천해주세요.
각 기능을 구현하기 위한 '구현 방법 혹은 방식 및 기술'(ex, Long Pooling, Short Polling, WebSocket, Spring Data JPA, React-Query 등 해당 기능 하나를 구현하기 위한 기술 혹은 방식)에 대한 기술적 의사결정이 가능하도록 '품질 속성'별 가중치를 정하고 '트레이드오프'를 분석해주세요.
단, 여기서 '구현 방법 혹은 방식 및 기술'은 프레임 워크 단위가 아닌 해당 기능 하나를 구현하기 위한 기술 혹은 방식이어야합니다.
"""