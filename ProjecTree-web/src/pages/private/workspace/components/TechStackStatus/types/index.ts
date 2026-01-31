/**
 * 기술 스택 현황 페이지에서 사용하는 타입 정의
 */

// 노드 레벨 타입 (Task 또는 Advanced)
export type NodeLevel = 'TASK' | 'ADVANCE';

// 우선순위 타입
export type Priority = 'P0' | 'P1' | 'P2';

// 상태 타입
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

// 기술 스택이 매핑된 노드 정보
export interface TechStackNode {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  confirmedTechs: string[]; // 확정된 기술 스택 목록
  lastUpdated: string; // 마지막 업데이트 시간 (ISO 8601)
  level: NodeLevel; // task or advanced
}

// Summary 카드 데이터
export interface SummaryCardData {
  title: string;
  value: number;
  change?: number; // 전주 대비 증감 (optional)
  percentage?: number; // P0 비중용 (optional)
  count?: number; // P0 개수용 (optional)
}

// 필터 옵션
export interface FilterOptions {
  level: NodeLevel | 'all'; // task, advanced, 또는 all
  sortBy: 'recent' | 'priority' | 'status'; // 정렬 기준
  filterBy: 'all' | string; // 조건 필터 (기술 스택별, 상태별 등)
}
