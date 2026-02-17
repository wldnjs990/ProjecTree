import { wasApiClient } from '@/shared/lib/axiosClient';
import type { ApiResponse } from './types';

// ============================================
// 역할(Role) 상수 정의
// ============================================

/**
 * 팀 멤버 역할 Enum
 */
export const TeamRole = {
  OWNER: 'OWNER',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
} as const;

export type TeamRoleType = (typeof TeamRole)[keyof typeof TeamRole];

// ============================================
// Request 타입 정의
// ============================================

/**
 * [타입] 멤버 초대 요청
 */
export interface InviteMemberRequest {
  workspaceId: number;
  chatRoomId: string;
  email: string;
  role: TeamRoleType;
}

/**
 * [타입] 멤버 역할 변경 요청
 */
export interface ChangeMemberRoleRequest {
  workspaceId: number;
  targetMemberId: number;
  role: TeamRoleType;
}

// ============================================
// Response 타입 정의
// ============================================

/**
 * [타입] 멤버 초대 응답
 */
export interface InviteMemberResponse {
  id: number;
  email: string;
  nickname: string;
  role: TeamRoleType;
}

// ============================================
// API 함수
// ============================================

/**
 * [API] 멤버 초대
 * 워크스페이스에 새로운 멤버를 초대합니다.
 *
 * @param request - 초대 요청 데이터
 * @returns 초대된 멤버 정보
 *
 * @note Method가 Swagger에 미표기되어 POST로 추정
 */
export const inviteMember = async (
  request: InviteMemberRequest
): Promise<InviteMemberResponse> => {
  try {
    const response = await wasApiClient.post<ApiResponse<InviteMemberResponse>>(
      'teams/invite',
      request
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * [API] 팀원 역할 변경
 * 워크스페이스 팀원의 역할을 수정합니다.
 *
 * @param request - 역할 변경 요청 데이터
 *
 * @note Method: PATCH (Swagger 확인됨)
 */
export const changeMemberRole = async (
  request: ChangeMemberRoleRequest
): Promise<void> => {
  try {
    await wasApiClient.patch<ApiResponse<unknown>>('teams', request);
  } catch (error) {
    throw error;
  }
};

// ============================================
// 역할 표시용 유틸리티
// ============================================

/**
 * 역할을 한글로 변환
 */
export const getRoleLabel = (role: TeamRoleType): string => {
  const labels: Record<TeamRoleType, string> = {
    [TeamRole.OWNER]: '관리자',
    [TeamRole.EDITOR]: '편집자',
    [TeamRole.VIEWER]: '열람자',
  };
  return labels[role];
};
