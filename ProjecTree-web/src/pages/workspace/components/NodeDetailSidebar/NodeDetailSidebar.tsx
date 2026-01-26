import { cn } from '@/lib/utils';
import {
  useIsNodeDetailOpen,
  useSelectedNodeDetail,
  useSelectedNodeListData,
} from '../../stores/nodeDetailEditStore';
import CandidateNodeContainer from './CandidateNodeContainer';
import NodeDetailContainer from './NodeDetailContainer';

// 노드 기본 정보 (헤더용) - WorkSpacePage에서 전달받음
interface NodeDetailSidebarProps {
  nodeInfo?: {
    name: string;
    nodeType: string;
    identifier: string;
    taskType: string | null;
  };
  className?: string;
}

export function NodeDetailSidebar({
  nodeInfo,
  className,
}: NodeDetailSidebarProps) {
  // Store에서 상태 구독
  const isOpen = useIsNodeDetailOpen();
  const nodeDetail = useSelectedNodeDetail();
  const nodeListData = useSelectedNodeListData();

  // 데이터가 없으면 렌더링하지 않음
  if (!nodeDetail || !nodeListData) return null;

  return (
    <div
      className={cn(
        'fixed top-0 right-0 h-full w-100 bg-white border-l border-[#E2E8F0] shadow-lg z-50',
        'transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full',
        className
      )}
    >
      {/* 스크롤 영역 */}
      <div className="h-full overflow-y-auto">
        <NodeDetailContainer nodeInfo={nodeInfo} />
        <CandidateNodeContainer
          nodeInfo={nodeInfo}
          description={nodeDetail.description}
        />
      </div>
    </div>
  );
}
