import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { getTechStacks } from '@/apis';
import type { TechStackItem } from '@/apis';

interface Step4TechStackProps {
  data: {
    techStacks: TechStackItem[];
  };
  onChange: (updates: Partial<Step4TechStackProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step4TechStack({
  data,
  onChange,
}: Step4TechStackProps) {
  const [techOptions, setTechOptions] = useState<TechStackItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 검색어 입력 시 API 조회
  useEffect(() => {
    const fetchTechs = async () => {
      if (!searchTerm.trim()) {
        setTechOptions([]);
        return;
      }
      try {
        const results = await getTechStacks(searchTerm);
        setTechOptions(results);
      } catch (error) {
      }
    };

    const timer = setTimeout(fetchTechs, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredTechs = techOptions.filter(
    (tech) => !data.techStacks.some((selected) => selected.id === tech.id)
  );

  const handleAdd = (techEntry: TechStackItem) => {
    if (!data.techStacks.some((selected) => selected.id === techEntry.id)) {
      onChange({ techStacks: [...data.techStacks, techEntry] });
      setSearchTerm('');
      setShowSuggestions(false);
      setSelectedIndex(0);
    }
  };

  const handleRemove = (techId: number) => {
    onChange({
      techStacks: data.techStacks.filter((tech) => tech.id !== techId),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredTechs.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredTechs.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredTechs[selectedIndex]) {
          handleAdd(filteredTechs[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(0);
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-['Pretendard'] font-bold text-[22px] leading-tight tracking-[-0.02em] text-[#1A1A1A]">
          사용할 기술 스택
        </h2>
        <p className="font-['Pretendard'] font-medium text-[15px] text-[#757575]">
          사용 예정인 기술을 선택해주세요 (다중 선택 가능)
        </p>
      </div>

      {/* 폼 필드 */}
      <div className="flex flex-col gap-5">
        {/* 검색 입력 */}
        <div className="relative flex flex-col gap-2 z-50">
          <Label
            htmlFor="techSearch"
            className="font-['Pretendard'] font-medium text-[13.1px] leading-[14px] text-[var(--figma-text-cod-gray)]"
          ></Label>
          <Input
            id="techSearch"
            placeholder="사용할 기술스택 검색 (React, Spring...)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(searchTerm.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="h-[44px] px-3 py-[12.5px] bg-transparent border-[var(--figma-border-mercury)] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-md font-['Pretendard'] font-normal text-[14px] leading-4 focus-visible:ring-[var(--figma-primary-blue)]"
          />

          {/* 검색 자동완성 드롭다운 */}
          {showSuggestions && filteredTechs.length > 0 && (
            <div className="absolute top-full mt-1 max-h-60 w-full overflow-y-auto rounded-lg shadow-xl bg-white border border-[var(--figma-border-mercury)] z-50 ring-1 ring-black/5">
              {filteredTechs.map((tech, index) => (
                <div
                  key={tech.id}
                  className={`cursor-pointer px-4 py-2.5 font-['Pretendard'] font-normal text-[14px] transition-colors
                    ${index === selectedIndex
                      ? 'bg-[var(--figma-gray-concrete)] text-[var(--figma-text-cod-gray)]'
                      : 'bg-transparent text-[var(--figma-text-cod-gray)] hover:bg-[var(--figma-gray-concrete)]'
                    }`}
                  onClick={() => handleAdd(tech)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {tech.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 선택된 기술 스택 */}
        {data.techStacks.length > 0 && (
          <div className="flex min-h-15 max-h-[320px] overflow-y-auto chat-scrollbar flex-wrap gap-2 rounded-lg p-4 bg-[var(--figma-gray-concrete)] border border-[var(--figma-border-mercury)]">
            {data.techStacks.map((tech) => (
              <Badge
                key={tech.id}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-['Pretendard'] font-normal bg-white text-[var(--figma-text-cod-gray)] border border-[var(--figma-border-mercury)] shadow-sm hover:bg-gray-50"
              >
                {tech.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(tech.id);
                  }}
                  className="rounded-full p-0.5 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
