import { useState } from 'react';
import { StickyNote, ChevronDown, ChevronUp } from 'lucide-react';

interface MemoSectionProps {
  memo?: string;
  onMemoChange?: (memo: string) => void;
}

export function MemoSection({ memo = '', onMemoChange }: MemoSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [localMemo, setLocalMemo] = useState(memo);

  // // 사이드바 메모 작성 이벤트 따로 분리해둘게요!
  // const {} = useCrdt()

  const handleMemoChange = (value: string) => {
    setLocalMemo(value);
    onMemoChange?.(value);
  };

  return (
    <div className="rounded-[14px] border border-[rgba(227,228,235,0.5)] bg-[rgba(251,251,255,0.6)] backdrop-blur-sm overflow-hidden">
      {/* 섹션 헤더 (접기/펼치기) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-[#0B0B0B]" />
          <span className="text-xs font-medium text-[#0B0B0B]">메모</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[#61626F]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#61626F]" />
        )}
      </button>

      {/* 콘텐츠 */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <textarea
            value={localMemo}
            onChange={(e) => handleMemoChange(e.target.value)}
            placeholder="노드의 메모사항을 기록할 수 있습니다."
            className="w-full h-20 p-3 text-sm text-[#0B0B0B] placeholder:text-[#9CA3AF] bg-white border border-[#DEDEDE] rounded-lg resize-none focus:outline-none focus:border-[#6363C6] focus:ring-1 focus:ring-[#6363C6]"
          />
        </div>
      )}
    </div>
  );
}
