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
import type { Role } from '@/apis/workspace.api';

interface Step5TeamInviteProps {
  data: {
    memberRoles: Record<string, Role>;
  };
  onChange: (updates: Partial<Step5TeamInviteProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step5TeamInvite({
  data,
  onChange,
}: Step5TeamInviteProps) {
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<Role>('EDITOR');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('');
      return false;
    }

    if (Object.prototype.hasOwnProperty.call(data.memberRoles, email)) {
      setEmailError('이미 초대된 멤버입니다.');
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setMemberEmail(email);

    if (email.trim()) {
      validateEmail(email);
    } else {
      setEmailError('');
    }
  };

  const handleInviteMember = () => {
    if (!validateEmail(memberEmail)) {
      return;
    }

    const newMemberRoles = {
      ...data.memberRoles,
      [memberEmail.trim()]: memberRole,
    };
    onChange({ memberRoles: newMemberRoles });

    setMemberEmail('');
    setMemberRole('EDITOR');
    setEmailError('');
  };

  const handleRemoveMember = (emailToRemove: string) => {
    const newMemberRoles = { ...data.memberRoles };
    delete newMemberRoles[emailToRemove];
    onChange({ memberRoles: newMemberRoles });
  };

  const handleRoleChange = (email: string, newRole: Role) => {
    const newMemberRoles = {
      ...data.memberRoles,
      [email]: newRole,
    };
    onChange({ memberRoles: newMemberRoles });
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
            <Select
              value={memberRole}
              onValueChange={(val: Role) => setMemberRole(val)}
            >
              <SelectTrigger className="h-[44px] bg-white border-[var(--figma-border-mercury)] shadow-sm rounded-md font-['Pretendard'] font-normal text-[14px] hover:border-[var(--figma-forest-accent)] transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EDITOR">편집자 - 편집 가능</SelectItem>
                <SelectItem value="VIEWER">뷰어 - 보기만 가능</SelectItem>
                <SelectItem value="OWNER">관리자 - 모든 권한</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className={`w-full h-[44px] font-['Pretendard'] font-normal text-[13.2px] leading-5 rounded-md border-none transition-colors
              ${!memberEmail.trim() || !!emailError
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
        {Object.keys(data.memberRoles).length > 0 && (
          <div className="flex flex-col gap-2">
            <Label className="font-['Pretendard'] font-medium text-[13.1px] leading-[14px] text-[var(--figma-text-cod-gray)]">
              초대된 팀원
            </Label>
            <div className="max-h-[130px] overflow-y-auto chat-scrollbar pr-1 flex flex-col gap-2">
              {Object.entries(data.memberRoles).map(([email, role]) => (
                <div
                  key={email}
                  className="flex items-center justify-between rounded-md p-2 bg-white border border-[var(--figma-border-mercury)] shadow-sm shrink-0"
                >
                  <span className="font-['Pretendard'] font-normal text-[13px] text-[var(--figma-text-cod-gray)]">
                    {email}
                  </span>
                  <div className="flex items-center gap-2">
                    <Select
                      value={role}
                      onValueChange={(newRole: Role) =>
                        handleRoleChange(email, newRole)
                      }
                    >
                      <SelectTrigger className="h-8 w-[160px] bg-white border-[var(--figma-border-mercury)] shadow-sm rounded-md font-['Pretendard'] font-normal text-[13px] hover:border-[var(--figma-forest-accent)] transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EDITOR">편집자 - 편집 가능</SelectItem>
                        <SelectItem value="VIEWER">뷰어 - 보기만 가능</SelectItem>
                        <SelectItem value="OWNER">관리자 - 모든 권한</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-500"
                      onClick={() => handleRemoveMember(email)}
                    >
                      <span className="sr-only">삭제</span>
                      &times;
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
