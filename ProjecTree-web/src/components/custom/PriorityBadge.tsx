import { cn } from "@/lib/utils";

export type Priority = "P0" | "P1" | "P2";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

/** 우선도에 따라 다른 디자인 제공 */
const priorityStyles: Record<Priority, string> = {
  P0: "bg-[#FB2C36] text-white",
  P1: "bg-[#FF8904] text-white",
  P2: "bg-[#64748B] text-white",
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[8px] font-bold shadow-md",
        priorityStyles[priority],
        className,
      )}
    >
      {priority}
    </span>
  );
}
