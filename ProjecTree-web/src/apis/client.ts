import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://projectree-was:8080/api/';

export const wasApiClient = axios.create({
  baseURL: BASE_URL,
  // 네트워크 타임아웃 시간(10초)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor
wasApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: 토큰 추가 로직
    // const token = localStorage.getItem('accessToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
wasApiClient.interceptors.response.use(
  (response) => {
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
        // TODO : zustand 전역변수 등에 저장해 navigation으로 리다이렉트 처리 필요
        window.location.href = '/login';
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
