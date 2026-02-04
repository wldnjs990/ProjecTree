/**
 * FeatureSpec 뷰에서 사용하는 공통 상수
 */

export const statusBadge = {
  TODO: 'bg-gray-100 text-gray-600 border-gray-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-600 border-blue-200',
  DONE: 'bg-green-100 text-green-600 border-green-200',
  HOLD: 'bg-yellow-100 text-yellow-600 border-yellow-200',
} as const;

export const statusLabel = {
  TODO: '예정',
  IN_PROGRESS: '진행중',
  DONE: '완료',
  HOLD: '보류',
} as const;

export const priorityBadge = {
  P0: 'bg-red-100 text-red-600 border-red-200',
  P1: 'bg-amber-100 text-amber-600 border-amber-200',
  P2: 'bg-slate-100 text-slate-600 border-slate-200',
} as const;

// Base grid layout for all hierarchy levels (JIRA style)
// [chevron+icon+type combined] [priority] [name] [status] [complexity] [assignee]
export const specGridCols =
  'grid grid-cols-[11rem_5rem_minmax(0,1fr)_7rem_6rem_6.5rem] items-center gap-2';

// Indentation for each hierarchy level (applied to first column)
export const indentLevel = {
  EPIC: 'pl-6',
  STORY: 'pl-9',
  TASK: 'pl-12',
  ADVANCE: 'pl-15',
} as const;
