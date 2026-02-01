import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Priority } from '../types';

// 우선순위별 스타일
const priorityStyles: Record<Priority, { bg: string; text: string }> = {
  P0: { bg: 'bg-[rgba(231,0,11,0.15)]', text: 'text-[#E7000B]' },
  P1: { bg: 'bg-[rgba(253,154,0,0.15)]', text: 'text-[#FD9A00]' },
  P2: { bg: 'bg-[rgba(43,127,255,0.15)]', text: 'text-[#2B7FFF]' },
  P3: { bg: 'bg-[rgba(100,116,139,0.15)]', text: 'text-[#64748B]' },
};

interface PrioritySelectProps {
  value: Priority | undefined;
  onChange: (value: Priority) => void;
}

// 우선순위 선택 컴포넌트 (편집 모드)
export function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  const priorityList = Object.keys(priorityStyles) as Priority[];

  return (
    <Select value={value} onValueChange={(v) => onChange(v as Priority)}>
      <SelectTrigger className="w-20 h-7 text-xs">
        <SelectValue placeholder="선택" />
      </SelectTrigger>
      <SelectContent>
        {priorityList.map((key) => (
          <SelectItem key={key} value={key}>
            <span
              className={cn(
                'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-lg',
                priorityStyles[key].bg,
                priorityStyles[key].text
              )}
            >
              {key}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface SelectedPriorityProps {
  priority: Priority;
}

// 선택된 우선순위 표시 컴포넌트 (조회 모드)
export function SelectedPriority({ priority }: SelectedPriorityProps) {
  const style = priorityStyles[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-lg',
        style.bg,
        style.text
      )}
    >
      {priority}
    </span>
  );
}

// 통합 컴포넌트
interface NodePriorityProps {
  value: Priority | undefined;
  isEdit: boolean;
  onChange?: (value: Priority) => void;
}

export function NodePriorityField({
  value,
  isEdit,
  onChange,
}: NodePriorityProps) {
  if (isEdit && onChange) {
    return <PrioritySelect value={value} onChange={onChange} />;
  }
  if (value) {
    return <SelectedPriority priority={value} />;
  }
  return <span className="text-sm text-muted-foreground">미지정</span>;
}
