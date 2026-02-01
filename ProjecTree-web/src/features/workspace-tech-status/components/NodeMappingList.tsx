import { NodeListHeader } from './NodeListHeader';
import { NodeListItem } from './NodeListItem';
import type { TechStackNode } from '../types';

interface NodeMappingListProps {
  nodes: TechStackNode[];
  onNodeClick?: (nodeId: string) => void;
}

/**
 * Node Mapping List 컴포넌트
 *
 * 노드 리스트 컨테이너 (헤더 + 아이템들)
 */
export function NodeMappingList({ nodes, onNodeClick }: NodeMappingListProps) {
  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p className="text-sm">표시할 노드가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <NodeListHeader />
      <div className="overflow-auto">
        {nodes.map((node) => (
          <NodeListItem
            key={node.id}
            id={node.id}
            title={node.title}
            priority={node.priority}
            status={node.status}
            confirmedTechs={node.confirmedTechs}
            lastUpdated={node.lastUpdated}
            onClick={() => onNodeClick?.(node.id)}
          />
        ))}
      </div>
    </div>
  );
}
