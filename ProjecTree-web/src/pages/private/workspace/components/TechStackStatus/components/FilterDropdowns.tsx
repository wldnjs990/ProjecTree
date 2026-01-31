import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterDropdownsProps {
  sortBy: string;
  filterBy: string;
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

/**
 * Filter Dropdowns 컴포넌트
 *
 * 정렬 및 조건 필터 드롭다운
 */
export function FilterDropdowns({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
}: FilterDropdownsProps) {
  return (
    <div className="flex items-center gap-3">
      {/* 정렬 */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="정렬" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">최신순</SelectItem>
          <SelectItem value="priority">우선순위순</SelectItem>
          <SelectItem value="status">상태순</SelectItem>
        </SelectContent>
      </Select>

      {/* 조건 */}
      <Select value={filterBy} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="조건" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="tech">기술 스택별</SelectItem>
          <SelectItem value="status">상태별</SelectItem>
          <SelectItem value="priority">우선순위별</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
