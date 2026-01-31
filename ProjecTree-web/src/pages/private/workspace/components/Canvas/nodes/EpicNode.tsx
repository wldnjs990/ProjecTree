import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { StatusTag } from '@/shared/components/StatusTag';
import { PriorityBadge } from '@/shared/components/PriorityBadge';
import type { FlowNodeData } from '@/pages/private/workspace/types/node';

export type EpicNodeType = Node<FlowNodeData, 'EPIC'>;

function EpicNodeComponent({ data, selected }: NodeProps<EpicNodeType>) {
  const nodeData = data;

  return (
    <div
      className={cn(
        'relative bg-[#F5F3FF] rounded-2xl border-2 border-[#8B5CF6] shadow-md p-3 min-w-40',
        selected && 'ring-2 ring-[#8B5CF6] ring-offset-2',
        'shadow-[0_0_10px_#C5BAF8]'
      )}
    >
      {/* Priority Badge */}
      {nodeData.priority && (
        <div className="absolute -top-2 -left-2">
          <PriorityBadge priority={nodeData.priority} />
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-[#8B5CF6] border-2 border-white"
      />

      {/* Tags */}
      <div className="flex gap-1.5 mb-2">
        <StatusTag type="EPIC" />
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

      {/* Source Handle - Edge color: #2B7FFF (epic→story) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-[#2B7FFF] border-2 border-white"
      />
    </div>
  );
}

export const EpicNode = memo(EpicNodeComponent);
