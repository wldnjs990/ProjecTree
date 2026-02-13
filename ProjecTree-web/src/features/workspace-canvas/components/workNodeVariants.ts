import { cn } from '@/shared/lib/utils';
import type { FlowNodeData } from '@/features/workspace-core';
import type { Tags } from './nodeParts';

export type WorkNodeKind = 'PROJECT' | 'EPIC' | 'STORY' | 'TASK' | 'ADVANCE';

interface WorkNodeVariantParams {
  nodeType: WorkNodeKind;
  selected: boolean;
  taskType?: FlowNodeData['taskType'];
  status?: FlowNodeData['status'];
}

export interface WorkNodeRenderState {
  hasTargetHandle: boolean;
  tagWrap: boolean;
  showDifficulty: boolean;
  titleClass?: string;
  tags: Tags;
  containerClass: string;
  topHandleClass: string;
  bottomHandleClass: string;
}

export function getWorkNodeRenderState({
  nodeType,
  selected,
  taskType,
  status,
}: WorkNodeVariantParams): WorkNodeRenderState {
  const isFrontendTone = taskType === 'FE';

  const baseState: Omit<
    WorkNodeRenderState,
    'containerClass' | 'topHandleClass' | 'bottomHandleClass' | 'tags'
  > = {
    hasTargetHandle: nodeType !== 'PROJECT',
    tagWrap:
      nodeType === 'STORY' || nodeType === 'TASK' || nodeType === 'ADVANCE',
    showDifficulty: nodeType === 'TASK' || nodeType === 'ADVANCE',
    titleClass: nodeType === 'PROJECT' ? undefined : 'mb-2',
  };

  switch (nodeType) {
    case 'PROJECT':
      return {
        ...baseState,
        tags: ['PROJECT', status],
        containerClass: cn(
          'bg-[#F5F3FF] border-[#90A1B9]',
          selected && 'ring-2 ring-[#90A1B9] ring-offset-2'
        ),
        topHandleClass: '',
        bottomHandleClass: 'w-2 h-2 bg-[#8B5CF6] border-2 border-white',
      };
    case 'EPIC':
      return {
        ...baseState,
        tags: ['EPIC', status],
        containerClass: cn(
          'bg-[#F5F3FF] border-[#8B5CF6] shadow-[0_0_10px_#C5BAF8]',
          selected && 'ring-2 ring-[#8B5CF6] ring-offset-2'
        ),
        topHandleClass: 'w-2 h-2 bg-[#8B5CF6] border-2 border-white',
        bottomHandleClass: 'w-2 h-2 bg-[#2B7FFF] border-2 border-white',
      };
    case 'STORY':
      return {
        ...baseState,
        tags: ['STORY', status],
        containerClass: cn(
          'border-[#7CCF00]',
          selected && 'ring-2 ring-offset-2 ring-[#7CCF00]'
        ),
        topHandleClass: 'w-2 h-2 border-2 border-white bg-[#2B7FFF]',
        bottomHandleClass: 'w-2 h-2 border-2 border-white bg-[#00D492]',
      };
    case 'TASK':
      return {
        ...baseState,
        tags: ['TASK', taskType ?? undefined, status],
        containerClass: cn(
          isFrontendTone
            ? 'bg-[#FFF7ED] border-[#F97316]'
            : 'bg-[#EEF2FF] border-[#6366F1]',
          selected && 'ring-2 ring-offset-2',
          isFrontendTone ? 'ring-[#F97316]' : 'ring-[#6366F1]'
        ),
        topHandleClass: cn(
          'w-2 h-2 border-2 border-white',
          isFrontendTone ? 'bg-[#00D492]' : 'bg-[#06B6D4]'
        ),
        bottomHandleClass: cn(
          'w-2 h-2 border-2 border-white',
          isFrontendTone ? 'bg-[#00D492]' : 'bg-[#0891B2]'
        ),
      };
    case 'ADVANCE':
      return {
        ...baseState,
        tags: ['ADVANCE', taskType ?? undefined, status],
        containerClass: cn(
          isFrontendTone
            ? 'bg-[#FFF7ED] border-[#F97316]'
            : 'bg-[#EEF2FF] border-[#6366F1]',
          selected && 'ring-2 ring-offset-2',
          isFrontendTone ? 'ring-[#F97316]' : 'ring-[#6366F1]'
        ),
        topHandleClass: cn(
          'w-2 h-2 border-2 border-white',
          isFrontendTone ? 'bg-[#F97316]' : 'bg-[#6366F1]'
        ),
        bottomHandleClass: cn(
          'w-2 h-2 border-2 border-white',
          isFrontendTone ? 'bg-[#F97316]' : 'bg-[#6366F1]'
        ),
      };
  }
}
