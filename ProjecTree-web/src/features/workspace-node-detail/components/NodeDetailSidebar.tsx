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
  usePreviewKind,
  usePreviewCandidate,
  useCustomPreviewDraft,
  useIsCreatingNode,
  useNodeDetailStore,
  previewNodesCrdtService,
  nodeDetailCrdtService,
  getCrdtClient,
  type YNodeValue,
} from '@/features/workspace-core';
import CandidateNodeContainer from './CandidateNodeContainer';
import CustomNodeContainer from './CustomNodeContainer';
import NodeDetailContainer from './NodeDetailContainer';
import NodeDescriptionMarkdown from './NodeDescriptionMarkdown';
import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { postCreateCustomNode, postCreateNode } from '@/apis/node.api';

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
  const [prevNodeId, setPrevNodeId] = useState(selectedNodeId);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // selectedNodeId나 isOpen이 변경되면 상태 리셋 (렌더링 중 처리)
  if (selectedNodeId !== prevNodeId || isOpen !== prevIsOpen) {
    setPrevNodeId(selectedNodeId);
    setPrevIsOpen(isOpen);
    setIsDescriptionView(false);
    setIsExpanded(false);
  }
  const { closeSidebar } = useNodeDetailEdit();

  // 후보 미리보기 상태
  const candidatePreviewMode = useCandidatePreviewMode();
  const previewKind = usePreviewKind();
  const previewCandidate = usePreviewCandidate();
  const customDraft = useCustomPreviewDraft();
  const isCreatingNode = useIsCreatingNode();
  // 스토어 액션
  const { exitCandidatePreview, updateCustomDraft } =
    useNodeDetailStore();

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
  // pending 중인 preview 노드는 유지, 현재 보고 있는 non-pending 노드만 제거
  const handleExitPreview = useCallback(() => {
    const currentPreviewNodeId =
      previewKind === 'candidate' && previewCandidate
        ? `preview-${previewCandidate.id}`
        : previewKind === 'custom' && customDraft
          ? customDraft.previewNodeId
          : null;

    if (currentPreviewNodeId && !isCreatingNode) {
      previewNodesCrdtService.removePreviewNode(currentPreviewNodeId);
    }
    exitCandidatePreview();
  }, [exitCandidatePreview, previewKind, previewCandidate, customDraft, isCreatingNode]);

  const handleCustomNameChange = useCallback(
    (value: string) => {
      updateCustomDraft({ name: value });
      if (!customDraft?.previewNodeId) return;
      const client = getCrdtClient();
      const yPreviewNodes = client?.getYMap<Y.Map<YNodeValue>>('previewNodes');
      const yNode = yPreviewNodes?.get(customDraft.previewNodeId);
      if (!yNode) return;
      const data = (yNode.get('data') ?? {}) as Record<string, unknown>;
      yNode.set('data', { ...data, title: value.trim() || '새 노드' });
    },
    [customDraft, updateCustomDraft]
  );

  const handleCustomDescriptionChange = useCallback(
    (value: string) => {
      updateCustomDraft({ description: value });
    },
    [updateCustomDraft]
  );

  // 확정 핸들러
  // 클라이언트: nodeCreatingPending=true 전송 + API 호출만 수행
  // CRDT 서버: Spring 응답 받으면 노드 추가 + 프리뷰 제거 + pending=false 브로드캐스트
  const handleConfirmCreate = useCallback(async () => {
    if (!selectedNodeId) return;

    const client = getCrdtClient();
    const yPreviewNodes = client?.getYMap<Y.Map<YNodeValue>>('previewNodes');
    const resolvePosition = (nodeId: string) => {
      const yNode = yPreviewNodes?.get(nodeId);
      const position = yNode?.get('position') as
        | { x?: unknown; y?: unknown }
        | undefined;
      const xpos = Number(position?.x);
      const ypos = Number(position?.y);
      if (!Number.isFinite(xpos) || !Number.isFinite(ypos)) return null;
      return { xpos, ypos };
    };

    // 현재 프리뷰 노드 ID 결정
    const previewNodeId =
      previewKind === 'candidate' && previewCandidate
        ? `preview-${previewCandidate.id}`
        : customDraft?.previewNodeId;

    if (!previewNodeId) return;

    nodeDetailCrdtService.setNodeCreatingPending(previewNodeId, true);

    try {
      if (previewKind === 'candidate' && previewCandidate) {
        const position = resolvePosition(`preview-${previewCandidate.id}`);
        if (!position) return;

        await postCreateNode(
          { xpos: position.xpos, ypos: position.ypos, previewNodeId },
          Number(selectedNodeId),
          previewCandidate.id
        );
      } else if (previewKind === 'custom' && customDraft) {
        const position = resolvePosition(customDraft.previewNodeId);
        if (!position) return;

        await postCreateCustomNode({
          name: customDraft.name.trim(),
          description: customDraft.description.trim(),
          nodeType: customDraft.nodeType,
          parentNodeId: customDraft.parentNodeId,
          workspaceId: customDraft.workspaceId,
          xpos: position.xpos,
          ypos: position.ypos,
          previewNodeId,
        });
      }
      // 성공 시: CRDT 서버가 Spring 콜백을 통해 pending=false + preview 노드 삭제 처리
      console.log('[NodeDetailSidebar] 노드 생성 요청 완료:', previewNodeId);
    } catch (error) {
      console.error('노드 생성 실패:', error);
      // 에러 시에만 클라이언트에서 pending 해제 (서버 응답이 없으므로)
      nodeDetailCrdtService.setNodeCreatingPending(previewNodeId, false);
    }
  }, [
    selectedNodeId,
    previewKind,
    previewCandidate,
    customDraft,
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
          <div className="h-full overflow-y-auto node-detail-scrollbar">
            <AnimatePresence mode="wait">
              {candidatePreviewMode &&
              previewKind === 'candidate' &&
              previewCandidate ? (
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
              ) : candidatePreviewMode &&
                previewKind === 'custom' &&
                customDraft ? (
                <motion.div
                  key="custom-preview"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <CustomNodeContainer
                    draft={customDraft}
                    parentNodeInfo={selectedNodeInfo}
                    onBack={handleExitPreview}
                    onConfirm={handleConfirmCreate}
                    onChangeName={handleCustomNameChange}
                    onChangeDescription={handleCustomDescriptionChange}
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
