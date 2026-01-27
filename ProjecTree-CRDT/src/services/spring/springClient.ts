import axios from "axios";

const SPRING_BASE_URL = process.env.SPRING_BASE_URL;
const SERVICE_TOKEN = process.env.SPRING_SERVICE_TOKEN;

if (!SPRING_BASE_URL || !SERVICE_TOKEN) {
  throw new Error("Spring 연동 환경 변수가 설정되지 않았습니다.");
}

export const springClient = axios.create({
  baseURL: SPRING_BASE_URL,
  timeout: 5000,
  // TODO: JWT 추가시 헤더 설정
  // headers: {
  // Authorization: `Bearer ${SERVICE_TOKEN}`,
  // "Content-Type": "application/json",
  // },
});
