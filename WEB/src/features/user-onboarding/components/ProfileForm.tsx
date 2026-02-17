import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Layers,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sprout,
  Home,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { patchMemberSignup, getMemberInfo } from '@/apis';
import { useSetAccessToken, useAccessToken } from '@/shared/stores/authStore';
import { useSetUser } from '@/shared/stores/userStore';
import { parseJwt } from '@/shared/lib/utils';

/**
 * [컴포넌트] 사용자 온보딩 프로필 설정 폼
 * - 닉네임 입력 및 유효성 검사를 처리합니다.
 */
export function ProfileForm() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const setAccessToken = useSetAccessToken();
  const setUser = useSetUser();
  const accessToken = useAccessToken();
  const isSigningUp = useRef(false);

  // 토큰 유효성 및 권한 검사 & 이메일 조회
  useEffect(() => {
    if (isSigningUp.current) return;

    if (!accessToken) {
      // 토큰이 없으면 로그인 페이지로 이동 (Alert 없이 자연스럽게)
      navigate('/login');
      return;
    }

    // Role 확인
    const { role } = parseJwt(accessToken);
    if (role === 'ROLE_USER') {
      alert('이미 가입된 회원입니다.');
      navigate('/workspace-lounge');
      return;
    }

    // 이메일 정보 가져오기 (멤버 정보 조회)
    getMemberInfo()
      .then((info) => {
        setEmail(info.email);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [accessToken, navigate]);

  // 닉네임 유효성 검사 (Local Validation only)
  useEffect(() => {
    if (!nickname) {
      setIsValid(false);
      setErrorMessage('');
      setSuccessMessage('');
      return;
    }

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

    // 모든 로컬 검사 통과 시 성공 상태 설정
    setIsValid(true);
    setSuccessMessage('사용 가능한 닉네임 형식입니다.');
    setErrorMessage('');
  }, [nickname]);

  const handleSave = async () => {
    try {
      if (!isValid || isChecking) return;

      setIsChecking(true);
      isSigningUp.current = true;
      const updatedAccessToken = await patchMemberSignup(nickname);

      if (!updatedAccessToken) {
        throw new Error('토큰을 받지 못했습니다.');
      }

      setAccessToken(updatedAccessToken);
      const user = await getMemberInfo();
      setUser(user);
      navigate('/workspace-lounge');
    } catch (error) {
      setErrorMessage('가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsValid(false);
      isSigningUp.current = false;
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-16">
      <motion.div
        className="w-full max-w-md flex flex-col gap-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="bg-[#0f4c3a] p-2 rounded-lg">
            <Layers className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-[#0f4c3a] tracking-tight">
            ProjecTree
          </span>
          <Link
            to="/"
            className="p-1 -mr-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors ml-auto"
            aria-label="홈으로 이동"
          >
            <Home className="w-6 h-6" />
          </Link>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            프로필 설정 <Sprout className="text-green-600 h-8 w-8" />
          </h2>
          <p className="text-slate-500 text-lg tracking-tight">
            서비스에서 사용할 기본 정보를 입력해주세요
          </p>
        </div>

        <div className="space-y-6">
          {/* Nickname Field */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="nickname"
                className="text-slate-600 font-medium text-sm"
              >
                닉네임
              </Label>
              <span className="text-xs text-slate-400 font-mono">
                {nickname.length} / 16
              </span>
            </div>
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
                    * 한글, 영문, 숫자, 언더스코어(_) 사용 가능
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Email Field (Read-only) */}
          <div className="space-y-3 pt-4">
            <Label className="text-slate-600 font-medium text-sm">이메일</Label>
            <div className="relative">
              <Input
                type="text"
                value={email || '이메일 정보를 불러오는 중...'}
                readOnly
                className="h-12 bg-slate-50 text-slate-500 border-slate-200 pl-11 shadow-inner"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            </div>
            <p className="text-xs text-slate-400 pl-1">
              * 로그인된 계정의 이메일 정보입니다
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
  );
}
