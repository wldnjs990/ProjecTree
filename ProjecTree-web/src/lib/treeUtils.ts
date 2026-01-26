import type { Node, Edge } from '@xyflow/react';
import type {
  ProjectItem,
  ProjectItemType,
} from '../pages/workspace/components/Sidebar/ProjectTreeItem';

export function buildProjectTree(nodes: Node[], edges: Edge[]): ProjectItem[] {
  if (!nodes || !edges) return [];

  // 1. Map all nodes to ProjectItem format (without children initially)
  const itemMap = new Map<string, ProjectItem>();

  nodes.forEach((node) => {
    // Determine type safely
    let type: ProjectItemType = 'task'; // default
    if (
      ['project', 'epic', 'story', 'task', 'advanced'].includes(node.type || '')
    ) {
      type = node.type as ProjectItemType;
    }

    itemMap.set(node.id, {
      id: node.id,
      type,
      title: (node.data.title as string) || 'Untitled',
      children: [],
    });
  });

  // 2. Build hierarchy based on edges
  const childrenIds = new Set<string>();

  edges.forEach((edge) => {
    const parent = itemMap.get(edge.source);
    const child = itemMap.get(edge.target);

    if (parent && child) {
      parent.children?.push(child);
      childrenIds.add(child.id);
    }
  });

  // 3. Find roots (items that are not children of anyone)
  const roots: ProjectItem[] = [];
  itemMap.forEach((item) => {
    if (!childrenIds.has(item.id)) {
      roots.push(item);
    }
  });

  return roots;
}
