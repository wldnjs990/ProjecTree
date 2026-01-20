import { X, Sprout } from "lucide-react";
import type { NodeDetailData } from "./types";
import { cn } from "@/lib/utils";

interface NodeHeaderProps {
  node: NodeDetailData;
  onClose: () => void;
}

// 노드 타입별 태그 스타일
const typeTagStyles: Record<
  string,
  { bg: string; border: string; text: string; label: string }
> = {
  task: {
    bg: "bg-[rgba(47,88,200,0.1)]",
    border: "border-[rgba(47,88,200,0.5)]",
    text: "text-[#6363C6]",
    label: "Task",
  },
  advanced: {
    bg: "bg-[rgba(8,145,178,0.1)]",
    border: "border-[rgba(8,145,178,0.5)]",
    text: "text-[#0891B2]",
    label: "Advanced",
  },
  story: {
    bg: "bg-[rgba(0,212,146,0.1)]",
    border: "border-[rgba(0,212,146,0.5)]",
    text: "text-[#00D492]",
    label: "Story",
  },
  epic: {
    bg: "bg-[rgba(139,92,246,0.1)]",
    border: "border-[rgba(139,92,246,0.5)]",
    text: "text-[#8B5CF6]",
    label: "Epic",
  },
  project: {
    bg: "bg-[rgba(100,116,139,0.1)]",
    border: "border-[rgba(100,116,139,0.5)]",
    text: "text-[#64748B]",
    label: "Project",
  },
};

// 카테고리별 태그 스타일
const categoryTagStyles = {
  frontend: {
    bg: "bg-[#FFF7ED]",
    border: "border-[#F97316]",
    text: "text-[#F97316]",
    label: "Frontend",
  },
  backend: {
    bg: "bg-[#EEF2FF]",
    border: "border-[#6366F1]",
    text: "text-[#6366F1]",
    label: "Backend",
  },
};

export function NodeHeader({ node, onClose }: NodeHeaderProps) {
  const typeStyle = typeTagStyles[node.type] || typeTagStyles.task;
  const categoryStyle = node.category
    ? categoryTagStyles[node.category]
    : null;

  return (
    <div className="relative pb-4">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-0 right-0 p-1 rounded-md hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>

      {/* 태그 영역 */}
      <div className="flex items-center gap-3 mb-3">
        {/* 노드 타입 태그 */}
        <span
          className={cn(
            "inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-lg border",
            typeStyle.bg,
            typeStyle.border,
            typeStyle.text
          )}
        >
          {typeStyle.label}
        </span>

        {/* 카테고리 태그 (frontend/backend) */}
        {categoryStyle && (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md border",
              categoryStyle.bg,
              categoryStyle.border,
              categoryStyle.text
            )}
          >
            <Sprout className="w-3 h-3" />
            {categoryStyle.label}
          </span>
        )}

        {/* Task ID */}
        {node.taskId && (
          <span className="text-xs text-[#64748B]">#{node.taskId}</span>
        )}
      </div>

      {/* 제목 */}
      <h2 className="text-base font-medium text-[#14151F] mb-2 pr-8">
        {node.title}
      </h2>

      {/* 설명 */}
      {node.description && (
        <p className="text-sm text-[#61626F] leading-relaxed">
          {node.description}
        </p>
      )}
    </div>
  );
}
