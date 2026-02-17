import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * [MSW] Service Worker 설정
 * - 위에서 정의한 'handlers'(가짜 API들)를 바탕으로 워커를 생성합니다.
 * - 이 워커가 브라우저의 네트워크 요청을 감시하고 있다가, handlers에 정의된 요청이 오면 가로챕니다.
 */
export const worker = setupWorker(...handlers);
