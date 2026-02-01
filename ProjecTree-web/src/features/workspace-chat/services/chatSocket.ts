import { io, Socket } from 'socket.io-client';

class ChatSocketService {
  private socket: Socket | null = null;
  private readonly serverUrl: string;
  // 로컬 시뮬레이션을 위한 리스너 관리
  private localListeners: Record<string, ((...args: any[]) => void)[]> = {};

  constructor() {
    // 환경변수에서 WebSocket 서버 URL 가져오기
    this.serverUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
  }

  /**
   * WebSocket 연결 초기화
   */
  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(this.serverUrl, {
      auth: {
        token, // JWT 토큰 전달
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // 로컬 리스너들을 실제 소켓에도 연동
    Object.entries(this.localListeners).forEach(([event, callbacks]) => {
      callbacks.forEach((cb) => this.socket?.on(event, cb));
    });

    // 연결 이벤트
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔴 Connection error:', error);
    });

    return this.socket;
  }

  /**
   * 로컬 이벤트 발생 (시뮬레이션 용)
   */
  private trigger(event: string, ...args: any[]): void {
    const callbacks = this.localListeners[event];
    if (callbacks) {
      callbacks.forEach((cb) => cb(...args));
    }
  }

  /**
   * 워크스페이스 채팅방 입장
   */
  joinWorkspace(workspaceId: string): void {
    if (!this.socket?.connected) {
      console.log(`🔄 [Mock] Joined workspace: ${workspaceId}`);
      return;
    }
    this.socket.emit('chat:join', { workspaceId });
  }

  /**
   * 워크스페이스 채팅방 퇴장
   */
  leaveWorkspace(workspaceId: string): void {
    if (!this.socket?.connected) {
      console.log(`🔄 [Mock] Left workspace: ${workspaceId}`);
      return;
    }
    this.socket.emit('chat:leave', { workspaceId });
  }

  /**
   * 메시지 전송
   */
  sendMessage(workspaceId: string, content: string): void {
    // 백엔드가 연결되지 않았을 때 시뮬레이션
    if (!this.socket || !this.socket.connected) {
      console.log('🔄 [Mock] Simulating message send:', content);

      // 1. 에코 효과 (내가 보낸 메시지 수신 시뮬레이션)
      setTimeout(() => {
        this.trigger('message:receive', {
          message: {
            id: Date.now().toString(),
            workspaceId,
            senderId: 'temp_my_id',
            senderName: '나',
            content,
            timestamp: new Date().toISOString(),
            type: 'text',
          },
        });
      }, 100);

      // 2. 가짜 응답 시뮬레이션 (상대방이 말하는 효과)
      if (content.length > 0) {
        setTimeout(() => {
          this.trigger('typing:start', {
            workspaceId,
            userId: 'other-user-1',
            userName: '김개발',
          });
        }, 1000);

        setTimeout(() => {
          this.trigger('typing:stop', { workspaceId, userId: 'other-user-1' });
          this.trigger('message:receive', {
            message: {
              id: (Date.now() + 1).toString(),
              workspaceId,
              senderId: 'other-user-1',
              senderName: '김개발',
              content: `[Mock 응답] "${content.slice(0, 10)}..." 잘 확인했습니다!`,
              timestamp: new Date().toISOString(),
              type: 'text',
            },
          });
        }, 3000);
      }
      return;
    }

    this.socket.emit('message:send', {
      workspaceId,
      content,
      type: 'text',
    });
  }

  /**
   * 메시지 읽음 처리
   */
  markAsRead(workspaceId: string, messageIds: string[]): void {
    if (!this.socket || !this.socket.connected) return;
    this.socket.emit('message:read', { workspaceId, messageIds });
  }

  /**
   * 타이핑 시작
   */
  startTyping(workspaceId: string): void {
    if (!this.socket || !this.socket.connected) return;
    this.socket.emit('typing:start', { workspaceId });
  }

  /**
   * 타이핑 종료
   */
  stopTyping(workspaceId: string): void {
    if (!this.socket || !this.socket.connected) return;
    this.socket.emit('typing:stop', { workspaceId });
  }

  /**
   * 이벤트 리스너 등록
   */
  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.localListeners[event]) {
      this.localListeners[event] = [];
    }
    this.localListeners[event].push(callback);
    this.socket?.on(event, callback);
  }

  /**
   * 이벤트 리스너 제거
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.localListeners[event] = (this.localListeners[event] || []).filter(
        (cb) => cb !== callback
      );
    } else {
      delete this.localListeners[event];
    }
    this.socket?.off(event, callback);
  }

  /**
   * 연결 해제
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Socket 인스턴스 반환
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// 싱글톤 인스턴스
export const chatSocket = new ChatSocketService();
