import { cn } from '@/lib/utils';

export type TagType =
  | 'PROJECT'
  | 'EPIC'
  | 'STORY'
  | 'TASK'
  | 'ADVANCE'
  | 'FE'
  | 'BE'
  // 노드 상태 (types2 NodeStatus)
  | 'TODO'
  | 'IN_PROGRESS'
  | 'DONE';

interface StatusTagProps {
  type: TagType;
  label?: string;
  className?: string;
}

/**
 * 서버로부터 받는 노드의 태그 타입에 따라 다른 디자인을 보여줍니다.
 * 현재 노드 태그는 다음과 같습니다.
 * 노드 타입 project, epic, story, frontend(task), backend(task)
 */
const tagStyles: Record<
  TagType,
  { bg: string; text: string; defaultLabel: string }
> = {
  PROJECT: { bg: 'bg-[#64748B]', text: 'text-white', defaultLabel: '프로젝트' },
  EPIC: { bg: 'bg-[#8B5CF6]', text: 'text-white', defaultLabel: 'Epic' },
  STORY: { bg: 'bg-[#00D492]', text: 'text-white', defaultLabel: 'Story' },
  TASK: {
    bg: 'bg-[#2B7FFF]',
    text: 'text-white',
    defaultLabel: 'Task',
  },
  ADVANCE: {
    bg: 'bg-[#0891B2]',
    text: 'text-white',
    defaultLabel: 'Advanced',
  },
  FE: {
    bg: 'bg-[#F97316]',
    text: 'text-white',
    defaultLabel: 'FrontEnd',
  },
  BE: {
    bg: 'bg-[#6366F1]',
    text: 'text-white',
    defaultLabel: 'BackEnd',
  },
  // 노드 상태 (types2 NodeStatus)
  TODO: { bg: 'bg-[#64748B]', text: 'text-white', defaultLabel: '대기' },
  IN_PROGRESS: {
    bg: 'bg-[#2B7FFF]',
    text: 'text-white',
    defaultLabel: '진행중',
  },
  DONE: { bg: 'bg-[#00C950]', text: 'text-white', defaultLabel: '완료' },
};

export function StatusTag({ type, label, className }: StatusTagProps) {
  const style = tagStyles[type];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[8px] font-medium',
        style.bg,
        style.text,
        className
      )}
    >
      {label ?? style.defaultLabel}
    </span>
  );
}
