import { useState } from "react";
import { Lightbulb, ChevronDown, ChevronUp, Plus } from "lucide-react";
import type { SubNodeRecommendation } from "./types";

interface AINodeRecommendSectionProps {
  recommendations: SubNodeRecommendation[];
  onAddNode?: (node: SubNodeRecommendation) => void;
  onAddManual?: () => void;
}

// 하위 노드 카드 컴포넌트
function SubNodeCard({
  node,
  onAdd,
}: {
  node: SubNodeRecommendation;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-start justify-between p-2.5 border border-[#DEDEDE] rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#0B0B0B] truncate">{node.title}</p>
        <p className="text-[10px] text-[#636363] mt-0.5">{node.description}</p>
      </div>
      <button
        onClick={onAdd}
        className="ml-2 p-1 text-[#636363] hover:text-[#0B0B0B] hover:bg-gray-100 rounded transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function AINodeRecommendSection({
  recommendations,
  onAddNode,
  onAddManual,
}: AINodeRecommendSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-[14px] border border-[rgba(227,228,235,0.5)] bg-[rgba(251,251,255,0.6)] backdrop-blur-sm overflow-hidden">
      {/* 섹션 헤더 (접기/펼치기) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#FD9A00]" />
          <span className="text-xs font-medium text-[#0B0B0B]">
            노드 추가 + AI 다음 노드 추천
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[#61626F]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#61626F]" />
        )}
      </button>

      {/* 콘텐츠 */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* 추천 노드 목록 */}
          <div className="space-y-2">
            {recommendations.map((node) => (
              <SubNodeCard
                key={node.id}
                node={node}
                onAdd={() => onAddNode?.(node)}
              />
            ))}
          </div>

          {/* 직접 추가 버튼 */}
          <button
            onClick={onAddManual}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[#6363C6] border border-[rgba(99,99,198,0.3)] rounded-lg hover:bg-[rgba(99,99,198,0.05)] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            직접 추가
          </button>
        </div>
      )}
    </div>
  );
}
