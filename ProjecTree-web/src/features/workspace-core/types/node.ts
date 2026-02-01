import type { Node } from '@xyflow/react';

// ===== 서버 응답 타입 =====

/** 서버에서 받는 노드 타입 */
export type ServerNodeType = 'PROJECT' | 'EPIC' | 'STORY' | 'TASK' | 'ADVANCE';

/** 서버에서 받는 노드 상태 */
export type ServerNodeStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

/** 서버에서 받는 태스크 타입 */
export type ServerTaskType = 'FE' | 'BE' | null;

/** 서버에서 받는 우선순위 타입 */
export type ServerPriority = 'P0' | 'P1' | 'P2';

/** 서버 응답의 position 형식 */
export interface ServerPosition {
  xpos: number;
  ypos: number;
}

/** 서버 응답의 노드 data 형식 */
export interface ServerNodeData {
  identifier: string;
  taskType: ServerTaskType;
  nodeStatus: ServerNodeStatus;
  difficult?: number; // TASK, ADVANCED 타입에만 존재
}

/** 서버에서 받는 노드 형식 */
export interface ServerNode {
  id: number;
  name: string;
  nodeType: ServerNodeType;
  position: ServerPosition;
  parentId: number | null;
  data: ServerNodeData;
}

/** 서버 API 응답 형식 */
export interface ServerResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

// ===== ReactFlow 노드 타입 =====

/** ReactFlow 노드의 data 형식 */
export interface FlowNodeData {
  title: string;
  status: ServerNodeStatus;
  taskId: string;
  taskType?: ServerTaskType;
  difficult?: number;
  priority?: ServerPriority;
  [key: string]: unknown; // ReactFlow 호환용 인덱스 시그니처
}

/** ReactFlow에서 사용하는 노드 형식 (parentId 포함) */
export interface FlowNode extends Node {
  type: ServerNodeType;
  parentId?: string; // undefined = 루트 노드
  data: FlowNodeData;
}

// ===== Y.js 저장용 타입 =====

/** Y.Map에 저장되는 노드 형식 */
export interface YjsNode {
  id: string;
  type: ServerNodeType;
  parentId?: string; // undefined = 루트 노드
  position: { x: number; y: number };
  data: FlowNodeData;
}

// ===== 스토어 타입 =====

/** 연결 상태 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

/** Edge 스타일 설정 */
export interface EdgeStyle {
  stroke: string;
  strokeWidth: number;
}

// ===== 타입 가드 =====

export function isFlowNode(node: Node): node is FlowNode {
  return 'data' in node && 'type' in node;
}
