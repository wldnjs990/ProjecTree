import type { Edge } from '@xyflow/react';
import type { FlowNode, ServerNodeType } from '../types/node';

/** 노드 타입별 엣지 색상 */
const EDGE_COLORS: Record<ServerNodeType, string> = {
  PROJECT: '#8B5CF6', // purple
  EPIC: '#8B5CF6', // purple
  STORY: '#2B7FFF', // blue
  TASK: '#00D492', // green
  ADVANCED: '#06B6D4', // cyan
};

/** 기본 엣지 스타일 */
const DEFAULT_EDGE_STYLE = {
  strokeWidth: 2,
};

/**
 * parentId 기반으로 edges 자동 생성
 * @param nodes - ReactFlow 노드 배열 (parentId 포함)
 * @returns Edge 배열
 */
export function generateEdges(nodes: FlowNode[]): Edge[] {
  return nodes
    .filter((node) => node.parentId !== undefined)
    .map((node) => {
      // 부모 노드의 타입으로 색상 결정
      const parentNode = nodes.find((n) => n.id === node.parentId);
      const edgeColor = parentNode
        ? EDGE_COLORS[parentNode.type]
        : EDGE_COLORS.TASK;

      return {
        id: `e-${node.parentId}-${node.id}`,
        source: node.parentId!,
        target: node.id,
        type: 'smoothstep',
        style: {
          stroke: edgeColor,
          ...DEFAULT_EDGE_STYLE,
        },
      };
    });
}

/**
 * 특정 노드의 자식 노드들 찾기
 * @param nodes - 전체 노드 배열
 * @param parentId - 부모 노드 ID
 * @returns 자식 노드 배열
 */
export function findChildNodes(
  nodes: FlowNode[],
  parentId: string
): FlowNode[] {
  return nodes.filter((node) => node.parentId === parentId);
}

/**
 * 특정 노드의 모든 하위 노드들 찾기 (재귀)
 * @param nodes - 전체 노드 배열
 * @param parentId - 부모 노드 ID
 * @returns 모든 하위 노드 배열
 */
export function findAllDescendants(
  nodes: FlowNode[],
  parentId: string
): FlowNode[] {
  const children = findChildNodes(nodes, parentId);
  const descendants: FlowNode[] = [...children];

  children.forEach((child) => {
    descendants.push(...findAllDescendants(nodes, child.id));
  });

  return descendants;
}

/**
 * 루트 노드 찾기 (parentId가 undefined인 노드)
 * @param nodes - 전체 노드 배열
 * @returns 루트 노드 또는 undefined
 */
export function findRootNode(nodes: FlowNode[]): FlowNode | undefined {
  return nodes.find((node) => node.parentId === undefined);
}
