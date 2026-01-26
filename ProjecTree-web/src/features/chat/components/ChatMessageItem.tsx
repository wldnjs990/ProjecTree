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
        'flex gap-3',
        isCurrentUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* 아바타 */}
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.senderAvatar} alt={message.senderName} />
        <AvatarFallback>{message.senderName[0]}</AvatarFallback>
      </Avatar>

      {/* 메시지 내용 */}
      <div className={cn('flex flex-col', isCurrentUser ? 'items-end' : '')}>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {message.senderName}
          </span>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
        <div
          className={cn(
            'max-w-md rounded-lg px-4 py-2',
            isCurrentUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-900'
          )}
        >
          <p className="whitespace-pre-wrap break-all text-sm">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
};
