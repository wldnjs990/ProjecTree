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

interface Step5EpicSetupProps {
  data: {
    epics: Epic[];
  };
  onChange: (updates: Partial<Step5EpicSetupProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step5EpicSetup({
  data,
  onChange,
  onNext,
  onPrev,
}: Step5EpicSetupProps) {
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
          초기 에픽 설정
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
          프로젝트의 초기 에픽을 설정하세요
        </p>
      </div>

      {/* 폼 필드 */}
      <div className="flex flex-col gap-6">
        {/* 초기 에픽 설정 */}
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
            초기 에픽 설정
          </h3>

          {/* 에픽명과 추가 버튼 */}
          <div className="flex gap-2">
            <Input
              placeholder="에픽명 (20자 이내)"
              value={epicName}
              onChange={(e) => setEpicName(e.target.value)}
              maxLength={20}
              className="flex-1"
              style={{
                fontFamily: 'Roboto',
                fontWeight: 100,
                fontSize: '14px',
                lineHeight: '16px',
                height: '44px',
                padding: '12.5px 12px',
                background: 'rgba(255, 255, 255, 0.002)',
                border: '1px solid var(--figma-border-mercury)',
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                borderRadius: '6px',
              }}
            />
            <Button
              variant="outline"
              onClick={handleAddEpic}
              disabled={!epicName.trim()}
              className="whitespace-nowrap"
              style={{
                fontFamily: 'Roboto',
                fontWeight: 100,
                fontSize: '13.2px',
                height: '44px',
                padding: '8px 16px',
                background: 'transparent',
                color: 'var(--figma-text-cod-gray)',
                border: '1px solid var(--figma-border-mercury)',
                borderRadius: '6px',
              }}
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
            className="resize-none"
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '14px',
              lineHeight: '16px',
              padding: '12.5px 12px',
              background: 'rgba(255, 255, 255, 0.002)',
              border: '1px solid var(--figma-border-mercury)',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              borderRadius: '6px',
            }}
          />
          <div className="flex justify-end">
            <span
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                color: 'var(--figma-text-dove-gray',
              }}
            >
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
                className="flex items-start justify-between rounded-lg p-3"
                style={{
                  background: 'var(--figma-gray-concrete)',
                  border: '1px solid var(--figma-border-mercury)',
                }}
              >
                <div className="flex-1">
                  <h4
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: 400,
                      fontSize: '14px',
                      color: 'var(--figma-text-cod-gray)',
                    }}
                  >
                    {epic.name}
                  </h4>
                  <p
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: 100,
                      fontSize: '13px',
                      color: 'var(--figma-text-emperor)',
                    }}
                  >
                    {epic.description}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveEpic(epic.id)}
                  className="ml-2 rounded-full p-1 hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
