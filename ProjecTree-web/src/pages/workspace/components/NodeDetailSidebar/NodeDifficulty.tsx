import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DifficultySelectProps {
  value: number;
  onChange: (value: number) => void;
}

// 난이도 선택 컴포넌트 (편집 모드)
export function DifficultySelect({ value, onChange }: DifficultySelectProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className="p-0.5 hover:scale-110 transition-transform"
        >
          <Star
            className={cn(
              'w-4 h-4',
              level <= value
                ? 'fill-[#A3A9E0] text-[#A3A9E0]'
                : 'fill-none text-[rgba(97,98,111,0.3)] hover:text-[#A3A9E0]'
            )}
            strokeWidth={1.33}
          />
        </button>
      ))}
    </div>
  );
}

interface SelectedDifficultyProps {
  difficulty: number;
}

// 선택된 난이도 표시 컴포넌트 (조회 모드)
export function SelectedDifficulty({ difficulty }: SelectedDifficultyProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((level) => (
        <Star
          key={level}
          className={cn(
            'w-4 h-4',
            level <= difficulty
              ? 'fill-[#A3A9E0] text-[#A3A9E0]'
              : 'fill-none text-[rgba(97,98,111,0.3)]'
          )}
          strokeWidth={1.33}
        />
      ))}
    </div>
  );
}

// 통합 컴포넌트
interface NodeDifficultyProps {
  value: number;
  isEdit: boolean;
  onChange?: (value: number) => void;
}

export function NodeDifficultyField({ value, isEdit, onChange }: NodeDifficultyProps) {
  if (isEdit && onChange) {
    return <DifficultySelect value={value} onChange={onChange} />;
  }
  return <SelectedDifficulty difficulty={value} />;
}
