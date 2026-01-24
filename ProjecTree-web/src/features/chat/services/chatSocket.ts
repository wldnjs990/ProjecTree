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
     * 워크스페이스 채팅방 입장
     */
    joinWorkspace(workspaceId: string): void {
        if (!this.socket) {
            // 소켓이 연결되지 않았을 때 재연결 시도하거나 에러 처리
            console.warn('Socket not connected, attempting to join workspace later');
            return;
        }
        this.socket.emit('chat:join', { workspaceId });
    }

    /**
     * 워크스페이스 채팅방 퇴장
     */
    leaveWorkspace(workspaceId: string): void {
        if (!this.socket) return;
        this.socket.emit('chat:leave', { workspaceId });
    }

    /**
     * 메시지 전송
     */
    sendMessage(
        workspaceId: string,
        content: string,
        type: 'text' | 'image' | 'file' = 'text'
    ): void {
        if (!this.socket) {
            throw new Error('Socket not connected');
        }
        this.socket.emit('message:send', {
            workspaceId,
            content,
            type,
        });
    }

    /**
     * 메시지 읽음 처리
     */
    markAsRead(workspaceId: string, messageIds: string[]): void {
        if (!this.socket) return;
        this.socket.emit('message:read', { workspaceId, messageIds });
    }

    /**
     * 타이핑 시작
     */
    startTyping(workspaceId: string): void {
        if (!this.socket) return;
        this.socket.emit('typing:start', { workspaceId });
    }

    /**
     * 타이핑 종료
     */
    stopTyping(workspaceId: string): void {
        if (!this.socket) return;
        this.socket.emit('typing:stop', { workspaceId });
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
