import type { Node } from '@xyflow/react';
import type { NodeData, NodeDetailData } from '../types/nodeDetail';
import { getAvatarColor } from '@/shared/lib/utils';

/**
 * 노드 타입을 계층 레벨로 매핑
 */
function getNodeLevel(nodeType: string): number {
  const levelMap: Record<string, number> = {
    PROJECT: 0,
    EPIC: 1,
    STORY: 2,
    TASK: 3,
    ADVANCE: 4,
  };
  return levelMap[nodeType] ?? 0;
}

/**
 * 노드 상태를 SpecSheetView 형식으로 매핑
 */
function mapStatus(status: string): 'TODO' | 'IN_PROGRESS' | 'DONE' {
  const statusMap: Record<string, 'TODO' | 'IN_PROGRESS' | 'DONE'> = {
    pending: 'TODO',
    progress: 'IN_PROGRESS',
    completed: 'DONE',
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
  };
  return statusMap[status] ?? 'TODO';
}

/**
 * 노드 데이터를 FeatureSpecView가 사용할 수 있는 형식으로 변환
 */
export function transformNodesForSpecView(
  nodes: Node[],
  nodeDetails?: Record<number, NodeDetailData>,
  nodeListData?: Record<number, NodeData>,
) {
  return nodes.map((node) => {
    const nodeId = Number(node.id);
    const listItem = nodeListData?.[nodeId];
    const assignee = nodeDetails?.[nodeId]?.assignee;
    const specAssignee = assignee
      ? {
          id: assignee.id,
          name: assignee.name || assignee.nickname || '',
          initials: (assignee.nickname?.[0] || assignee.name?.[0] || 'U').toUpperCase(),
          color: getAvatarColor(assignee.id),
        }
      : undefined;

    return {
      ...node,
      data: {
        ...node.data,
        label: node.data.title || '',
        level: getNodeLevel(node.type ?? 'ADVANCE'),
        complexity: listItem?.difficult ?? node.data.difficult,
        status: mapStatus((listItem?.status ?? node.data.status as string) ?? 'TODO'),
        priority: listItem?.priority || node.data.priority || 'P2',
        assignee: specAssignee,
      },
    };
  });
}
