import type {
  ServerNode,
  ServerNodeType,
  ServerNodeStatus,
  ServerTaskType,
  FlowNode,
  FlowNodeType,
  FlowNodeStatus,
  FlowCategory,
  YjsNode,
} from '../types/node';

// ===== 서버 → ReactFlow 변환 =====

/** 서버 노드 타입 → ReactFlow 노드 타입 */
function convertNodeType(serverType: ServerNodeType): FlowNodeType {
  const typeMap: Record<ServerNodeType, FlowNodeType> = {
    PROJECT: 'project',
    EPIC: 'epic',
    STORY: 'story',
    TASK: 'task',
    ADVANCED: 'advanced',
  };
  return typeMap[serverType];
}

/** 서버 상태 → ReactFlow 상태 */
function convertStatus(serverStatus: ServerNodeStatus): FlowNodeStatus {
  const statusMap: Record<ServerNodeStatus, FlowNodeStatus> = {
    TODO: 'pending',
    IN_PROGRESS: 'progress',
    DONE: 'completed',
  };
  return statusMap[serverStatus];
}

/** 서버 태스크 타입 → ReactFlow 카테고리 */
function convertTaskType(taskType: ServerTaskType): FlowCategory | undefined {
  if (taskType === 'FE') return 'frontend';
  if (taskType === 'BE') return 'backend';
  return undefined;
}

/** 서버 노드 → ReactFlow 노드 변환 */
export function transformServerNode(serverNode: ServerNode): FlowNode {
  return {
    id: String(serverNode.id),
    type: convertNodeType(serverNode.nodeType),
    position: {
      x: serverNode.position.xPos,
      y: serverNode.position.yPos,
    },
    parentId:
      serverNode.parentId !== null ? String(serverNode.parentId) : undefined,
    data: {
      title: serverNode.name,
      status: convertStatus(serverNode.data.nodeStatus),
      taskId: serverNode.data.identifier,
      category: convertTaskType(serverNode.data.taskType),
      storyPoints: serverNode.data.difficult,
    },
  };
}

/** 서버 노드 배열 → ReactFlow 노드 배열 변환 */
export function transformServerNodes(serverNodes: ServerNode[]): FlowNode[] {
  return serverNodes.map(transformServerNode);
}

// ===== ReactFlow → Y.js 변환 =====

/** ReactFlow 노드 → Y.js 저장용 객체 */
export function flowNodeToYjsNode(node: FlowNode): YjsNode {
  return {
    id: node.id,
    type: node.type,
    parentId: node.parentId,
    position: { ...node.position },
    data: { ...node.data },
  };
}

/** Y.js 저장용 객체 → ReactFlow 노드 */
export function yjsNodeToFlowNode(yjsNode: YjsNode): FlowNode {
  return {
    id: yjsNode.id,
    type: yjsNode.type,
    position: { ...yjsNode.position },
    parentId: yjsNode.parentId,
    data: { ...yjsNode.data },
  };
}

// ===== ReactFlow → 서버 변환 (필요시) =====

/** ReactFlow 상태 → 서버 상태 */
export function convertStatusToServer(
  status: FlowNodeStatus
): ServerNodeStatus {
  const statusMap: Record<FlowNodeStatus, ServerNodeStatus> = {
    pending: 'TODO',
    progress: 'IN_PROGRESS',
    completed: 'DONE',
  };
  return statusMap[status];
}

/** ReactFlow 노드 타입 → 서버 노드 타입 */
export function convertNodeTypeToServer(type: FlowNodeType): ServerNodeType {
  const typeMap: Record<FlowNodeType, ServerNodeType> = {
    project: 'PROJECT',
    epic: 'EPIC',
    story: 'STORY',
    task: 'TASK',
    advanced: 'ADVANCED',
  };
  return typeMap[type];
}
