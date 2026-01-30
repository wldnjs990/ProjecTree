import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Layers, Lock, CheckCircle2, AlertCircle, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { checkNicknameDuplicate } from '@/apis/member.api';
import { patchMemberSignup } from '@/apis/oauth.api';
import { useSetAccessToken, useAccessToken } from '@/stores/authStore';
import { parseJwt } from '@/lib/utils';

export default function UserOnboardingPage() {
  const [nickname, setNickname] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState(false); // 유효성 검사 통과 여부
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지

  const navigate = useNavigate();
  const setAccessToken = useSetAccessToken();
  const accessToken = useAccessToken();

  // 토큰 유효성 및 권한 검사 (페이지 진입 시)
  useEffect(() => {
    if (!accessToken) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/login');
      return;
    }

    // Role 확인: ROLE_USER라면 이미 온보딩 완료한 유저이므로 라운지로 이동
    const { role } = parseJwt(accessToken);
    if (role === 'ROLE_USER') {
      alert('이미 가입된 회원입니다.');
      navigate('/workspace-lounge');
    }
  }, [accessToken, navigate]);

  // 닉네임 유효성 검사 및 중복 확인 (Debounce 500ms)
  useEffect(() => {
    // 1. 입력이 없으면 초기화
    if (!nickname) {
      setIsValid(false);
      setErrorMessage('');
      setSuccessMessage('');
      return;
    }

    // 2. 유효성 검사 (길이, 정규식)
    if (nickname.length > 16) {
      setIsValid(false);
      setErrorMessage('닉네임은 16자 이내여야 합니다.');
      setSuccessMessage('');
      return;
    }

    const regex = /^[a-zA-Z0-9가-힣_]+$/;
    if (!regex.test(nickname)) {
      setIsValid(false);
      setErrorMessage('한글, 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.');
      setSuccessMessage('');
      return;
    }

    // 3. 중복 확인 API 호출 (Debounce)
    const checkDuplicate = async () => {
      setIsChecking(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        const isDuplicate = await checkNicknameDuplicate(nickname);
        if (isDuplicate) {
          setIsValid(false);
          setErrorMessage('이미 사용 중인 닉네임입니다.');
        } else {
          setIsValid(true);
          setSuccessMessage('사용 가능한 닉네임입니다.');
        }
      } catch (error) {
        console.error('중복 확인 에러:', error);
        setIsValid(false);
        setErrorMessage('중복 확인 중 오류가 발생했습니다.');
      } finally {
        setIsChecking(false);
      }
    };

    const timer = setTimeout(checkDuplicate, 500);

    return () => clearTimeout(timer);
  }, [nickname]);

  const handleSave = async () => {
    // TODO: 프로필 정보 저장 API 연결 필요
    console.log('저장된 닉네임:', nickname);
    const updatedAccessToken = await patchMemberSignup(nickname);
    if (!updatedAccessToken) {
      console.error('토큰을 못 받았습니다.');
      return;
    }
    // ROLE_USER로 승격된 토큰 업데이트
    setAccessToken(updatedAccessToken);
    navigate('/workspace-lounge');
  };

  return (
    <div className="flex min-h-screen w-full font-sans text-slate-900 font-normal bg-white">
      {/* 1. Left Panel (Brand Area) - Organic Waves */}
      <motion.div
        className="hidden lg:flex flex-col justify-between w-2/5 min-w-[400px] max-w-[600px] p-16 relative overflow-hidden"
        style={{
          backgroundColor: '#0f4c3a', // Brand Dark Green
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Organic Wave Layer 1 (Back) */}
        <div
          className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23145d48' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z' /%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
        />

        {/* Organic Wave Layer 2 (Middle) */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none opacity-60"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%231a6e56' d='M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z' /%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
        />

        {/* Organic Wave Layer 3 (Front) */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none opacity-80"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23207f63' d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z' /%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
            <Layers className="text-white h-7 w-7" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            ProjecTree
          </span>
        </div>

        {/* Hero Content */}
        <motion.div
          className="z-10 flex flex-col justify-center h-full max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight tracking-tight break-keep">
            함께 성장할 <br />
            <span className="text-green-300">첫 걸음</span>을 떼어보세요.
          </h1>
          <p className="text-green-100 text-lg leading-relaxed tracking-tight break-keep">
            프로필을 설정하고 팀원들과 더 나은 협업을 시작하세요.
            <br />
            작은 씨앗이 모여 숲이 됩니다.
          </p>
        </motion.div>

        {/* Footer */}
        <div className="z-10 text-green-200/60 text-sm tracking-tight">
          © 2026 ProjecTree. All rights reserved.
        </div>
      </motion.div>

      {/* 2. Right Panel (Form Area) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-16">
        <motion.div
          className="w-full max-w-md flex flex-col gap-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-[#0f4c3a] p-2 rounded-lg">
              <Layers className="text-white h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-[#0f4c3a] tracking-tight">
              ProjecTree
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              프로필 설정 <Sprout className="text-green-600 h-8 w-8" />
            </h2>
            <p className="text-slate-500 text-lg tracking-tight">
              서비스에서 사용할 기본 정보를 입력해주세요.
            </p>
          </div>

          <div className="space-y-6">
            {/* Nickname Field */}
            <div className="space-y-3">
              <Label
                htmlFor="nickname"
                className="text-slate-600 font-medium text-sm"
              >
                닉네임
              </Label>
              <div className="group relative">
                <div className="relative">
                  <Input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="사용하실 닉네임을 입력하세요"
                    maxLength={16}
                    className={`h-12 text-base pr-12 transition-all ${
                      errorMessage
                        ? 'border-red-500 focus-visible:ring-red-500 bg-red-50/10'
                        : successMessage
                          ? 'border-green-500 focus-visible:ring-green-500 bg-green-50/10'
                          : 'border-slate-200 hover:border-slate-300'
                    }`}
                  />
                  {/* Status Indicator Icon */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    {isChecking ? (
                      <div className="h-5 w-5 border-2 border-slate-200 border-t-[var(--figma-tech-green)] rounded-full animate-spin" />
                    ) : successMessage ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 animate-in zoom-in spin-in-90 duration-300" />
                    ) : errorMessage ? (
                      <AlertCircle className="h-5 w-5 text-red-500 animate-in zoom-in duration-300" />
                    ) : null}
                  </div>
                </div>

                {/* Validation Messages */}
                <div className="absolute top-full left-0 mt-1.5 pl-1 w-full overflow-hidden">
                  {errorMessage ? (
                    <p className="text-sm font-medium text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1 fade-in duration-300">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errorMessage}
                    </p>
                  ) : successMessage ? (
                    <p className="text-sm font-medium text-green-600 flex items-center gap-1.5 animate-in slide-in-from-top-1 fade-in duration-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {successMessage}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      * 한글, 영문, 숫자, 언더스코어(_) 사용 가능 (최대 16자)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Email Field (Read-only) */}
            <div className="space-y-3 pt-4">
              <Label className="text-slate-600 font-medium text-sm">
                이메일
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  value="user@ssafy.com"
                  readOnly
                  className="h-12 bg-slate-50 text-slate-500 border-slate-200 pl-11 shadow-inner"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              </div>
              <p className="text-xs text-slate-400 pl-1">
                * 이메일은 변경할 수 없습니다.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSave}
              disabled={!isValid || isChecking}
              className="w-full h-14 text-lg font-bold mt-8 bg-[#0f4c3a] hover:bg-[#0a3a2a] text-white shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:shadow-none transition-all hover:-translate-y-1"
            >
              {isChecking ? '확인 중...' : '저장하고 시작하기'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
