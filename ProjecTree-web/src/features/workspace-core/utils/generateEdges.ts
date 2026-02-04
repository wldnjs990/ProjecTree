import type { Edge } from '@xyflow/react';
import dagre from 'dagre';
import type { FlowNode, ServerNodeType } from '../types/node';

/** 노드 고정 크기 상수 (Nodes.tsx와 동기화) */
const NODE_WIDTH = 180;
const NODE_HEIGHT = 100;

/** 노드 타입별 엣지 색상 */
const EDGE_COLORS: Record<ServerNodeType, string> = {
  PROJECT: '#8B5CF6', // purple
  EPIC: '#8B5CF6', // purple
  STORY: '#2B7FFF', // blue
  TASK: '#00D492', // green
  ADVANCE: '#06B6D4', // cyan
};

/** 기본 엣지 스타일 */
const DEFAULT_EDGE_STYLE = {
  strokeWidth: 2,
  strokeDasharray: '5 5',
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
        type: 'bezier',
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

/** 자동정렬 레이아웃 방향 */
export type LayoutDirection = 'TB' | 'BT' | 'LR' | 'RL';

/** 자동정렬 옵션 */
export interface AutoLayoutOptions {
  /** 레이아웃 방향 (기본값: TB - 위에서 아래로) */
  direction?: LayoutDirection;
  /** 노드 간 수평 간격 (기본값: 80) */
  nodeSpacingX?: number;
  /** 노드 간 수직 간격 (기본값: 100) */
  nodeSpacingY?: number;
}

/**
 * dagre를 사용해 노드들을 자동 정렬
 * @param nodes - ReactFlow 노드 배열
 * @param edges - ReactFlow 엣지 배열
 * @param options - 레이아웃 옵션
 * @returns 위치가 업데이트된 노드 배열
 */
export function getAutoLayoutedNodes(
  nodes: FlowNode[],
  edges: Edge[],
  options: AutoLayoutOptions = {}
): FlowNode[] {
  const {
    direction = 'TB',
    nodeSpacingX = 80,
    nodeSpacingY = 100,
  } = options;

  // dagre 그래프 생성
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // 그래프 설정
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacingX,
    ranksep: nodeSpacingY,
    marginx: 50,
    marginy: 50,
  });

  // 노드 추가
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  // 엣지 추가
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // 레이아웃 계산
  dagre.layout(dagreGraph);

  // 새 위치가 적용된 노드 반환
  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        // dagre는 노드 중심 좌표를 반환하므로 좌상단으로 변환
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });
}
