import { Plus } from 'lucide-react';
import type { Candidate } from '../types';

interface SubNodeCardProps extends React.HTMLAttributes<HTMLButtonElement> {
  node: Candidate;
  onClick: () => void;
}

export function SubNodeCard({ node, onClick }: SubNodeCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col w-full items-start justify-between p-2.5 border border-[#DEDEDE] hover:bg-[#1c69e30d] rounded-lg"
    >
      <div className="flex-1 min-w-0 w-full flex items-center justify-between">
        <p className="text-xs font-medium text-[#0B0B0B] truncate">
          {node.name}
        </p>
        <div className="ml-2 p-1 text-[#636363]">
          <Plus className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="text-left mt-1.5">
        <p className="text-[10px] text-[#636363] mt-0.5">{node.description}</p>
      </div>
    </button>
  );
}
