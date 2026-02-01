import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface NodeListItemProps {
  id: string;
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  status: string;
  confirmedTechs: string[];
  lastUpdated: string;
  onClick?: () => void;
}

// 우선순위 뱃지 스타일
const priorityStyles = {
  P0: 'bg-red-100 text-red-600 border-red-200',
  P1: 'bg-amber-100 text-amber-600 border-amber-200',
  P2: 'bg-slate-100 text-slate-600 border-slate-200',
};

// 상태 뱃지 스타일
const statusStyles = {
  progress: 'bg-blue-100 text-blue-600',
  pending: 'bg-gray-100 text-gray-600',
  completed: 'bg-green-100 text-green-600',
};

const statusLabels = {
  progress: '진행중',
  pending: '대기',
  completed: '완료',
};

/**
 * Node List Item 컴포넌트
 *
 * 노드 리스트의 각 행
 */
export function NodeListItem({
  title,
  priority,
  status,
  confirmedTechs,
  lastUpdated,
  onClick,
}: NodeListItemProps) {
  // 상대 시간 계산 (15분 전, 1시간 전)
  const timeAgo = formatDistanceToNow(new Date(lastUpdated), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <div
      className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr_auto] gap-4 px-6 py-4 border-b hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      {/* 노드명 */}
      <div className="font-medium text-sm truncate">{title}</div>

      {/* 우선순위 */}
      <div className="flex justify-center">
        <Badge
          className={cn('text-xs font-medium border', priorityStyles[priority])}
        >
          {priority}
        </Badge>
      </div>

      {/* 상태 */}
      <div className="flex justify-center">
        <Badge
          className={cn(
            'text-xs',
            statusStyles[status as keyof typeof statusStyles]
          )}
        >
          {statusLabels[status as keyof typeof statusLabels]}
        </Badge>
      </div>

      {/* 기술 스택 */}
      <div className="flex flex-wrap gap-1">
        {confirmedTechs.map((tech) => (
          <span
            key={tech}
            className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* 업데이트 */}
      <div className="text-xs text-muted-foreground text-center">{timeAgo}</div>

      {/* 화살표 아이콘 */}
      <div className="flex items-center justify-center">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}
