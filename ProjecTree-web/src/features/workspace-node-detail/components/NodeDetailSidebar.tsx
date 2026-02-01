import { cn } from '@/shared/lib/utils';
import { useSelectedNodeDetail, useSelectedNodeListData } from '../hooks';
import {
  useIsNodeDetailOpen,
  useSelectedNodeId,
} from '@/features/workspace-core';
import CandidateNodeContainer from './CandidateNodeContainer';
import NodeDetailContainer from './NodeDetailContainer';
import { useMemo } from 'react';
import { mockNodesApiResponse } from '@/features/workspace-core';
import { motion, AnimatePresence } from 'motion/react';

// 노드 기본 정보 (헤더용) - WorkSpacePage에서 전달받음
interface NodeDetailSidebarProps {
  className?: string;
}

export function NodeDetailSidebar({ className }: NodeDetailSidebarProps) {
  // Store에서 상태 구독
  const isOpen = useIsNodeDetailOpen();
  const nodeDetail = useSelectedNodeDetail();
  const nodeListData = useSelectedNodeListData();

  const selectedNodeId = useSelectedNodeId();

  // 디버깅용 로그
  console.log('[NodeDetailSidebar] 상태 확인:', {
    isOpen,
    selectedNodeId,
    nodeDetail: nodeDetail ? '있음' : 'null',
    nodeListData: nodeListData ? '있음' : 'null',
  });

  // 선택된 노드의 기본 정보 (헤더용)
  const selectedNodeInfo = useMemo(() => {
    if (!selectedNodeId) return undefined;
    const numericId = Number(selectedNodeId);
    // TODO : 백엔드 API로 실제 연결하기
    const apiNode = mockNodesApiResponse.data.find((n) => n.id === numericId);
    if (!apiNode) return undefined;
    return {
      name: apiNode.name,
      nodeType: apiNode.nodeType,
      identifier: apiNode.data.identifier,
      taskType: apiNode.data.taskType,
    };
  }, [selectedNodeId]);

  return (
    <AnimatePresence>
      {isOpen && nodeDetail && nodeListData && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            'absolute top-0 right-0 h-full w-100 bg-white border-l border-[#E2E8F0] shadow-lg z-50',
            className
          )}
        >
          {/* 스크롤 영역 */}
          <div className="h-full overflow-y-auto">
            <NodeDetailContainer nodeInfo={selectedNodeInfo} />
            <CandidateNodeContainer
              nodeInfo={selectedNodeInfo}
              description={nodeDetail.description}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
