import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { TECH_STACK_OPTIONS } from '../techStackData';

interface Step3TechStackProps {
  data: {
    techStacks: string[];
  };
  onChange: (updates: Partial<Step3TechStackProps['data']>) => void;
}

export default function Step3TechStack({
  data,
  onChange,
}: Step3TechStackProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); // 키보드로 선택된 인덱스

  // 검색어로 필터링 (이미 선택된 것 제외, 최대 10개)
  const filteredTechs = TECH_STACK_OPTIONS.filter(
    (tech) =>
      tech.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !data.techStacks.includes(tech)
  ).slice(0, 10);

  // 기술 스택 추가
  const handleAdd = (tech: string) => {
    if (!data.techStacks.includes(tech)) {
      onChange({ techStacks: [...data.techStacks, tech] });
      setSearchTerm('');
      setShowSuggestions(false);
      setSelectedIndex(0);
    }
  };

  // 기술 스택 제거
  const handleRemove = (tech: string) => {
    onChange({
      techStacks: data.techStacks.filter((t) => t !== tech),
    });
  };

  // 키보드 이벤트 처리
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
    <div className="space-y-6">
      {/* 검색 입력 */}
      <div className="space-y-2 relative">
        <Label htmlFor="techSearch">사용할 기술스택 검색</Label>
        <Input
          id="techSearch"
          placeholder="사용할 기술스택 검색"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
            setSelectedIndex(0); // 검색어 변경 시 선택 인덱스 초기화
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(searchTerm.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />

        {/* 검색 자동완성 드롭다운 */}
        {showSuggestions && filteredTechs.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredTechs.map((tech, index) => (
              <div
                key={tech}
                className={`px-4 py-2 cursor-pointer ${
                  index === selectedIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleAdd(tech)}
              >
                {tech}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 선택된 기술 스택 */}
      {data.techStacks.length > 0 && (
        <div className="flex flex-wrap gap-2 min-h-[60px] p-4 border rounded-lg bg-gray-50">
          {data.techStacks.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-2"
            >
              {tech}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(tech);
                }}
                className="hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
