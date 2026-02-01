import { Button } from '@/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { NodeLevel } from '../types';

interface LevelToggleProps {
  selectedLevel: NodeLevel | 'all';
  onLevelChange: (level: NodeLevel | 'all') => void;
}

/**
 * Level Toggle 컴포넌트
 *
 * Task / Advance 레벨을 토글하는 버튼 그룹
 */
export function LevelToggle({
  selectedLevel,
  onLevelChange,
}: LevelToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        노드 레벨 비교
      </span>
      <div className="inline-flex rounded-md border border-border bg-background">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'rounded-r-none border-r',
            selectedLevel === 'TASK' && 'bg-muted'
          )}
          onClick={() => onLevelChange('TASK')}
        >
          Task
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'rounded-l-none',
            selectedLevel === 'ADVANCE' && 'bg-muted'
          )}
          onClick={() => onLevelChange('ADVANCE')}
        >
          Advance
        </Button>
      </div>
    </div>
  );
}
