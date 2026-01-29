import type { NodeStatus, NodeType, Priority, TaskType } from "./node.type";

export function isValidNodePayload(body: any): body is IncomingNodePayload {
  return (
    typeof body?.id === "number" &&
    typeof body?.name === "string" &&
    typeof body?.nodeType === "string" &&
    typeof body?.position?.xPos === "number" &&
    typeof body?.position?.yPos === "number"
  );
}

export interface IncomingNodePayload {
  workspaceId?: number;
  nodeData: {
    id: number;
    name: string;
    nodeType: NodeType;
    position: {
      xPos: number;
      yPos: number;
    };
    parentId: number | null;
    data: {
      priority?: Priority;
      identifier?: string;
      taskType?: TaskType;
      status?: NodeStatus;
      difficult?: number;
    };
  };
}
