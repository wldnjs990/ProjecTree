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
  useIsPreviewCreating,
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
import { postCreateCustomNode, postCreateNode } from '@/apis';

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

  // 현재 프리뷰 노드 ID 계산
  const currentPreviewNodeId = useMemo(() => {
    if (previewKind === 'candidate' && previewCandidate) {
      return `preview-${previewCandidate.id}`;
    }
    if (previewKind === 'custom' && customDraft) {
      return customDraft.previewNodeId;
    }
    return null;
  }, [previewKind, previewCandidate, customDraft]);

  // 현재 프리뷰 노드가 생성 중인지 확인
  const isCreatingNode = useIsPreviewCreating(currentPreviewNodeId);

  // 스토어 액션
  const { exitCandidatePreview, updateCustomDraft } =
    useNodeDetailStore();

  // 디버깅용 로그

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
    // useCallback의 closure 문제를 피하기 위해 최신 상태를 직접 확인
    const store = useNodeDetailStore.getState();
    const isCreating = currentPreviewNodeId
      ? store.creatingPreviewIds.has(currentPreviewNodeId)
      : false;

    if (currentPreviewNodeId && !isCreating) {
      previewNodesCrdtService.removePreviewNode(currentPreviewNodeId);
    }
    exitCandidatePreview();
  }, [exitCandidatePreview, currentPreviewNodeId]);

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
  // candidate: pending=true 전송 + API 호출 → CRDT 서버가 Spring 응답 받으면 노드 추가 + pending=false 브로드캐스트
  // custom: pending 없이 API 호출 → 클라이언트에서 직접 preview 제거 + 상태 정리
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

    try {
      if (previewKind === 'candidate' && previewCandidate) {
        const previewNodeId = `preview-${previewCandidate.id}`;
        const position = resolvePosition(previewNodeId);
        if (!position) return;

        // candidate는 pending 설정 (CRDT 서버가 브로드캐스트)
        nodeDetailCrdtService.setNodeCreatingPending(previewNodeId, true);

        await postCreateNode(
          { xpos: position.xpos, ypos: position.ypos, previewNodeId },
          Number(selectedNodeId),
          previewCandidate.id
        );
        // 성공 시: CRDT 서버가 Spring 콜백을 통해 pending=false + preview 노드 삭제 처리
      } else if (previewKind === 'custom' && customDraft) {
        const previewNodeId = customDraft.previewNodeId;
        const position = resolvePosition(previewNodeId);
        if (!position) return;

        // custom은 pending 없이 API 호출 (서버에서 브로드캐스트 안 함)
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

        // 성공 시: 클라이언트에서 직접 preview 노드 제거 + 상태 정리
        previewNodesCrdtService.removePreviewNode(previewNodeId);
        exitCandidatePreview();
      }
    } catch (error) {
      // candidate 에러 시에만 pending 해제 (custom은 pending 사용 안 함)
      if (previewKind === 'candidate' && previewCandidate) {
        const previewNodeId = `preview-${previewCandidate.id}`;
        nodeDetailCrdtService.setNodeCreatingPending(previewNodeId, false);
      }
    }
  }, [
    selectedNodeId,
    previewKind,
    previewCandidate,
    customDraft,
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
