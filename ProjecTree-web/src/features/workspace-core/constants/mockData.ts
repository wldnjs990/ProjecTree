import type { Node, Edge } from '@xyflow/react';
import type { AvatarColor } from '@/shared/components/UserAvatar';
import type {
  NodesApiResponse,
  NodeDetailApiResponse,
  NodeDetailData,
} from '../types';

// ===== 백엔드 API 목데이터 =====

// 노드 목록 API 응답 목데이터
export const mockNodesApiResponse: NodesApiResponse = {
  status: 'SUCCESS',
  code: 200,
  message: '요청에 성공하였습니다.',
  data: [
    {
      id: 1,
      name: 'AI 여행 추천 서비스',
      nodeType: 'PROJECT',
      position: { xpos: 400, ypos: 50 },
      parentId: null,
      data: {
        priority: 'P0',
        identifier: 'PROJ-001',
        taskType: null,
        status: 'IN_PROGRESS',
      },
    },
    {
      id: 2,
      name: '사용자 인증',
      nodeType: 'EPIC',
      position: { xpos: 400, ypos: 180 },
      parentId: 1,
      data: {
        priority: 'P0',
        identifier: 'EPIC-001',
        taskType: null,
        status: 'DONE',
      },
    },
    {
      id: 3,
      name: '사용자가 로그인한다.',
      nodeType: 'STORY',
      position: { xpos: 250, ypos: 340 },
      parentId: 2,
      data: {
        priority: 'P1',
        identifier: 'STORY-001',
        taskType: null,
        status: 'IN_PROGRESS',
      },
    },
    {
      id: 4,
      name: '프론트엔드 로그인',
      nodeType: 'TASK',
      position: { xpos: 200, ypos: 470 },
      parentId: 3,
      data: {
        priority: 'P0',
        identifier: 'TASK-001',
        taskType: 'FE',
        status: 'IN_PROGRESS',
        difficult: 4,
      },
    },
    {
      id: 5,
      name: '백엔드 로그인',
      nodeType: 'TASK',
      position: { xpos: 400, ypos: 470 },
      parentId: 3,
      data: {
        priority: 'P1',
        identifier: 'TASK-002',
        taskType: 'BE',
        status: 'TODO',
        difficult: 3,
      },
    },
  ],
};

// 노드 상세 API 응답 목데이터
export const mockNodeDetailApiResponses: Record<number, NodeDetailApiResponse> =
{
  4: {
    status: 'SUCCESS',
    code: 200,
    message: '요청에 성공하였습니다.',
    data: {
      id: 4,
      assignee: {
        id: '2',
        name: '이지은',
      },
      description:
        '로그인, 회원가입, 비밀번호 재설정, 소셜 로그인 연동을 포함한 종합 인증 시스템을 구현합니다.',
      note: '기한 엄수 요망',
      candidates: [
        {
          id: 101,
          name: '[FE] 현재 위치 기반 추천 화면 및 즉시표시 UX 구현',
          description:
            "사용자의 위치 권한을 요청하고 현재 좌표(위도/경도)를 가져와 추천 UI를 초기화한다. 화면에는 '지금 바로 입장 가능' 배너, 근처(500m) 식당 목록, 각 항목에 거리, 예상 혼잡도 상태(아이콘), '즉시 입장 가능' 태그를 표시한다.",
          taskType: 'FE',
          isSelected: false,
        },
        {
          id: 102,
          name: '[FE] 소셜 로그인 버튼 컴포넌트 구현',
          description:
            'OAuth2 기반 소셜 로그인(Google, Kakao, Naver) 버튼 및 인증 플로우를 구현합니다.',
          taskType: 'FE',
          isSelected: false,
        },
      ],
      techs: [
        {
          id: 7555,
          name: 'react-hook-form',
          advantage:
            '성능에 최적화된 폼 라이브러리로 비제어 컴포넌트 방식을 사용하여 리렌더링을 최소화합니다. 간단한 API와 작은 번들 사이즈가 장점입니다.',
          disadvantage:
            '비제어 방식에 익숙하지 않은 개발자에게는 학습 곡선이 있을 수 있습니다.',
          description:
            'React를 위한 폼 상태 관리 라이브러리로, 유효성 검사와 폼 제출을 효율적으로 처리합니다.',
          ref: 'https://react-hook-form.com/',
          recommendationScore: 5,
        },
        {
          id: 50139,
          name: 'SWR',
          advantage:
            'Stale-While-Revalidate 전략으로 빠른 UX를 제공하며, 자동 캐싱과 실시간 동기화를 지원합니다.',
          disadvantage:
            'React 전용 라이브러리이며, 복잡한 서버 상태 관리에는 React Query가 더 적합할 수 있습니다.',
          description:
            'React를 위한 데이터 페칭 라이브러리로, 캐싱과 재검증을 자동으로 처리합니다.',
          ref: 'https://swr.vercel.app/',
          recommendationScore: 4,
        },
        {
          id: 71996,
          name: 'React Query',
          advantage:
            '강력한 서버 상태 관리 기능과 DevTools를 제공하며, 캐싱, 동기화, 백그라운드 업데이트를 자동으로 처리합니다.',
          disadvantage:
            '학습 곡선이 있으며, 작은 프로젝트에는 오버엔지니어링일 수 있습니다.',
          description:
            '서버 상태 관리를 위한 라이브러리로, 데이터 페칭, 캐싱, 동기화를 효율적으로 처리합니다.',
          ref: 'https://tanstack.com/query/',
          recommendationScore: 4,
        },
      ],
      comparison:
        '# 기술 비교 분석\n\n| 비교 항목 | react-hook-form | SWR | React Query |\n|---|---|---|---|\n| 주요 용도 | 폼 상태 관리 | 데이터 페칭/캐싱 | 서버 상태 관리 |\n| 번들 크기 | 작음 (~9KB) | 작음 (~4KB) | 중간 (~13KB) |\n| 학습 곡선 | 낮음 | 낮음 | 중간 |\n| DevTools | 없음 | 없음 | 있음 |\n| 캐싱 전략 | N/A | SWR | 다양한 옵션 |\n\n# 요약\n- 폼 처리에는 react-hook-form을 사용합니다.\n- 간단한 데이터 페칭에는 SWR이 적합합니다.\n- 복잡한 서버 상태 관리가 필요하면 React Query를 고려합니다.',
    },
  },
  5: {
    status: 'SUCCESS',
    code: 200,
    message: '요청에 성공하였습니다.',
    data: {
      id: 5,
      assignee: {
        id: '1',
        name: '김민수',
      },
      description: 'JWT 기반 인증 API와 세션 관리를 구현합니다.',
      note: '',
      candidates: [
        {
          id: 201,
          name: '[BE] 토큰 검증 미들웨어 구현',
          description:
            'JWT 토큰의 유효성을 검사하는 미들웨어를 구현합니다. 만료 시간, 서명 검증 등을 처리합니다.',
          taskType: 'BE',
          isSelected: false,
        },
        {
          id: 202,
          name: '[BE] 리프레시 토큰 로직 구현',
          description:
            'Access Token 만료 시 Refresh Token을 이용한 토큰 갱신 메커니즘을 구현합니다.',
          taskType: 'BE',
          isSelected: false,
        },
      ],
      techs: [
        {
          id: 8001,
          name: 'JWT',
          advantage:
            'Stateless 인증 방식으로 확장성이 좋으며, 서버 세션 저장소가 필요 없습니다.',
          disadvantage:
            '토큰 크기가 크고, 토큰 탈취 시 만료 전까지 무효화하기 어렵습니다.',
          description:
            'JSON Web Token 기반의 인증 방식으로, 토큰에 사용자 정보를 담아 전달합니다.',
          ref: 'https://jwt.io/',
          recommendationScore: 5,
        },
      ],
      comparison:
        '# JWT 인증 전략\n\nJWT는 stateless 인증의 표준으로, 마이크로서비스 아키텍처��� 적합합니다. 토큰 만료 시간을 짧게 설정하고 Refresh Token을 활용하여 보안을 강화하는 것이 권장됩니다.',
    },
  },
  3: {
    status: 'SUCCESS',
    code: 200,
    message: '요청에 성공하였습니다.',
    data: {
      id: 3,
      assignee: null,
      description: '사용자 스토리: 로그인 기능 전체 흐름',
      note: '',
      candidates: [
        {
          id: 301,
          name: '소셜 로그인 기능',
          description: 'OAuth2 기반 소셜 로그인 (Google, Kakao, Naver)',
          taskType: null,
          isSelected: false,
        },
      ],
      techs: [],
      comparison: '',
    },
  },
  2: {
    status: 'SUCCESS',
    code: 200,
    message: '요청에 성공하였습니다.',
    data: {
      id: 2,
      assignee: null,
      description: '전체 인증 시스템 에픽',
      note: '',
      candidates: [],
      techs: [],
      comparison: '',
    },
  },
  1: {
    status: 'SUCCESS',
    code: 200,
    message: '요청에 성공하였습니다.',
    data: {
      id: 1,
      assignee: null,
      description: 'AI 기반 맞춤형 여행 추천 플랫폼',
      note: '',
      candidates: [],
      techs: [],
      comparison: '',
    },
  },
};

// 노드 상세 데이터만 추출 (사이드바에서 사용)
export const mockNodeDetails: Record<number, NodeDetailData> =
  Object.fromEntries(
    Object.entries(mockNodeDetailApiResponses).map(([key, value]) => [
      Number(key),
      value.data,
    ])
  );

// 백엔드 API 응답을 React Flow 노드로 변환
export const mockNodes: Node[] = mockNodesApiResponse.data.map((node) => ({
  id: String(node.id),
  type: node.nodeType || 'TASK',
  position: { x: node.position.xpos, y: node.position.ypos },
  parentId: node.parentId ? String(node.parentId) : undefined,
  data: {
    title: node.name,
    status: node.data.status,
    priority: node.data.priority,
    taskId: `#${node.data.identifier}`,
    taskType: node.data.taskType ? node.data.taskType : undefined,
    difficult: node.data.difficult,
  },
}));

// Mock edges connecting nodes
export const mockEdges: Edge[] = [
  {
    id: 'e-1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#8B5CF6', strokeWidth: 2 },
  },
  {
    id: 'e-2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    style: { stroke: '#2B7FFF', strokeWidth: 2 },
  },
  {
    id: 'e-3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    style: { stroke: '#00D492', strokeWidth: 2 },
  },
  {
    id: 'e-3-5',
    source: '3',
    target: '5',
    type: 'smoothstep',
    style: { stroke: '#06B6D4', strokeWidth: 2 },
  },
];

// ===== 기타 목데이터 =====

// Mock online users
// Mock online users
export interface MockUser {
  id: string;
  name: string; // 실명
  nickname: string; // 닉네임
  initials: string;
  color: AvatarColor;
  isOnline: boolean;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  isMe?: boolean; // 내 자신인지 여부 (UI 테스트용)
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: '김싸피',
    nickname: 'ProjecTree 마스터',
    initials: 'KM',
    color: 'blue',
    isOnline: true,
    role: 'OWNER',
    isMe: true,
  },
  {
    id: '2',
    name: '이수민',
    nickname: 'Front-end Wizard',
    initials: 'LJ',
    color: 'pink',
    isOnline: true,
    role: 'EDITOR',
  },
  {
    id: '3',
    name: '박현수',
    nickname: 'Backend Guru',
    initials: 'PH',
    color: 'orange',
    isOnline: false,
    role: 'EDITOR',
  },
  {
    id: '4',
    name: '최유리',
    nickname: 'Design Master',
    initials: 'CY',
    color: 'green',
    isOnline: false,
    role: 'VIEWER',
  },
  {
    id: '5',
    name: '김철수',
    nickname: 'QA Engineer',
    initials: 'KC',
    color: 'orange',
    isOnline: true,
    role: 'VIEWER',
  },
  {
    id: '6',
    name: '이영희',
    nickname: 'DevOps',
    initials: 'LY',
    color: 'pink',
    isOnline: false,
    role: 'EDITOR',
  },
  {
    id: '7',
    name: '박민수',
    nickname: 'Security',
    initials: 'PM',
    color: 'purple',
    isOnline: true,
    role: 'EDITOR',
  },
  {
    id: '8',
    name: '정수진',
    nickname: 'Frontend',
    initials: 'JS',
    color: 'blue',
    isOnline: false,
    role: 'VIEWER',
  },
  {
    id: '9',
    name: '강호동',
    nickname: 'Backend',
    initials: 'KH',
    color: 'green',
    isOnline: true,
    role: 'EDITOR',
  },
  {
    id: '10',
    name: '유재석',
    nickname: 'Fullstack',
    initials: 'YJ',
    color: 'orange',
    isOnline: false,
    role: 'OWNER',
  },
  {
    id: '11',
    name: '신동엽',
    nickname: 'Manager',
    initials: 'SD',
    color: 'pink',
    isOnline: true,
    role: 'EDITOR',
  },
  {
    id: '12',
    name: '아이유',
    nickname: 'Singer',
    initials: 'IU',
    color: 'purple',
    isOnline: false,
    role: 'VIEWER',
  },
];

// Tech Stack Summary
export interface TechStackSummary {
  totalTechStacks: number;
  weeklyChange: number;
  mappedNodes: number;
  mappedNodesChange: number;
  p0Percentage: number;
  p0Count: number;
}

export const mockTechStackSummary: TechStackSummary = {
  totalTechStacks: 24,
  weeklyChange: 3,
  mappedNodes: 156,
  mappedNodesChange: 8,
  p0Percentage: 34,
  p0Count: 13,
};

// Tech Stack Mappings
export interface TechStackMapping {
  nodeId: string;
  confirmedTechs: string[];
  lastUpdated: string;
}

export const mockTechStackMappings: TechStackMapping[] = [
  {
    nodeId: 'task-1',
    confirmedTechs: ['React', 'TypeScript', 'SWR'],
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15분 전
  },
  {
    nodeId: 'task-2',
    confirmedTechs: ['Node.js', 'PostgreSQL', 'JWT'],
    lastUpdated: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1시간 전
  },
  {
    nodeId: 'advanced-4',
    confirmedTechs: ['React.memo', 'useMemo'],
    lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3시간 전
  },
  {
    nodeId: 'advanced-5',
    confirmedTechs: ['Redis'],
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6시간 전
  },
];
