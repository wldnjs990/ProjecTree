import { Check, Plus } from 'lucide-react';
import type { Candidate } from '../types';
import { cn } from '@/shared/lib/utils';

interface SubNodeCardProps extends React.HTMLAttributes<HTMLButtonElement> {
  node: Candidate;
  onClick: () => void;
  isSelected?: boolean;
  disabled?: boolean;
}

export function SubNodeCard({
  node,
  onClick,
  isSelected = false,
  disabled = false,
}: SubNodeCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col w-full items-start justify-between p-2.5 border rounded-lg transition-all',
        isSelected
          ? 'bg-[rgba(28,105,227,0.05)] border-[rgba(28,105,227,0.5)]'
          : 'border-[#DEDEDE] hover:bg-[#1c69e30d]',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
      )}
    >
      <div className="flex-1 min-w-0 w-full flex items-center justify-between">
        <p className="text-xs font-medium text-[#0B0B0B] truncate">
          {node.name}
        </p>
        <div className="ml-2 p-1 text-[#636363]">
          {isSelected ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
        </div>
      </div>
      <div className="text-left mt-1.5">
        <p className="text-[10px] text-[#636363] mt-0.5">{node.summary}</p>
      </div>
    </button>
  );
}
