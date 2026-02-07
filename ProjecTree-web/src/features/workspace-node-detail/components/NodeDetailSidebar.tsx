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
  getCrdtClient,
  type YNodeValue,
} from '@/features/workspace-core';
import CandidateNodeContainer from './CandidateNodeContainer';
import CustomNodeContainer from './CustomNodeContainer';
import NodeDetailContainer from './NodeDetailContainer';
import NodeDescriptionMarkdown from './NodeDescriptionMarkdown';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { postCreateCustomNode, postCreateNode } from '@/apis/node.api';
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
  const previewKind = usePreviewKind();
  const previewCandidate = usePreviewCandidate();
  const customDraft = useCustomPreviewDraft();
  const isCreatingNode = useIsCreatingNode();
  const currentUser = useUser();
  const currentUserId = String(currentUser?.memberId ?? currentUser?.id ?? '');

  // 스토어 액션
  const { exitCandidatePreview, setIsCreatingNode, updateCustomDraft } =
    useNodeDetailStore();

  const pendingCreationRef = useRef<{
    existingIds: Set<string>;
    expectedName: string;
    parentId: string;
  } | null>(null);


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

  useEffect(() => {
    if (!isCreatingNode || !pendingCreationRef.current) return;
    const { existingIds, expectedName, parentId } = pendingCreationRef.current;
    const createdNode = nodes.find(
      (node) =>
        !existingIds.has(node.id) &&
        node.parentId === parentId &&
        node.data?.title === expectedName
    );
    if (!createdNode) return;

    if (currentUserId) {
      previewNodesCrdtService.clearPreviewNodesByOwner(currentUserId);
    }
    exitCandidatePreview();
    setIsCreatingNode(false);
    pendingCreationRef.current = null;
  }, [
    isCreatingNode,
    nodes,
    currentUserId,
    exitCandidatePreview,
    setIsCreatingNode,
  ]);

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
    [customDraft?.previewNodeId, updateCustomDraft]
  );

  const handleCustomDescriptionChange = useCallback(
    (value: string) => {
      updateCustomDraft({ description: value });
    },
    [updateCustomDraft]
  );

  // 확정 핸들러
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
      setIsCreatingNode(true);

      if (previewKind === 'candidate' && previewCandidate) {
        const position = resolvePosition(`preview-${previewCandidate.id}`);
        if (!position) return;
        pendingCreationRef.current = {
          existingIds: new Set(nodes.map((node) => node.id)),
          expectedName: previewCandidate.name,
          parentId: String(selectedNodeId),
        };

        await postCreateNode(
          { xpos: position.xpos, ypos: position.ypos },
          Number(selectedNodeId),
          previewCandidate.id
        );
      } else if (previewKind === 'custom' && customDraft) {
        const position = resolvePosition(customDraft.previewNodeId);
        if (!position) return;
        pendingCreationRef.current = {
          existingIds: new Set(nodes.map((node) => node.id)),
          expectedName: customDraft.name.trim(),
          parentId: String(selectedNodeId),
        };

        await postCreateCustomNode({
          name: customDraft.name.trim(),
          description: customDraft.description.trim(),
          nodeType: customDraft.nodeType,
          parentNodeId: customDraft.parentNodeId,
          workspaceId: customDraft.workspaceId,
          xpos: position.xpos,
          ypos: position.ypos,
        });
      } else {
        return;
      }

    } catch (error) {
      console.error('??? ??? ???:', error);
    } finally {
      if (pendingCreationRef.current === null) {
        setIsCreatingNode(false);
      }
    }
  }, [
    selectedNodeId,
    previewKind,
    previewCandidate,
    customDraft,
    nodes,
    setIsCreatingNode,
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
