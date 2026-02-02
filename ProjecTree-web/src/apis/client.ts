import { useAuthStore } from '@/shared/stores/authStore';
import { useUserStore } from '@/shared/stores/userStore';
import axios from 'axios';
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { AccessTokenPayload, ApiResponse } from './types';

const BASE_URL = import.meta.env.VITE_API_URL;
const MAX_RETRY = 3;

// 재시도 카운트를 포함한 config 타입
type RequestConfigWithRetry = InternalAxiosRequestConfig & {
  _retryCount?: number;
};

// 토큰 갱신 중복 방지
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

export const wasApiClient = axios.create({
  baseURL: BASE_URL,
  // 네트워크 타임아웃 시간(600초 - AI때문에 임시 처리)
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// 로그아웃 처리
const handleAuthFailure = () => {
  useAuthStore.getState().clearAccessToken();
  useUserStore.getState().clearUser();
  pendingRequests = [];
  isRefreshing = false;
  window.location.href = '/';
};

// Request Interceptor
wasApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // accessToken 있으면 요청 보낼때 마다 헤더에 토큰 담아서 보내기
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
wasApiClient.interceptors.response.use(
  async (response: AxiosResponse) => {
    const data = response.data as ApiResponse<unknown>;
    const config = response.config as RequestConfigWithRetry;

    if (data.success) return response;

    // AccessToken 만료 (60408)
    if (data.code === 60408) {
      const isRefreshRequest = config.url?.includes('auth/refresh');
      const retryCount = config._retryCount ?? 0;

      // refresh 요청 실패 또는 재시도 횟수 초과 → 로그아웃
      if (isRefreshRequest || retryCount >= MAX_RETRY) {
        handleAuthFailure();
        return Promise.reject(new Error('인증이 만료되었습니다.'));
      }

      // 이미 토큰 갱신 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((newToken: string) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            config._retryCount = retryCount + 1;
            resolve(wasApiClient(config));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data: refreshData } =
          await wasApiClient.post<ApiResponse<AccessTokenPayload>>(
            'auth/refresh'
          );

        const newToken = refreshData.data.accessToken;

        if (newToken) {
          useAuthStore.getState().setAccessToken(newToken);

          // 대기 중인 요청들 처리
          pendingRequests.forEach((callback) => callback(newToken));
          pendingRequests = [];

          // 원래 요청 재시도
          config.headers.Authorization = `Bearer ${newToken}`;
          config._retryCount = retryCount + 1;
          return wasApiClient(config);
        } else {
          handleAuthFailure();
          return Promise.reject(new Error('토큰 갱신 실패'));
        }
      } catch {
        handleAuthFailure();
        return Promise.reject(new Error('토큰 갱신 실패'));
      } finally {
        isRefreshing = false;
      }
    }

    return response;
  },
  (error: AxiosError) => {
    // 네트워크 에러 또는 타임아웃
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        console.error('[API] 요청 시간 초과');
      } else {
        console.error('[API] 네트워크 연결 오류');
      }
      return Promise.reject(error);
    }

    const { status } = error.response;

    switch (status) {
      case 400:
        console.error('[API] 잘못된 요청입니다.');
        break;
      case 401:
        console.error('[API] 인증이 필요합니다.');
        // 로그인 페이지로 리다이렉트(임시)
        break;
      case 403:
        console.error('[API] 접근 권한이 없습니다.');
        break;
      case 404:
        console.error('[API] 요청한 리소스를 찾을 수 없습니다.');
        break;
      case 500:
        console.error('[API] 서버 오류가 발생했습니다.');
        break;
      default:
        console.error(`[API] 오류 발생: ${status}`);
    }

    return Promise.reject(error);
  }
);

export default wasApiClient;
