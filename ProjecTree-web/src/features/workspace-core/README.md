# workspace-core 구조 규칙

이 문서는 `workspace-core` 내부 코드 배치 기준을 정의합니다.

## 폴더 책임

- `crdt`: 연결, 세션, 송수신 같은 transport 계층
- `services`: 도메인 처리와 부수효과 실행 계층
- `hooks`: React 라이프사이클/구독/이벤트 바인딩
- `stores`: 상태 저장, selector, 상태 갱신 함수
- `types`: 타입 정의와 메시지 스키마
- `utils`: 순수 함수(부수효과 없음)
- `constants`: 고정 값, 매핑 테이블

## service 분리 기준

- 목적이 하나인 도메인 처리 단위여야 한다.
- React 컴포넌트나 특정 훅에 묶이지 않아야 한다.
- store 갱신, toast, 서버 명령 전송 같은 부수효과를 한곳에 모은다.
- 여러 화면/훅에서 재사용될 수 있어야 한다.
- 연결(transport) 로직과 해석/처리 로직을 분리한다.

## service로 두는 예시

- CRDT 수신 메시지 해석 후 상태 반영
- 노드 상세 편집 동기화 lifecycle 처리
- preview 노드 생성/삭제 동기화 처리

## service로 두지 않는 예시

- `useEffect`, `useMemo` 중심의 화면 구독 로직
- 단순 문자열/좌표 계산 같은 순수 함수
- 단일 컴포넌트에서만 쓰는 UI 이벤트 핸들러

## 코드 작성 규칙

- `service`는 가능하면 입력/출력 계약을 타입으로 명시한다.
- `dispatcher`는 라우팅만 하고 실제 처리 로직은 `service`로 위임한다.
- 새 메시지 타입 추가 시 순서는 `types` -> `service` -> `dispatcher` -> 호출부 검증으로 진행한다.

