// 노드 상세 사이드바에서 사용하는 타입 정의

// 백엔드 API 공통 응답 타입
export type ApiStatus = 'SUCCESS' | 'FAIL';
export type NodeType = 'PROJECT' | 'EPIC' | 'STORY' | 'TASK';
export type TaskType = 'FE' | 'BE' | null;
export type NodeStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

// 노드 목록 API 응답 타입
export interface NodePosition {
  xPos: number;
  yPos: number;
}

export interface NodeData {
  priority?: Priority;
  identifier: string;
  taskType: TaskType;
  status: NodeStatus;
  difficult: number;
}

export interface ApiNode {
  id: number;
  name: string;
  nodeType: NodeType;
  position: NodePosition;
  parentId: number | null;
  data: NodeData;
}

export interface NodesApiResponse {
  status: ApiStatus;
  code: number;
  message: string;
  data: ApiNode[];
}

// 노드 상세 API 응답 타입
export interface Assignee {
  id: string;
  name: string;
}

export interface Candidate {
  id: number;
  name: string;
  description: string;
  taskType: TaskType;
}

export interface TechRecommendation {
  id: number;
  name: string;
  advantage: string;
  disadvantage: string;
  description: string;
  ref: string;
  recommendationScore: number;
}

export interface NodeDetailData {
  id: number;
  assignee: Assignee | null;
  description: string;
  note: string;
  candidates: Candidate[];
  techs: TechRecommendation[];
  comparison: string;
}

export interface NodeDetailApiResponse {
  status: ApiStatus;
  code: number;
  message: string;
  data: NodeDetailData;
}
