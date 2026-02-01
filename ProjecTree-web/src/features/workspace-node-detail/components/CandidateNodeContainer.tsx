import { ArrowLeft, Sprout } from 'lucide-react';
import NodeHeaderButton from './NodeHeaderButton';
import NodeHeaderInfo from './NodeHeaderInfo';
import { categoryTagStyles, typeTagStyles } from '@/features/workspace-core';
import { cn } from '@/shared/lib/utils';

interface CandidateNodeSectionProps {
  nodeInfo?: {
    name: string;
    nodeType: string;
    identifier: string;
    taskType: string | null;
  };
  description: string;
}
export default function CandidateNodeContainer({
  nodeInfo,
  description,
}: CandidateNodeSectionProps) {
  const typeStyle =
    (nodeInfo?.nodeType && typeTagStyles[nodeInfo.nodeType]) ||
    typeTagStyles.TASK;
  const categoryStyle =
    nodeInfo?.nodeType && nodeInfo.taskType
      ? categoryTagStyles[nodeInfo.taskType]
      : null;
  return (
    <div className="p-4 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <NodeHeaderButton onClick={() => {}}>
          <ArrowLeft />
        </NodeHeaderButton>
        <h3 className="text-lg font-bold">다음 노드 : {nodeInfo?.name}</h3>
      </div>
      {/* 헤더 정보 */}
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
        {nodeInfo?.identifier && (
          <span className="text-xs text-[#64748B]">#{nodeInfo.identifier}</span>
        )}
      </div>
      <NodeHeaderInfo name={nodeInfo?.name} description={description} />
    </div>
  );
}
