import type { AvatarColor } from '@/shared/components/UserAvatar';

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
