import type { ServerNode, FlowNode, YjsNode } from '../types/node';

// ===== 서버 → ReactFlow 변환 =====

/** 서버 노드 → ReactFlow 노드 변환 */
export function transformServerNode(serverNode: ServerNode): FlowNode {
  return {
    id: String(serverNode.id),
    type: serverNode.nodeType,
    position: {
      x: serverNode.position.xPos,
      y: serverNode.position.yPos,
    },
    parentId:
      serverNode.parentId !== null ? String(serverNode.parentId) : undefined,
    data: {
      title: serverNode.name,
      status: serverNode.data.nodeStatus,
      taskId: serverNode.data.identifier,
      taskType: serverNode.data.taskType,
      difficult: serverNode.data.difficult,
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
