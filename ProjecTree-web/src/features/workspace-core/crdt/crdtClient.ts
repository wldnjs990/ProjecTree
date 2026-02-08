import * as Y from 'yjs';
import { UndoManager } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { Awareness } from 'y-protocols/awareness';
import { toast } from 'sonner';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { useNodeStore } from '../stores/nodeStore';
import { useNodeDetailStore } from '../stores/nodeDetailStore';

// Awareness ?íƒœ ?€??
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

// Y.Map???€?¥ë˜???¸ë“œ ê°??€??
export type YNodeValue =
  | string
  | undefined
  | { x: number; y: number }
  | Record<string, unknown>;

/**
 * ?±ê???CRDT ?´ë¼?´ì–¸??
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
    // yDoc ?ë£Œêµ¬ì¡°???¸í™˜?˜ëŠ” websocket ?´ë¼?´ì–¸?¸ë¡œ ë³€??
    this.provider = new WebsocketProvider(serverUrl, roomId, this.yDoc);
    this.awareness = this.provider.awareness;

    this.setupConnectionEvents();
  }

  private setupConnectionEvents() {
    const { setConnectionStatus, setIsSynced } = useNodeStore.getState();

    this.provider.on('status', ({ status }: { status: string }) => {
      if (status === 'connected') {
        setConnectionStatus('connected');
        console.log('[CRDT] server connected');
        this.setupMessageListener();
      } else if (status === 'connecting') {
        setConnectionStatus('connecting');
        console.log('[CRDT] connecting...');
      } else if (status === 'disconnected') {
        setConnectionStatus('disconnected');
        console.log('[CRDT] disconnected');
      }
    });

    this.provider.on('sync', (isSynced: boolean) => {
      setIsSynced(isSynced);
      if (isSynced) {
        console.log('[CRDT] ?™ê¸°???„ë£Œ');
      }
    });

    // ?œë²„ë¡œë???ë©”ì‹œì§€ ?˜ì‹  ë¦¬ìŠ¤??
    this.provider.ws?.addEventListener('message', (event: MessageEvent) => {
      // y-websocket?€ ë°”ì´?ˆë¦¬ ?°ì´?°ë„ ì£¼ê³ ë°›ìœ¼ë¯€ë¡?ë¬¸ì?´ë§Œ ì²˜ë¦¬
      if (typeof event.data === 'string') {
        try {
          const message = JSON.parse(event.data);
          this.handleServerMessage(message);
        } catch {
          // JSON ?Œì‹± ?¤íŒ¨ ??ë¬´ì‹œ
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
    const { setAiStreamingText, setAiStreamingType, clearAiStreaming } =
      useNodeDetailStore.getState();

    switch (message.type) {
      case 'AI_MESSAGE':
        console.log('[CRDT] AI_MESSAGE ?˜ì‹ :', message);
        if (message.isComplete) {
          // ?¤íŠ¸ë¦¬ë° ?„ë£Œ ???íƒœ ì´ˆê¸°??
          clearAiStreaming();
        } else if (message.text) {
          // ?¤íŠ¸ë¦¬ë° ?ìŠ¤???…ë°?´íŠ¸
          setAiStreamingText(message.text as string);
          if (message.streamType) {
            setAiStreamingType(message.streamType);
          }
        }
        break;
      case 'save_error':
        console.error('[CRDT] ?€???ëŸ¬ ?˜ì‹ :', message);
        if (message.action === 'delete_node') {
          toast.error('?¸ë“œ ?? œ???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
        } else if (message.action === 'delete_candidate') {
          toast.error('?›„ë³??¸ë“œ ?? œ???¤íŒ¨?ˆìŠµ?ˆë‹¤.');
        } else {
          toast.error('?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.');
        }
        break;
      default:
        break;
    }
  }

  /**
   * WebSocket ë©”ì‹œì§€ ?˜ì‹  ë¦¬ìŠ¤???¤ì •
   */
  private setupMessageListener() {
    const ws = this.provider.ws;
    if (!ws) return;

    ws.addEventListener('message', (event: MessageEvent) => {
      // y-websocket?€ ë°”ì´?ˆë¦¬ ?°ì´?°ë„ ì£¼ê³ ë°›ìœ¼ë¯€ë¡?ë¬¸ì?´ë§Œ ì²˜ë¦¬
      if (typeof event.data === 'string') {
        try {
          const message = JSON.parse(event.data);
          this.handleServerMessage(message);
        } catch {
          // JSON ?Œì‹± ?¤íŒ¨ ??ë¬´ì‹œ
        }
      }
    });

    console.log('[CRDT] ë©”ì‹œì§€ ë¦¬ìŠ¤???¤ì •??);
  }

  /**
   * Y.Map ê°€?¸ì˜¤ê¸?(?€???ˆì „)
   */
  getYMap<T>(name: string): Y.Map<T> {
    return this.yDoc.getMap(name) as Y.Map<T>;
  }

  /**
   * UndoManager ì´ˆê¸°??(nodes Y.Map ?„ìš©)
   */
  initUndoManager(): UndoManager {
    if (this.undoManager) {
      return this.undoManager;
    }

    const yNodes = this.getYMap<Y.Map<YNodeValue>>('nodes');

    this.undoManager = new UndoManager(yNodes, {
      // ë¡œì»¬ ë³€ê²½ë§Œ ì¶”ì  (?ê²© ë³€ê²½ì? undo ?€???„ë‹˜)
      trackedOrigins: new Set([null]),
      // ?°ì† ?œë˜ê·¸ë? ?˜ë‚˜??undo ?¨ìœ„ë¡?ë¬¶ìŒ (ms)
      captureTimeout: 300,
    });

    console.log('[CRDT] UndoManager ì´ˆê¸°?”ë¨');
    return this.undoManager;
  }

  /**
   * Undo ?¤í–‰
   */
  undo(): boolean {
    if (this.undoManager?.canUndo()) {
      this.undoManager.undo();
      console.log('[CRDT] Undo ?¤í–‰');
      return true;
    }
    return false;
  }

  /**
   * Redo ?¤í–‰
   */
  redo(): boolean {
    if (this.undoManager?.canRedo()) {
      this.undoManager.redo();
      console.log('[CRDT] Redo ?¤í–‰');
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
   * ?¸ë“œ ?ì„¸?•ë³´ ?¸ì§‘ ?°ì´???€???”ì²­??CRDT ?œë²„ë¡??„ì†¡
   * CRDT ?œë²„ê°€ REST APIë¥??µí•´ ?¤í”„ë§??œë²„ë¡??„ì†¡
   * ?¤í”„ë§??œë²„?ì„œ DB???€??
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
      console.log('[CRDT] ?Œí¬?¤í˜?´ìŠ¤ ?€???”ì²­ ?„ì†¡:', {
        requestId,
      });
      return requestId;
    }

    console.warn('[CRDT] WebSocket???°ê²°?˜ì? ?Šì•„ ?€???”ì²­ ?¤íŒ¨');
    return null;
  }

  /**
   * ?¸ë“œ ?„ì¹˜?•ë³´ ?¸ì§‘ ?°ì´???€???”ì²­??CRDT ?œë²„ë¡??„ì†¡
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
      console.log('[CRDT] ?¸ë“œ ?„ì¹˜ ?€???”ì²­ ?„ì†¡:', {
        requestId,
        nodeId,
      });
      return requestId;
    }

    console.warn('[CRDT] WebSocket???°ê²°?˜ì? ?Šì•„ ?€???”ì²­ ?¤íŒ¨');
    return null;
  }

  /**
   * ?¸ë“œ ê¸°ìˆ ?¤íƒ ? íƒ ?´ë²¤?¸ë? CRDT ?œë²„ë¡??„ì†¡ ë°?YMap ë¸Œë¡œ?œìº?¤íŠ¸
   * @param nodeId ?¸ë“œ ID
   * @param selectedTechId ? íƒ??ê¸°ìˆ ?¤íƒ ID
   */
  selectNodeTech(nodeId: string, selectedTechId: number): string | null {
    const requestId = crypto.randomUUID();

    // YMap??? íƒ??ê¸°ìˆ ?¤íƒ ?€??(ë¸Œë¡œ?œìº?¤íŠ¸)
    const selectedNodeTechs = this.getYMap<number>('selectedNodeTechs');
    selectedNodeTechs.set(nodeId, selectedTechId);

    // CRDT ?œë²„???´ë²¤???„ì†¡
    const ws = this.provider.ws;
    const message = JSON.stringify({
      type: 'select_node_tech',
      requestId,
      nodeId,
      selectedTechId,
    });

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      console.log('[CRDT] ?¸ë“œ ê¸°ìˆ ?¤íƒ ? íƒ ?”ì²­ ?„ì†¡:', {
        requestId,
        nodeId,
        selectedTechId,
      });
      return requestId;
    }

    console.warn('[CRDT] WebSocket???°ê²°?˜ì? ?Šì•„ ê¸°ìˆ ?¤íƒ ? íƒ ?”ì²­ ?¤íŒ¨');
    return null;
  }

  /**
   * ? íƒ???¸ë“œ ê¸°ìˆ ?¤íƒ YMap ê°€?¸ì˜¤ê¸?
   */
  getSelectedNodeTechs(): Y.Map<number> {
    return this.getYMap<number>('selectedNodeTechs');
  }

  /**
   * ?¸ë“œ ?? œ ?”ì²­??CRDT ?œë²„ë¡??„ì†¡
   * CRDT ?œë²„ê°€ Spring DELETE ?¸ì¶œ ??Y.Doc?ì„œ ?¸ë“œ+?ì‹?¸ë“œ ?¼ê´„ ?? œ
   * @param nodeId ?? œ???¸ë“œ ID
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
      console.log('[CRDT] ?¸ë“œ ?? œ ?”ì²­ ?„ì†¡:', { requestId, nodeId });
      return requestId;
    }

    console.warn('[CRDT] WebSocket???°ê²°?˜ì? ?Šì•„ ?? œ ?”ì²­ ?¤íŒ¨');
    return null;
  }

  /**
   * ?¸ë“œ ?„ë³´ ?? œ ?”ì²­??CRDT ?œë²„ë¡??„ì†¡
   * CRDT ?œë²„ê°€ Spring DELETE È£Ãâ ??Y.Doc?ì„œ ÈÄº¸ Á¦°Å
   * @param nodeId ?? œ ´ë»ó ºÎ¸ğ ³ëµå ID
   * @param candidateId ?? œ ´ë»ó ÈÄº¸ ID
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
      console.log('[CRDT] ?¸ë“œ ?„ë³´ ?? œ ?”ì²­ ?„ì†¡:', {
        requestId,
        nodeId,
        candidateId,
      });
      return requestId;
    }

    console.warn('[CRDT] WebSocket???°ê²°?˜ì? ?Šì•„ ÈÄº¸ ?? œ ?”ì²­ ?¤íŒ¨');
    return null;
  }

  /**
   * ?±ê????¸ìŠ¤?´ìŠ¤ ê°€?¸ì˜¤ê¸?
   */
  static getInstance(): CrdtClient | null {
    return CrdtClient.instance;
  }

  /**
   * ?±ê???ì´ˆê¸°??(roomId ë³€ê²????¬ìƒ??
   */
  static init(roomId: string): CrdtClient {
    if (CrdtClient.instance && CrdtClient.instance.roomId === roomId) {
      return CrdtClient.instance;
    }

    // ê¸°ì¡´ ?¸ìŠ¤?´ìŠ¤ ?•ë¦¬
    CrdtClient.destroy();

    // ???¸ìŠ¤?´ìŠ¤ ?ì„±
    CrdtClient.instance = new CrdtClient(roomId);
    useWorkspaceStore.getState().setRoomId(roomId);

    return CrdtClient.instance;
  }

  /**
   * ?±ê????•ë¦¬
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
      console.log('[CRDT] ?´ë¼?´ì–¸???•ë¦¬??);
    }
  }
}

// ?¸ì˜ ?¨ìˆ˜??
export const initCrdtClient = CrdtClient.init;
export const getCrdtClient = CrdtClient.getInstance;
export const destroyCrdtClient = CrdtClient.destroy;

export default CrdtClient;



