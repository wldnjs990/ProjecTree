import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { StatusTag } from '@/components/custom/StatusTag';
import {
  PriorityBadge,
  type Priority,
} from '@/components/custom/PriorityBadge';

export interface AdvancedNodeData extends Record<string, unknown> {
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  taskId: string;
  category: 'frontend' | 'backend';
  priority?: Priority;
  difficult?: number;
}

export type AdvancedNodeType = Node<AdvancedNodeData, 'advanced'>;

function AdvancedNodeComponent({
  data,
  selected,
}: NodeProps<AdvancedNodeType>) {
  const nodeData = data;

  const borderColor =
    nodeData.category === 'frontend' ? 'border-[#F97316]' : 'border-[#6366F1]';
  const bgColor =
    nodeData.category === 'frontend' ? 'bg-[#FFF7ED]' : 'bg-[#EEF2FF]';

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 shadow-md p-3 min-w-40',
        bgColor,
        borderColor,
        selected && 'ring-2 ring-offset-2',
        nodeData.category === 'frontend' ? 'ring-[#F97316]' : 'ring-[#6366F1]'
      )}
    >
      {/* Priority Badge */}
      {nodeData.priority && (
        <div className="absolute -top-2 -left-2">
          <PriorityBadge priority={nodeData.priority} />
        </div>
      )}

      {/* Target Handle - Edge color: #00D492 (FE) / #0891B2 (BE) from task→advanced */}
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          'w-2 h-2 border-2 border-white',
          nodeData.category === 'frontend' ? 'bg-[#00D492]' : 'bg-[#0891B2]'
        )}
      />

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        <StatusTag type="advanced" />
        <StatusTag type={nodeData.category} />
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

      {/* Source Handle - same as target for consistency */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          'w-2 h-2 border-2 border-white',
          nodeData.category === 'frontend' ? 'bg-[#00D492]' : 'bg-[#0891B2]'
        )}
      />
    </div>
  );
}

export const AdvancedNode = memo(AdvancedNodeComponent);
