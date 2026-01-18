from langchain_core.prompts import ChatPromptTemplate

extraction_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "당신은 기술 분석가입니다. 텍스트에서 추천된 기술 스택을 추출하세요. 기술 명칭을 정확하게 식별해야 합니다. 유효한 JSON 형식으로 출력하세요.",
        ),
        ("human", "{text}"),
    ]
)
