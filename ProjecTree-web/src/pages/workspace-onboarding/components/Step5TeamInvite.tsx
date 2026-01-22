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
        <h2
          style={{
            fontFamily: 'Roboto',
            fontWeight: 100,
            fontSize: '18.8px',
            lineHeight: '28px',
            letterSpacing: '-0.5px',
            color: 'var(--figma-text-cod-gray)',
          }}
        >
          팀 초대
        </h2>
        <p
          style={{
            fontFamily: 'Roboto',
            fontWeight: 100,
            fontSize: '13.3px',
            lineHeight: '20px',
            color: 'var(--figma-text-emperor)',
          }}
        >
          팀원을 초대하세요
        </p>
      </div>

      {/* 폼 필드 */}
      <div className="flex flex-col gap-6">
        {/* 이메일 초대 */}
        <div className="flex flex-col gap-4">
          <h3
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '15px',
              lineHeight: '20px',
              color: 'var(--figma-text-cod-gray)',
            }}
          >
            이메일 초대
          </h3>

          <div className="flex flex-col gap-2">
            <Input
              type="email"
              placeholder="name@company.com"
              value={memberEmail}
              onChange={handleEmailChange}
              style={{
                fontFamily: 'Roboto',
                fontWeight: 100,
                fontSize: '14px',
                lineHeight: '16px',
                height: '44px',
                padding: '12.5px 12px',
                background: 'rgba(255, 255, 255, 0.002)',
                border: emailError
                  ? '1px solid var(--figma-required-crimson)'
                  : '1px solid var(--figma-border-mercury)',
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                borderRadius: '6px',
              }}
            />
            {emailError && (
              <span
                style={{
                  fontFamily: 'Roboto',
                  fontWeight: 100,
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: 'var(--figma-required-crimson)',
                }}
              >
                {emailError}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label
              style={{
                fontFamily: 'Roboto',
                fontWeight: 100,
                fontSize: '13.1px',
                lineHeight: '14px',
                color: 'var(--figma-text-cod-gray)',
              }}
            >
              권한
            </Label>
            <Select value={memberRole} onValueChange={setMemberRole}>
              <SelectTrigger
                style={{
                  fontFamily: 'Roboto',
                  fontWeight: 100,
                  fontSize: '14px',
                  height: '44px',
                  background: 'rgba(255, 255, 255, 0.002)',
                  border: '1px solid var(--figma-border-mercury)',
                  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                  borderRadius: '6px',
                }}
              >
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
            className="w-full"
            onClick={handleInviteMember}
            disabled={!memberEmail.trim() || !!emailError}
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '13.2px',
              lineHeight: '20px',
              height: '44px',
              background:
                !memberEmail.trim() || !!emailError
                  ? 'var(--figma-gray-concrete)'
                  : 'var(--figma-primary-blue)',
              color:
                !memberEmail.trim() || !!emailError
                  ? 'var(--figma-text-emperor)'
                  : 'var(--figma-white)',
              borderRadius: '6px',
              border: 'none',
              cursor:
                !memberEmail.trim() || !!emailError ? 'not-allowed' : 'pointer',
            }}
          >
            초대 메일 보내기
          </Button>
        </div>

        {/* 초대된 팀원 목록 */}
        {data.teamMembers.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label
              style={{
                fontFamily: 'Roboto',
                fontWeight: 100,
                fontSize: '13.1px',
                lineHeight: '14px',
                color: 'var(--figma-text-cod-gray)',
              }}
            >
              초대된 팀원
            </Label>
            {data.teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded p-2"
                style={{
                  background: 'var(--figma-gray-concrete)',
                  border: '1px solid var(--figma-border-mercury)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Roboto',
                    fontWeight: 100,
                    fontSize: '13px',
                    color: 'var(--figma-text-cod-gray)',
                  }}
                >
                  {member.email}
                </span>
                <span
                  style={{
                    fontFamily: 'Roboto',
                    fontWeight: 100,
                    fontSize: '13px',
                    color: 'var(--figma-text-emperor)',
                  }}
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
