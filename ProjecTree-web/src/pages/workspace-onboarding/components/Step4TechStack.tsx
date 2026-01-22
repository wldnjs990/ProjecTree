import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { TECH_STACK_OPTIONS } from '../techStackData';

interface Step4TechStackProps {
  data: {
    techStacks: string[];
  };
  onChange: (updates: Partial<Step4TechStackProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step4TechStack({
  data,
  onChange,
  // onNext,
  // onPrev,
}: Step4TechStackProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredTechs = TECH_STACK_OPTIONS.filter(
    (tech) =>
      tech.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !data.techStacks.includes(tech)
  ).slice(0, 10);

  const handleAdd = (tech: string) => {
    if (!data.techStacks.includes(tech)) {
      onChange({ techStacks: [...data.techStacks, tech] });
      setSearchTerm('');
      setShowSuggestions(false);
      setSelectedIndex(0);
    }
  };

  const handleRemove = (tech: string) => {
    onChange({
      techStacks: data.techStacks.filter((t) => t !== tech),
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
          사용할 기술 스택
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
          사용 예정인 기술을 선택해주세요 (다중 선택 가능)
        </p>
      </div>

      {/* 폼 필드 */}
      <div className="flex flex-col gap-5">
        {/* 검색 입력 */}
        <div className="relative flex flex-col gap-2">
          <Label
            htmlFor="techSearch"
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '13.1px',
              lineHeight: '14px',
              color: 'var(--figma-text-cod-gray)',
            }}
          >
            사용할 기술스택 검색
          </Label>
          <Input
            id="techSearch"
            placeholder="사용할 기술스택 검색"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(searchTerm.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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

          {/* 검색 자동완성 드롭다운 */}
          {showSuggestions && filteredTechs.length > 0 && (
            <div
              className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg shadow-lg"
              style={{
                background: 'var(--figma-white)',
                border: '1px solid var(--figma-border-mercury)',
              }}
            >
              {filteredTechs.map((tech, index) => (
                <div
                  key={tech}
                  className="cursor-pointer px-4 py-2"
                  style={{
                    backgroundColor:
                      index === selectedIndex
                        ? 'var(--figma-gray-concrete)'
                        : 'transparent',
                    fontFamily: 'Roboto',
                    fontWeight: 100,
                    fontSize: '14px',
                    color: 'var(--figma-text-cod-gray)',
                  }}
                  onClick={() => handleAdd(tech)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {tech}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 선택된 기술 스택 */}
        {data.techStacks.length > 0 && (
          <div
            className="flex min-h-15 flex-wrap gap-2 rounded-lg p-4"
            style={{
              background: 'var(--figma-gray-concrete)',
              border: '1px solid var(--figma-border-mercury)',
            }}
          >
            {data.techStacks.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1.5 text-sm"
                style={{
                  fontFamily: 'Roboto',
                  fontWeight: 100,
                  background: 'var(--figma-white)',
                  color: 'var(--figma-text-cod-gray)',
                  border: '1px solid var(--figma-border-mercury)',
                }}
              >
                {tech}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(tech);
                  }}
                  className="rounded-full p-0.5 hover:bg-gray-300"
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
