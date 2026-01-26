import { X, Sprout, SquarePen } from 'lucide-react';
import { cn } from '@/lib/utils';
import NodeHeaderButton from './NodeHeaderButton';
import NodeHeaderInfo from './NodeHeaderInfo';
import { categoryTagStyles, typeTagStyles } from '../../constants/nodeStyle';

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
}

export function NodeHeaderSection({
  nodeInfo,
  description,
  onClose,
  toggleEdit,
  isEdit,
}: NodeHeaderSectionProps) {
  if (!nodeInfo) return null;

  const typeStyle = typeTagStyles[nodeInfo.nodeType] || typeTagStyles.TASK;
  const categoryStyle = nodeInfo.taskType
    ? categoryTagStyles[nodeInfo.taskType]
    : null;

  return (
    <div className="relative pb-4">
      {/* 헤더 */}
      <div className="flex px-4 py-2 justify-between fixed top-0 left-0 w-full bg-white z-10">
        {/* 태그 영역 */}
        <div className="flex items-center gap-3 mb-3">
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
              #{nodeInfo.identifier}
            </span>
          )}
        </div>
        {/* 버튼 영역 */}
        <div className="flex items-center gap-3 mb-3">
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
