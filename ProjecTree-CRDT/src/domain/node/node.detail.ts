import type { NodeStatus, Priority, NodeType } from "./node.type";

export interface Assignee {
  id: string;
  name: string;
}

export interface EditableNodeDetail {
  nodeType: NodeType;
  status: NodeStatus;
  priority?: Priority;
  difficult: number;
  assignee: Assignee | null;
  note: string;
}

export interface SendNodeDetail {
  nodeType: NodeType;
  status: NodeStatus;
  priority?: Priority;
  difficult: number;
  assignee: number | null;
  note: string;
}

export function toSendNodeDetail(detail: EditableNodeDetail): SendNodeDetail {
  return {
    nodeType: detail.nodeType,
    status: detail.status,
    ...(detail.priority !== undefined && { priority: detail.priority }),
    difficult: detail.difficult,
    assignee: detail.assignee ? Number(detail.assignee.id) : null,
    note: detail.note,
  };
}
