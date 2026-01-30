import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { getTechStacks } from '@/apis/workspace.api';
import type { TechStackItem } from '@/apis/workspace.api';

interface Step4TechStackProps {
  data: {
    techStacks: number[]; // 🚨 ID 목록 (number[])
  };
  onChange: (updates: Partial<Step4TechStackProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step4TechStack({
  data,
  onChange,
}: Step4TechStackProps) {
  const [techOptions, setTechOptions] = useState<TechStackItem[]>([]); // 전체 기술 목록 (API)
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 1. 컴포넌트 마운트 시 API로 기술 스택 목록 가져오기
  useEffect(() => {
    const loadData = async () => {
      try {
        const stacks = await getTechStacks();
        setTechOptions(stacks);
      } catch (error) {
        console.error('기술 스택 로딩 실패:', error);
      }
    };
    loadData();
  }, []);

  // 검색어 필터링 (이미 선택된 것 제외)
  const filteredTechs = techOptions
    .filter(
      (tech) =>
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !data.techStacks.includes(tech.id)
    )
    .slice(0, 10);

  // 추가 (ID 저장)
  const handleAdd = (techEntry: TechStackItem) => {
    if (!data.techStacks.includes(techEntry.id)) {
      onChange({ techStacks: [...data.techStacks, techEntry.id] });
      setSearchTerm('');
      setShowSuggestions(false);
      setSelectedIndex(0);
    }
  };

  // 삭제 (ID로 삭제)
  const handleRemove = (techId: number) => {
    onChange({
      techStacks: data.techStacks.filter((id) => id !== techId),
    });
  };

  // 키보드 조작 핸들러
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

  // ID로 이름 찾기 헬퍼
  const getTechName = (id: number) => {
    return techOptions.find((t) => t.id === id)?.name || `Unknown(${id})`;
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
          >
            {/* 사용할 기술스택 검색 */}
          </Label>
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
                    ${
                      index === selectedIndex
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
            {data.techStacks.map((techId) => (
              <Badge
                key={techId}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-['Pretendard'] font-normal bg-white text-[var(--figma-text-cod-gray)] border border-[var(--figma-border-mercury)] shadow-sm hover:bg-gray-50"
              >
                {getTechName(techId)}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(techId);
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
