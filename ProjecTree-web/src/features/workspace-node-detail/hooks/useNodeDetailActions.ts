import { useCallback } from 'react';
import * as Y from 'yjs';
import {
  generateNodeCandidates,
  getAiNodeTechRecommendation,
  postCustomNodeTechRecommendation,
} from '@/apis';
import {
  calculateChildNodePosition,
  getChildNodeType,
  getCrdtClient,
  nodeDetailCrdtService,
  previewNodesCrdtService,
  useNodeDetailStore,
  type Candidate,
  type FlowNode,
  type NodeDetailData,
} from '@/features/workspace-core';

interface UseNodeDetailActionsParams {
  nodeDetail: NodeDetailData | null;
  selectedNodeId: string | null;
  workspaceId: number | null;
  nodes: FlowNode[];
  currentUserId: string;
  closeSidebar: () => void;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toFiniteNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const readPosition = (yNode: Y.Map<unknown>) => {
  const rawPosition = yNode.get('position');
  if (!isRecord(rawPosition)) {
    return { xpos: 0, ypos: 0 };
  }

  return {
    xpos: toFiniteNumber(rawPosition.x),
    ypos: toFiniteNumber(rawPosition.y),
  };
};

export function useNodeDetailActions({
  nodeDetail,
  selectedNodeId,
  workspaceId,
  nodes,
  currentUserId,
  closeSidebar,
}: UseNodeDetailActionsParams) {
  const enterCandidatePreview = useNodeDetailStore((state) => state.enterCandidatePreview);
  const enterCustomPreview = useNodeDetailStore((state) => state.enterCustomPreview);

  const handleCandidateClick = useCallback(
    (nodeId: number, candidateId: number, position: { xpos: number; ypos: number }) => {
      const candidate = nodeDetail?.candidates.find((item) => item.id === candidateId);
      if (!candidate) return;

      const parentNodeId = selectedNodeId ?? String(nodeId);
      const previewNode: FlowNode = {
        id: `preview-${candidateId}`,
        type: 'PREVIEW',
        position: { x: position.xpos, y: position.ypos },
        parentId: parentNodeId,
        data: {
          title: candidate.name,
          status: 'TODO',
          taskId: '#preview',
          taskType: candidate.taskType,
          ...(currentUserId ? { lockedBy: currentUserId } : {}),
        },
      };

      previewNodesCrdtService.addPreviewNode(previewNode);
      enterCandidatePreview(candidate, position);
    },
    [nodeDetail, selectedNodeId, currentUserId, enterCandidatePreview]
  );

  const handleLockedCandidateClick = useCallback(
    (candidate: Candidate) => {
      const previewNodeId = `preview-${candidate.id}`;
      const client = getCrdtClient();
      if (!client) return;

      const yPreviewNodes = client.getYMap<Y.Map<unknown>>('previewNodes');
      const yNode = yPreviewNodes.get(previewNodeId);
      if (!yNode) return;

      enterCandidatePreview(candidate, readPosition(yNode));

      const yNodeCreatingPending = client.getYMap<boolean>('nodeCreatingPending');
      const isPending = yNodeCreatingPending.get(previewNodeId) === true;
      if (isPending) {
        useNodeDetailStore.getState().addCreatingPreviewId(previewNodeId);
      }
    },
    [enterCandidatePreview]
  );

  const handleCandidateAddManual = useCallback(() => {
    if (!selectedNodeId || !workspaceId) return;

    const parentNode = nodes.find((node) => node.id === selectedNodeId);
    if (!parentNode) return;

    const nextType = getChildNodeType(parentNode.type);
    if (!nextType) return;

    const position = calculateChildNodePosition(nodes, selectedNodeId);
    const previewNodeId = `preview-custom-${Date.now()}`;
    const previewNode: FlowNode = {
      id: previewNodeId,
      type: 'PREVIEW',
      position: { x: position.xpos, y: position.ypos },
      parentId: selectedNodeId,
      data: {
        title: '새 노드',
        status: 'TODO',
        taskId: '#preview',
        taskType: parentNode.data.taskType ?? null,
        ...(currentUserId ? { lockedBy: currentUserId } : {}),
      },
    };

    previewNodesCrdtService.addPreviewNode(previewNode);
    enterCustomPreview(
      {
        name: '',
        description: '',
        nodeType: nextType,
        taskType: parentNode.data.taskType ?? null,
        parentNodeId: Number(selectedNodeId),
        workspaceId,
        previewNodeId,
      },
      position
    );
  }, [selectedNodeId, workspaceId, nodes, currentUserId, enterCustomPreview]);

  const handleGenerateTechs = useCallback(async () => {
    if (!selectedNodeId || !workspaceId) return;

    nodeDetailCrdtService.setTechsPending(selectedNodeId, true);
    try {
      await getAiNodeTechRecommendation(Number(selectedNodeId), workspaceId);
    } catch {
      nodeDetailCrdtService.setTechsPending(selectedNodeId, false);
    }
  }, [selectedNodeId, workspaceId]);

  const handleGenerateCandidates = useCallback(async () => {
    if (!selectedNodeId || !workspaceId) return;

    nodeDetailCrdtService.setCandidatesPending(selectedNodeId, true);
    try {
      await generateNodeCandidates(Number(selectedNodeId), workspaceId);
    } catch {
      nodeDetailCrdtService.setCandidatesPending(selectedNodeId, false);
    }
  }, [selectedNodeId, workspaceId]);

  const handleAddCustomTech = useCallback(
    async (techVocaId: number) => {
      if (!selectedNodeId || !workspaceId) return;

      nodeDetailCrdtService.setTechsPending(selectedNodeId, true);
      try {
        await postCustomNodeTechRecommendation(Number(selectedNodeId), {
          workspaceId,
          techVocaId,
        });
      } catch {
        nodeDetailCrdtService.setTechsPending(selectedNodeId, false);
      }
    },
    [selectedNodeId, workspaceId]
  );

  const handleDeleteNode = useCallback(() => {
    if (!selectedNodeId) return;
    const client = getCrdtClient();
    if (!client) return;

    closeSidebar();
    client.deleteNode(selectedNodeId);
  }, [selectedNodeId, closeSidebar]);

  const handleDeleteCandidate = useCallback(
    (candidateId: number) => {
      if (!selectedNodeId) return;
      const client = getCrdtClient();
      if (!client) return;

      client.deleteCandidate(selectedNodeId, candidateId);
    },
    [selectedNodeId]
  );

  return {
    handleCandidateClick,
    handleLockedCandidateClick,
    handleCandidateAddManual,
    handleGenerateTechs,
    handleGenerateCandidates,
    handleAddCustomTech,
    handleDeleteNode,
    handleDeleteCandidate,
  };
}

