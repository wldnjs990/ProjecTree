import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { NodeStatus } from './types';

// 상태별 스타일 및 라벨
const statusStyles: Record<
  NodeStatus,
  { bg: string; text: string; label: string }
> = {
  TODO: {
    bg: 'bg-[rgba(100,116,139,0.15)]',
    text: 'text-[#64748B]',
    label: '대기중',
  },
  IN_PROGRESS: {
    bg: 'bg-[rgba(99,99,198,0.15)]',
    text: 'text-[#6363C6]',
    label: '진행중',
  },
  DONE: {
    bg: 'bg-[rgba(0,201,80,0.15)]',
    text: 'text-[#00C950]',
    label: '완료',
  },
};

interface StatusSelectProps {
  value: NodeStatus;
  onChange: (value: NodeStatus) => void;
}

// 상태 선택 컴포넌트 (편집 모드)
export function StatusSelect({ value, onChange }: StatusSelectProps) {
  const statusList = Object.keys(statusStyles) as NodeStatus[];

  return (
    <Select value={value} onValueChange={(v) => onChange(v as NodeStatus)}>
      <SelectTrigger className="w-28 h-7 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusList.map((key) => (
          <SelectItem key={key} value={key}>
            <span
              className={cn(
                'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-lg',
                statusStyles[key].bg,
                statusStyles[key].text
              )}
            >
              {statusStyles[key].label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface SelectedStatusProps {
  status: NodeStatus;
}

// 선택된 상태 표시 컴포넌트 (조회 모드)
export function SelectedStatus({ status }: SelectedStatusProps) {
  const style = statusStyles[status];
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-lg',
        style.bg,
        style.text
      )}
    >
      {style.label}
    </span>
  );
}

// 통합 컴포넌트
interface NodeStatusProps {
  value: NodeStatus;
  isEdit: boolean;
  onChange?: (value: NodeStatus) => void;
}

export function NodeStatusField({ value, isEdit, onChange }: NodeStatusProps) {
  if (isEdit && onChange) {
    return <StatusSelect value={value} onChange={onChange} />;
  }
  return <SelectedStatus status={value} />;
}
