import type { ApiResponse } from './api.type';
import wasApiClient from './client';
import { useAuthStore } from '@/stores/authStore';

const redirectURL = `${window.location.origin}/oauth/callback`;

const redirectToGoogleOauth = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  alert(`${BASE_URL}oauth2/authorization/google?redirectURL=${redirectURL}`);
  window.location.href = `${BASE_URL}oauth2/authorization/google?redirectURL=${redirectURL}`;
};

const redirectToGithubOauth = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  window.location.href = `${BASE_URL}oauth2/authorization/github?redirectURL=${redirectURL}`;
};

interface AccessTokenPayload {
  accessToken: string | null;
}
/**
 * 토큰 가져오기
 * oauth 로그인 후, 쿼리 파라미터로 전달받는 code값을 서버로 보내 토큰을 받아옴
 * refresh는 헤더 쿠키에, access는 body에 받아짐
 */
const getToken = async (code: string): Promise<string | null> => {
  const { data, headers } = await wasApiClient.get<
    ApiResponse<AccessTokenPayload>
  >(`auth/token?code=${code}`);
  console.log(headers);
  return data.data.accessToken;
};

/**
 * 회원 승격
 * ROLE_GUEST => ROLE_USER로 승격시키는 API
 * USER로 승격시 accessToken 재발급(payload에 담김)
 */
const patchMemberSignup = async (nickname: string): Promise<string | null> => {
  console.log('!');
  const accessToken = useAuthStore.getState().accessToken;
  console.log(accessToken);
  const { data } = await wasApiClient.patch<ApiResponse<AccessTokenPayload>>(
    'auth/members/signup',
    { nickname }
  );
  console.log('?');
  console.log(data);

  return data.data.accessToken;
};

export {
  redirectToGoogleOauth,
  redirectToGithubOauth,
  getToken,
  patchMemberSignup,
};
