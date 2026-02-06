import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { StatusTag, type TagType } from '@/shared/components/StatusTag';
import { PriorityBadge } from '@/shared/components/PriorityBadge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { FlowNodeData } from '@/features/workspace-core';
import { useIsCreatingNode, useNodes } from '@/features/workspace-core';

/** 노드 고정 크기 상수 */
export const NODE_DIMENSIONS = {
  width: 180,
  height: 100,
} as const;

type Tags = Array<TagType | null | undefined>;

function PriorityBadgeSlot({
  priority,
}: {
  priority?: FlowNodeData['priority'];
}) {
  if (!priority) {
    return null;
  }

  return (
    <div className="absolute -top-2 -left-2">
      <PriorityBadge priority={priority} />
    </div>
  );
}

function NodeTags({
  tags,
  wrap = false,
  className,
}: {
  tags: Tags;
  wrap?: boolean;
  className?: string;
}) {
  const validTags = tags.filter(Boolean) as TagType[];

  if (validTags.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex gap-1.5 mb-2', wrap && 'flex-wrap', className)}>
      {validTags.map((tag, index) => (
        <StatusTag key={`${tag}-${index}`} type={tag} />
      ))}
    </div>
  );
}

function DifficultyDots({ difficult }: { difficult?: number }) {
  if (!difficult) {
    return null;
  }

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: Math.min(difficult, 5) }).map((_, i) => (
        <span key={i} className="text-[8px] text-yellow">
          ⭐
        </span>
      ))}
    </div>
  );
}

function NodeFooter({
  taskId,
  difficult,
}: {
  taskId: string;
  difficult?: number;
}) {
  return (
    <div className="flex items-center justify-between border-t border-[#DEDEDE]/50 pt-2">
      <span className="text-[10px] text-[#64748B]">{taskId}</span>
      {difficult && <DifficultyDots difficult={difficult} />}
    </div>
  );
}

function NodeTitle({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <p
          className={cn(
            'text-sm font-medium text-[#0B0B0B] line-clamp-2 cursor-default',
            className
          )}
        >
          {title}
        </p>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-[280px] bg-zinc-800 text-white px-3 py-2 rounded-lg shadow-lg"
      >
        <p className="text-sm">{title}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Project 노드
export type ProjectNodeType = Node<FlowNodeData, 'PROJECT'>;
function ProjectNodeComponent({ data, selected }: NodeProps<ProjectNodeType>) {
  const nodeData = data;

  return (
    <div
      className={cn(
        'relative bg-[#F5F3FF] rounded-2xl border-2 border-[#90A1B9] shadow-md p-3',
        'w-[180px]',
        selected && 'ring-2 ring-[#90A1B9] ring-offset-2'
      )}
    >
      <PriorityBadgeSlot priority={nodeData.priority} />

      <NodeTags tags={['PROJECT', nodeData.status]} />

      <NodeTitle title={nodeData.title} />

      <NodeFooter taskId={nodeData.taskId} />

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-[#8B5CF6] border-2 border-white"
      />
    </div>
  );
}

// Epic 노드
export type EpicNodeType = Node<FlowNodeData, 'EPIC'>;
function EpicNodeComponent({ data, selected }: NodeProps<EpicNodeType>) {
  const nodeData = data;

  return (
    <div
      className={cn(
        'relative bg-[#F5F3FF] rounded-2xl border-2 border-[#8B5CF6] shadow-md p-3',
        'w-[180px]',
        selected && 'ring-2 ring-[#8B5CF6] ring-offset-2',
        'shadow-[0_0_10px_#C5BAF8]'
      )}
    >
      <PriorityBadgeSlot priority={nodeData.priority} />

      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-[#8B5CF6] border-2 border-white"
      />

      <NodeTags tags={['EPIC', nodeData.status]} />

      <NodeTitle title={nodeData.title} className="mb-2" />

      <NodeFooter taskId={nodeData.taskId} />

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-[#2B7FFF] border-2 border-white"
      />
    </div>
  );
}

// Story 노드
export type StoryNodeType = Node<FlowNodeData, 'STORY'>;
function StoryNodeComponent({ data, selected }: NodeProps<StoryNodeType>) {
  const nodeData = data;

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 border-[#7CCF00] shadow-md p-3',
        'w-[180px]',
        selected && 'ring-2 ring-offset-2 ring-[#7CCF00]'
      )}
    >
      <PriorityBadgeSlot priority={nodeData.priority} />

      <Handle
        type="target"
        position={Position.Top}
        className={cn('w-2 h-2 border-2 border-white bg-[#2B7FFF]')}
      />

      <NodeTags tags={['STORY', nodeData.status]} wrap />

      <NodeTitle title={nodeData.title} className="mb-2" />

      <NodeFooter taskId={nodeData.taskId} />

      <Handle
        type="source"
        position={Position.Bottom}
        className={cn('w-2 h-2 border-2 border-white bg-[#00D492]')}
      />
    </div>
  );
}

// Task 노드
export type TaskNodeType = Node<FlowNodeData, 'TASK'>;
function TaskNodeComponent({ data, selected }: NodeProps<TaskNodeType>) {
  const nodeData = data;

  const borderColor =
    nodeData.taskType === 'FE' ? 'border-[#F97316]' : 'border-[#6366F1]';
  const bgColor = nodeData.taskType === 'FE' ? 'bg-[#FFF7ED]' : 'bg-[#EEF2FF]';

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 shadow-md p-3',
        'w-[180px]',
        bgColor,
        borderColor,
        selected && 'ring-2 ring-offset-2',
        nodeData.taskType === 'FE' ? 'ring-[#F97316]' : 'ring-[#6366F1]'
      )}
    >
      <PriorityBadgeSlot priority={nodeData.priority} />

      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          'w-2 h-2 border-2 border-white',
          nodeData.taskType === 'FE' ? 'bg-[#00D492]' : 'bg-[#06B6D4]'
        )}
      />

      <NodeTags
        tags={['TASK', nodeData.taskType ?? undefined, nodeData.status]}
        wrap
      />

      <NodeTitle title={nodeData.title} className="mb-2" />

      <NodeFooter taskId={nodeData.taskId} difficult={nodeData.difficult} />

      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          'w-2 h-2 border-2 border-white',
          nodeData.taskType === 'FE' ? 'bg-[#00D492]' : 'bg-[#0891B2]'
        )}
      />
    </div>
  );
}

// Advance 노드
export type AdvanceNodeType = Node<FlowNodeData, 'ADVANCE'>;
function AdvanceNodeComponent({
  id,
  data,
  selected,
}: NodeProps<AdvanceNodeType>) {
  const nodeData = data;
  const nodes = useNodes();
  const currentNode = nodes.find((node) => node.id === id);
  const parentNode = currentNode?.parentId
    ? nodes.find((node) => node.id === currentNode.parentId)
    : undefined;
  const parentTaskType = parentNode?.data.taskType ?? nodeData.taskType;

  const borderColor =
    parentTaskType === 'FE' ? 'border-[#F97316]' : 'border-[#6366F1]';
  const bgColor = parentTaskType === 'FE' ? 'bg-[#FFF7ED]' : 'bg-[#EEF2FF]';
  const handleColor = parentTaskType === 'FE' ? 'bg-[#F97316]' : 'bg-[#6366F1]';

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 shadow-md p-3',
        'w-[180px]',
        bgColor,
        borderColor,
        selected && 'ring-2 ring-offset-2',
        parentTaskType === 'FE' ? 'ring-[#F97316]' : 'ring-[#6366F1]'
      )}
    >
      <PriorityBadgeSlot priority={nodeData.priority} />

      <Handle
        type="target"
        position={Position.Top}
        className={cn('w-2 h-2 border-2 border-white', handleColor)}
      />

      <NodeTags
        tags={['ADVANCE', nodeData.taskType ?? undefined, nodeData.status]}
        wrap
      />

      <NodeTitle title={nodeData.title} className="mb-2" />

      <NodeFooter taskId={nodeData.taskId} difficult={nodeData.difficult} />

      <Handle
        type="source"
        position={Position.Bottom}
        className={cn('w-2 h-2 border-2 border-white', handleColor)}
      />
    </div>
  );
}

// Preview 노드 (더미/미리보기용)
export interface PreviewNodeData extends FlowNodeData {
  isPreview: true;
}
export type PreviewNodeType = Node<PreviewNodeData, 'PREVIEW'>;
function PreviewNodeComponent({ data }: NodeProps<PreviewNodeType>) {
  const isCreating = useIsCreatingNode();

  return (
    <div
      className={cn(
        'relative rounded-2xl p-3 w-[180px]',
        'border-2 border-dashed',
        isCreating
          ? 'border-[#1C69E3] bg-[rgba(28,105,227,0.08)] shadow-[0_0_20px_rgba(28,105,227,0.4)]'
          : 'border-[#1C69E3]/50 bg-[rgba(28,105,227,0.03)]',
        'transition-all duration-300'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 border-2 border-white bg-[#1C69E3]/50"
      />

      {/* 미리보기 태그 */}
      <div className="flex items-center gap-1.5 mb-2">
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-lg',
            'bg-[#1C69E3]/10 text-[#1C69E3] border border-[#1C69E3]/30'
          )}
        >
          <Sparkles className="w-3 h-3" />
          미리보기
        </span>
      </div>

      {/* 노드 제목 */}
      <p
        className={cn(
          'text-sm font-medium line-clamp-2',
          isCreating ? 'text-[#1C69E3]' : 'text-[#0B0B0B]/70'
        )}
      >
        {data.title}
      </p>

      {/* 로딩 오버레이 */}
      {isCreating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-[#1C69E3] animate-spin" />
            <span className="text-xs text-[#1C69E3] font-medium">
              생성 중...
            </span>
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 border-2 border-white bg-[#1C69E3]/50"
      />
    </div>
  );
}

// export---------------------------------------------------------------
export const ProjectNode = memo(ProjectNodeComponent);
export const EpicNode = memo(EpicNodeComponent);
export const StoryNode = memo(StoryNodeComponent);
export const TaskNode = memo(TaskNodeComponent);
export const AdvancedNode = memo(AdvanceNodeComponent);
export const PreviewNode = memo(PreviewNodeComponent);
