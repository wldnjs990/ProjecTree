import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getTechStacks } from '@/apis/workspace.api';
import type { TechStackItem } from '@/apis/workspace.api';

interface CustomTechAddDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTech: (techVocaId: number) => Promise<void>;
  isAdding?: boolean;
}

export function CustomTechAddDialog({
  isOpen,
  onOpenChange,
  onAddTech,
  isAdding = false,
}: CustomTechAddDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [techOptions, setTechOptions] = useState<TechStackItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // 검색어 입력 시 API 조회 (디바운스 300ms)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setTechOptions([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await getTechStacks(searchTerm);
        setTechOptions(results);
      } catch (error) {
        console.error('기술 스택 검색 실패:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 다이얼로그 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setTechOptions([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelect = async (tech: TechStackItem) => {
    await onAddTech(tech.id);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (techOptions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < techOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (techOptions[selectedIndex]) {
          handleSelect(techOptions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onOpenChange(false);
        break;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            기술스택 직접 추가
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* 검색 입력 */}
          <div className="relative">
            <Input
              placeholder="기술스택 검색 (React, Spring...)"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              disabled={isAdding}
              autoFocus
              className="h-10"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-[#636363]" />
              </div>
            )}
          </div>

          {/* 검색 결과 드롭다운 */}
          {techOptions.length > 0 && (
            <div className="max-h-60 overflow-y-auto rounded-lg border border-[#E5E5E5] bg-white shadow-sm">
              {techOptions.map((tech, index) => (
                <button
                  key={tech.id}
                  type="button"
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    index === selectedIndex
                      ? 'bg-[#F5F5F5] text-[#0B0B0B]'
                      : 'bg-white text-[#636363] hover:bg-[#F5F5F5]'
                  }`}
                  onClick={() => handleSelect(tech)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  disabled={isAdding}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          )}

          {/* 검색 결과 없음 */}
          {searchTerm.trim() && !isSearching && techOptions.length === 0 && (
            <p className="text-center text-sm text-[#9CA3AF] py-4">
              검색 결과가 없습니다.
            </p>
          )}

          {/* 로딩 상태 */}
          {isAdding && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-[#636363]">
              <Loader2 className="w-4 h-4 animate-spin" />
              추가 중...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
