# NodeDetailSidebar 컴포넌트

노드를 클릭하면 오른쪽에서 슬라이드 인 되어 나타나는 상세 정보 사이드바입니다.

## 파일 구조

```
NodeDetailSidebar/
├── index.ts                    # Export 파일
├── types.ts                    # 타입 정의
├── NodeDetailSidebar.tsx       # 메인 사이드바 컴포넌트
├── NodeHeader.tsx              # 헤더 섹션 (태그, 제목, 설명)
├── StatusMetaSection.tsx       # 상태 & 메타 정보 섹션
├── AITechRecommendSection.tsx  # AI 기술 추천 섹션
├── AINodeRecommendSection.tsx  # AI 다음 노드 추천 섹션
├── MemoSection.tsx             # 메모 섹션
└── README.md                   # 이 문서
```

---

## 타입 정의 (`types.ts`)

### 기본 타입
| 타입 | 설명 | 값 |
|------|------|-----|
| `NodeCategory` | 노드 카테고리 | `"frontend"` \| `"backend"` |
| `NodeStatus` | 노드 상태 | `"pending"` \| `"progress"` \| `"completed"` |
| `Priority` | 우선순위 | `"P0"` \| `"P1"` \| `"P2"` \| `"P3"` |
| `NodeType` | 노드 타입 | `"project"` \| `"epic"` \| `"story"` \| `"task"` \| `"advanced"` |

### 인터페이스

#### `Assignee` - 담당자 정보
```typescript
interface Assignee {
  id: string;
  name: string;      // 이름 (예: "이지은")
  initials: string;  // 이니셜 (예: "LJ")
  color: string;     // 아바타 배경색 (예: "#1C69E3")
}
```

#### `TechTag` - 기술 태그 (장/단점)
```typescript
interface TechTag {
  label: string;                    // 태그 텍스트 (예: "자동 캐싱")
  type: "positive" | "negative";    // 장점/단점 구분
}
```

#### `TechRecommendation` - AI 기술 추천 항목
```typescript
interface TechRecommendation {
  id: string;
  name: string;           // 기술명 (예: "SWR")
  category: string;       // 카테고리 (예: "데이터 페칭/캐싱")
  description: string;    // 설명
  tags: TechTag[];        // 장/단점 태그 목록
  isAIRecommended?: boolean;  // AI 추천 여부 (뱃지 표시)
}
```

#### `SubNodeRecommendation` - AI 하위 노드 추천 항목
```typescript
interface SubNodeRecommendation {
  id: string;
  title: string;       // 노드 제목 (예: "하위 기능 1")
  description: string; // 설명 (예: "세부 기능 구현")
}
```

#### `NodeDetailData` - 노드 상세 데이터 (메인)
```typescript
interface NodeDetailData {
  id: string;
  type: NodeType;
  category?: NodeCategory;           // frontend/backend (task, advanced만 해당)
  taskId?: string;                   // 태스크 ID (예: "ASDF-2")
  title: string;
  description?: string;
  status: NodeStatus;
  priority?: Priority;
  assignee?: Assignee;
  difficulty?: number;               // 난이도 1-5 (별점)
  techRecommendations?: TechRecommendation[];
  subNodeRecommendations?: SubNodeRecommendation[];
  memo?: string;
}
```

---

## 컴포넌트 설명

### 1. `NodeDetailSidebar.tsx` - 메인 컴포넌트
전체 사이드바를 조합하는 메인 컴포넌트입니다.

**Props:**
| Prop | 타입 | 설명 |
|------|------|------|
| `node` | `NodeDetailData \| null` | 표시할 노드 데이터 |
| `isOpen` | `boolean` | 사이드바 열림 상태 |
| `onClose` | `() => void` | 닫기 버튼 클릭 핸들러 |
| `onTechCompare` | `() => void` | "기술 비교하기" 버튼 클릭 |
| `onTechAddManual` | `() => void` | 기술 "직접 추가" 버튼 클릭 |
| `onNodeAdd` | `(node) => void` | 추천 노드 추가 버튼 클릭 |
| `onNodeAddManual` | `() => void` | 노드 "직접 추가" 버튼 클릭 |
| `onMemoChange` | `(memo) => void` | 메모 내용 변경 |

**스타일:** 너비 400px, 오른쪽에서 슬라이드 인 애니메이션

---

### 2. `NodeHeader.tsx` - 헤더 섹션
노드의 기본 정보를 표시합니다.

**표시 내용:**
- 노드 타입 태그 (Task, Advanced, Story, Epic, Project)
- 카테고리 태그 (Frontend/Backend) - task, advanced 노드만
- Task ID (예: #ASDF-2)
- 제목
- 설명
- 닫기(X) 버튼

**태그 색상:**
| 타입 | 배경 | 텍스트 |
|------|------|--------|
| Task | 파란색 10% | #6363C6 |
| Advanced | 시안 10% | #0891B2 |
| Story | 초록 10% | #00D492 |
| Epic | 보라 10% | #8B5CF6 |
| Project | 회색 10% | #64748B |
| Frontend | #FFF7ED | #F97316 |
| Backend | #EEF2FF | #6366F1 |

---

### 3. `StatusMetaSection.tsx` - 상태 & 메타 섹션
노드의 상태 정보와 메타데이터를 표시합니다.

**표시 내용:**
- 상태 (대기/진행중/완료)
- 우선순위 (P0/P1/P2/P3)
- 담당자 (아바타 + 이름)
- 난이도 (별점 1-5)

**상태 색상:**
| 상태 | 색상 |
|------|------|
| 대기 | #64748B (회색) |
| 진행중 | #6363C6 (보라) |
| 완료 | #00C950 (초록) |

**우선순위 색상:**
| 우선순위 | 색상 |
|----------|------|
| P0 | #E7000B (빨강) |
| P1 | #FD9A00 (주황) |
| P2 | #2B7FFF (파랑) |
| P3 | #64748B (회색) |

---

### 4. `AITechRecommendSection.tsx` - AI 기술 추천 섹션
AI가 추천하는 기술 스택을 카드 형태로 표시합니다.

**기능:**
- 접기/펼치기 토글
- 기술 카드 선택 (하이라이트)
- AI 추천 뱃지 표시
- 장/단점 태그 (초록/빨강)
- "기술 비교하기" 버튼
- "직접 추가" 버튼

**태그 색상:**
| 타입 | 배경 | 텍스트 |
|------|------|--------|
| 장점 (+) | #ECFDF5 | #007A55 |
| 단점 (-) | #F8F8F8 | #C10007 |

---

### 5. `AINodeRecommendSection.tsx` - AI 다음 노드 추천 섹션
AI가 추천하는 하위 노드를 표시합니다.

**기능:**
- 접기/펼치기 토글
- 추천 노드 목록 (제목 + 설명)
- 노드별 추가(+) 버튼
- "직접 추가" 버튼

---

### 6. `MemoSection.tsx` - 메모 섹션
노드에 대한 메모를 작성할 수 있는 영역입니다.

**기능:**
- 접기/펼치기 토글
- 텍스트 입력 영역
- 실시간 메모 저장 (onMemoChange 콜백)

---

## 사용 예시

```tsx
import { NodeDetailSidebar, type NodeDetailData } from "./components/NodeDetailSidebar";

function WorkSpacePage() {
  const [selectedNode, setSelectedNode] = useState<NodeDetailData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Canvas에서 노드 클릭 시 */}
      <TreeCanvas onNodeClick={(nodeId) => {
        setSelectedNode(getNodeData(nodeId));
        setIsOpen(true);
      }} />

      {/* 사이드바 */}
      <NodeDetailSidebar
        node={selectedNode}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onTechCompare={() => console.log("기술 비교")}
        onMemoChange={(memo) => console.log("메모:", memo)}
      />
    </>
  );
}
```

---

## 디자인 토큰

### 공통 카드 스타일
```css
background: rgba(251, 251, 255, 0.6);
border: 1px solid rgba(227, 228, 235, 0.5);
backdrop-filter: blur(4px);
border-radius: 14px;
```

### 버튼 스타일 (보라색 아웃라인)
```css
color: #6363C6;
border: 1px solid rgba(99, 99, 198, 0.3);
border-radius: 8px;
```

### 폰트
- 제목: Inter, 16px, Medium (#14151F)
- 본문: Inter, 14px, Regular (#61626F)
- 라벨: Geist, 12px, Regular (#61626F)
- 태그: Inter, 12px, Semibold
