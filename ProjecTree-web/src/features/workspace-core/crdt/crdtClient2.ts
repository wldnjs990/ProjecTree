// crdt 클라이언트 생성 모듈
import { Doc, UndoManager } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { Awareness } from 'y-protocols/awareness.js';
import { useNodeStore } from '../stores';

// 모듈 스코프 변수 =====================================================
// serverUrl
const serverUrl: string = import.meta.env.VITE_CRDT_SERVER_URL;

// yjs
let yDoc: Doc | null = null;
let undoManager: UndoManager | null = null;

// y-websocket
let yWebsocket: WebsocketProvider | null = null;
let awareness: Awareness | null = null;

// 워크스페이스 Id
let workspaceId: string | null = null;

// 함수 =====================================================

// y-websocket 연결 이벤트 세팅
function setupConnectionListners() {
  const { setConnectionStatus, setIsSynced } = useNodeStore.getState();

  if (!yWebsocket) {
    console.error('y-websocket 인스턴스가 없습니다.');
    return;
  }

  // 연결 상태 이벤트
  yWebsocket.on('status', ({ status }) => {
    switch (status) {
      case 'connected':
        break;
      case 'connecting':
        break;
      case 'disconnected':
        break;
      default:
        setConnectionStatus(status);
        break;
    }
  });
  // ydoc 동기 이벤트
}

// y-websocket 메시지 이벤트 세팅
function setupMessageListeners() {}

// y-websocket 생성
function initWebsocket() {
  if (!workspaceId || !yDoc) return;
  yWebsocket = new WebsocketProvider(serverUrl, workspaceId, yDoc);
  setupConnectionListners();
}

// undoManager 생성
function initUndoManager() {
  if (!yDoc) return;

  const yNodes = yDoc.getMap('nodes');
  // undo/redo Manager 생성
  undoManager = new UndoManager(yNodes, {
    // 로컬 변경만 추적 (원격 변경은 undo 대상 아님)
    trackedOrigins: new Set([null]),
    // 연속 드래그를 하나의 undo 단위로 묶음 (ms)
    captureTimeout: 300,
  });
}

// 모든 인스턴스 제거
const destroyCrdtClient = () => {
  yWebsocket?.destroy();
  undoManager?.destroy();
  yDoc?.destroy();

  yWebsocket = null;
  undoManager = null;
  yDoc = null;
  workspaceId = null;
};

// crdt 클라이언트 초기화
const initCrdtClient = (enterWorkspaceId: string) => {
  // 이미 동일한 인스턴스가 있는 경우 기존 인스턴스 제공
  if (yWebsocket && enterWorkspaceId === workspaceId) return yWebsocket;

  destroyCrdtClient();

  yDoc = new Doc();
  workspaceId = enterWorkspaceId;

  initWebsocket();

  initUndoManager();
};

export { destroyCrdtClient, initCrdtClient };
