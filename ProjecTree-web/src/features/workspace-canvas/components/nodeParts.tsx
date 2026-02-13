import { cn } from '@/shared/lib/utils';
import { StatusTag, type TagType } from '@/shared/components/StatusTag';
import { PriorityBadge } from '@/shared/components/PriorityBadge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { FlowNodeData } from '@/features/workspace-core';
import { useNodePresence } from '@/features/workspace-core';

export type Tags = Array<TagType | null | undefined>;

export function NodePresenceAvatars({ nodeId }: { nodeId: string }) {
  const { getUsersForNode } = useNodePresence();
  const users = getUsersForNode(nodeId);
  if (users.length === 0) return null;

  const visible = users.slice(0, 3);
  const remaining = users.length - visible.length;

  return (
    <div className="absolute -top-2 -right-2 flex items-center">
      {visible.map((user, index) => (
        <div
          key={user.id}
          className={cn(
            'h-6 w-6 rounded-full border-2 border-white text-[10px] font-semibold text-white flex items-center justify-center shadow-sm',
            index > 0 && '-ml-2'
          )}
          style={{ backgroundColor: user.color }}
          title={user.name}
        >
          {user.initials}
        </div>
      ))}
      {remaining > 0 && (
        <div className="h-6 w-6 -ml-2 rounded-full border-2 border-white bg-[#E2E8F0] text-[10px] font-semibold text-[#475569] flex items-center justify-center shadow-sm">
          +{remaining}
        </div>
      )}
    </div>
  );
}

export function PriorityBadgeSlot({
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

// 노드 타입(프로젝트, 에픽, 스토리, 테스크, 어드벤스)
export function NodeTags({
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

// 난이도
function DifficultyDots({ difficult }: { difficult?: number }) {
  if (!difficult) {
    return null;
  }

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: Math.min(difficult, 5) }).map((_, i) => (
        <span key={i} className="text-[8px] text-yellow">
          *
        </span>
      ))}
    </div>
  );
}

// 노드 하단
export function NodeFooter({
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

// 노드 제목
export function NodeTitle({
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
        className="max-w-70 bg-zinc-800 text-white px-3 py-2 rounded-lg shadow-lg"
      >
        <p className="text-sm">{title}</p>
      </TooltipContent>
    </Tooltip>
  );
}
