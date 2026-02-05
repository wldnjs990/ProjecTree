import type { AvatarColor } from '@/shared/components/UserAvatar';

// ===== 기타 목데이터 =====

// Mock online users
export interface MockUser {
  id: string;
  initials: string;
  color: AvatarColor;
  isOnline: boolean;
}

export const mockUsers: MockUser[] = [
  { id: '1', initials: 'KM', color: 'blue', isOnline: true },
  { id: '2', initials: 'LJ', color: 'pink', isOnline: true },
  { id: '3', initials: 'PH', color: 'orange', isOnline: false },
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
