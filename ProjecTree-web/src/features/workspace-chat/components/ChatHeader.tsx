import { MessageSquareMore, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface ChatHeaderProps {
  workspaceName: string;
  participantCount: number;
  isConnected: boolean;
  collapsed?: boolean;
}

export const ChatHeader = ({
  workspaceName,
  participantCount,
  isConnected,
  collapsed = false,
}: ChatHeaderProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-zinc-300/60 bg-white/60 backdrop-blur-sm px-4 py-2',
        collapsed && 'justify-center px-0 border-b-0 bg-transparent'
      )}
    >
      <div className="flex items-center gap-2">
        <MessageSquareMore className="h-4 w-4 text-zinc-500" />
        {!collapsed && (
          <>
            <h2 className="text-sm font-medium text-[#0B0B0B]">
              {workspaceName}
            </h2>
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </>
        )}
      </div>

      {!collapsed && (
        <div className="flex items-center gap-1.5 rounded-full bg-white/70 border border-white/60 px-2.5 py-1">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-zinc-700">
            {participantCount}
          </span>
        </div>
      )}
    </div>
  );
};
