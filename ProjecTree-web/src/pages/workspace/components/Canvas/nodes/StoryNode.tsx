import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { StatusTag } from '@/components/custom/StatusTag';
import { PriorityBadge } from '@/components/custom/PriorityBadge';
import type { FlowNodeData } from '@/pages/workspace/types/node';

export type StoryNodeType = Node<FlowNodeData, 'STORY'>;

function StoryNodeComponent({ data, selected }: NodeProps<StoryNodeType>) {
  const nodeData = data;

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 border-[#7CCF00] shadow-md p-3 min-w-40',
        selected && 'ring-2 ring-offset-2 ring-[#7CCF00]'
      )}
    >
      {/* Priority Badge */}
      {nodeData.priority && (
        <div className="absolute -top-2 -left-2">
          <PriorityBadge priority={nodeData.priority} />
        </div>
      )}

      {/* Target Handle - Edge color: #2B7FFF (epic→story) */}
      <Handle
        type="target"
        position={Position.Top}
        className={cn('w-2 h-2 border-2 border-white bg-[#2B7FFF]')}
      />

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        <StatusTag type="STORY" />
        <StatusTag type={nodeData.status} />
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-[#0B0B0B] mb-2">
        {nodeData.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#DEDEDE]/50 pt-2">
        <span className="text-[10px] text-[#64748B]">{nodeData.taskId}</span>
        {nodeData.difficult && (
          <div className="flex gap-0.5">
            {Array.from({ length: Math.min(nodeData.difficult, 5) }).map(
              (_, i) => (
                <span key={i} className="text-[8px] text-yellow">
                  ★
                </span>
              )
            )}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={cn('w-2 h-2 border-2 border-white bg-[#00D492]')}
      />
    </div>
  );
}

export const StoryNode = memo(StoryNodeComponent);
