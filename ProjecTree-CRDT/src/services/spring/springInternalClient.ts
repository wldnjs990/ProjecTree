import axios from "axios";

import {
  getInternalToken,
  invalidateInternalToken,
} from "../../auth/internalTokenManager";

const SPRING_BASE_URL = process.env.SPRING_BASE_URL;

if (!SPRING_BASE_URL) {
  throw new Error("Spring 연동 환경 변수가 설정되지 않았습니다.");
}

export const springInternalClient = axios.create({
  baseURL: SPRING_BASE_URL,
  timeout: 5000,
});

springInternalClient.interceptors.request.use(async (config) => {
  const token = await getInternalToken();
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

springInternalClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const original = error.config;

    if (status === 401 && !original._retried) {
      original._retried = true;

      invalidateInternalToken();

      await getInternalToken();
      return springInternalClient(original);
    }

    throw error;
  },
);
