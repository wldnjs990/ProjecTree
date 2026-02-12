// crdt 클라이언트 생성 모듈
import { Doc, UndoManager } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Awareness } from 'y-protocols/awareness.js';
import { useNodeStore } from '../stores';
import { dispatchCrdtMessage } from './dispatcher';

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
    setConnectionStatus(status);

    if (status === 'connected') {
      setupMessageListeners();
    }
  });

  // ydoc 동기 이벤트
  yWebsocket.on('sync', (isSynced: boolean) => {
    setIsSynced(isSynced);
  });
}

function setupMessageListeners() {
  const ws = yWebsocket?.ws;
  if (!ws) return;

  ws.addEventListener('message', (event: MessageEvent) => {
    // yjs 바이너리 메시지 분리
    if (typeof event.data !== 'string') return;

    try {
      const parsedMessage = JSON.parse(event.data);
      dispatchCrdtMessage(parsedMessage);
    } catch {
      // yjs 문자열 비-JSON 메시지 분리
      return;
    }
  });
}


// y-websocket 생성
function initWebsocket() {
  if (!workspaceId || !yDoc) return;
  yWebsocket = new WebsocketProvider(serverUrl, workspaceId, yDoc);
  setupConnectionListners();
}

// awareness 생성
function initAwareness() {
  if (!yWebsocket) return;
  awareness = yWebsocket.awareness;
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
  awareness = null;
  workspaceId = null;
};

// crdt 클라이언트 초기화
const initCrdtClient = (enterWorkspaceId: string) => {
  // 이미 동일한 인스턴스가 있는 경우 기존 인스턴스 제공
  if (yWebsocket && enterWorkspaceId === workspaceId) return;

  destroyCrdtClient();

  yDoc = new Doc();
  workspaceId = enterWorkspaceId;

  initWebsocket();

  initAwareness();

  initUndoManager();
};

const getCrdtClient = () => {
  if (!yDoc || !yWebsocket) return null;
  return { yWebsocket, yDoc, undoManager, awareness };
};

export { destroyCrdtClient, initCrdtClient, getCrdtClient };
