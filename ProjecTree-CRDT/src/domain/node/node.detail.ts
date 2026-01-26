import type { NodeStatus, Priority } from "./node.type";

export interface Assignee {
  id: string;
  name: string;
}

export interface EditableNodeDetail {
  status: NodeStatus;
  priority?: Priority;
  difficult: number;
  assignee: Assignee | null;
  note: string;
}

export interface SendNodeDetail {
  status: NodeStatus;
  priority?: Priority;
  difficult: number;
  assignee: number | null;
  note: string;
}

export function toSendNodeDetail(
  detail: EditableNodeDetail
): SendNodeDetail {
  return {
    status: detail.status,
    ...(detail.priority !== undefined && { priority: detail.priority }),
    difficult: detail.difficult,
    assignee: detail.assignee ? Number(detail.assignee.id) : null,
    note: detail.note,
  };
}