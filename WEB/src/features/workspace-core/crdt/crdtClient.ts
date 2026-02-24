import * as Y from 'yjs';
import { UndoManager } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { Awareness } from 'y-protocols/awareness';
import type { ConnectionStatus } from '../types/node';
import { dispatchCrdtMessage } from './dispatcher';

export interface AwarenessState {
  cursor?: { x: number; y: number };
  user?: { name: string; color: string };
  activeNodeId?: string | null;
}

export type YNodeValue =
  | undefined
  | string
  | { x: number; y: number }
  | Record<string, unknown>;

export interface CrdtClientCallbacks {
  onStatusChange: (status: ConnectionStatus) => void;
  onSyncChange: (isSynced: boolean) => void;
  onRoomJoined: (roomId: string) => void;
  onDestroy: () => void;
}

export interface CrdtClientInstance {
  yDoc: Y.Doc;
  provider: WebsocketProvider;
  awareness: Awareness;
  undoManager: UndoManager;
  roomId: string;
  getYMap<T>(name: string): Y.Map<T>;
  sendMessage(message: Record<string, unknown>): boolean;
}

const serverUrl = import.meta.env.VITE_CRDT_SERVER_URL || 'ws://localhost:1234';

let yDoc: Y.Doc | null = null;
let provider: WebsocketProvider | null = null;
let awareness: Awareness | null = null;
let undoManager: UndoManager | null = null;
let roomId: string | null = null;

let callbacks: CrdtClientCallbacks | null = null;

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

function initMessageListener() {
  const ws = provider?.ws;
  if (!ws) return;
  if (boundWs === ws) return;

  if (boundWs) {
    boundWs.removeEventListener('message', handleWsMessage);
  }

  ws.addEventListener('message', handleWsMessage);
  boundWs = ws;
}

function initConnectionListeners() {
  if (!provider) return;

  statusHandler = ({ status }: { status: string }) => {
    if (
      status === 'connected' ||
      status === 'connecting' ||
      status === 'disconnected'
    ) {
      callbacks?.onStatusChange(status as ConnectionStatus);
    }

    if (status === 'connected') {
      initMessageListener();
    }
  };

  syncHandler = (isSynced: boolean) => {
    callbacks?.onSyncChange(isSynced);
  };

  provider.on('status', statusHandler);
  provider.on('sync', syncHandler);
}

function destroyConnectionListeners() {
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

function initUndoManager() {
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

function getClientInstance(): CrdtClientInstance | null {
  if (!yDoc || !provider || !awareness || !undoManager || !roomId) return null;

  return {
    yDoc,
    provider,
    awareness,
    undoManager,
    roomId,
    getYMap: <T>(name: string) => getMapOrThrow<T>(name),
    sendMessage,
  };
}

function initCrdtClient(
  nextRoomId: string,
  cb: CrdtClientCallbacks
): CrdtClientInstance | null {
  if (provider && roomId === nextRoomId) {
    return getClientInstance();
  }

  destroyCrdtClient();

  callbacks = cb;
  yDoc = new Y.Doc();
  roomId = nextRoomId;
  provider = new WebsocketProvider(serverUrl, nextRoomId, yDoc);
  awareness = provider.awareness;

  initUndoManager();
  initConnectionListeners();
  initMessageListener();
  callbacks.onRoomJoined(nextRoomId);

  return getClientInstance();
}

function destroyCrdtClient(): void {
  destroyConnectionListeners();
  provider?.destroy();
  undoManager?.destroy();
  yDoc?.destroy();

  provider = null;
  undoManager = null;
  yDoc = null;
  awareness = null;
  roomId = null;

  callbacks?.onDestroy();
  callbacks = null;
}

const CrdtClient = {
  init: initCrdtClient,
  getInstance: getClientInstance,
  destroy: destroyCrdtClient,
};

export default CrdtClient;
