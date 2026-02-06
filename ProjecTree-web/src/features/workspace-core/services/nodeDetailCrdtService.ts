import * as Y from 'yjs';
import { getCrdtClient, type YNodeValue } from '../crdt/crdtClient';
import { useNodeStore, type ConfirmedNodeData } from '../stores/nodeStore';
import {
  useNodeDetailStore,
  type EditableNodeDetail,
} from '../stores/nodeDetailStore';
import type {
  NodeStatus,
  Priority,
  Assignee,
  NodeType,
  Candidate,
  TechRecommendation,
} from '../types/nodeDetail';
import type { FlowNodeData } from '../types/node';

// Y.Map stored value type (candidates are managed in a separate Y.Map)
type YNodeDetailValue = string | number | Assignee | null | undefined;

class NodeDetailCrdtService {
  private static instance: NodeDetailCrdtService | null = null;

  private yNodeDetailsRef: Y.Map<Y.Map<YNodeDetailValue>> | null = null;
  private yConfirmedRef: Y.Map<ConfirmedNodeData> | null = null;
  private yNodeCandidatesRef: Y.Map<Candidate[]> | null = null;
  private yNodeTechRecommendationsRef: Y.Map<TechRecommendation[]> | null =
    null;
  private yNodeCandidatesPendingRef: Y.Map<boolean> | null = null;
  private yNodeTechsPendingRef: Y.Map<boolean> | null = null;
  private cleanupFn: (() => void) | null = null;
  private isInitialized = false;

  private constructor() {}

  // Sync confirmed data back into the node graph data (for ReactFlow UI)

  private updateNodeDataInCrdt(
    nodeId: string,
    confirmedData: ConfirmedNodeData
  ): void {
    const client = getCrdtClient();
    if (!client) return;

    const yNodes = client.getYMap<Y.Map<YNodeValue>>('nodes');
    const yNode = yNodes.get(nodeId);
    if (!yNode) return;

    const currentData = yNode.get('data') as FlowNodeData | undefined;
    if (!currentData) return;

    const nextData: FlowNodeData = {
      ...currentData,
      status: confirmedData.status,
      priority: confirmedData.priority,
      difficult: confirmedData.difficult,
    };

    client.yDoc.transact(() => {
      yNode.set('data', nextData);
    });
  }

  static getInstance(): NodeDetailCrdtService {
    if (!NodeDetailCrdtService.instance) {
      NodeDetailCrdtService.instance = new NodeDetailCrdtService();
    }
    return NodeDetailCrdtService.instance;
  }

  // Initialize CRDT observers (call once per connection)
  initObservers(): void {
    if (this.isInitialized) {
      console.log('[NodeDetailCrdtService] already initialized');
      return;
    }

    const client = getCrdtClient();
    if (!client) {
      console.warn('[NodeDetailCrdtService] CRDT client is not available.');
      return;
    }
    const yNodeDetails = client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');
    const yConfirmed = client.getYMap<ConfirmedNodeData>('confirmedNodeData');
    const yNodeCandidates = client.getYMap<Candidate[]>('nodeCandidates');
    const yNodeTechRecommendations = client.getYMap<TechRecommendation[]>(
      'nodeTechRecommendations'
    );
    const yNodeCandidatesPending = client.getYMap<boolean>(
      'nodeCandidatesPending'
    );
    const yNodeTechsPending = client.getYMap<boolean>('nodeTechsPending');
    const editObserveHandler = () => {
      this.syncFromYjs();
    };
    const confirmedObserveHandler = (event: Y.YMapEvent<ConfirmedNodeData>) => {
      event.keysChanged.forEach((key) => {
        const confirmedData = yConfirmed.get(key);
        if (confirmedData) {
          console.log(
            '[NodeDetailCrdtService] confirmed data received:',
            key,
            confirmedData
          );
          useNodeStore
            .getState()
            .applyConfirmedData(Number(key), confirmedData);
          this.updateNodeDataInCrdt(key, confirmedData);
        }
      });
    };
    const candidatesHandler = (event: Y.YMapEvent<Candidate[]>) => {
      event.keysChanged.forEach((key) => {
        const candidates = yNodeCandidates.get(key);
        if (candidates) {
          console.log(
            '[NodeDetailCrdtService] candidates received:',
            key,
            candidates
          );
          useNodeStore.getState().updateNodeDetail(Number(key), { candidates });
        }
      });
    };

    const techRecommendationsHandler = (
      event: Y.YMapEvent<TechRecommendation[]>
    ) => {
      event.keysChanged.forEach((key) => {
        const techs = yNodeTechRecommendations.get(key);
        if (techs) {
          console.log(
            '[NodeDetailCrdtService] tech recommendations received:',
            key,
            techs
          );
          useNodeStore.getState().updateNodeDetail(Number(key), { techs });
        }
      });
    };

    const candidatesPendingHandler = (event: Y.YMapEvent<boolean>) => {
      event.keysChanged.forEach((key) => {
        const pending = yNodeCandidatesPending.get(key);
        if (pending !== undefined) {
          useNodeStore
            .getState()
            .updateNodeDetail(Number(key), { candidatesPending: pending });
        }
      });
    };

    const techsPendingHandler = (event: Y.YMapEvent<boolean>) => {
      event.keysChanged.forEach((key) => {
        const pending = yNodeTechsPending.get(key);
        if (pending !== undefined) {
          useNodeStore
            .getState()
            .updateNodeDetail(Number(key), { techsPending: pending });
        }
      });
    };

    yNodeDetails.observeDeep(editObserveHandler);
    yConfirmed.observe(confirmedObserveHandler);
    yNodeCandidates.observe(candidatesHandler);
    yNodeTechRecommendations.observe(techRecommendationsHandler);
    yNodeCandidatesPending.observe(candidatesPendingHandler);
    yNodeTechsPending.observe(techsPendingHandler);
    const loadExistingData = () => {
      yConfirmed.forEach((confirmedData, key) => {
        console.log(
          '[NodeDetailCrdtService] confirmed data load:',
          key,
          confirmedData
        );
        useNodeStore.getState().applyConfirmedData(Number(key), confirmedData);
        this.updateNodeDataInCrdt(key, confirmedData);
      });
      const { selectedNodeId } = useNodeDetailStore.getState();
      if (selectedNodeId && yNodeDetails.has(selectedNodeId)) {
        this.syncFromYjs();
        console.log(
          '[NodeDetailCrdtService] restore edit data:',
          selectedNodeId
        );
      }
      yNodeCandidatesPending.forEach((pending, key) => {
        useNodeStore
          .getState()
          .updateNodeDetail(Number(key), { candidatesPending: pending });
      });
      yNodeTechsPending.forEach((pending, key) => {
        useNodeStore
          .getState()
          .updateNodeDetail(Number(key), { techsPending: pending });
      });
    };
    const syncHandler = (isSynced: boolean) => {
      if (isSynced) {
        console.log(
          '[NodeDetailCrdtService] Y.js sync complete, loading existing data'
        );
        loadExistingData();
      }
    };
    if (client.provider.synced) {
      console.log(
        '[NodeDetailCrdtService] already synced, loading existing data'
      );
      loadExistingData();
    } else {
      client.provider.once('sync', syncHandler);
    }
    this.cleanupFn = () => {
      yNodeDetails.unobserveDeep(editObserveHandler);
      yConfirmed.unobserve(confirmedObserveHandler);
      yNodeCandidates.unobserve(candidatesHandler);
      yNodeTechRecommendations.unobserve(techRecommendationsHandler);
      yNodeCandidatesPending.unobserve(candidatesPendingHandler);
      yNodeTechsPending.unobserve(techsPendingHandler);
      client.provider.off('sync', syncHandler);
    };

    this.yNodeDetailsRef = yNodeDetails;
    this.yConfirmedRef = yConfirmed;
    this.yNodeCandidatesRef = yNodeCandidates;
    this.yNodeTechRecommendationsRef = yNodeTechRecommendations;
    this.yNodeCandidatesPendingRef = yNodeCandidatesPending;
    this.yNodeTechsPendingRef = yNodeTechsPending;
    this.isInitialized = true;

    console.log('[NodeDetailCrdtService] observers initialized');
  }

  // Cleanup CRDT observers
  cleanupObservers(): void {
    if (this.cleanupFn) {
      this.cleanupFn();
    }

    this.yNodeDetailsRef = null;
    this.yConfirmedRef = null;
    this.yNodeCandidatesRef = null;
    this.yNodeTechRecommendationsRef = null;
    this.yNodeCandidatesPendingRef = null;
    this.yNodeTechsPendingRef = null;
    this.cleanupFn = null;
    this.isInitialized = false;

    console.log('[NodeDetailCrdtService] observers cleaned up');
  }

  // Start editing (creates Y.Map entry and local edit state)
  startEdit(): void {
    const { selectedNodeId } = useNodeDetailStore.getState();
    const client = getCrdtClient();

    if (!client || !selectedNodeId) {
      console.warn('[NodeDetailCrdtService] cannot start edit.');
      return;
    }
    const nodeStore = useNodeStore.getState();
    const numericId = Number(selectedNodeId);
    const nodeListData = nodeStore.nodeListData[numericId];
    const nodeDetail = nodeStore.nodeDetails[numericId];

    if (!nodeListData || !nodeDetail) {
      console.warn('[NodeDetailCrdtService] node data not found.');
      return;
    }

    const nodeType = useNodeStore
      .getState()
      .nodes.find((n) => n.id === selectedNodeId)
      ?.type.toUpperCase() as NodeType;
    interface ServerEditableNodeDetail extends EditableNodeDetail {
      nodeType: NodeType;
    }
    const initialData: ServerEditableNodeDetail = {
      status: nodeListData.status,
      priority: nodeListData.priority,
      difficult: nodeListData.difficult,
      assignee: nodeDetail.assignee,
      note: nodeDetail.note,
      nodeType: nodeType,
    };
    const yNodeDetails = client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');

    client.yDoc.transact(() => {
      const yNodeDetail = new Y.Map<YNodeDetailValue>();
      yNodeDetail.set('status', initialData.status);
      yNodeDetail.set('priority', initialData.priority);
      yNodeDetail.set('difficult', initialData.difficult);
      yNodeDetail.set('assignee', initialData.assignee);
      yNodeDetail.set('note', initialData.note);
      yNodeDetail.set('nodeType', initialData.nodeType);
      yNodeDetails.set(selectedNodeId, yNodeDetail);
    });
    const store = useNodeDetailStore.getState();
    store.setIsEditing(true);
    store.setEditData(initialData);

    console.log('[NodeDetailCrdtService] edit start:', selectedNodeId);
  }

  // Finish editing (broadcast confirmed data)
  async finishEdit(): Promise<void> {
    const { selectedNodeId, editData } = useNodeDetailStore.getState();

    if (!selectedNodeId || !editData) {
      console.warn('[NodeDetailCrdtService] no data to save.');
      return;
    }

    const store = useNodeDetailStore.getState();
    store.setIsSaving(true);

    try {
      const client = getCrdtClient();
      if (client) {
        const requestId = client.saveNodeDetail(selectedNodeId);
        if (requestId) {
          console.log(
            '[NodeDetailCrdtService] save request sent, requestId:',
            requestId
          );
        }
      }

      if (client && this.yConfirmedRef && this.yNodeDetailsRef) {
        const confirmedData: ConfirmedNodeData = {
          status: editData.status,
          priority: editData.priority,
          difficult: editData.difficult,
          assignee: editData.assignee,
          note: editData.note,
        };
        this.yConfirmedRef.set(selectedNodeId, confirmedData);
        console.log(
          '[NodeDetailCrdtService] confirmed data broadcast:',
          selectedNodeId,
          confirmedData
        );
        useNodeStore
          .getState()
          .applyConfirmedData(Number(selectedNodeId), confirmedData);
        this.yNodeDetailsRef.delete(selectedNodeId);
      }

      store.setIsEditing(false);
      store.setEditData(null);
      console.log('[NodeDetailCrdtService] edit finished:', selectedNodeId);
    } catch (error) {
      console.error('[NodeDetailCrdtService] save failed:', error);
      throw error;
    } finally {
      store.setIsSaving(false);
    }
  }

  // Cancel editing
  cancelEdit(): void {
    const { selectedNodeId } = useNodeDetailStore.getState();

    if (!selectedNodeId) return;

    const client = getCrdtClient();
    if (client) {
      const yNodeDetails =
        client.getYMap<Y.Map<YNodeDetailValue>>('nodeDetails');
      yNodeDetails.delete(selectedNodeId);
    }

    const store = useNodeDetailStore.getState();
    store.setIsEditing(false);
    store.setEditData(null);

    console.log('[NodeDetailCrdtService] edit canceled:', selectedNodeId);
  }

  // Update a single field in edit data
  updateField<K extends keyof EditableNodeDetail>(
    field: K,
    value: EditableNodeDetail[K]
  ): void {
    const { selectedNodeId } = useNodeDetailStore.getState();

    if (!this.yNodeDetailsRef || !selectedNodeId) return;

    const yNodeDetail = this.yNodeDetailsRef.get(selectedNodeId);
    if (!yNodeDetail) {
      console.warn('[NodeDetailCrdtService] no editing node.');
      return;
    }

    yNodeDetail.set(field, value as YNodeDetailValue);
    console.log('[NodeDetailCrdtService] field update:', field, value);
  }

  // Sync edit data from Y.js to local store
  private syncFromYjs(): void {
    const { selectedNodeId } = useNodeDetailStore.getState();

    if (!this.yNodeDetailsRef || !selectedNodeId) return;

    const yNodeDetail = this.yNodeDetailsRef.get(selectedNodeId);
    if (!yNodeDetail) {
      const store = useNodeDetailStore.getState();
      store.setIsEditing(false);
      store.setEditData(null);
      return;
    }
    const data: EditableNodeDetail = {
      status: (yNodeDetail.get('status') as NodeStatus) || 'TODO',
      priority: yNodeDetail.get('priority') as Priority | undefined,
      difficult: (yNodeDetail.get('difficult') as number) || 1,
      assignee: yNodeDetail.get('assignee') as Assignee | null,
      note: (yNodeDetail.get('note') as string) || '',
    };

    const store = useNodeDetailStore.getState();
    store.setEditData(data);
    store.setIsEditing(true);
  }

  checkAndRestoreEditData(nodeId: string): void {
    if (this.yNodeDetailsRef && this.yNodeDetailsRef.has(nodeId)) {
      setTimeout(() => {
        this.syncFromYjs();
        console.log(
          '[NodeDetailCrdtService] restore edit data on node select:',
          nodeId
        );
      }, 0);
    }
  }

  // Update candidates (broadcast + local store)
  updateCandidates(nodeId: string, candidates: Candidate[]): void {
    const client = getCrdtClient();
    if (!client || !this.yNodeCandidatesRef) {
      console.warn('[NodeDetailCrdtService] CRDT client is not available.');
      return;
    }
    this.yNodeCandidatesRef.set(nodeId, candidates);
    this.setCandidatesPending(nodeId, false);
    useNodeStore.getState().updateNodeDetail(Number(nodeId), { candidates });

    console.log(
      '[NodeDetailCrdtService] candidates updated:',
      nodeId,
      candidates
    );
  }

  // Update tech recommendations (broadcast + local store)
  updateTechRecommendations(nodeId: string, techs: TechRecommendation[]): void {
    const client = getCrdtClient();
    if (!client || !this.yNodeTechRecommendationsRef) {
      console.warn('[NodeDetailCrdtService] CRDT client is not available.');
      return;
    }

    this.yNodeTechRecommendationsRef.set(nodeId, techs);
    this.setTechsPending(nodeId, false);
    useNodeStore.getState().updateNodeDetail(Number(nodeId), { techs });

    console.log(
      '[NodeDetailCrdtService] tech recommendations updated:',
      nodeId,
      techs
    );
  }

  setCandidatesPending(nodeId: string, pending: boolean): void {
    if (!this.yNodeCandidatesPendingRef) return;
    this.yNodeCandidatesPendingRef.set(nodeId, pending);
    useNodeStore
      .getState()
      .updateNodeDetail(Number(nodeId), { candidatesPending: pending });
  }

  setTechsPending(nodeId: string, pending: boolean): void {
    if (!this.yNodeTechsPendingRef) return;
    this.yNodeTechsPendingRef.set(nodeId, pending);
    useNodeStore
      .getState()
      .updateNodeDetail(Number(nodeId), { techsPending: pending });
  }
}
export const nodeDetailCrdtService = NodeDetailCrdtService.getInstance();




