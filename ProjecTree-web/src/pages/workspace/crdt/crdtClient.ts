import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { Awareness } from 'y-protocols/awareness';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { useNodeStore } from '../stores/nodeStore';

// Awareness 상태 타입
export interface AwarenessState {
  cursor?: {
    x: number;
    y: number;
  };
  user?: {
    name: string;
    color: string;
  };
}

// Y.Map에 저장되는 노드 값 타입
export type YNodeValue =
  | string
  | undefined
  | { x: number; y: number }
  | Record<string, unknown>;

/**
 * 싱글톤 CRDT 클라이언트
 */
class CrdtClient {
  private static instance: CrdtClient | null = null;

  public yDoc: Y.Doc;
  public provider: WebsocketProvider;
  public awareness: Awareness;
  public roomId: string;

  private constructor(roomId: string) {
    this.roomId = roomId;
    this.yDoc = new Y.Doc();

    const serverUrl =
      import.meta.env.VITE_CRDT_SERVER_URL || 'ws://localhost:1234';
    // yDoc 자료구조에 호환되는 websocket 클라이언트로 변환
    this.provider = new WebsocketProvider(serverUrl, roomId, this.yDoc);
    this.awareness = this.provider.awareness;

    this.setupConnectionEvents();
  }

  private setupConnectionEvents() {
    const { setConnectionStatus, setIsSynced } = useNodeStore.getState();

    this.provider.on('status', ({ status }: { status: string }) => {
      if (status === 'connected') {
        setConnectionStatus('connected');
        console.log('[CRDT] 서버 연결됨');
      } else if (status === 'connecting') {
        setConnectionStatus('connecting');
        console.log('[CRDT] 연결 중...');
      } else if (status === 'disconnected') {
        setConnectionStatus('disconnected');
        console.log('[CRDT] 연결 해제됨');
      }
    });

    this.provider.on('sync', (isSynced: boolean) => {
      setIsSynced(isSynced);
      if (isSynced) {
        console.log('[CRDT] 동기화 완료');
      }
    });
  }

  /**
   * Y.Map 가져오기 (타입 안전)
   */
  getYMap<T>(name: string): Y.Map<T> {
    return this.yDoc.getMap(name) as Y.Map<T>;
  }

  /**
   * 노드 상세정보 편집 데이터 저장 요청을 CRDT 서버로 전송
   * CRDT 서버가 REST API를 통해 스프링 서버로 전송
   * 스프링 서버에서 DB에 저장
   */
  saveNodeDetail(): string | null {
    const requestId = crypto.randomUUID();
    const message = JSON.stringify({
      type: 'save_node_detail',
      requestId,
    });

    const ws = this.provider.ws;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      console.log('[CRDT] 워크스페이스 저장 요청 전송:', {
        requestId,
      });
      return requestId;
    }

    console.warn('[CRDT] WebSocket이 연결되지 않아 저장 요청 실패');
    return null;
  }

  /**
   * 싱글톤 인스턴스 가져오기
   */
  static getInstance(): CrdtClient | null {
    return CrdtClient.instance;
  }

  /**
   * 싱글톤 초기화 (roomId 변경 시 재생성)
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
   * 싱글톤 정리
   */
  static destroy() {
    if (CrdtClient.instance) {
      CrdtClient.instance.provider.destroy();
      CrdtClient.instance.yDoc.destroy();
      CrdtClient.instance = null;
      useWorkspaceStore.getState().reset();
      useNodeStore.getState().reset();
      console.log('[CRDT] 클라이언트 정리됨');
    }
  }
}

// 편의 함수들
export const initCrdtClient = CrdtClient.init;
export const getCrdtClient = CrdtClient.getInstance;
export const destroyCrdtClient = CrdtClient.destroy;

export default CrdtClient;
