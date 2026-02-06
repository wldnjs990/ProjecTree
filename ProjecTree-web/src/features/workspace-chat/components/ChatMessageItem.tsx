import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { ChatMessage } from '../types/chat.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/shared/lib/utils';

import { useUserStore } from '@/shared/stores/userStore';
import { useChatStore } from '../store/chatStore';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  const user = useUserStore((state) => state.user);

  // 참여자 목록에서 최신 닉네임 조회
  const participants = useChatStore(
    (state) => state.participants[message.workspaceId] || []
  );
  const sender = participants.find((p) => p.id === message.senderId);
  const displayName = sender?.name || message.senderName || '알 수 없는 사용자';

  // ID 매칭을 더 유연하게 처리 (서버가 어떤 ID를 보낼지 확실치 않을 경우 대비)
  const isCurrentUser =
    (user?.memberId && message.senderId === user.memberId.toString()) ||
    (user?.id && message.senderId === user.id.toString()) ||
    (user?.email && message.senderId === user.email);

  let timestamp = '';
  try {
    const date = new Date(message.timestamp);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    timestamp = format(date, 'a h:mm', { locale: ko });
  } catch (e) {
    timestamp = '시간 오류';
  }

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
          <AvatarImage src={message.senderAvatar} alt={displayName} />
          <AvatarFallback className="text-[10px]">
            {displayName?.[0] || '?'}
          </AvatarFallback>
        </Avatar>
      )}

      {/* 메시지 내용 */}
      <div className={cn('flex flex-col', isCurrentUser ? 'items-end' : '')}>
        <div className="mb-0.5 flex items-center gap-1.5">
          {!isCurrentUser && (
            <span className="text-xs font-medium text-gray-900">
              {displayName}
            </span>
          )}
          <span className="text-[10px] text-gray-500">{timestamp}</span>
        </div>
        <div
          className={cn(
            'w-fit max-w-xs rounded-lg px-2.5 py-1',
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
