# Y.Doc 노드 구조 불일치 트러블슈팅

## 요약

- 증상: Yjs 동기화는 되지만 클라이언트에서 노드 데이터 해석이 깨짐.
- 원인: 서버는 중첩 Y.Map 구조로 저장, 클라이언트는 plain object 구조를 기대.
- 해결: 서버가 position/data/detail을 plain object로 저장하도록 수정.

## 증상

- 클라이언트에서 `yNode.get("position")` 결과가 `{ x, y }`가 아닌 Y.Map으로 들어옴.
- 타입 캐스팅은 통과하지만 런타임 구조가 다라 UI/로직에서 오류 또는 이상 동작 발생.
- 데이터 전송 자체(y-websocket 업데이트)는 정상.

## 원인 분석

서버와 클라이언트의 Y.Doc 내부 구조가 서로 다름.

### 서버 구조(수정 전)

nodes : Y.Map

- nodeId : Y.Map
  - type : string
  - parentId : number | null
  - position : Y.Map (x, y)
  - data : Y.Map (title, taskId, status, ...)
    nodeDetails : Y.Map
- nodeId : Y.Map

### 클라이언트 기대 구조

nodes : Y.Map

- nodeId : Y.Map
  - type : string
  - parentId : string | undefined
  - position : { x: number; y: number }
  - data : { title, taskId, status, ... }
    nodeDetails : Y.Map
- nodeId : object

### 불일치 지점

- position/data/detail이 Y.Map인지 plain object인지가 서로 다름.
- 클라이언트는 object 접근을 전제로 하고 있어 Y.Map을 받으면 해석 실패.

## 관련 코드 경로

- 서버 입력: `ProjecTree-CRDT/src/api/internalRouter.ts`
- 서버 Y.Doc 연결: `ProjecTree-CRDT/src/yjs/ydoc-gateway.ts`
- 클라이언트 Y.Doc 사용 훅: `useNodesCrdt` (클라이언트 코드)

## 해결 방식

plain object 구조를 표준으로 결정하고 서버 저장 로직을 수정.

### 수정 내용 (서버)

- position: `yNode.set("position", { x, y })`
- data: `yNode.set("data", { ... })`
- nodeDetails: `details.set(nodeId, { ... })` (undefined 제거)

## 검증 포인트

1. 클라이언트가 `yNode.get("position")`에서 `{ x, y }`를 받는지 확인.
2. `data`가 object로 들어와 `title/status/priority` 접근이 정상인지 확인.
3. 동일 room(docName)으로 연결되는지 확인 (서버는 room="1" 고정).

## 재발 방지

- Y.Doc 스키마(중첩/객체)를 문서로 명시하고 서버/클라이언트에 공통 타입 정의 적용.
- 클라이언트 측에서 Y.Map/object 혼합을 허용하는 가드 로직을 추가.

## plain object vs 중첩 Y.Map

```javascript
import * as Y from "yjs";

const doc = new Y.Doc();
const nodes = doc.getMap<Y.Map<any>>("nodes");
const nodeId = "1";

// 1) plain object 방식
const yNodePlain = new Y.Map();
yNodePlain.set("type", "TASK");
yNodePlain.set("position", { x: 10, y: 20 });
yNodePlain.set("data", { title: "Hello", status: "TODO" });
nodes.set(nodeId, yNodePlain);

// 읽기
const posPlain = yNodePlain.get("position"); // { x: 10, y: 20 }
console.log(posPlain.x, posPlain.y);

// 2) 중첩 Y.Map 방식
const yNodeMap = new Y.Map();
const posMap = new Y.Map();
posMap.set("x", 10);
posMap.set("y", 20);
yNodeMap.set("position", posMap);

const dataMap = new Y.Map();
dataMap.set("title", "Hello");
dataMap.set("status", "TODO");
yNodeMap.set("data", dataMap);
nodes.set("2", yNodeMap);

// 읽기
const posNested = yNodeMap.get("position") as Y.Map<any>;
console.log(posNested.get("x"), posNested.get("y"));

```

- plain object: 접근이 단순 (pos.x), 구조가 JSON에 가깝고 디버깅이 쉬움.
- 중첩 Y.Map: 내부 필드 단위로 CRDT 병합이 가능하지만 접근 코드가 더 복잡.
