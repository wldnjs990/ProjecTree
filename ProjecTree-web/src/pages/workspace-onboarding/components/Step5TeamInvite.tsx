import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TeamMember {
  email: string;
  role: string;
}

interface Step5TeamInviteProps {
  data: {
    teamMembers: TeamMember[];
  };
  onChange: (updates: Partial<Step5TeamInviteProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step5TeamInvite({
  data,
  onChange,
  // onNext,
  // onPrev,
}: Step5TeamInviteProps) {
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('편집자 - 편집 가능');
  const [emailError, setEmailError] = useState('');

  // 이메일 유효성 검사 함수
  const validateEmail = (email: string): boolean => {
    // 빈 값 체크
    if (!email.trim()) {
      setEmailError('');
      return false;
    }

    // 이메일 형식 정규식 (RFC 5322 기반 간소화 버전)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다');
      return false;
    }

    // 중복 이메일 체크
    const isDuplicate = data.teamMembers.some(
      (member) => member.email.toLowerCase() === email.toLowerCase()
    );

    if (isDuplicate) {
      setEmailError('이미 초대된 이메일입니다');
      return false;
    }

    setEmailError('');
    return true;
  };

  // 이메일 입력 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setMemberEmail(email);

    // 실시간 유효성 검사 (입력 중일 때는 형식만 체크)
    if (email.trim()) {
      validateEmail(email);
    } else {
      setEmailError('');
    }
  };

  const handleInviteMember = () => {
    // 최종 유효성 검사
    if (!validateEmail(memberEmail)) {
      return;
    }

    const newMember: TeamMember = {
      email: memberEmail.trim(),
      role: memberRole,
    };
    onChange({ teamMembers: [...data.teamMembers, newMember] });
    setMemberEmail('');
    setMemberRole('편집자 - 편집 가능');
    setEmailError('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-['Pretendard'] font-bold text-[22px] leading-tight tracking-[-0.02em] text-[#1A1A1A]">
          팀 초대
        </h2>
        <p className="font-['Pretendard'] font-medium text-[15px] text-[#757575]">
          팀원을 초대하세요
        </p>
      </div>

      {/* 폼 필드 */}
      <div className="flex flex-col gap-6">
        {/* 이메일 초대 */}
        <div className="flex flex-col gap-4">
          <h3 className="font-['Pretendard'] font-medium text-[15px] leading-5 text-[var(--figma-text-cod-gray)]">
            이메일 초대
          </h3>

          <div className="flex flex-col gap-2">
            <Input
              type="email"
              placeholder="name@company.com"
              value={memberEmail}
              onChange={handleEmailChange}
              className={`h-[44px] px-3 py-[12.5px] bg-white shadow-sm rounded-md font-['Pretendard'] font-normal text-[14px] leading-4 focus-visible:ring-[var(--figma-forest-primary)] focus-visible:border-[var(--figma-forest-primary)] transition-all
                ${emailError ? 'border-[var(--figma-required-crimson)]' : 'border-[var(--figma-border-mercury)] hover:border-[var(--figma-forest-accent)]'}`}
            />
            {emailError && (
              <span className="font-['Pretendard'] font-normal text-xs leading-4 text-[var(--figma-required-crimson)]">
                {emailError}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-['Pretendard'] font-medium text-[13.1px] leading-[14px] text-[var(--figma-text-cod-gray)]">
              권한
            </Label>
            <Select value={memberRole} onValueChange={setMemberRole}>
              <SelectTrigger className="h-[44px] bg-white border-[var(--figma-border-mercury)] shadow-sm rounded-md font-['Pretendard'] font-normal text-[14px] hover:border-[var(--figma-forest-accent)] transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="편집자 - 편집 가능">
                  편집자 - 편집 가능
                </SelectItem>
                <SelectItem value="뷰어 - 보기만 가능">
                  뷰어 - 보기만 가능
                </SelectItem>
                <SelectItem value="관리자 - 모든 권한">
                  관리자 - 모든 권한
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className={`w-full h-[44px] font-['Pretendard'] font-normal text-[13.2px] leading-5 rounded-md border-none transition-colors
              ${
                !memberEmail.trim() || !!emailError
                  ? 'bg-[var(--figma-gray-concrete)] text-[var(--figma-text-emperor)] cursor-not-allowed'
                  : 'bg-[var(--figma-forest-primary)] text-[var(--figma-white)] hover:bg-[#1B5E20]'
              }`}
            onClick={handleInviteMember}
            disabled={!memberEmail.trim() || !!emailError}
          >
            초대 메일 보내기
          </Button>
        </div>

        {/* 초대된 팀원 목록 */}
        {data.teamMembers.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label className="font-['Pretendard'] font-medium text-[13.1px] leading-[14px] text-[var(--figma-text-cod-gray)]">
              초대된 팀원
            </Label>
            <div className="max-h-[130px] overflow-y-auto chat-scrollbar pr-1 flex flex-col gap-2">
              {data.teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded p-2 bg-white border border-[var(--figma-border-mercury)] shadow-sm shrink-0"
                >
                  <span className="font-['Pretendard'] font-normal text-[13px] text-[var(--figma-text-cod-gray)]">
                    {member.email}
                  </span>
                  <span className="font-['Pretendard'] font-normal text-[13px] text-[var(--figma-text-emperor)]">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
