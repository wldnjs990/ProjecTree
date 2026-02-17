import { io, Socket } from 'socket.io-client';

class ChatSocketService {
  private socket: Socket | null = null;
  private readonly serverUrl: string;
  private onAnyRegistered: boolean = false; // 🔧 onAny 리스너 등록 여부 추적
  private pendingJoins: Set<string> = new Set(); // 연결 전 보류된 chatRoomId 저장
  private connectionCallbacks: Set<(connected: boolean) => void> = new Set();

  constructor() {
    // 환경변수에서 WebSocket 서버 URL 가져오기
    this.serverUrl = import.meta.env.VITE_WS_URL || 'http://localhost:7092';
  }

  /**
   * 연결 상태 변경 콜백 등록
   */
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionCallbacks.add(callback);
    // 현재 연결 상태 즉시 알림
    if (this.socket?.connected) {
      callback(true);
    }
    // cleanup 함수 반환
    return () => {
      this.connectionCallbacks.delete(callback);
    };
  }

  /**
   * WebSocket 연결 초기화
   */
  connect(accessToken: string): Socket {
    if (this.socket?.connected) {
      // 🔍 이미 연결된 소켓이 있어도 onAny 리스너 확인 및 등록
      if (!this.onAnyRegistered) {
        this.onAnyRegistered = true;
      }
      return this.socket;
    }

    this.socket = io(this.serverUrl, {
      path: '/socket.io',
      query: {
        token: 'Bearer ' + accessToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // 🔧 연결 이벤트 리스너 등록 (한 번만!)
    this.socket.on('connect', () => {
      // 재연결 시 onAny 리스너 재등록
      if (!this.onAnyRegistered && this.socket) {
        this.onAnyRegistered = true;
      }

      // 연결 상태 콜백 호출
      this.connectionCallbacks.forEach((cb) => cb(true));

      // 연결 완료 후, 보류 중인 채팅방 입장 요청 처리
      if (this.pendingJoins.size > 0 && this.socket) {
        this.pendingJoins.forEach((roomId) => {
          this.socket?.emit('chat:join', { chatRoomId: roomId });
        });
        this.pendingJoins.clear();
      }
    });

    this.socket.on('disconnect', () => {
      this.onAnyRegistered = false; // 연결 끊기면 플래그 리셋

      // 연결 상태 콜백 호출
      this.connectionCallbacks.forEach((cb) => cb(false));
    });

    this.socket.on('connect_error', (error) => {
      console.error(error);
    });

    this.onAnyRegistered = true; // 등록 완료 플래그 설정

    return this.socket;
  }

  /**
   * 채팅방 입장
   */
  joinChatRoom(chatRoomId: string): void {
    if (!this.socket?.connected) {
      // 아직 연결되지 않았으면 보류시키고 연결 시 발송
      this.pendingJoins.add(chatRoomId);
      return;
    }

    // 백엔드 스펙: chatRoomId (ChatPayloadDto.Join)
    this.socket.emit('chat:join', { chatRoomId });
  }

  /**
   * 채팅방 퇴장
   */
  leaveChatRoom(chatRoomId: string): void {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('chat:leave', { chatRoomId });
  }

  /**
   * 메시지 전송
   */
  sendMessage(chatRoomId: string, content: string): void {
    if (!this.socket || !this.socket.connected) {
      return;
    }

    // 백엔드 스펙: chatRoomId 사용
    this.socket.emit('message:send', {
      chatRoomId,
      content,
      type: 'text',
    });
  }

  /**
   * 메시지 읽음 처리 (백엔드 미구현 가능성 있음, 일단 유지)
   */
  markAsRead(chatRoomId: string, messageIds: string[]): void {
    if (!this.socket || !this.socket.connected) return;
    this.socket.emit('message:read', { chatRoomId, messageIds });
  }

  /**
   * 타이핑 시작
   */
  startTyping(chatRoomId: string, userId: string, userName: string): void {
    if (!this.socket || !this.socket.connected) return;
    this.socket.emit('typing:start', {
      chatRoomId,
      memberId: userId,
      userId: userId, // 백엔드 호환성 위해 추가
      userName,
    });
  }

  /**
   * 타이핑 종료
   */
  stopTyping(chatRoomId: string, userId: string): void {
    if (!this.socket || !this.socket.connected) return;
    this.socket.emit('typing:stop', {
      chatRoomId,
      memberId: userId,
      userId: userId, // 백엔드 호환성 위해 추가
    });
  }

  /**
   * 이벤트 리스너 등록
   */
  on(event: string, callback: (...args: any[]) => void): void {
    this.socket?.on(event, callback);
  }

  /**
   * 이벤트 리스너 제거
   */
  off(event: string, callback?: (...args: any[]) => void): void {
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
