import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@/styles/index.css';

const USE_MSW = false; // 실제 서버 쓸 때 false로 변경

(async () => {
  const container = document.getElementById('root');
  if (!container) return; // 방어 코드

  // 1. MSW 모드일 때
  if (import.meta.env.DEV && USE_MSW) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });

    createRoot(container).render(<App />);
    return;
  }

  // 2. 실제 서버 모드일 때 (위에서 return 안 됐으면 실행)
  createRoot(container).render(<App />);
})();
