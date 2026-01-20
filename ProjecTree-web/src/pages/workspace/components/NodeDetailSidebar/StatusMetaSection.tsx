import { Star } from "lucide-react";
import type { NodeDetailData, NodeStatus, Priority } from "./types";
import { cn } from "@/lib/utils";

interface StatusMetaSectionProps {
  node: NodeDetailData;
}

// 상태별 스타일
const statusStyles: Record<NodeStatus, { bg: string; text: string; label: string }> = {
  pending: {
    bg: "bg-[rgba(100,116,139,0.15)]",
    text: "text-[#64748B]",
    label: "대기",
  },
  progress: {
    bg: "bg-[rgba(99,99,198,0.15)]",
    text: "text-[#6363C6]",
    label: "진행중",
  },
  completed: {
    bg: "bg-[rgba(0,201,80,0.15)]",
    text: "text-[#00C950]",
    label: "완료",
  },
};

// 우선순위별 스타일
const priorityStyles: Record<Priority, { bg: string; text: string }> = {
  P0: { bg: "bg-[rgba(231,0,11,0.15)]", text: "text-[#E7000B]" },
  P1: { bg: "bg-[rgba(253,154,0,0.15)]", text: "text-[#FD9A00]" },
  P2: { bg: "bg-[rgba(43,127,255,0.15)]", text: "text-[#2B7FFF]" },
  P3: { bg: "bg-[rgba(100,116,139,0.15)]", text: "text-[#64748B]" },
};

export function StatusMetaSection({ node }: StatusMetaSectionProps) {
  const statusStyle = statusStyles[node.status];
  const priorityStyle = node.priority ? priorityStyles[node.priority] : null;

  return (
    <div className="rounded-[14px] border border-[rgba(227,228,235,0.5)] bg-[rgba(251,251,255,0.6)] backdrop-blur-sm p-4 space-y-4">
      {/* 섹션 헤더 */}
      <h3 className="text-xs font-medium text-[#61626F] uppercase tracking-wider">
        Status & Meta
      </h3>

      {/* 상태 & 우선순위 */}
      <div className="flex items-center gap-8">
        {/* 상태 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#61626F]">상태</span>
          <span
            className={cn(
              "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-lg",
              statusStyle.bg,
              statusStyle.text
            )}
          >
            {statusStyle.label}
          </span>
        </div>

        {/* 우선순위 */}
        {priorityStyle && node.priority && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#61626F]">우선순위</span>
            <span
              className={cn(
                "inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-lg",
                priorityStyle.bg,
                priorityStyle.text
              )}
            >
              {node.priority}
            </span>
          </div>
        )}
      </div>

      {/* 구분선 */}
      <div className="border-t border-[rgba(227,228,235,0.5)] pt-3 space-y-3">
        {/* 담당자 */}
        {node.assignee && (
          <div className="space-y-1">
            <span className="text-xs text-[#61626F]">담당자</span>
            <div className="flex items-center gap-2 px-2 py-2 bg-[rgba(238,238,238,0.5)] rounded-md">
              {/* 아바타 */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-normal"
                style={{ backgroundColor: node.assignee.color }}
              >
                {node.assignee.initials}
              </div>
              {/* 이름 */}
              <span className="text-sm text-[#0B0B0B]">{node.assignee.name}</span>
            </div>
          </div>
        )}

        {/* 난이도 */}
        {node.difficulty !== undefined && (
          <div className="space-y-1">
            <span className="text-xs text-[#61626F]">난이도</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <button key={level} className="p-0.5">
                  <Star
                    className={cn(
                      "w-4 h-4",
                      level <= node.difficulty!
                        ? "fill-[#A3A9E0] text-[#A3A9E0]"
                        : "fill-none text-[rgba(97,98,111,0.3)]"
                    )}
                    strokeWidth={1.33}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
