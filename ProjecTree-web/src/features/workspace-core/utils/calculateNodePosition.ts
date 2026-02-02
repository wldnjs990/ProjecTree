import type { FlowNode } from '../types/node';
import { findChildNodes } from './generateEdges';

/** 부모-자식 수직 간격 */
const NODE_VERTICAL_SPACING = 130;

/** 형제 노드 수평 간격 */
const NODE_HORIZONTAL_SPACING = 200;

/**
 * 새 자식 노드의 위치 계산
 * @param nodes - 전체 노드 배열
 * @param parentId - 부모 노드 ID
 * @returns 새 노드의 좌표 { xpos, ypos }
 */
export function calculateChildNodePosition(
  nodes: FlowNode[],
  parentId: string
): { xpos: number; ypos: number } {
  // 부모 노드 찾기
  const parentNode = nodes.find((n) => n.id === parentId);
  if (!parentNode) {
    // 부모 노드가 없으면 기본 위치 반환
    return { xpos: 200, ypos: 200 };
  }

  // 기존 형제 노드들 조회
  const siblings = findChildNodes(nodes, parentId);

  // 첫 자식인 경우: 부모 바로 아래
  if (siblings.length === 0) {
    return {
      xpos: parentNode.position.x,
      ypos: parentNode.position.y + NODE_VERTICAL_SPACING,
    };
  }

  // 추가 자식인 경우: 가장 오른쪽 형제 노드 + 수평 간격
  const rightmostSibling = siblings.reduce((rightmost, current) =>
    current.position.x > rightmost.position.x ? current : rightmost
  );

  return {
    xpos: rightmostSibling.position.x + NODE_HORIZONTAL_SPACING,
    ypos: parentNode.position.y + NODE_VERTICAL_SPACING,
  };
}
