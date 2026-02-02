import { wasApiClient } from '@/apis/client';
import type { AccessTokenPayload } from './types';

/**
 * [타입] 회원 기본 정보 응답
 */
export interface MemberInfoResponse {
  name: string;
  nickname: string;
  email: string;
}

/**
 * [타입] 닉네임 중복 확인 응답
 */
export interface NicknameCheckResponse {
  exist: boolean;
}

/**
 * [타입] API 공통 응답 래퍼
 */
interface ApiResponse<T> {
  message: string;
  data: T;
  code: number;
  success: boolean;
}

/**
 * [API] 회원 기본 정보 조회
 * @param id - 회원 ID
 */
export const getMemberInfo = async (): Promise<MemberInfoResponse> => {
  const response =
    await wasApiClient.get<ApiResponse<MemberInfoResponse>>(`members/me`);
  return response.data.data;
};

/**
 * [API] 회원 이메일 조회
 * @param id - 회원 ID
 */
export const getMemberEmail = async (id: number): Promise<string> => {
  const response = await wasApiClient.get<ApiResponse<{ email: string }>>(
    `members/${id}/email`
  );
  return response.data.data.email;
};

/**
 * [API] 닉네임 변경
 * @param id - 회원 ID
 * @param nickname - 새 닉네임
 */
export const updateNickname = async (
  id: number,
  nickname: string
): Promise<void> => {
  await wasApiClient.put(`members/${id}/nickname`, null, {
    params: { nickname },
  });
};

/**
 * [API] 닉네임 중복 확인
 * @param nickname - 확인할 닉네임
 * @returns 사용 가능 여부
 */
const checkNicknameDuplicate = async (nickname: string): Promise<boolean> => {
  const response = await wasApiClient.get<ApiResponse<NicknameCheckResponse>>(
    'members/nickname-check',
    { params: { nickname } }
  );
  return response.data.data.exist;
};

/**
 * [API] 회원 승격
 * ROLE_GUEST => ROLE_USER로 승격시키는 API
 * USER로 승격시 accessToken 재발급(payload에 담김)
 */
const patchMemberSignup = async (nickname: string): Promise<string | null> => {
  const { data } = await wasApiClient.patch<ApiResponse<AccessTokenPayload>>(
    'auth/members/signup',
    { nickname }
  );

  return data.data.accessToken;
};

/**
 * [API] 회원 탈퇴
 * @param id - 회원 ID
 */
const deleteMember = async (id: number): Promise<void> => {
  await wasApiClient.delete(`members/${id}`);
};

export { checkNicknameDuplicate, patchMemberSignup, deleteMember };
