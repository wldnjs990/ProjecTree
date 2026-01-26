import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { useWebSocket } from './useWebSocket';
import type { ChatMessage } from '../types/chat.types';
import { chatSocket } from '../services/chatSocket';

export const useChat = (workspaceId: string) => {
    const {
        sendMessage: wsSendMessage,
        startTyping,
        stopTyping,
        isConnected,
    } = useWebSocket(workspaceId);

    const sendMessage = (content: string) => {
        if (!workspaceId || !content.trim()) return;

        // 1. 소켓으로 전송 시도
        // WebSocket 연결이 있으면 전송
        if (isConnected) {
            chatSocket.sendMessage(workspaceId, content.trim());
        } else {
            console.warn('Socket not connected, message will only be shown locally');
        }

        // 2. [Optimistic UI] 로컬 스토어에 즉시 추가 (나 자신에게는 바로 보임)
        const optimisticMessage: ChatMessage = {
            id: Date.now().toString(), // 임시 ID
            workspaceId,
            senderId: 'temp_my_id', // TODO: 실제 내 ID
            senderName: '나', // TODO: 실제 내 이름
            content: content.trim(),
            timestamp: new Date().toISOString(),
            type: 'text',
            isRead: true,
            readBy: [],
        };
        useChatStore.getState().addMessage(workspaceId, optimisticMessage);
    };

    // Stable empty array to prevent new reference on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const EMPTY_ARRAY: any[] = [];

    const messages = useChatStore((state) => state.messages[workspaceId] ?? EMPTY_ARRAY);
    const participants = useChatStore(
        (state) => state.participants[workspaceId] ?? EMPTY_ARRAY
    );
    const typingUsers = useChatStore(
        (state) => state.typingUsers[workspaceId] ?? EMPTY_ARRAY
    );
    const unreadCount = useChatStore(
        (state) => state.unreadCounts[workspaceId] || 0
    );

    const setParticipants = useChatStore((state) => state.setParticipants);

    //TODO: 메시지 히스토리 로드 (REST API)
    useEffect(() => {
        // fetchMessageHistory(workspaceId);
    }, [workspaceId]);

    // FIXME: UI 테스트를 위한 더미 데이터 주입 (백엔드 연동 시 제거)
    const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) return;

        // 이미 메시지가 있으면 스킵
        if (messages.length > 0) {
            initializedRef.current = true;
            return;
        }

        const mockMessages: ChatMessage[] = [
            {
                id: 'msg-1',
                workspaceId,
                senderId: 'other-user-1',
                senderName: '김개발',
                senderAvatar: '',
                content: '백엔드 API 명세서 노드 구조 업데이트했습니다. 확인 부탁드려요!',
                timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1시간 전
                type: 'text',
                isRead: true,
                readBy: [],
            },
            {
                id: 'msg-2',
                workspaceId,
                senderId: 'temp_my_id',
                senderName: '나',
                content: '넵, User Auth 쪽 트리 구조가 좀 복잡해 보이는데 분리하는 게 좋지 않을까요?',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
                type: 'text',
                isRead: true,
                readBy: [],
            },
            {
                id: 'msg-3',
                workspaceId,
                senderId: 'other-user-2',
                senderName: '이기획',
                senderAvatar: '',
                content: '좋은 의견입니다. 일단 메인 기능 명세부터 확정 짓고 넘어갑시다.',
                timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5분 전
                type: 'text',
                isRead: true,
                readBy: [],
            },
        ];

        useChatStore.getState().setMessages(workspaceId, mockMessages);

        // 참여자 목록도 같이 세팅
        if (participants.length === 0) {
            useChatStore.getState().setParticipants(workspaceId, [
                { id: 'temp_my_id', name: '나', email: 'me@dev.com', role: 'owner', isOnline: true, isTyping: false },
                { id: 'other-user-1', name: '김개발', email: 'dev@dev.com', role: 'member', isOnline: true, isTyping: false },
                { id: 'other-user-2', name: '이기획', email: 'pm@dev.com', role: 'member', isOnline: false, isTyping: false },
            ]);
        }

        initializedRef.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceId]);

    return {
        messages,
        participants,
        typingUsers,
        unreadCount,
        isConnected,
        sendMessage,
        startTyping,
        stopTyping,
    };
};
