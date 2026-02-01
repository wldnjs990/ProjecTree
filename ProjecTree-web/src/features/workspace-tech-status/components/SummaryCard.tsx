import { cn } from '@/lib/utils';
import type { LucideProps } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ComponentType<LucideProps>;
  iconColor?: string;
  subtitle?: string;
}

/**
 * Summary Card 컴포넌트
 *
 * 통계 정보를 표시하는 카드
 * - 아이콘 + 제목
 * - 큰 숫자 값
 * - 증감 표시 (선택)
 * - 부제목 (선택)
 */
export function SummaryCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'bg-violet-100',
  subtitle,
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
      {/* 헤더: 아이콘 + 제목 */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        <div className={cn('p-2 rounded-full', iconColor)}>
          <Icon className="w-4 h-4 text-violet-600" />
        </div>
      </div>

      {/* 메인 값 */}
      <div className="space-y-1">
        <div className="text-3xl font-bold text-foreground">{value}</div>

        {/* 증감 또는 부제목 */}
        {change !== undefined && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span
              className={cn(
                'font-medium',
                change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : ''
              )}
            >
              {change > 0 ? '+' : ''}
              {change}개
            </span>
            <span>전주 대비</span>
          </div>
        )}

        {subtitle && (
          <div className="text-sm text-muted-foreground">{subtitle}</div>
        )}
      </div>
    </div>
  );
}
