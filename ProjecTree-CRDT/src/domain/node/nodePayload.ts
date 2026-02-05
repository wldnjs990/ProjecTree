import type { NodeStatus, NodeType, Priority, TaskType } from "./node.type";

export function isValidNodePayload(body: any): body is IncomingNodePayload {
  return (
    // 추가 검증 로직은 필요에 따라 여기에 작성
    // TODO description 필드 추가되면 여기도 수정 필요
    typeof body?.id === "number" &&
    typeof body?.name === "string" &&
    typeof body?.nodeType === "string" &&
    typeof body?.position?.xpos === "number" &&
    typeof body?.position?.ypos === "number" &&
    // (typeof body?.parentId === "string" || body?.parentId === null) &&
    typeof body?.data === "object"
  );
}

export interface IncomingNodePayload {
  id: number;
  name: string;
  nodeType: NodeType;
  position: {
    xpos: number;
    ypos: number;
  };
  parentId: string | null;
  data: {
    priority?: Priority;
    identifier?: string;
    taskType?: TaskType;
    status?: NodeStatus;
    difficult?: number;
  };
}
