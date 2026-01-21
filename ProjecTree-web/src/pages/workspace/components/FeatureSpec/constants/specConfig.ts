/**
 * FeatureSpec 뷰에서 사용하는 공통 상수
 */

export const statusBadge = {
  TODO: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-100 text-blue-600",
  DONE: "bg-green-100 text-green-600",
  HOLD: "bg-yellow-100 text-yellow-600",
} as const;

export const statusLabel = {
  TODO: "예정",
  IN_PROGRESS: "진행중",
  DONE: "완료",
  HOLD: "보류",
} as const;

export const priorityBadge = {
  P0: "bg-red-100 text-red-600 border-red-200",
  P1: "bg-amber-100 text-amber-600 border-amber-200",
  P2: "bg-slate-100 text-slate-600 border-slate-200",
} as const;

// Base grid layout for all hierarchy levels (JIRA style)
// [chevron+dot+type combined] [priority] [name] [status] [complexity] [assignee]
export const specGridCols =
  "grid grid-cols-[10rem_4rem_1fr_5rem_5rem_5rem] items-center gap-2";

// Indentation for each hierarchy level (applied to first column)
export const indentLevel = {
  epic: "pl-2",
  story: "pl-5",
  task: "pl-8",
  advanced: "pl-11",
} as const;
