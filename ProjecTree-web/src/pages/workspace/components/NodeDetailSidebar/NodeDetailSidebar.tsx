import type { NodeDetailData, SubNodeRecommendation } from "./types";
import { NodeHeader } from "./NodeHeader";
import { StatusMetaSection } from "./StatusMetaSection";
import { AITechRecommendSection } from "./AITechRecommendSection";
import { AINodeRecommendSection } from "./AINodeRecommendSection";
import { MemoSection } from "./MemoSection";
import { cn } from "@/lib/utils";

interface NodeDetailSidebarProps {
  node: NodeDetailData | null;
  isOpen: boolean;
  onClose: () => void;
  onTechCompare?: () => void;
  onTechAddManual?: () => void;
  onNodeAdd?: (node: SubNodeRecommendation) => void;
  onNodeAddManual?: () => void;
  onMemoChange?: (memo: string) => void;
  className?: string;
}

export function NodeDetailSidebar({
  node,
  isOpen,
  onClose,
  onTechCompare,
  onTechAddManual,
  onNodeAdd,
  onNodeAddManual,
  onMemoChange,
  className,
}: NodeDetailSidebarProps) {
  if (!node) return null;

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-[400px] bg-white border-l border-[#E2E8F0] shadow-lg z-50",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full",
        className
      )}
    >
      {/* 스크롤 영역 */}
      <div className="h-full overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* 노드 헤더 (태그, 제목, 설명) */}
          <NodeHeader node={node} onClose={onClose} />

          {/* Status & Meta 섹션 */}
          <StatusMetaSection node={node} />

          {/* AI 기술 추천 섹션 */}
          {node.techRecommendations && node.techRecommendations.length > 0 && (
            <AITechRecommendSection
              recommendations={node.techRecommendations}
              comparison={node.techComparison}
              onCompare={onTechCompare}
              onAddManual={onTechAddManual}
            />
          )}

          {/* AI 다음 노드 추천 섹션 */}
          {node.subNodeRecommendations && node.subNodeRecommendations.length > 0 && (
            <AINodeRecommendSection
              recommendations={node.subNodeRecommendations}
              onAddNode={onNodeAdd}
              onAddManual={onNodeAddManual}
            />
          )}

          {/* 메모 섹션 */}
          <MemoSection memo={node.memo} onMemoChange={onMemoChange} />
        </div>
      </div>
    </div>
  );
}
