import type { NodeType } from '../types/nodeDetail';

export function getChildNodeType(parentType: NodeType): NodeType | null {
  switch (parentType) {
    case 'PROJECT':
      return 'EPIC';
    case 'EPIC':
      return 'STORY';
    case 'STORY':
      return 'TASK';
    case 'TASK':
      return 'ADVANCE';
    default:
      return null;
  }
}
