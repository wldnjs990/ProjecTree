import { LevelToggle } from './LevelToggle';
import { FilterDropdowns } from './FilterDropdowns';
import type { NodeLevel } from '../types';

interface FilterSectionProps {
  selectedLevel: NodeLevel | 'all';
  sortBy: string;
  filterBy: string;
  onLevelChange: (level: NodeLevel | 'all') => void;
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

/**
 * Filter Section 컴포넌트
 *
 * 레벨 토글과 필터 드롭다운을 포함하는 컨테이너
 */
export function FilterSection({
  selectedLevel,
  sortBy,
  filterBy,
  onLevelChange,
  onSortChange,
  onFilterChange,
}: FilterSectionProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
      {/* 왼쪽: Level Toggle */}
      <LevelToggle
        selectedLevel={selectedLevel}
        onLevelChange={onLevelChange}
      />

      {/* 오른쪽: Filter Dropdowns */}
      <FilterDropdowns
        sortBy={sortBy}
        filterBy={filterBy}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}
