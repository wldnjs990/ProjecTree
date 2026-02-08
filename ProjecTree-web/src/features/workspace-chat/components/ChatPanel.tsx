import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { useChat } from '../hooks/useChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { ChatParticipantList } from './ChatParticipantList';

interface ChatPanelProps {
  workspaceId: string;
  workspaceName: string;
  collapsed?: boolean;
}

export const ChatPanel = ({
  workspaceId,
  workspaceName,
  collapsed = false,
}: ChatPanelProps) => {
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
    <div
      className={cn(
        'flex h-full flex-col bg-white/70 border-t border-zinc-300/60 backdrop-blur-sm overflow-hidden',
        collapsed && 'border-t-0'
      )}
    >
      {/* 헤더 */}
      <ChatHeader
        workspaceName={workspaceName}
        isConnected={isConnected}
        collapsed={collapsed}
      />

      <div
        className={cn(
          'flex flex-1 overflow-hidden relative',
          collapsed && 'hidden'
        )}
      >
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
          <div className="absolute inset-0 z-30 bg-white/90 border-l border-white/40 backdrop-blur-md w-full animate-in slide-in-from-right duration-200">
            <ChatParticipantList
              participants={participants}
              onClose={() => setShowParticipants(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
