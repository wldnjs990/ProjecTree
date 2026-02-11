import {
  X,
  Sprout,
  SquarePen,
  Maximize2,
  Minimize2,
  FileText,
  Trash2,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import NodeHeaderButton from './NodeHeaderButton';
import NodeHeaderInfo from './NodeHeaderInfo';
import { categoryTagStyles, typeTagStyles } from '@/features/workspace-core';
import { Confirm } from '@/shared/components/Confirm';
import { ConfirmTrigger } from '@/shared/components/ConfirmTrigger';

interface NodeHeaderSectionProps {
  nodeInfo?: {
    name: string;
    nodeType: string;
    identifier: string;
    taskType: string | null;
  };
  description: string;
  onClose: () => void;
  toggleEdit: () => void;
  isEdit: boolean;
  onShowDescription?: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  onDelete?: () => void;
}

export function NodeHeaderSection({
  nodeInfo,
  description,
  onClose,
  toggleEdit,
  isEdit,
  onShowDescription,
  onToggleExpand,
  isExpanded,
  onDelete,
}: NodeHeaderSectionProps) {
  if (!nodeInfo) return null;

  // PROJECT 노드는 삭제 불가
  const canDelete = onDelete && nodeInfo.nodeType !== 'PROJECT';

  const typeStyle = typeTagStyles[nodeInfo.nodeType] || typeTagStyles.TASK;
  const categoryStyle = nodeInfo.taskType
    ? categoryTagStyles[nodeInfo.taskType]
    : null;

  return (
    <div className="pb-4">
      {/* 헤더 */}
      <div className="flex px-4 py-4 justify-between absolute top-0 left-0 w-full bg-white z-10 border-b border-[#EEEEEE]">
        {/* 태그 영역 */}
        <div className="flex items-center gap-3">
          {onShowDescription && (
            <button
              type="button"
              onClick={onShowDescription}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#4F46E5] px-2 py-1 rounded-md border border-[#E0E7FF] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          )}
          {/* 노드 타입 태그 */}
          <span
            className={cn(
              'inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-lg border',
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
                'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md border',
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
          {nodeInfo.identifier && (
            <span className="text-xs text-[#64748B]">
              {nodeInfo.identifier}
            </span>
          )}
        </div>
        {/* 버튼 영역 */}
        <div className="flex items-center gap-3">
          {onToggleExpand && (
            <NodeHeaderButton onClick={onToggleExpand}>
              {isExpanded ? (
                <Minimize2 className="w-5 h-5 text-gray-500" />
              ) : (
                <Maximize2 className="w-5 h-5 text-gray-500" />
              )}
            </NodeHeaderButton>
          )}
          {/* 삭제 버튼 */}
          {canDelete && (
            <Confirm
              trigger={
                <ConfirmTrigger asChild>
                  <NodeHeaderButton>
                    <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-500" />
                  </NodeHeaderButton>
                </ConfirmTrigger>
              }
              title="노드를 삭제하시겠습니까?"
              description="이 노드와 모든 하위 노드가 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
              cancelText="취소"
              actionText="삭제"
              onAction={onDelete}
            />
          )}
          {/* 편집 버튼 */}
          <NodeHeaderButton onClick={toggleEdit}>
            <SquarePen
              className={cn(
                'w-5 h-5',
                isEdit ? 'text-[#6363C6]' : 'text-gray-500'
              )}
            />
          </NodeHeaderButton>
          {/* 닫기 버튼 */}
          <NodeHeaderButton onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </NodeHeaderButton>
        </div>
      </div>

      {/* TODO : 제목, 설명 동시편집 구현 */}
      <NodeHeaderInfo name={nodeInfo.name} description={description} />
    </div>
  );
}
