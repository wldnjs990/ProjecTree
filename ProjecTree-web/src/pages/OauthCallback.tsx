// React 예시 (OAuthCallback.jsx)
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. URL에서 token 파라미터 추출
    const accessToken = searchParams.get('token');

    if (accessToken) {
      // 2. 로컬 스토리지나 상태 관리(Zustand, Redux)에 저장
      localStorage.setItem('accessToken', accessToken);

      // 3. 로그인 완료 후 메인 페이지로 이동
      navigate('/');
    } else {
      // 실패 처리
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return <div>로그인 처리 중...</div>;
};

export default OAuthCallback;
