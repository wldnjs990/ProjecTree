import { useUserStore } from '@/shared/stores/userStore';
import type { AccessTokenPayload, ApiResponse } from './types';
import wasApiClient from './client';
import { useAuthStore } from '@/shared/stores/authStore';

const redirectURL = `${window.location.origin}/oauth/callback`;

/**
 * 구글 로그인
 */
const redirectToGoogleOauth = () => {
  const BASE_URL = import.meta.env.VITE_OAUTH_URL;
  window.location.href = `${BASE_URL}/oauth2/authorization/google?redirectURL=${redirectURL}`;
};

/**
 * 깃허브 로그인
 */
const redirectToGithubOauth = () => {
  const BASE_URL = import.meta.env.VITE_OAUTH_URL;
  window.location.href = `${BASE_URL}/oauth2/authorization/github?redirectURL=${redirectURL}`;
};

/**
 * 토큰 가져오기
 * oauth 로그인 후, 쿼리 파라미터로 전달받는 code값을 서버로 보내 토큰을 받아옴
 * refresh는 헤더 쿠키에, access는 body에 받아짐
 */
const getToken = async (code: string): Promise<string | null> => {
  const { data } = await wasApiClient.get<ApiResponse<AccessTokenPayload>>(
    `auth/token?code=${code}`
  );
  return data.data.accessToken;
};

/**
 * 토큰 재발급
 */
const refreshToken = async (): Promise<string | null> => {
  const { data } =
    await wasApiClient.post<ApiResponse<AccessTokenPayload>>(`auth/refresh`);
  return data.data.accessToken;
};

/**
 * 로그아웃
 * 현재는 블랙리스트 등록하지 않고 토큰 제거로만 구현
 * TODO : 로그아웃 API 제작되면 연동
 */
const logout = async () => {
  useAuthStore.getState().clearAccessToken();
  useUserStore.getState().clearUser();
};

export {
  redirectToGoogleOauth,
  redirectToGithubOauth,
  getToken,
  logout,
  refreshToken,
};
