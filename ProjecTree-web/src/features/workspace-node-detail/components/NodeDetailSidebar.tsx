import { cn } from '@/shared/lib/utils';
import {
  useSelectedNodeDetail,
  useSelectedNodeListData,
  useNodeDetailEdit,
} from '../hooks';
import {
  useIsNodeDetailOpen,
  useSelectedNodeId,
  useNodes,
  useCandidatePreviewMode,
  usePreviewCandidate,
  useIsCreatingNode,
  useNodeDetailStore,
  previewNodesCrdtService,
  getCrdtClient,
  type YNodeValue,
} from '@/features/workspace-core';
import CandidateNodeContainer from './CandidateNodeContainer';
import NodeDetailContainer from './NodeDetailContainer';
import NodeDescriptionMarkdown from './NodeDescriptionMarkdown';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { postCreateNode } from '@/apis/node.api';
import { useUser } from '@/shared/stores/userStore';
import * as Y from 'yjs';

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
  const [isDescriptionView, setIsDescriptionView] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { closeSidebar } = useNodeDetailEdit();

  // 후보 미리보기 상태
  const candidatePreviewMode = useCandidatePreviewMode();
  const previewCandidate = usePreviewCandidate();
  const isCreatingNode = useIsCreatingNode();
  const currentUser = useUser();
  const currentUserId = String(currentUser?.memberId ?? currentUser?.id ?? '');

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
    if (currentUserId) {
      previewNodesCrdtService.clearPreviewNodesByOwner(currentUserId);
    }
    exitCandidatePreview();
  }, [exitCandidatePreview, currentUserId]);

  useEffect(() => {
    setIsDescriptionView(false);
    setIsExpanded(false);
  }, [selectedNodeId, isOpen]);

  // 확정 핸들러
  const handleConfirmCreate = useCallback(async () => {
    if (!selectedNodeId || !previewCandidate) return;

    const client = getCrdtClient();
    const yPreviewNodes = client?.getYMap<Y.Map<YNodeValue>>('previewNodes');
    const previewNodeId = `preview-${previewCandidate.id}`;
    const yNode = yPreviewNodes?.get(previewNodeId);
    const position = yNode?.get('position') as
      | { x?: unknown; y?: unknown }
      | undefined;
    const xpos = Number(position?.x);
    const ypos = Number(position?.y);
    if (!Number.isFinite(xpos) || !Number.isFinite(ypos)) return;

    try {
      setIsCreatingNode(true);

      // API 호출 (계산된 위치 전송)
      await postCreateNode(
        { xpos, ypos },
        Number(selectedNodeId),
        previewCandidate.id
      );

      // 성공 시: preview 노드 제거 (새 노드는 CRDT 브로드캐스트로 자동 추가됨)
      if (currentUserId) {
        previewNodesCrdtService.clearPreviewNodesByOwner(currentUserId);
      }
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
    setIsCreatingNode,
    exitCandidatePreview,
    currentUserId,
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
            'absolute top-0 right-0 h-full bg-white border-l border-[#E2E8F0] shadow-lg z-50',
            isExpanded ? 'w-full' : 'w-100',
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
              ) : isDescriptionView ? (
                <motion.div
                  key="node-description"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <NodeDescriptionMarkdown
                    description={nodeDetail.description}
                    onBack={() => setIsDescriptionView(false)}
                    onClose={closeSidebar}
                    onToggleExpand={() => setIsExpanded((prev) => !prev)}
                    isExpanded={isExpanded}
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
                  <NodeDetailContainer
                    nodeInfo={selectedNodeInfo}
                    onShowDescription={() => setIsDescriptionView(true)}
                    onToggleExpand={() => setIsExpanded((prev) => !prev)}
                    isExpanded={isExpanded}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
