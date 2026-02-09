EPIC_DESCRIPTION_STRUCTURE = """
[비즈니스 배경]
- 프로젝트의 핵심 목표 및 비즈니스 가치 설명

[범위]
- 주요 기능 및 모듈 목록
- 각 기능별 간략한 설명 및 기술적 요소

[기술]
- Frontend: 사용 기술 및 라이브러리
- Backend: 서버 프레임워크 및 아키텍처
- DB: 데이터 저장소 및 용도
- 기타: 실시간 통신, 로깅, 인프라 등

[제약]
- 인력, 기간, 예산 등의 제약 사항
- 개발 범위 제외 대상(Out-of-Scope)

[성공 지표]
- 정량적/정성적 목표
- 성능 목표 (예: 응답 시간, 처리량)

[우선순위]
- 개발 순서 및 중요도 나열

[인수 기준]
- 기능 완료 판단 기준
- 테스트 통과 기준
"""

EPIC_FEW_SHOT_EXAMPLE = """
[비즈니스 배경] 일정 기능은 사용자가 여행 계획을 만들고 실행하는 핵심입니다. 일정 등록, 장소 추천, 경로 시각화는 사용자의 동선 최적화와 동행자 합의를 돕습니다.

[범위]
- 일정 CRUD: 기간, 하루별 블록(시작·종료), 메모, 태그, 동행자 관리용 API 및 React UI.
- 일정 기반 장소 추천: Elasticsearch 색인된 장소에서 거리·이동시간·영업시간을 고려해 점수화 후 추천. Redis로 캐시.
- 하루별 경로 시각화: React 지도(Leaflet/Mapbox)에 방문 순서와 예상 소요시간 표시. 백엔드(Sprint Boot 또는 FastAPI)에서 경로 좌표 계산. WebSocket으로 진행 상태 전송.

[기술]
- Frontend: React.js
- Backend: Spring Boot (메인), FastAPI(비동기 작업 가능)
- DB: MySQL, Elasticsearch(검색), Redis(캐시)
- 실시간: WebSocket
- 로깅: Logstash/Kibana

[제약]
- 2명(주니어)·기간(약 12주) 고려해 고급 최적화 및 외부 연동은 제외.

[성공 지표]
- 일정 생성→추천→경로 시각화 완료 비율 ≥40%
- 추천 응답 평균(캐시): <2s, 최초 계산 <5s

[우선순위]
- 일정 CRUD + 지도 마커
- 기본 추천 API + Redis 캐시
- 경로 시각화 + WebSocket
- 시간 배정 자동화 + ICS 내보내기

[인수 기준]
- 일정 CRUD와 지도 경로 시각화 동작
- 추천 API 정상 응답 및 캐시 확인
- 내보내기 파일 생성
"""

STORY_DESCRIPTION_STRUCTURE = """
## 1. User Story
**[Persona]**로서,
**[Action]**하기를 원한다.
왜냐하면 **[Benefit/Value]**하기 위해서이다.

## 2. Acceptance Criteria (인수 조건)

**Scenario 1: [시나리오 명]**
- **Given:** [초기 조건]
- **When:** [액션]
- **Then:** [예상 결과]
- **And:** [추가 결과]

**Scenario 2: [예외/에러 시나리오]**
- **Given:** [초기 조건]
- **When:** [액션]
- **Then:** [예상 결과]

## 3. Note & Exceptions
- [제약 사항 1]
- [기술적 고려사항]
"""

STORY_FEW_SHOT_EXAMPLE = """
## 1. User Story
**[쇼핑몰 고객]**으로서,
**[키워드로 상품을 검색하고 정렬]**하기를 원한다.
왜냐하면 **[내가 원하는 조건의 상품을 빠르게 찾아서 구매]**하기 위해서이다.

## 2. Acceptance Criteria (인수 조건)

**Scenario 1: 키워드 검색 및 정렬 (Happy Path)**
- **Given:** 사용자가 검색창에 '운동화'를 입력했다.
- **When:** 엔터키를 치거나 돋보기 아이콘을 클릭하면
- **Then:** 상품명이나 태그에 '운동화'가 포함된 상품 리스트가 노출된다.
- **And:** 기본 정렬은 '최신순'으로 노출된다.
- **And:** '가격 낮은 순' 필터를 클릭하면 즉시 리스트가 가격 오름차순으로 재정렬된다.

**Scenario 2: 검색 결과 없음 (Empty State)**
- **Given:** 사용자가 존재하지 않는 상품명(예: '없는상품123')을 입력했다.
- **When:** 검색을 실행하면
- **Then:** "검색 결과가 없습니다."라는 문구와 함께 일러스트가 중앙에 표시된다.
- **And:** 하단에 '추천 상품' 리스트가 대체제로 노출된다.

**Scenario 3: 특수문자 입력 방지**
- **Given:** 사용자가 검색창에 스크립트 태그(<script>)나 특수문자만 입력했다.
- **When:** 검색을 실행하면
- **Then:** 검색이 실행되지 않고 "올바른 검색어를 입력해주세요."라는 토스트 메시지가 뜬다.

## 3. Note & Exceptions
- 검색어는 최소 2글자 이상이어야 한다.
- 페이징 처리는 Infinite Scroll 방식을 사용한다.
"""

TASK_DESCRIPTION_STRUCTURE = """
## 1. 개요 (Overview)
- **User Story:** [연관된 사용자 스토리]
- **작업 목표:** [구체적인 작업 목표]

## 2. 구현 상세 (Implementation Logic)
- **[요소]:** [클래스/파일/컴포넌트 명 등]
- **[상세 로직]:**
  1. [단계 1]
  2. [단계 2]
  ...

## 3. 입력 및 출력 스펙 (Input/Output) - *Backend의 경우 필수, Frontend는 선택*
- **Input:** [입력 데이터/파라미터]
- **Output:** [출력 데이터/응답]

## 4. 검증 방법 (Verification)
- **[검증 항목]:**
  - [ ] [테스트 케이스 1]
  - [ ] [테스트 케이스 2]
"""

TASK_SMJ_FEW_SHOT_EXAMPLE = """
# [BE/Core] 숙박 예약 요금 계산기(Pricing Engine) 구현

## 1. 개요 (Overview)
- **User Story:** "사용자는 성수기, 주말, 쿠폰 적용 여부에 따라 정확히 계산된 최종 금액을 확인해야 한다."
- **작업 목표:** 날짜, 인원, 옵션 등을 입력받아 최종 결제 금액을 산출하는 순수 자바/파이썬 객체 구현.

## 2. 구현 상세 (Implementation Logic)
- **Class:** `PriceCalculatorService` (Spring Bean x, POJO 권장)
- **계산 로직 (순서 중요):**
  1. **기본 요금:** 숙소의 `base_price` * `박(night)` 수.
  2. **성수기 할증:** 예약 날짜가 `peak_season`에 포함되면 20% 가산.
  3. **주말 할증:** 금, 토요일 숙박 시 10,000원 추가.
  4. **쿠폰 할인:** 정률(%) 또는 정액(₩) 쿠폰 적용 (마이너스 금액 불가 체크).
  5. **부가세:** 최종 금액의 10% 별도 계산.

## 3. 입력 및 출력 스펙
- **Input:** `CheckInDate`, `CheckOutDate`, `BasePrice`, `Coupon`
- **Output:** `FinalAmount`, `DiscountAmount`, `Tax`

## 4. 검증 방법 (Verification)
- **TC(Test Case) 작성:**
  - [ ] 평일 1박, 쿠폰 없음 -> 기본 요금 일치 확인.
  - [ ] 성수기 주말 2박, 10% 쿠폰 -> 복합 계산 검증.
  - [ ] 쿠폰 금액이 숙박비보다 클 때 -> 0원 처리 확인.

---

# [FE/Core] Axios 인스턴스 및 인터셉터(Interceptor) 구현

## 1. 개요 (Overview)
- **User Story:** "사용자는 로그인 상태가 유지되는 동안 별도의 인증 절차 없이 서비스를 이용해야 하며, 토큰 만료 시 자동으로 갱신되어야 한다."
- **작업 목표:** 모든 API 요청에 자동으로 Access Token을 싣고, 401 에러 발생 시 Refresh Token으로 재발급받는 로직 구현.

## 2. 구현 상세 (Implementation Logic)
- **File:** `src/api/http.ts`
- **Request Interceptor:**
  - [ ] LocalStorage/Cookie에서 `accessToken` 조회.
  - [ ] Header에 `Authorization: Bearer token` 추가.
- **Response Interceptor:**
  - [ ] **Success:** 응답 데이터(`response.data`)만 반환하도록 필터링.
  - [ ] **Error (401):**
    1. 원본 요청(Request)을 잠시 대기(Pending).
    2. `POST /auth/refresh` 호출하여 새 토큰 발급.
    3. 새 토큰으로 원본 요청 재전송(Retry).
    4. 재발급 실패 시 로그아웃 처리 및 로그인 페이지로 리다이렉트.

## 3. 검증 방법 (Verification)
- **테스트 시나리오:**
  - [ ] 로그인 후 API 호출 시 개발자 도구 Network 탭 Header 확인.
  - [ ] Access Token을 강제로 만료시키거나 삭제 후 API 호출 시, Refresh API가 호출되는지 확인.
"""
