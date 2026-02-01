import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Layers, Lock, CheckCircle2, AlertCircle, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { checkNicknameDuplicate, patchMemberSignup } from '@/apis/member.api';
import { useSetAccessToken, useAccessToken } from '@/shared/stores/authStore';
import { parseJwt } from '@/shared/lib/utils';

/**
 * [컴포넌트] 사용자 온보딩 프로필 설정 폼
 * - 닉네임 입력 및 유효성 검사를 처리합니다.
 */
export function ProfileForm() {
  const [nickname, setNickname] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    const updatedAccessToken = await patchMemberSignup(nickname);
    if (!updatedAccessToken) {
      console.error('토큰을 못 받았습니다.');
      return;
    }
    setAccessToken(updatedAccessToken);
    navigate('/workspace-lounge');
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
            <Label className="text-slate-600 font-medium text-sm">이메일</Label>
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
  );
}
