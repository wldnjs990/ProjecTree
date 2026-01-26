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