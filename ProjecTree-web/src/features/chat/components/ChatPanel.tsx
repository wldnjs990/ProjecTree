import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { ChatParticipantList } from './ChatParticipantList';

interface ChatPanelProps {
    workspaceId: string;
    workspaceName: string;
}

export const ChatPanel = ({ workspaceId, workspaceName }: ChatPanelProps) => {
    const [showParticipants, setShowParticipants] = useState(false);
    const {
        messages,
        participants,
        typingUsers,
        isConnected,
        sendMessage,
        startTyping,
        stopTyping,
    } = useChat(workspaceId);

    return (
        <div className="flex h-full flex-col bg-white">
            {/* 헤더 */}
            <ChatHeader
                workspaceName={workspaceName}
                participantCount={participants.length}
                isConnected={isConnected}
                onToggleParticipants={() => setShowParticipants(!showParticipants)}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* 메시지 영역 */}
                <div className="flex flex-1 flex-col">
                    <ChatMessageList messages={messages} typingUsers={typingUsers} />
                    <ChatInput
                        onSendMessage={sendMessage}
                        onStartTyping={startTyping}
                        onStopTyping={stopTyping}
                        disabled={false} // FIXME: 테스트를 위해 연결 끊겨도 입력 가능하게 변경
                    />
                </div>

                {/* 참여자 목록 (토글) */}
                {showParticipants && (
                    <div className="w-64 border-l border-gray-200">
                        <ChatParticipantList participants={participants} />
                    </div>
                )}
            </div>
        </div>
    );
};
