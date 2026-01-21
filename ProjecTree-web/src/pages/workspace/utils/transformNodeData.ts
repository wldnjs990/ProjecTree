import type { Node } from "@xyflow/react";

/**
 * 노드 타입을 계층 레벨로 매핑
 */
function getNodeLevel(nodeType: string): number {
  const levelMap: Record<string, number> = {
    project: 0,
    epic: 1,
    story: 2,
    task: 3,
    advanced: 4,
  };
  return levelMap[nodeType] ?? 0;
}

/**
 * 노드 상태를 SpecSheetView 형식으로 매핑
 */
function mapStatus(status: string): "TODO" | "IN_PROGRESS" | "DONE" {
  const statusMap: Record<string, "TODO" | "IN_PROGRESS" | "DONE"> = {
    pending: "TODO",
    progress: "IN_PROGRESS",
    completed: "DONE",
  };
  return statusMap[status] ?? "TODO";
}

/**
 * mockNodes 데이터를 FeatureSpecView가 사용할 수 있는 형식으로 변환
 */
export function transformNodesForSpecView(nodes: Node[]) {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      label: node.data.title || "",
      level: getNodeLevel(node.type ?? ""),
      complexity: node.data.storyPoints,
      status: mapStatus((node.data.status as string) ?? "pending"),
      priority: node.data.priority || "P2",
      assignee: node.data.assignee,
    },
  }));
}
