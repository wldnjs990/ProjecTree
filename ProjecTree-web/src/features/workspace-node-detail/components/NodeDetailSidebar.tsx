import { cn } from '@/shared/lib/utils';
import { useSelectedNodeDetail, useSelectedNodeListData } from '../hooks';
import {
  useIsNodeDetailOpen,
  useSelectedNodeId,
  useNodes,
  useCandidatePreviewMode,
  usePreviewCandidate,
  usePreviewNodePosition,
  useIsCreatingNode,
  useNodeDetailStore,
  previewNodesCrdtService,
} from '@/features/workspace-core';
import CandidateNodeContainer from './CandidateNodeContainer';
import NodeDetailContainer from './NodeDetailContainer';
import { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { postCreateNode } from '@/apis/node.api';

// 노드 기본 정보 (헤더용) - WorkSpacePage에서 전달받음
interface NodeDetailSidebarProps {
  className?: string;
}

export function NodeDetailSidebar({ className }: NodeDetailSidebarProps) {
  // Store에서 상태 구독
  const isOpen = useIsNodeDetailOpen();
  const nodeDetail = useSelectedNodeDetail();
  const nodeListData = useSelectedNodeListData();
  const nodes = useNodes();
  const selectedNodeId = useSelectedNodeId();

  // 후보 미리보기 상태
  const candidatePreviewMode = useCandidatePreviewMode();
  const previewCandidate = usePreviewCandidate();
  const previewNodePosition = usePreviewNodePosition();
  const isCreatingNode = useIsCreatingNode();

  // 스토어 액션
  const { exitCandidatePreview, setIsCreatingNode } = useNodeDetailStore();

  // 디버깅용 로그
  console.log('[NodeDetailSidebar] 상태 확인:', {
    isOpen,
    selectedNodeId,
    nodeDetail: nodeDetail ? '있음' : 'null',
    nodeListData: nodeListData ? '있음' : 'null',
    candidatePreviewMode,
  });

  // 선택된 노드의 기본 정보 (헤더용) - 실제 nodeStore에서 가져옴
  const selectedNodeInfo = useMemo(() => {
    if (!selectedNodeId) return undefined;
    const node = nodes.find((n) => n.id === selectedNodeId);
    if (!node) return undefined;
    return {
      name: node.data.title,
      nodeType: node.type,
      identifier: node.data.taskId,
      taskType: node.data.taskType ?? null,
    };
  }, [selectedNodeId, nodes]);

  // 미리보기 종료 핸들러
  const handleExitPreview = useCallback(() => {
    previewNodesCrdtService.clearPreviewNodes();
    exitCandidatePreview();
  }, [exitCandidatePreview]);

  // 확정 핸들러
  const handleConfirmCreate = useCallback(async () => {
    if (!selectedNodeId || !previewCandidate || !previewNodePosition) return;

    try {
      setIsCreatingNode(true);

      // API 호출 (계산된 위치 전송)
      await postCreateNode(
        previewNodePosition, // { xpos, ypos }
        Number(selectedNodeId),
        previewCandidate.id
      );

      // 성공 시: preview 노드 제거 (새 노드는 CRDT 브로드캐스트로 자동 추가됨)
      previewNodesCrdtService.clearPreviewNodes();
      exitCandidatePreview();
    } catch (error) {
      console.error('노드 생성 실패:', error);
      // 에러 시에도 상태 정리
    } finally {
      setIsCreatingNode(false);
    }
  }, [
    selectedNodeId,
    previewCandidate,
    previewNodePosition,
    setIsCreatingNode,
    exitCandidatePreview,
  ]);

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
            <AnimatePresence mode="wait">
              {candidatePreviewMode && previewCandidate ? (
                <motion.div
                  key="candidate-preview"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <CandidateNodeContainer
                    candidate={previewCandidate}
                    parentNodeInfo={selectedNodeInfo}
                    onBack={handleExitPreview}
                    onConfirm={handleConfirmCreate}
                    isCreating={isCreatingNode}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="node-detail"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <NodeDetailContainer nodeInfo={selectedNodeInfo} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
