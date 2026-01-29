// React 예시 (OAuthCallback.jsx)
import { getToken } from '@/apis/oauth.api';
import { useSetAccessToken } from '@/stores/authStore';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // auth store selector hook
  const setAccessToken = useSetAccessToken();

  useEffect(() => {
    // 1. URL에서 token 파라미터 추출(서버 요청 code값)
    const code = searchParams.get('code');
    if (code) {
      // 2. 토큰 저장 함수 실행(즉시실행 함수)
      (async () => {
        // was 서버에 토큰값 요청
        const accessToken = await getToken(code);
        if (!accessToken) {
          console.error('토큰값을 못 받았습니다.');
          return;
        }
        // zustand store에 accessToken 저장
        await setAccessToken(accessToken);

        // jwt 파싱 함수
        // TODO : 유틸 함수로 분리할지 고민
        const parseJwt = (token: string) => {
          const payload = token.split('.')[1];
          const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
          return JSON.parse(decoded);
        };

        // 유저인지 게스트인지 구분
        const isUser = parseJwt(accessToken).role === 'ROLE_USER';

        // 유저라면 메인 페이지 이동, 게스트라면 유저 온보딩 페이지 이동
        if (isUser) {
          navigate('/');
        } else {
          navigate('/user-onboarding');
        }
      })();
    } else {
      // 실패 처리
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return <div>로그인 처리 중...</div>;
};

export default OAuthCallback;
