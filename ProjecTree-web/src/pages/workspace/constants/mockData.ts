import type { Node, Edge } from "@xyflow/react";
import type { ProjectNodeData } from "../components/Canvas/nodes/ProjectNode";
import type { EpicNodeData } from "../components/Canvas/nodes/EpicNode";
import type { StoryNodeData } from "../components/Canvas/nodes/StoryNode";
import type { AvatarColor } from "@/components/custom/UserAvatar";
import type { AdvancedNodeData, TaskNodeData } from "../components";

// Mock nodes for the tree
export const mockNodes: Node[] = [
  // Project Node
  {
    id: "project-1",
    type: "project",
    position: { x: 400, y: 50 },
    data: {
      title: "AI 여행 추천 서비스",
      status: "progress",
      priority: "P0",
    } as ProjectNodeData,
  },
  // Epic Node
  {
    id: "epic-1",
    type: "epic",
    position: { x: 400, y: 180 },
    data: {
      title: "사용자 인증",
      status: "completed",
      taskId: "#ASDF-2",
      storyPoints: 5,
    } as EpicNodeData,
  },
  // Story Nodes
  {
    id: "story-1",
    type: "story",
    position: { x: 250, y: 340 },
    data: {
      title: "사용자가 로그인한다.",
      status: "progress",
      taskId: "#ASDF-3",
      category: "frontend",
      storyPoints: 3,
    } as StoryNodeData,
  },
  {
    id: "task-1",
    type: "task",
    position: { x: 200, y: 470 },
    data: {
      title: "프론트엔드 로그인",
      status: "progress",
      taskId: "#ASDF-4",
      category: "frontend",
      storyPoints: 4,
    } as TaskNodeData,
  },
  {
    id: "task-2",
    type: "task",
    position: { x: 400, y: 470 },
    data: {
      title: "백엔드 로그인",
      status: "pending",
      taskId: "#ASDF-5",
      category: "backend",
      storyPoints: 3,
    } as TaskNodeData,
  },
  {
    id: "advanced-4",
    type: "advanced",
    position: { x: 150, y: 600 },
    data: {
      title: "프론트엔드 Form 렌더링 최적화",
      status: "pending",
      taskId: "#ASDF-6",
      category: "frontend",
      priority: "P1",
      storyPoints: 2,
    } as AdvancedNodeData,
  },
  {
    id: "advanced-5",
    type: "advanced",
    position: { x: 450, y: 600 },
    data: {
      title: "백엔드 블랙리스트 관리",
      status: "pending",
      taskId: "#ASDF-7",
      category: "backend",
      priority: "P2",
      storyPoints: 3,
    } as AdvancedNodeData,
  },
];

// Mock edges connecting nodes
export const mockEdges: Edge[] = [
  {
    id: "e-project-epic",
    source: "project-1",
    target: "epic-1",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#8B5CF6", strokeWidth: 2 },
  },
  {
    id: "e-epic-story1",
    source: "epic-1",
    target: "story-1",
    type: "smoothstep",
    style: { stroke: "#2B7FFF", strokeWidth: 2 },
  },
  {
    id: "e-story1-task1",
    source: "story-1",
    target: "task-1",
    type: "smoothstep",
    style: { stroke: "#00D492", strokeWidth: 2 },
  },
  {
    id: "e-story1-task2",
    source: "story-1",
    target: "task-2",
    type: "smoothstep",
    style: { stroke: "#06B6D4", strokeWidth: 2 },
  },
  {
    id: "e-task1-advanced4",
    source: "task-1",
    target: "advanced-4",
    type: "smoothstep",
    style: { stroke: "#00D492", strokeWidth: 2 },
  },
  {
    id: "e-task2-advanced5",
    source: "task-2",
    target: "advanced-5",
    type: "smoothstep",
    style: { stroke: "#0891B2", strokeWidth: 2 },
  },
];

// Mock online users
export interface MockUser {
  id: string;
  initials: string;
  color: AvatarColor;
  isOnline: boolean;
}

export const mockUsers: MockUser[] = [
  { id: "1", initials: "KM", color: "blue", isOnline: true },
  { id: "2", initials: "LJ", color: "pink", isOnline: true },
  { id: "3", initials: "PH", color: "orange", isOnline: false },
];

// Mock node detail data for sidebar
import type { NodeDetailData } from "../components/NodeDetailSidebar";

export const mockNodeDetails: Record<string, NodeDetailData> = {
  "task-1": {
    id: "task-1",
    type: "task",
    category: "frontend",
    taskId: "ASDF-2",
    title: "사용자 인증 시스템",
    description:
      "로그인, 회원가입, 비밀번호 재설정, 소셜 로그인 연동을 포함한 종합 인증 시스템을 구현합니다.",
    status: "progress",
    priority: "P0",
    assignee: {
      id: "2",
      name: "이지은",
      initials: "LJ",
      color: "#1C69E3",
    },
    difficulty: 4,
    techRecommendations: [
      {
        id: "swr",
        name: "SWR",
        category: "데이터 페칭/캐싱",
        description:
          "React를 위한 데이터 페칭 라이브러리. Stale-While-Revalidate 전략으로 빠른 UX를 제공합니다.",
        tags: [
          { label: "자동 캐싱", type: "positive" },
          { label: "실시간 동기화", type: "positive" },
          { label: "React 전용", type: "negative" },
        ],
        isAIRecommended: true,
      },
      {
        id: "react-query",
        name: "React Query",
        category: "서버 상태 관리",
        description:
          "강력한 서버 상태 관리 라이브러리. 캐싱, 동기화, 백그라운드 업데이트를 자동으로 처리합니다.",
        tags: [
          { label: "강력한 캐싱", type: "positive" },
          { label: "DevTools", type: "positive" },
          { label: "학습 곡선", type: "negative" },
        ],
      },
      {
        id: "react-hook-form",
        name: "React Hook Form",
        category: "폼 관리",
        description:
          "성능에 최적화된 폼 라이브러리. 비제어 컴포넌트로 리렌더링을 최소화합니다.",
        tags: [
          { label: "고성능", type: "positive" },
          { label: "간단한 API", type: "positive" },
          { label: "비제어 방식", type: "negative" },
        ],
      },
    ],
    techComparison: {
      id: "comparison-swr-react-query",
      comparedTechs: ["swr", "react-query"],
      comparisonTable:
        "# 기술 비교 분석\n\n| 요소 | infinite-scroll-with-auto-scroll-api | reactive-scroll-manager | observable-scroll-behavior |\n|---|---|---|---|\n| 생산성 | 중간-상 | 중상 | 중상-높음 |\n| 번들 크기 | 중간 | 중간 | 중상(추가 라이브러리 시 증가) |\n| 상태 관리 효율성 | 메시지 흐름과 스크롤 제어를 분리 어려움 | 상태 관리와 스크롤 제어를 함께 다루며 일관성 좋음 | Observable로 흐름 분리, 확장성은 좋지만 학습 필요 |\n| 생태계 지원 | 일반적 방법론, 재사용성 좋음 | React 기반으로 생태계 친화적 | RxJS 등 Observable 생태계 의존성 |\n| 구현 난이도 | 중-상 | 중 | 중-상 |\n| 핵심 보완 포인트 | 스크롤 위치 유지 로직의 경계 설정 필요 | 스크롤 타이밍과 버퍼 관리 중요 | 추상화 레벨 높아 초기 학습 필요 |\n\n요약: 세 옵션은 모두 실시간 채팅의 자동 스크롤 요구를 충족하지만, 실제로는 사용자의 스크롤 의도(읽고 있는지 여부)에 따라 자동 스크롤 정책을 다르게 적용하는 것이 중요합니다. 주니어 개발자라면 reactive-scroll-manager가 React 친화적이며 관리 포인트가 명확해 시작하기 좋고, infinite-scroll-with-auto-scroll-api는 로직 경계와 복합 케이스에 강합니다. observable-scroll-behavior는 확장성은 크지만 학습부담이 큽니다.",
    },
    subNodeRecommendations: [
      {
        id: "sub-1",
        title: "하위 기능 1",
        description: "세부 기능 구현",
      },
      {
        id: "sub-2",
        title: "하위 기능 2",
        description: "세부 기능 구현",
      },
      {
        id: "sub-3",
        title: "하위 기능 3",
        description: "세부 기능 구현",
      },
    ],
    memo: "",
  },
  "task-2": {
    id: "task-2",
    type: "task",
    category: "backend",
    taskId: "ASDF-5",
    title: "백엔드 로그인",
    description: "JWT 기반 인증 API와 세션 관리를 구현합니다.",
    status: "pending",
    priority: "P1",
    assignee: {
      id: "1",
      name: "김민수",
      initials: "KM",
      color: "#8B5CF6",
    },
    difficulty: 3,
    techRecommendations: [
      {
        id: "jwt",
        name: "JWT",
        category: "인증",
        description: "JSON Web Token 기반 stateless 인증 방식입니다.",
        tags: [
          { label: "확장성", type: "positive" },
          { label: "무상태", type: "positive" },
          { label: "토큰 크기", type: "negative" },
        ],
        isAIRecommended: true,
      },
    ],
    subNodeRecommendations: [
      {
        id: "sub-1",
        title: "토큰 검증 로직",
        description: "JWT 토큰 유효성 검사",
      },
      {
        id: "sub-2",
        title: "리프레시 토큰",
        description: "토큰 갱신 메커니즘",
      },
    ],
  },
  "advanced-4": {
    id: "advanced-4",
    type: "advanced",
    category: "frontend",
    taskId: "ASDF-6",
    title: "프론트엔드 Form 렌더링 최적화",
    description: "복잡한 폼의 렌더링 성능을 개선합니다.",
    status: "pending",
    priority: "P1",
    difficulty: 2,
    techRecommendations: [
      {
        id: "memo",
        name: "React.memo",
        category: "최적화",
        description:
          "컴포넌트 메모이제이션으로 불필요한 리렌더링을 방지합니다.",
        tags: [
          { label: "성능 향상", type: "positive" },
          { label: "간단함", type: "positive" },
        ],
        isAIRecommended: true,
      },
      {
        id: "usememo",
        name: "useMemo",
        category: "최적화",
        description: "값 메모이제이션으로 비용이 큰 계산을 최적화합니다.",
        tags: [
          { label: "계산 최적화", type: "positive" },
          { label: "과도한 사용 주의", type: "negative" },
        ],
      },
      {
        id: "use-callback",
        name: "useCallback",
        category: "최적화",
        description:
          "함수 메모이제이션으로 자식 컴포넌트 리렌더링을 방지합니다.",
        tags: [
          { label: "함수 안정화", type: "positive" },
          { label: "의존성 관리", type: "negative" },
        ],
      },
    ],
    techComparison: {
      id: "comparison-react-optimization",
      comparedTechs: ["memo", "usememo", "use-callback"],
      comparisonTable:
        "# 기술 비교 분석\n\n| 요소 | infinite-scroll-with-auto-scroll-api | reactive-scroll-manager | observable-scroll-behavior |\n|---|---|---|---|\n| 생산성 | 중간-상 | 중상 | 중상-높음 |\n| 번들 크기 | 중간 | 중간 | 중상(추가 라이브러리 시 증가) |\n| 상태 관리 효율성 | 메시지 흐름과 스크롤 제어를 분리 어려움 | 상태 관리와 스크롤 제어를 함께 다루며 일관성 좋음 | Observable로 흐름 분리, 확장성은 좋지만 학습 필요 |\n| 생태계 지원 | 일반적 방법론, 재사용성 좋음 | React 기반으로 생태계 친화적 | RxJS 등 Observable 생태계 의존성 |\n| 구현 난이도 | 중-상 | 중 | 중-상 |\n| 핵심 보완 포인트 | 스크롤 위치 유지 로직의 경계 설정 필요 | 스크롤 타이밍과 버퍼 관리 중요 | 추상화 레벨 높아 초기 학습 필요 |\n\n요약: 세 옵션은 모두 실시간 채팅의 자동 스크롤 요구를 충족하지만, 실제로는 사용자의 스크롤 의도(읽고 있는지 여부)에 따라 자동 스크롤 정책을 다르게 적용하는 것이 중요합니다. 주니어 개발자라면 reactive-scroll-manager가 React 친화적이며 관리 포인트가 명확해 시작하기 좋고, infinite-scroll-with-auto-scroll-api는 로직 경계와 복합 케이스에 강합니다. observable-scroll-behavior는 확장성은 크지만 학습부담이 큽니다.",
    },
    subNodeRecommendations: [],
  },
  "advanced-5": {
    id: "advanced-5",
    type: "advanced",
    category: "backend",
    taskId: "ASDF-7",
    title: "백엔드 블랙리스트 관리",
    description: "토큰 블랙리스트를 효율적으로 관리합니다.",
    status: "pending",
    priority: "P2",
    difficulty: 3,
    techRecommendations: [
      {
        id: "redis",
        name: "Redis",
        category: "캐시/DB",
        description:
          "인메모리 데이터 저장소로 빠른 블랙리스트 조회가 가능합니다.",
        tags: [
          { label: "고성능", type: "positive" },
          { label: "TTL 지원", type: "positive" },
        ],
        isAIRecommended: true,
      },
    ],
    subNodeRecommendations: [],
  },
  "story-1": {
    id: "story-1",
    type: "story",
    taskId: "ASDF-3",
    title: "사용자가 로그인한다.",
    description: "사용자 스토리: 로그인 기능 전체 흐름",
    status: "progress",
    priority: "P0",
    difficulty: 3,
    subNodeRecommendations: [
      {
        id: "sub-1",
        title: "소셜 로그인",
        description: "OAuth2 기반 소셜 로그인",
      },
    ],
  },
  "epic-1": {
    id: "epic-1",
    type: "epic",
    taskId: "ASDF-2",
    title: "사용자 인증",
    description: "전체 인증 시스템 에픽",
    status: "completed",
    difficulty: 5,
    subNodeRecommendations: [],
  },
  "project-1": {
    id: "project-1",
    type: "project",
    title: "AI 여행 추천 서비스",
    description: "AI 기반 맞춤형 여행 추천 플랫폼",
    status: "progress",
    priority: "P0",
    subNodeRecommendations: [],
  },
};
