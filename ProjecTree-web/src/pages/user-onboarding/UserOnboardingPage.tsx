import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock } from 'lucide-react';

export default function UserOnboardingPage() {
  const [nickname, setNickname] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const handleDuplicateCheck = () => {
    setIsChecking(true);
    // TODO: 백엔드 닉네임 중복 확인 API 연결 필요
    // 지금은 1초 뒤에 사용 가능하다고 가정
    setTimeout(() => {
      setIsChecking(false);
      alert('사용 가능한 닉네임입니다!');
    }, 1000);
  };

  const handleSave = () => {
    // TODO: 프로필 정보 저장 API 연결 필요
    console.log('저장된 닉네임:', nickname);
    navigate('/workspaceLounge');
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: '#FFFFFF' }}
    >
      <div
        className="flex flex-col items-center"
        style={{ width: '400px', gap: '48px' }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: 'Roboto',
            fontWeight: 400,
            fontSize: '24px',
            color: '#18181B',
            textAlign: 'center',
          }}
        >
          프로필 설정
        </h1>

        {/* Form Container */}
        <div className="flex w-full flex-col gap-6">
          {/* 닉네임 필드 */}
          <div className="flex flex-col gap-2">
            <label
              style={{
                fontSize: '13px',
                color: '#71717B',
                fontFamily: 'Roboto',
              }}
            >
              닉네임
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력해주세요"
                className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                style={{ height: '44px' }}
              />
              <button
                onClick={handleDuplicateCheck}
                disabled={!nickname}
                className="whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                style={{ height: '44px' }}
              >
                {isChecking ? '확인 중...' : '중복 확인'}
              </button>
            </div>
          </div>

          {/* 이메일 필드 */}
          <div className="flex flex-col gap-2">
            <label
              style={{
                fontSize: '13px',
                color: '#71717B',
                fontFamily: 'Roboto',
              }}
            >
              이메일
            </label>
            <div className="relative">
              <input
                type="text"
                value="user@ssafy.com"
                readOnly
                className="w-full rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-400 outline-none"
                style={{ height: '44px' }}
              />
              <Lock
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>

          {/* 저장 후 계속 버튼 */}
          <button
            onClick={handleSave}
            className="mt-4 w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={!nickname}
          >
            저장 후 계속
          </button>
        </div>
      </div>
    </div>
  );
}
