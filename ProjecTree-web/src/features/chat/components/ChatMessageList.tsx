import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types/chat.types';
import { ChatMessageItem } from './ChatMessageItem';
import { TypingIndicator } from './TypingIndicator';

interface ChatMessageListProps {
  messages: ChatMessage[];
  typingUsers: string[];
}

export const ChatMessageList = ({
  messages,
  typingUsers,
}: ChatMessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 새 메시지 도착 시 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col justify-end min-h-0 overflow-y-auto px-4 py-4">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-400">
          <p>메시지가 없습니다. 첫 메시지를 보내보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))}
          {typingUsers.length > 0 && (
            <TypingIndicator userCount={typingUsers.length} />
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};
