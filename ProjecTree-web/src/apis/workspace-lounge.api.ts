import { wasApiClient } from '@/apis/client';

/**
 * [타입] 워크스페이스 진행률 정보
 */
export interface WorkspaceProgress {
  p0: { total: number; completed: number };
  p1: { total: number; completed: number };
  p2: { total: number; completed: number };
}

/**
 * [타입] 워크스페이스 라운지 API 응답 (백엔드 명세)
 */
export interface WorkspaceLoungeResponse {
  workspaceId: number;
  name: string;
  description: string;
  totalNodes: number;
  totalCompletedNodes: number;
  totalMembers: number;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  progress: WorkspaceProgress;
  updatedAt: string;
  createdAt?: string; // Optional if backend doesn't support it yet
}

/**
 * [타입] 프론트엔드 워크스페이스 카드 데이터
 */
export interface WorkspaceCardData {
  id: string;
  title: string;
  description: string;
  role: 'Owner' | 'Editor' | 'Viewer';
  progressP0: number;
  progressP1: number;
  progressP2: number;
  lastModified: string;
  lastCreated: string;
  updatedAt: string;
  createdAt: string;
  members: { name: string; avatar: string }[];
}

/**
 * 진행률 계산 (completed / total * 100)
 */
const calculateProgress = (data: {
  total: number;
  completed: number;
}): number => {
  if (data.total === 0) return 0;
  return Math.round((data.completed / data.total) * 100);
};

/**
 * 역할 변환 (OWNER -> Owner)
 */
const convertRole = (
  role: 'OWNER' | 'EDITOR' | 'VIEWER'
): 'Owner' | 'Editor' | 'Viewer' => {
  const roleMap: Record<string, 'Owner' | 'Editor' | 'Viewer'> = {
    OWNER: 'Owner',
    EDITOR: 'Editor',
    VIEWER: 'Viewer',
  };
  return roleMap[role] || 'Viewer';
};

/**
 * 상대 시간 변환 (updatedAt -> "2시간 전")
 */
const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return '';
  // UTC 시간으로 처리 (KST +9시간 보정)
  const isUTC = dateString.endsWith('Z') || dateString.includes('+');
  const date = new Date(isUTC ? dateString : `${dateString}Z`);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  return date.toLocaleDateString('ko-KR');
};

/**
 * API 응답을 프론트엔드 형식으로 변환
 */
const transformWorkspace = (
  workspace: WorkspaceLoungeResponse
): WorkspaceCardData => {
  const createdDate = workspace.createdAt || workspace.updatedAt;

  return {
    id: String(workspace.workspaceId),
    title: workspace.name,
    description: workspace.description,
    role: convertRole(workspace.role),
    progressP0: calculateProgress(workspace.progress.p0),
    progressP1: calculateProgress(workspace.progress.p1),
    progressP2: calculateProgress(workspace.progress.p2),
    lastModified: formatRelativeTime(workspace.updatedAt),
    lastCreated: formatRelativeTime(createdDate),
    updatedAt: workspace.updatedAt,
    createdAt: createdDate,
    members: Array.from({ length: workspace.totalMembers }, (_, i) => ({
      name: `멤버${i + 1}`,
      avatar: '',
    })),
  };
};

/**
 * [API] 내가 속한 워크스페이스 목록 조회
 * @returns 워크스페이스 카드 데이터 배열
 */
export interface WorkspaceLoungeApiResponse {
  message: string;
  data: WorkspaceLoungeResponse[];
  code: number;
  success: boolean;
}

export const getMyWorkspaces = async (): Promise<WorkspaceCardData[]> => {
  const response =
    await wasApiClient.get<WorkspaceLoungeApiResponse>(`/workspaces/my`);

  return response.data.data.map(transformWorkspace);
};
