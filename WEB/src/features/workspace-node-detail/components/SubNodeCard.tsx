import type { KeyboardEvent } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import type { Candidate } from '../types';
import { cn } from '@/shared/lib/utils';

interface SubNodeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  node: Candidate;
  onClick: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  deleteDisabled?: boolean;
}

export function SubNodeCard({
  node,
  onClick,
  onDelete,
  isSelected = false,
  disabled = false,
  deleteDisabled = false,
}: SubNodeCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex flex-col w-full items-start justify-between p-2.5 border rounded-lg transition-all',
        isSelected
          ? 'bg-[rgba(28,105,227,0.05)] border-[rgba(28,105,227,0.5)]'
          : 'border-[#DEDEDE] hover:bg-[#1c69e30d]',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
      )}
    >
      <div className="flex-1 min-w-0 w-full flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-[#0B0B0B] truncate">
          {node.name}
        </p>
        <div className="ml-2 flex items-center gap-1 text-[#636363]">
          {onDelete && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (!deleteDisabled) {
                  onDelete();
                }
              }}
              disabled={deleteDisabled}
              className={cn(
                'p-1 rounded hover:bg-black/5 transition-colors',
                deleteDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
              )}
              aria-label="후보 삭제"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="p-1">
            {isSelected ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
      </div>
      <div className="text-left mt-1.5">
        <p className="text-[10px] text-[#636363] mt-0.5">{node.summary}</p>
      </div>
    </div>
  );
}
