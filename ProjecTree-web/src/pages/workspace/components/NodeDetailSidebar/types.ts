// 노드 상세 사이드바에서 사용하는 타입 정의

export type NodeCategory = "frontend" | "backend";
export type NodeStatus = "pending" | "progress" | "completed";
export type Priority = "P0" | "P1" | "P2" | "P3";
export type NodeType = "project" | "epic" | "story" | "task" | "advanced";

export interface Assignee {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface TechTag {
  label: string;
  type: "positive" | "negative";
}

export interface TechRecommendation {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: TechTag[];
  isAIRecommended?: boolean;
}

export interface SubNodeRecommendation {
  id: string;
  title: string;
  description: string;
}

export interface TechComparison {
  id: string;
  comparedTechs: string[]; // 비교 대상 기술 ID 배열
  comparisonTable: string; // 마크다운 형식의 비교 장표
}

export interface NodeDetailData {
  id: string;
  type: NodeType;
  category?: NodeCategory;
  taskId?: string;
  title: string;
  description?: string;
  status: NodeStatus;
  priority?: Priority;
  assignee?: Assignee;
  difficulty?: number; // 1-5
  techRecommendations?: TechRecommendation[];
  techComparison?: TechComparison; // task, advanced 타입에서만 사용
  subNodeRecommendations?: SubNodeRecommendation[];
  memo?: string;
}
