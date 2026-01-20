from langchain_core.prompts import ChatPromptTemplate

task_refine_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "당신은 테크니컬 리드입니다. 태스크를 분석하고 기술적 접근 방식에 대한 비교와 난이도(1-5)를 제시하세요. 유효한 JSON 형식으로 출력하세요.",
        ),
        ("human", "Task: {name}\nDescription: {description}\nType: {type}"),
    ]
)
