import { io, Socket } from 'socket.io-client';

class ChatSocketService {
  private socket: Socket | null = null;
  private readonly serverUrl: string;
  constructor() {
    // 환경변수에서 WebSocket 서버 URL 가져오기
    this.serverUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
  }

  /**
   * WebSocket 연결 초기화
   */
  connect(accessToken: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(this.serverUrl, {
      path: '/socket.io',
      // @ts-ignore
      auth: accessToken,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
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
   * 채팅방 입장
   */
  joinChatRoom(chatRoomId: string): void {
    if (!this.socket?.connected) {
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
