// 노드 타입별 태그 스타일
export const typeTagStyles: Record<
  string,
  { bg: string; border: string; text: string; label: string }
> = {
  TASK: {
    bg: 'bg-[rgba(47,88,200,0.1)]',
    border: 'border-[rgba(47,88,200,0.5)]',
    text: 'text-[#6363C6]',
    label: 'Task',
  },
  ADVANCED: {
    bg: 'bg-[rgba(8,145,178,0.1)]',
    border: 'border-[rgba(8,145,178,0.5)]',
    text: 'text-[#0891B2]',
    label: 'Advanced',
  },
  STORY: {
    bg: 'bg-[rgba(0,212,146,0.1)]',
    border: 'border-[rgba(0,212,146,0.5)]',
    text: 'text-[#00D492]',
    label: 'Story',
  },
  EPIC: {
    bg: 'bg-[rgba(139,92,246,0.1)]',
    border: 'border-[rgba(139,92,246,0.5)]',
    text: 'text-[#8B5CF6]',
    label: 'Epic',
  },
  PROJECT: {
    bg: 'bg-[rgba(100,116,139,0.1)]',
    border: 'border-[rgba(100,116,139,0.5)]',
    text: 'text-[#64748B]',
    label: 'Project',
  },
};

// 카테고리별 태그 스타일
export const categoryTagStyles: Record<
  string,
  { bg: string; border: string; text: string; label: string }
> = {
  FE: {
    bg: 'bg-[#FFF7ED]',
    border: 'border-[#F97316]',
    text: 'text-[#F97316]',
    label: 'Frontend',
  },
  BE: {
    bg: 'bg-[#EEF2FF]',
    border: 'border-[#6366F1]',
    text: 'text-[#6366F1]',
    label: 'Backend',
  },
};
