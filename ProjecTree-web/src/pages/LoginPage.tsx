import { useNavigate } from 'react-router';
import { Layers } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 실제 로그인 로직은 나중에 추가
    navigate('/');
  };

  return (
    <div
      className="flex flex-row justify-center items-center min-h-screen w-full relative"
      style={{
        background: '#FFFFFF',
      }}
    >
      {/* Gradient Background - 격자 패턴 제거 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(238, 242, 255, 0.5) 0%, rgba(238, 242, 255, 0) 50%, #FAFAFA 100%)',
          zIndex: 1,
        }}
      />

      {/* Card Container */}
      <div
        className="flex flex-col items-start relative"
        style={{
          width: '448px',
          maxWidth: '448px',
          background: '#FFFFFF',
          border: '1px solid #E4E4E7',
          boxShadow:
            '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '24px 0px',
          zIndex: 2,
        }}
      >
        {/* Inner Container */}
        <div
          className="flex flex-col items-start"
          style={{
            padding: '32px',
            gap: '32px',
            width: '100%',
          }}
        >
          {/* Logo and Title Container */}
          <div
            className="flex flex-row justify-center items-center"
            style={{
              gap: '8px',
              width: '382px',
              height: '40px',
            }}
          >
            {/* Logo Background */}
            <div
              className="flex flex-row justify-center items-center"
              style={{
                width: '40px',
                height: '40px',
                background: '#4F39F6',
                borderRadius: '8px',
              }}
            >
              {/* Lucide Icon */}
              <Layers size={24} color="#FFFFFF" strokeWidth={2} />
            </div>

            {/* ProjecTree Text */}
            <h2
              className="flex items-center"
              style={{
                width: '111px',
                height: '32px',
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 100,
                fontSize: '24px',
                lineHeight: '32px',
                color: '#18181B',
              }}
            >
              ProjecTree
            </h2>
          </div>

          {/* Heading Container */}
          <div
            className="flex flex-col items-start"
            style={{
              gap: '8px',
              width: '382px',
              height: '60px',
            }}
          >
            {/* Main Heading */}
            <div
              className="flex flex-col items-center w-full"
              style={{
                height: '32px',
              }}
            >
              <h1
                className="flex items-center text-center"
                style={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 100,
                  fontSize: '24px',
                  lineHeight: '32px',
                  color: '#18181B',
                }}
              >
                ProjecTree 시작하기
              </h1>
            </div>

            {/* Subtitle */}
            <div
              className="flex flex-col items-center w-full"
              style={{
                height: '20px',
              }}
            >
              <p
                className="flex items-center text-center"
                style={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 100,
                  fontSize: '13.3px',
                  lineHeight: '20px',
                  color: '#71717B',
                }}
              >
                프로젝트 성공을 위한 여정을 시작하세요.
              </p>
            </div>
          </div>

          {/* Buttons Container */}
          <div
            className="flex flex-col items-start"
            style={{
              gap: '12px',
              width: '382px',
              height: '108px',
            }}
          >
            {/* Google Button */}
            <button
              onClick={handleLogin}
              className="flex flex-row justify-center items-center"
              style={{
                padding: '8px 12px',
                gap: '8px',
                width: '382px',
                height: '48px',
                background: '#FFFFFF',
                border: '1px solid #E4E4E7',
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                borderRadius: '6px',
              }}
            >
              {/* Google Icon - 간단한 SVG 유지 (Google 로고는 특수함) */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 6.67L14.24 6.67C14.32 7.04 14.4 7.41 14.4 7.87C14.4 10.93 12.27 13.33 8 13.33C4.32 13.33 1.33 10.35 1.33 6.67C1.33 2.99 4.32 0 8 0C9.73 0 11.23 0.64 12.37 1.69L10.29 3.77C9.73 3.25 8.93 2.93 8 2.93C5.87 2.93 4.13 4.67 4.13 6.8C4.13 8.93 5.87 10.67 8 10.67C9.87 10.67 11.23 9.6 11.6 8.13L8 8.13L8 6.67Z"
                  fill="#4285F4"
                />
                <path
                  d="M1.45 9.41L3.31 10.93C3.84 12.13 5.07 13 8 13C9.87 13 11.23 12.4 12.37 11.31L10.29 9.23C9.73 9.75 8.93 10.07 8 10.07C6.13 10.07 4.67 8.8 4.13 7.2L1.45 9.41Z"
                  fill="#34A853"
                />
                <path
                  d="M4.13 4.72C3.95 5.17 3.87 5.65 3.87 6.13C3.87 6.61 3.95 7.09 4.13 7.54L1.45 5.33C1.15 5.93 1 6.61 1 7.33C1 8.05 1.15 8.73 1.45 9.33L4.13 7.12L4.13 4.72Z"
                  fill="#FBBC05"
                />
                <path
                  d="M8 0.67C9.73 0.67 11.23 1.31 12.37 2.36L10.29 4.44C9.73 3.92 8.93 3.6 8 3.6C6.13 3.6 4.67 4.87 4.13 6.47L1.45 4.26C2.64 2.31 5.07 0.67 8 0.67Z"
                  fill="#EA4335"
                />
              </svg>

              <span
                className="flex items-center text-center"
                style={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 100,
                  fontSize: '13.8px',
                  lineHeight: '20px',
                  color: '#000000',
                }}
              >
                Google로 계속하기
              </span>
            </button>

            {/* GitHub Button */}
            <button
              onClick={handleLogin}
              className="flex flex-row justify-center items-center"
              style={{
                padding: '8px 12px',
                gap: '8px',
                width: '382px',
                height: '48px',
                background: '#27272A',
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                borderRadius: '6px',
              }}
            >
              {/* GitHub Icon - 간단한 SVG 유지 */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                  fill="#FFFFFF"
                />
              </svg>

              <span
                className="flex items-center text-center"
                style={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 100,
                  fontSize: '13.9px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                }}
              >
                GitHub로 계속하기
              </span>
            </button>
          </div>

          {/* Terms Text */}
          <div
            className="flex flex-col items-center"
            style={{
              width: '382px',
              height: '39px',
            }}
          >
            <p
              className="flex items-center text-center"
              style={{
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 100,
                fontSize: '11.4px',
                lineHeight: '20px',
                color: '#71717B',
              }}
            >
              계속 진행하면 ProjecTree의 이용약관 및 개인정보처리방침에 동의하는
              것으로 간주 합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
