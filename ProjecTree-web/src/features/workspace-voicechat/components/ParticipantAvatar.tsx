import { MicOff } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { AvatarColor } from '@/shared/components/UserAvatar';

const colorStyles: Record<AvatarColor, string> = {
  blue: 'bg-[#2B7FFF]',
  pink: 'bg-[#F6339A]',
  orange: 'bg-[#FD9A00]',
  green: 'bg-[#00C950]',
  purple: 'bg-[#8B5CF6]',
};

type ParticipantAvatarProps = {
  name: string;
  displayName?: string;
  isSpeaking: boolean;
  isMuted?: boolean;
  isMe?: boolean;
  color?: AvatarColor;
};

export default function ParticipantAvatar({
  name,
  displayName,
  isSpeaking,
  isMuted,
  isMe = false,
  color,
}: ParticipantAvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const label = displayName ?? name;
  const fallbackColor = isMe ? 'bg-blue-600' : 'bg-slate-600';
  const resolvedColor = color ? colorStyles[color] : fallbackColor;

  return (
    <div className="relative flex flex-col items-center gap-1">
      <div className="relative">
        <Avatar
          className={cn(
            'size-10 transition-all duration-300 ease-in-out',
            isSpeaking &&
              'ring-2 ring-green-400 ring-offset-2 ring-offset-slate-800 shadow-[0_0_15px_rgba(74,222,128,0.6)]'
          )}
        >
          <AvatarFallback
            className={cn(
              'text-white font-semibold text-sm',
              resolvedColor
            )}
          >
            {initial}
          </AvatarFallback>
        </Avatar>

        {isMuted && (
          <span className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-0.5 z-10">
            <MicOff className="w-3 h-3 text-white" />
          </span>
        )}
      </div>

      <span className="text-xs text-slate-300 max-w-[60px] truncate">
        {label}
      </span>
    </div>
  );
}
