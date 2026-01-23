import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
// TODO : awareness 라이브러리 타입 찾아야함
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
