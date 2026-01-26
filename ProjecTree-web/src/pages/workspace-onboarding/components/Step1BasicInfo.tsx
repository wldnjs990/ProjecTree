import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

interface Step1BasicInfoProps {
  data: {
    workspaceName: string;
    workspaceKey: string;
  };
  onChange: (updates: Partial<Step1BasicInfoProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step1BasicInfo({
  data,
  onChange,
  // onNext,
  // onPrev,
}: Step1BasicInfoProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* 헤더 */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-['Pretendard'] font-bold text-[24px] leading-tight tracking-[-0.02em] text-[#1A1A1A]">
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
          <Label
            htmlFor="workspaceName"
            className="font-['Pretendard'] font-semibold text-[14px] text-[#424242]"
          >
            워크스페이스명
          </Label>
          <Input
            id="workspaceName"
            placeholder="Untitled-1"
            value={data.workspaceName}
            onChange={(e) => onChange({ workspaceName: e.target.value })}
            maxLength={20}
            className="h-[52px] px-4 bg-[#F9FAFB] border-[#E0E0E0] shadow-sm rounded-xl font-['Pretendard'] text-[15px] focus-visible:ring-4 focus-visible:ring-[#4CAF50]/10 focus-visible:border-[#4CAF50] focus-visible:bg-[#F1F8E9] transition-all duration-200 placeholder:text-[#BDBDBD]"
          />
          <div className="flex justify-end">
            <span className="font-['Inter'] text-[12px] text-[#9E9E9E]">
              {data.workspaceName.length}/20
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
            <div className="relative group">
              <Info className="h-4 w-4 text-[#BDBDBD] hover:text-[#4CAF50] transition-colors cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                URL에 사용될 고유 키입니다
              </div>
            </div>
          </div>
          <Input
            id="workspaceKey"
            placeholder="ex) ASDF"
            value={data.workspaceKey}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
              onChange({ workspaceKey: value });
            }}
            maxLength={4}
            className="h-[52px] px-4 bg-[#F9FAFB] border-[#E0E0E0] shadow-sm rounded-xl font-['Pretendard'] text-[15px] focus-visible:ring-4 focus-visible:ring-[#4CAF50]/10 focus-visible:border-[#4CAF50] focus-visible:bg-[#F1F8E9] transition-all duration-200 placeholder:text-[#BDBDBD]"
          />
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
