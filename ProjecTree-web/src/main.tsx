/**
 * [추후 실제 서버 연동 가이드]
 * 
 * Q. 백엔드 API가 개발되어서 이제 가짜(MSW) 말고 진짜 서버와 통신하고 싶다면?
 * A. 아래 `enableMocking` 함수 호출 부분을 주석 처리하면 됩니다.
 * 
 * 예시:
 * // enableMocking().then(() => { ... });
 * createRoot(document.getElementById('root')!).render(<App />);
 * 
 * 이렇게 하면 앱이 시작될 때 MSW가 켜지지 않으므로, 모든 요청이 실제 서버로 날아갑니다.
 * (배포 시에는 `import.meta.env.DEV` 체크 덕분에 자동으로 꺼지므로 걱정 안 하셔도 됩니다!)
 */
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@/styles/index.css';

/**
 * [MSW] 모킹 활성화 함수
 * - React 앱이 시작되기 전에 호출되어야 합니다.
 * - 개발 환경(DEV)일 때만 가짜 서버(Worker)를 켜서 API를 모킹합니다.
 */
async function enableMocking() {
  // 개발 환경(development)이 아닐 경우(예: 배포 환경)에는
  // 즉시 Promise를 완료시켜서 바로 앱이 렌더링되게 합니다.
  if (!import.meta.env.DEV) {
    return Promise.resolve();
  }

  // 모킹 설정 파일 가져오기
  const { worker } = await import('./mocks/browser');

  // 가짜 서버(Service Worker) 시작!
  // onUnhandledRequest: 'bypass' -> 모킹하지 않은 API 요청은 무시하고 실제 서버로 보냄 (경고 에러 방지)
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

// 1. 모킹 설정이 끝난 후에 -> 2. React 앱을 렌더링합니다.
// enableMocking이 항상 Promise를 반환하므로, 개발/배포 환경 모두 안전하게 렌더링됩니다.
// enableMocking().then(() => {
//   createRoot(document.getElementById('root')!).render(<App />);
// });

// Web RTC 테스트 할 때 위 enableMocking().then(...) 부분을 주석 처리하고 아래 라인 주석 풀고 실행
createRoot(document.getElementById('root')!).render(<App />);
