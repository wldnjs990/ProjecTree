import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

interface Step1BasicInfoProps {
  data: {
    name: string;
    workspaceKey: string;
  };
  onChange: (updates: Partial<Step1BasicInfoProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors?: Record<string, string>;
}

export default function Step1BasicInfo({
  data,
  onChange,
  // onNext,
  // onPrev,
  errors,
}: Step1BasicInfoProps) {
  const [localError, setLocalError] = useState<string>('');

  return (
    <div className="flex flex-col gap-8">
      {/* 헤더 */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-['Pretendard'] font-bold text-[22px] leading-tight tracking-[-0.02em] text-[#1A1A1A]">
          워크스페이스 시작하기
        </h2>
        <p className="font-['Pretendard'] font-medium text-[15px] text-[#757575]">
          효율적인 프로젝트 관리를 위한 첫 단계
        </p>
      </div>

      {/* 폼 필드 */}
      <div className="flex flex-col gap-6">
        {/* 워크스페이스명 */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1">
            <Label
              htmlFor="name"
              className="font-['Pretendard'] font-semibold text-[14px] text-[#424242]"
            >
              워크스페이스명
            </Label>
            <span className="font-[Inter] font-medium text-[14px] leading-5 text-[var(--figma-required-crimson)] text-red-500">
              *
            </span>
          </div>
          <Input
            id="name"
            placeholder="Untitled-1"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            maxLength={20}
            className={`h-[52px] px-4 bg-[#F9FAFB] border-[#E0E0E0] shadow-sm rounded-xl font-['Pretendard'] text-[15px] focus-visible:ring-4 focus-visible:ring-[#4CAF50]/10 focus-visible:border-[#4CAF50] focus-visible:bg-[#F1F8E9] transition-all duration-200 placeholder:text-[#BDBDBD] ${errors?.name ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10' : ''}`}
          />
          {errors?.name && (
            <p className="font-['Pretendard'] text-[13px] text-red-500 mt-1">
              {errors.name}
            </p>
          )}
          <div className="flex justify-end">
            <span className="font-['Inter'] text-[12px] text-[#9E9E9E]">
              {data.name.length}/20
            </span>
          </div>
        </div>

        {/* 워크스페이스 키 */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <Label
              htmlFor="workspaceKey"
              className="font-['Pretendard'] font-semibold text-[14px] text-[#424242]"
            >
              워크스페이스 키
            </Label>
            <span className="font-[Inter] font-medium text-[14px] leading-5 text-[var(--figma-required-crimson)] text-red-500">
              *
            </span>
            <div className="relative group">
              <Info className="h-4 w-4 text-[#BDBDBD] hover:text-[#4CAF50] transition-colors cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block px-4 py-3 bg-white border border-[#4ADE80] text-[#374151] text-xs rounded-xl shadow-[0_4px_14px_0_rgba(74,222,128,0.25)] z-50 w-max max-w-[300px] whitespace-normal text-left leading-relaxed">
                <p>
                  프로젝트 내{' '}
                  <span className="text-[#16A34A] font-bold">
                    각 기능을 식별하는 고유 코드
                  </span>
                  입니다.
                  <br />
                  <span className="text-[#15803D] text-[11px] font-medium opacity-80">
                    (예: PROJ-001)
                  </span>
                </p>
              </div>
            </div>
          </div>
          <Input
            id="workspaceKey"
            placeholder="ex) ASDF"
            value={data.workspaceKey}
            onChange={(e) => {
              const checkedValue = e.target.value;
              const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(checkedValue);

              if (hasKorean) {
                setLocalError('영어로 입력해주세요');
              } else {
                setLocalError('');
              }

              const value = checkedValue.toUpperCase().replace(/[^A-Z]/g, '');
              onChange({ workspaceKey: value });
            }}
            maxLength={4}
            className={`h-[52px] px-4 bg-[#F9FAFB] border-[#E0E0E0] shadow-sm rounded-xl font-['Pretendard'] text-[15px] focus-visible:ring-4 focus-visible:ring-[#4CAF50]/10 focus-visible:border-[#4CAF50] focus-visible:bg-[#F1F8E9] transition-all duration-200 placeholder:text-[#BDBDBD] ${errors?.workspaceKey || localError ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10' : ''}`}
            autoComplete="off"
          />
          {(errors?.workspaceKey || localError) && (
            <p className="font-['Pretendard'] text-[13px] text-red-500 mt-1">
              {localError || errors?.workspaceKey}
            </p>
          )}
          <div className="flex justify-end">
            <span className="font-['Inter'] text-[12px] text-[#9E9E9E]">
              {data.workspaceKey.length}/4
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
