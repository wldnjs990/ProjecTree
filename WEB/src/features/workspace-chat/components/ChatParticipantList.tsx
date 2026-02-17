import { X } from 'lucide-react';
import type { ChatParticipant } from '../types/chat.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatParticipantListProps {
  participants: ChatParticipant[];
  onClose?: () => void;
}

export const ChatParticipantList = ({
  participants,
  onClose,
}: ChatParticipantListProps) => {
  const onlineCount = participants.filter((p) => p.isOnline).length;

  return (
    <div className="flex h-full flex-col bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/40 bg-white/60 px-4 py-3">
        <h3 className="text-sm font-semibold text-[var(--figma-tech-green)]">
          참여자 ({onlineCount}/{participants.length})
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-400 hover:bg-white/70 hover:text-zinc-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-white/60"
          >
            <div className="relative">
              <Avatar className="h-6 w-6">
                <AvatarImage src={participant.avatar} alt={participant.name} />
                <AvatarFallback className="text-[10px]">
                  {participant.name[0]}
                </AvatarFallback>
              </Avatar>
              {participant.isOnline && (
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-green-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-900">
                {participant.name}
              </p>
              <p className="text-[10px] text-zinc-500">
                {participant.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
