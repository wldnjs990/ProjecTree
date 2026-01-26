import { useState } from 'react';
import { StickyNote, ChevronDown, ChevronUp } from 'lucide-react';
import {
  useDisplayData,
  useIsEditing,
  useNodeDetailEditStore,
} from '../../stores/nodeDetailEditStore';

// 메모 편집 컴포넌트 (편집 모드)
interface NoteEditProps {
  value: string;
  onChange?: (value: string) => void;
}
function NoteEdit({ value, onChange }: NoteEditProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-[14px] border border-[rgba(227,228,235,0.5)] bg-[rgba(251,251,255,0.6)] backdrop-blur-sm overflow-hidden">
      <button
        type="button"
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

      {isExpanded && (
        <div className="px-4 pb-4">
          <textarea
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder="노드의 메모사항을 기록할 수 있습니다."
            className="w-full h-20 p-3 text-sm text-[#0B0B0B] placeholder:text-[#9CA3AF] bg-white border border-[#DEDEDE] rounded-lg resize-none focus:outline-none focus:border-[#6363C6] focus:ring-1 focus:ring-[#6363C6]"
          />
        </div>
      )}
    </div>
  );
}

// 메모 표시 컴포넌트 (조회 모드)
interface NoteDisplayProps {
  note: string;
}
function NoteDisplay({ note }: NoteDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-[14px] border border-[rgba(227,228,235,0.5)] bg-[rgba(251,251,255,0.6)] backdrop-blur-sm overflow-hidden">
      <button
        type="button"
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

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="w-full min-h-20 p-3 text-sm text-[#0B0B0B] bg-[rgba(238,238,238,0.3)] rounded-lg whitespace-pre-wrap">
            {note || <span className="text-[#9CA3AF]">메모가 없습니다.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// 노드 메모 섹션 - Store 직접 구독
export function MemoSection() {
  // Store에서 상태 구독
  const displayData = useDisplayData();
  const isEdit = useIsEditing();
  const updateField = useNodeDetailEditStore((state) => state.updateField);

  if (!displayData) return null;

  const handleNoteChange = (value: string) => {
    updateField('note', value);
  };

  if (isEdit) {
    return <NoteEdit value={displayData.note} onChange={handleNoteChange} />;
  }

  return <NoteDisplay note={displayData.note} />;
}
