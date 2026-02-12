import * as Y from 'yjs';
import { UndoManager } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { Awareness } from 'y-protocols/awareness';
import { toast } from 'sonner';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { useNodeStore } from '../stores/nodeStore';
import { useNodeDetailStore } from '../stores/nodeDetailStore';

// Awareness 상태 정보
export interface AwarenessState {
  cursor?: {
    x: number;
    y: number;
  };
  user?: {
    name: string;
    color: string;
  };
  activeNodeId?: string | null;
}

// Y.Map에 저장되는 노드 값 타입
export type YNodeValue =
  | string
  | undefined
  | { x: number; y: number }
  | Record<string, unknown>;

/**
 * CRDT 클라이언트
 */
class CrdtClient {
  private static instance: CrdtClient | null = null;

  public yDoc: Y.Doc;
  public provider: WebsocketProvider;
  public awareness: Awareness;
  public roomId: string;
  private undoManager: UndoManager | null = null;

  private constructor(roomId: string) {
    this.roomId = roomId;
    this.yDoc = new Y.Doc();

    const serverUrl =
      import.meta.env.VITE_CRDT_SERVER_URL || 'ws://localhost:1234';
    // yDoc 자료구조를 동기화하는 websocket 클라이언트로 변환
    this.provider = new WebsocketProvider(serverUrl, roomId, this.yDoc);
    this.awareness = this.provider.awareness;

    this.setupConnectionEvents();
  }

  private setupConnectionEvents() {
    const { setConnectionStatus, setIsSynced } = useNodeStore.getState();

    this.provider.on('status', ({ status }: { status: string }) => {
      if (status === 'connected') {
        setConnectionStatus('connected');
        this.setupMessageListener();
      } else if (status === 'connecting') {
        setConnectionStatus('connecting');
      } else if (status === 'disconnected') {
        setConnectionStatus('disconnected');
      }
    });

    this.provider.on('sync', (isSynced: boolean) => {
      setIsSynced(isSynced);
      if (isSynced) {
      }
    });

    // 서버로부터 메시지 수신 리스너
    this.provider.ws?.addEventListener('message', (event: MessageEvent) => {
      // y-websocket은 바이너리 데이터도 주고받으므로 문자형만 처리
      if (typeof event.data === 'string') {
        try {
          const message = JSON.parse(event.data);
          this.handleServerMessage(message);
        } catch {
          // JSON 파싱 실패 시 무시
        }
      }
    });
  }

  private handleServerMessage(message: {
    type: string;
    action?: string;
    nodeId?: number;
    text?: string;
    streamType?: 'candidates' | 'techs';
    isComplete?: boolean;
    [key: string]: unknown;
  }) {
    const { updateAiStream, clearAiStream } =
      useNodeDetailStore.getState();

    switch (message.type) {
      case 'AI_MESSAGE': {
        const category = message.streamType === 'candidates' ? 'CANDIDATE'
          : message.streamType === 'techs' ? 'TECH' : null;
        const nodeId = message.nodeId;
        if (!category || nodeId == null) break;
        const key = `${category}-${nodeId}`;
        if (message.isComplete) {
          clearAiStream(key);
        } else if (message.text) {
          updateAiStream(key, message.text as string);
        }
        break;
      }
      case 'save_error':
        if (message.action === 'delete_node') {
          toast.error('노드 삭제에 실패했습니다.');
        } else if (message.action === 'delete_candidate') {
          toast.error('후보 노드 삭제에 실패했습니다.');
        } else {
          toast.error('저장에 실패했습니다.');
        }
        break;
      default:
        break;
    }
  }

  /**
   * WebSocket 메시지 수신 리스너 설정
   */
  private setupMessageListener() {
    const ws = this.provider.ws;
    if (!ws) return;

    ws.addEventListener('message', (event: MessageEvent) => {
      // y-websocket은 바이너리 데이터도 주고받으므로 문자형만 처리
      if (typeof event.data === 'string') {
        try {
          const message = JSON.parse(event.data);
          this.handleServerMessage(message);
        } catch {
          // JSON 파싱 실패 시 무시
        }
      }
    });
  }

  /**
   * Y.Map 가져오기(구버전)
   */
  getYMap<T>(name: string): Y.Map<T> {
    return this.yDoc.getMap(name) as Y.Map<T>;
  }

  /**
   * UndoManager 초기화(nodes Y.Map 전용)
   */
  initUndoManager(): UndoManager {
    if (this.undoManager) {
      return this.undoManager;
    }

    const yNodes = this.getYMap<Y.Map<YNodeValue>>('nodes');

    this.undoManager = new UndoManager(yNodes, {
      // 로컬 변경만 추적 (원격 변경은 undo 아님)
      trackedOrigins: new Set([null]),
      // 연속 드래그를 하나의 undo 단위로 묶음 (ms)
      captureTimeout: 300,
    });

    return this.undoManager;
  }

  /**
   * Undo 실행
   */
  undo(): boolean {
    if (this.undoManager?.canUndo()) {
      this.undoManager.undo();
      return true;
    }
    return false;
  }

  /**
   * Redo 실행
   */
  redo(): boolean {
    if (this.undoManager?.canRedo()) {
      this.undoManager.redo();
      return true;
    }
    return false;
  }

  canUndo(): boolean {
    return this.undoManager?.canUndo() ?? false;
  }

  canRedo(): boolean {
    return this.undoManager?.canRedo() ?? false;
  }

  /**
   * 노드 상세정보 편집 데이터 저장 요청을 CRDT 서버로 전송
   * CRDT 서버가 REST API로 스프링 서버에 전송
   * 스프링 서버에서 DB에 저장
   */
  saveNodeDetail(nodeId: string): string | null {
    const requestId = crypto.randomUUID();
    const message = JSON.stringify({
      type: 'save_node_detail',
      requestId,
      nodeId,
    });

    const ws = this.provider.ws;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      return requestId;
    }

    return null;
  }

  /**
   * 노드 위치정보 편집 데이터 저장 요청을 CRDT 서버로 전송
   */
  saveNodePosition(nodeId: string): string | null {
    const requestId = crypto.randomUUID();
    const workspaceId = this.roomId;

    const ws = this.provider.ws;
    const message = JSON.stringify({
      type: 'save_node_position',
      workspaceId,
      requestId,
      nodeId,
    });

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      return requestId;
    }

    return null;
  }

  /**
   * 노드 기술스택 선택 이벤트를 CRDT 서버로 전송 및 YMap 브로드캐스트
   * @param nodeId 노드 ID
   * @param selectedTechId 선택된 기술스택 ID
   */
  selectNodeTech(nodeId: string, selectedTechId: number): string | null {
    const requestId = crypto.randomUUID();

    // YMap에 선택된 기술스택 저장(브로드캐스트)
    const selectedNodeTechs = this.getYMap<number>('selectedNodeTechs');
    selectedNodeTechs.set(nodeId, selectedTechId);

    // CRDT 서버로 이벤트 전송
    const ws = this.provider.ws;
    const message = JSON.stringify({
      type: 'select_node_tech',
      requestId,
      nodeId,
      selectedTechId,
    });

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      return requestId;
    }

    return null;
  }

  /**
   * 선택된 노드 기술스택 YMap 가져오기
   */
  getSelectedNodeTechs(): Y.Map<number> {
    return this.getYMap<number>('selectedNodeTechs');
  }

  /**
   * 노드 삭제 요청을 CRDT 서버로 전송
   * CRDT 서버가 Spring DELETE 호출 후 Y.Doc에서 노드+자식 일괄 삭제
   * @param nodeId 삭제 대상 노드 ID
   */
  deleteNode(nodeId: string): string | null {
    const requestId = crypto.randomUUID();
    const message = JSON.stringify({
      type: 'delete_node',
      requestId,
      nodeId: Number(nodeId),
    });

    const ws = this.provider.ws;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      return requestId;
    }

    return null;
  }

  /**
   * 노드 후보 삭제 요청을 CRDT 서버로 전송
   * CRDT 서버가 Spring DELETE 호출 후 Y.Doc에서 후보 삭제
   * @param nodeId 삭제 대상 부모 노드 ID
   * @param candidateId 삭제 대상 후보 ID
   */
  deleteCandidate(nodeId: string, candidateId: number): string | null {
    const requestId = crypto.randomUUID();
    const message = JSON.stringify({
      type: 'delete_candidate',
      requestId,
      nodeId: Number(nodeId),
      candidateId,
    });

    const ws = this.provider.ws;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      return requestId;
    }

    return null;
  }

  /**
   * 싱글턴 인스턴스 가져오기
   */
  static getInstance(): CrdtClient | null {
    return CrdtClient.instance;
  }

  /**
   * 싱글턴 초기화(roomId 변경 시 발생)
   */
  static init(roomId: string): CrdtClient {
    if (CrdtClient.instance && CrdtClient.instance.roomId === roomId) {
      return CrdtClient.instance;
    }

    // 기존 인스턴스 정리
    CrdtClient.destroy();

    // 새 인스턴스 생성
    CrdtClient.instance = new CrdtClient(roomId);
    useWorkspaceStore.getState().setRoomId(roomId);

    return CrdtClient.instance;
  }

  /**
   * 싱글턴 정리
   */
  static destroy() {
    if (CrdtClient.instance) {
      CrdtClient.instance.undoManager?.destroy();
      CrdtClient.instance.undoManager = null;
      CrdtClient.instance.provider.destroy();
      CrdtClient.instance.yDoc.destroy();
      CrdtClient.instance = null;
      useWorkspaceStore.getState().reset();
      useNodeStore.getState().reset();
    }
  }
}

// 유틸 함수
export const initCrdtClient = CrdtClient.init;
export const getCrdtClient = CrdtClient.getInstance;
export const destroyCrdtClient = CrdtClient.destroy;

export default CrdtClient;
