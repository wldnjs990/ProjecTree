import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { ChatMessage } from '../types/chat.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { MOCK_MY_ID } from '../types/mockData';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  // TODO: 실제 구현 시 useAuth 등의 훅으로 현재 로그인한 사용자 정보를 가져와야 함.
  const isCurrentUser = message.senderId === MOCK_MY_ID;

  const timestamp = format(new Date(message.timestamp), 'a h:mm', {
    locale: ko,
  });

  return (
    <div
      className={cn(
        'flex gap-2',
        isCurrentUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* 아바타 (상대방만 표시) */}
      {!isCurrentUser && (
        <Avatar className="h-6 w-6">
          <AvatarImage src={message.senderAvatar} alt={message.senderName} />
          <AvatarFallback className="text-[10px]">
            {message.senderName[0]}
          </AvatarFallback>
        </Avatar>
      )}

      {/* 메시지 내용 */}
      <div className={cn('flex flex-col', isCurrentUser ? 'items-end' : '')}>
        <div className="mb-0.5 flex items-center gap-1.5">
          {!isCurrentUser && (
            <span className="text-xs font-medium text-gray-900">
              {message.senderName}
            </span>
          )}
          <span className="text-[10px] text-gray-500">{timestamp}</span>
        </div>
        <div
          className={cn(
            'max-w-md rounded-lg px-2.5 py-1',
            isCurrentUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-900'
          )}
        >
          <p className="whitespace-pre-wrap break-words text-xs">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
};
