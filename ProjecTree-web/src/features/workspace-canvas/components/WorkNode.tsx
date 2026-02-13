import { Handle, Position } from '@xyflow/react';
import type { FlowNodeData } from '@/features/workspace-core';
import { useNodes } from '@/features/workspace-core';
import {
  NodeFooter,
  NodePresenceAvatars,
  NodeTags,
  NodeTitle,
  PriorityBadgeSlot,
} from './nodeParts';
import {
  getWorkNodeRenderState,
  type WorkNodeKind,
} from './workNodeVariants';

interface WorkNodeProps {
  id: string;
  data: FlowNodeData;
  selected: boolean;
  nodeType: WorkNodeKind;
}

export function WorkNode({ id, data, selected, nodeType }: WorkNodeProps) {
  const nodes = useNodes();
  const currentNode = nodes.find((node) => node.id === id);
  const parentNode = currentNode?.parentId
    ? nodes.find((node) => node.id === currentNode.parentId)
    : undefined;

  const resolvedTaskType =
    nodeType === 'ADVANCE'
      ? (parentNode?.data.taskType ?? data.taskType)
      : data.taskType;

  const renderState = getWorkNodeRenderState({
    nodeType,
    selected,
    taskType: resolvedTaskType,
    status: data.status,
  });

  return (
    <div
      className={`relative rounded-2xl border-2 shadow-md p-3 w-[180px] ${renderState.containerClass}`}
    >
      <PriorityBadgeSlot priority={data.priority} />
      <NodePresenceAvatars nodeId={id} />

      {renderState.hasTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className={renderState.topHandleClass}
        />
      )}

      <NodeTags tags={renderState.tags} wrap={renderState.tagWrap} />

      <NodeTitle title={data.title} className={renderState.titleClass} />

      <NodeFooter
        taskId={data.taskId}
        difficult={renderState.showDifficulty ? data.difficult : undefined}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        className={renderState.bottomHandleClass}
      />
    </div>
  );
}

export type { WorkNodeKind };
