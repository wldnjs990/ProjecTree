import * as Y from 'yjs';
import { UndoManager } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { Awareness } from 'y-protocols/awareness';
import { useNodeStore } from '../stores/nodeStore';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { dispatchCrdtMessage } from './dispatcher';

export interface AwarenessState {
  cursor?: { x: number; y: number };
  user?: { name: string; color: string };
  activeNodeId?: string | null;
}

export type YNodeValue =
  | string
  | undefined
  | { x: number; y: number }
  | Record<string, unknown>;

export interface CrdtClientInstance {
  yDoc: Y.Doc;
  provider: WebsocketProvider;
  awareness: Awareness;
  roomId: string;
  getYMap<T>(name: string): Y.Map<T>;
  initUndoManager(): UndoManager;
  undo(): boolean;
  redo(): boolean;
  canUndo(): boolean;
  canRedo(): boolean;
  saveNodeDetail(nodeId: string): string | null;
  saveNodePosition(nodeId: string): string | null;
  selectNodeTech(nodeId: string, selectedTechId: number): string | null;
  getSelectedNodeTechs(): Y.Map<number>;
  deleteNode(nodeId: string): string | null;
  deleteCandidate(nodeId: string, candidateId: number): string | null;
}

const serverUrl = import.meta.env.VITE_CRDT_SERVER_URL || 'ws://localhost:1234';

let yDoc: Y.Doc | null = null;
let provider: WebsocketProvider | null = null;
let awareness: Awareness | null = null;
let undoManager: UndoManager | null = null;
let roomId: string | null = null;

let boundWs: WebSocket | null = null;
let statusHandler: ((event: { status: string }) => void) | null = null;
let syncHandler: ((isSynced: boolean) => void) | null = null;

function handleWsMessage(event: MessageEvent) {
  if (typeof event.data !== 'string') return;

  try {
    const parsedMessage = JSON.parse(event.data);
    dispatchCrdtMessage(parsedMessage);
  } catch {
    // Ignore non-JSON text frames from y-websocket internals.
  }
}

function setupMessageListener() {
  const ws = provider?.ws;
  if (!ws) return;
  if (boundWs === ws) return;

  if (boundWs) {
    boundWs.removeEventListener('message', handleWsMessage);
  }

  ws.addEventListener('message', handleWsMessage);
  boundWs = ws;
}

function setupConnectionListeners() {
  if (!provider) return;

  const { setConnectionStatus, setIsSynced } = useNodeStore.getState();

  statusHandler = ({ status }: { status: string }) => {
    if (
      status === 'connected' ||
      status === 'connecting' ||
      status === 'disconnected'
    ) {
      setConnectionStatus(status);
    }

    if (status === 'connected') {
      setupMessageListener();
    }
  };

  syncHandler = (isSynced: boolean) => {
    setIsSynced(isSynced);
  };

  provider.on('status', statusHandler);
  provider.on('sync', syncHandler);
}

function clearConnectionListeners() {
  if (provider && statusHandler) {
    provider.off('status', statusHandler);
  }
  if (provider && syncHandler) {
    provider.off('sync', syncHandler);
  }

  statusHandler = null;
  syncHandler = null;

  if (boundWs) {
    boundWs.removeEventListener('message', handleWsMessage);
    boundWs = null;
  }
}

function initUndoManagerInternal() {
  if (!yDoc) return;

  const yNodes = yDoc.getMap('nodes');
  undoManager = new UndoManager(yNodes, {
    trackedOrigins: new Set([null]),
    captureTimeout: 300,
  });
}

function getMapOrThrow<T>(name: string): Y.Map<T> {
  if (!yDoc) {
    throw new Error('CRDT client is not initialized.');
  }
  return yDoc.getMap(name) as Y.Map<T>;
}

function sendMessage(message: Record<string, unknown>): boolean {
  const ws = provider?.ws;
  if (!ws || ws.readyState !== WebSocket.OPEN) return false;

  ws.send(JSON.stringify(message));
  return true;
}

function buildClientInstance(): CrdtClientInstance | null {
  if (!yDoc || !provider || !awareness || !roomId) return null;

  return {
    yDoc,
    provider,
    awareness,
    roomId,
    getYMap: <T>(name: string) => getMapOrThrow<T>(name),
    initUndoManager: () => {
      if (undoManager) return undoManager;

      const yNodes = getMapOrThrow<Y.Map<YNodeValue>>('nodes');
      undoManager = new UndoManager(yNodes, {
        trackedOrigins: new Set([null]),
        captureTimeout: 300,
      });

      return undoManager;
    },
    undo: () => {
      if (!undoManager?.canUndo()) return false;
      undoManager.undo();
      return true;
    },
    redo: () => {
      if (!undoManager?.canRedo()) return false;
      undoManager.redo();
      return true;
    },
    canUndo: () => undoManager?.canUndo() ?? false,
    canRedo: () => undoManager?.canRedo() ?? false,
    saveNodeDetail: (nodeId: string) => {
      const requestId = crypto.randomUUID();
      const ok = sendMessage({ type: 'save_node_detail', requestId, nodeId });
      return ok ? requestId : null;
    },
    saveNodePosition: (nodeId: string) => {
      const requestId = crypto.randomUUID();
      const ok = sendMessage({
        type: 'save_node_position',
        workspaceId: roomId,
        requestId,
        nodeId,
      });
      return ok ? requestId : null;
    },
    selectNodeTech: (nodeId: string, selectedTechId: number) => {
      const selectedNodeTechs = getMapOrThrow<number>('selectedNodeTechs');
      selectedNodeTechs.set(nodeId, selectedTechId);

      const requestId = crypto.randomUUID();
      const ok = sendMessage({
        type: 'select_node_tech',
        requestId,
        nodeId,
        selectedTechId,
      });
      return ok ? requestId : null;
    },
    getSelectedNodeTechs: () => getMapOrThrow<number>('selectedNodeTechs'),
    deleteNode: (nodeId: string) => {
      const requestId = crypto.randomUUID();
      const ok = sendMessage({
        type: 'delete_node',
        requestId,
        nodeId: Number(nodeId),
      });
      return ok ? requestId : null;
    },
    deleteCandidate: (nodeId: string, candidateId: number) => {
      const requestId = crypto.randomUUID();
      const ok = sendMessage({
        type: 'delete_candidate',
        requestId,
        nodeId: Number(nodeId),
        candidateId,
      });
      return ok ? requestId : null;
    },
  };
}

export function destroyCrdtClient(): void {
  clearConnectionListeners();
  provider?.destroy();
  undoManager?.destroy();
  yDoc?.destroy();

  provider = null;
  undoManager = null;
  yDoc = null;
  awareness = null;
  roomId = null;

  useWorkspaceStore.getState().reset();
  useNodeStore.getState().reset();
}

export function initCrdtClient(nextRoomId: string): CrdtClientInstance | null {
  if (provider && roomId === nextRoomId) {
    return buildClientInstance();
  }

  destroyCrdtClient();

  yDoc = new Y.Doc();
  roomId = nextRoomId;
  provider = new WebsocketProvider(serverUrl, nextRoomId, yDoc);
  awareness = provider.awareness;

  initUndoManagerInternal();
  setupConnectionListeners();
  setupMessageListener();
  useWorkspaceStore.getState().setRoomId(nextRoomId);

  return buildClientInstance();
}

export function getCrdtClient(): CrdtClientInstance | null {
  return buildClientInstance();
}

const CrdtClient = {
  init: initCrdtClient,
  getInstance: getCrdtClient,
  destroy: destroyCrdtClient,
};

export default CrdtClient;
