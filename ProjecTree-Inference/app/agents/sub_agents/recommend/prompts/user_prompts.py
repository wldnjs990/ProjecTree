EXPERT_USER_PROMPT = """
저는 성장하고자 하는 주니어 개발자입니다. 현재 프로젝트에서 아래 기능을 구현해야 합니다.

[작업 정보]
- Task Type: {task_type} (BE/FE/DevOps/Advance)
- Task Name: {user_task}
- Description: {task_description}

{workspace_info}

{candidate_info}

[요청 사항]
위 기능을 구현하기 위해 현업에서 가장 많이 쓰이거나 학습 가치가 높은 '구현 기술/방식' 3가지를 추천해 주세요.

[제약 사항]
1. Granularity (입도): 프로젝트 전체 프레임워크(예: Spring Boot, Next.js)를 추천하지 마세요. 해당 기능 구현에 필요한 **구체적인 라이브러리(Library)**나 **구현 패턴(Pattern)**을 추천하세요.
   - (Bad Example): "Backend 구현하세요" -> "Spring Boot 추천"
   - (Good Example): "이미지 리사이징 기능 구현하세요" -> "Java ImageIO vs Thumbnailator vs AWS Lambda Edge"
2. Evaluation: 주니어 개발자가 이해할 수 있도록 '학습 난이도'와 '실무 사용 빈도'를 포함하여 비교 분석해 주세요.
3. '기술적 의사결정'이 가능하도록 '품질 속성'별 가중치를 정하고 '트레이드오프'를 분석해주세요.
"""