import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';

interface Epic {
  id: string;
  name: string;
  description: string;
}

interface Step6EpicSetupProps {
  data: {
    epics: Epic[];
  };
  onChange: (updates: Partial<Step6EpicSetupProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step6EpicSetup({
  data,
  onChange,
  // onNext,
  // onPrev,
}: Step6EpicSetupProps) {
  const [epicName, setEpicName] = useState('');
  const [epicDescription, setEpicDescription] = useState('');

  const handleAddEpic = () => {
    if (epicName.trim()) {
      const newEpic: Epic = {
        id: Date.now().toString(),
        name: epicName,
        description: epicDescription,
      };
      onChange({ epics: [...data.epics, newEpic] });
      setEpicName('');
      setEpicDescription('');
    }
  };

  const handleRemoveEpic = (id: string) => {
    onChange({
      epics: data.epics.filter((epic) => epic.id !== id),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-['Pretendard'] font-bold text-[24px] leading-tight tracking-[-0.02em] text-[#1A1A1A]">
          초기 에픽 설정
        </h2>
        <p className="font-['Pretendard'] font-medium text-[15px] text-[#757575]">
          프로젝트의 초기 에픽을 설정하세요
        </p>
      </div>

      {/* 폼 필드 */}
      <div className="flex flex-col gap-6">
        {/* 초기 에픽 설정 */}
        <div className="flex flex-col gap-4">
          <h3 className="font-['Pretendard'] font-medium text-[15px] leading-5 text-[var(--figma-text-cod-gray)]">
            초기 에픽 설정
          </h3>

          {/* 에픽명과 추가 버튼 */}
          <div className="flex gap-2">
            <Input
              placeholder="에픽명 (20자 이내)"
              value={epicName}
              onChange={(e) => setEpicName(e.target.value)}
              maxLength={20}
              className="flex-1 h-[44px] px-3 py-[12.5px] bg-white border-[var(--figma-border-mercury)] shadow-sm rounded-md font-['Pretendard'] font-normal text-[14px] leading-4 focus-visible:ring-[var(--figma-forest-primary)] focus-visible:border-[var(--figma-forest-primary)] hover:border-[var(--figma-forest-accent)] transition-colors"
            />
            <Button
              variant="outline"
              onClick={handleAddEpic}
              disabled={!epicName.trim()}
              className="whitespace-nowrap h-[44px] px-4 py-2 bg-white text-[var(--figma-text-cod-gray)] border border-[var(--figma-border-mercury)] rounded-md font-['Pretendard'] font-normal text-[13.2px] hover:bg-gray-50 hover:border-[var(--figma-forest-accent)] hover:text-[var(--figma-forest-primary)] transition-all"
            >
              <Plus className="mr-1 h-4 w-4" />
              에픽 추가
            </Button>
          </div>

          {/* 에픽 설명 */}
          <Textarea
            placeholder="에픽에 대한 설명을 간략하게 작성해주세요"
            value={epicDescription}
            onChange={(e) => setEpicDescription(e.target.value)}
            maxLength={50}
            rows={4}
            className="resize-none font-['Pretendard'] font-normal text-[14px] leading-4 p-[12.5px_12px] bg-white border-[var(--figma-border-mercury)] shadow-sm rounded-md focus-visible:ring-[var(--figma-forest-primary)] focus-visible:border-[var(--figma-forest-primary)] hover:border-[var(--figma-forest-accent)] transition-colors"
          />
          <div className="flex justify-end">
            <span className="font-['Pretendard'] font-normal text-xs leading-4 text-[var(--figma-text-dove-gray)]">
              {epicDescription.length}/50
            </span>
          </div>
        </div>

        {/* 에픽 목록 */}
        {data.epics.length > 0 && (
          <div className="flex flex-col gap-2">
            {data.epics.map((epic) => (
              <div
                key={epic.id}
                className="flex items-start justify-between rounded-lg p-3 bg-white border border-[var(--figma-border-mercury)] shadow-sm"
              >
                <div className="flex-1">
                  <h4 className="font-['Pretendard'] font-medium text-[14px] text-[var(--figma-text-cod-gray)]">
                    {epic.name}
                  </h4>
                  <p className="font-['Pretendard'] font-normal text-[13px] text-[var(--figma-text-emperor)]">
                    {epic.description}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveEpic(epic.id)}
                  className="ml-2 rounded-full p-1 hover:bg-black/10 transition-colors"
                >
                  <X className="h-4 w-4 text-[#666]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
