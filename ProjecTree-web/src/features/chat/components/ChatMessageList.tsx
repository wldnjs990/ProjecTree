import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { ChatMessage } from '../types/chat.types';
import { ChatMessageItem } from './ChatMessageItem';
import { TypingIndicator } from './TypingIndicator';
import { useChatPagination } from '../hooks/useChatPagination';

interface ChatMessageListProps {
  messages: ChatMessage[];
  typingUsers: string[];
}

export const ChatMessageList = ({
  messages,
  typingUsers,
}: ChatMessageListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 🆕 무한 스크롤 훅
  const { topSentinelRef, hasMore, isLoading } =
    useChatPagination(scrollContainerRef);

  // 새 메시지 도착 시 자동 스크롤 (초기 로드 포함)
  useEffect(() => {
    if (messages.length > 0) {
      // 초기 로드 시에는 즉시 스크롤 (부드럽게 하면 중간에 멈춤)
      const isInitialLoad = messages.length <= 20;
      bottomRef.current?.scrollIntoView({
        behavior: isInitialLoad ? 'auto' : 'smooth',
      });
    }
  }, [messages]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 flex flex-col min-h-0 overflow-y-auto px-4 py-4 chat-scrollbar"
    >
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-400">
          <p>메시지가 없습니다. 첫 메시지를 보내보세요!</p>
        </div>
      ) : (
        <div className="space-y-1.5 mt-auto">
          {/* 🆕 상단 감시 요소 (IntersectionObserver용) */}
          <div ref={topSentinelRef} className="h-1" />

          {/* 🆕 로딩 인디케이터 */}
          {isLoading && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}

          {/* 🆕 끝 표시 */}
          {!hasMore && messages.length > 0 && (
            <div className="text-center py-2 text-xs text-gray-400">
              대화의 시작입니다
            </div>
          )}

          {/* 메시지 목록 */}
          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))}

          {/* 타이핑 인디케이터 */}
          {typingUsers.length > 0 && (
            <TypingIndicator userCount={typingUsers.length} />
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};
