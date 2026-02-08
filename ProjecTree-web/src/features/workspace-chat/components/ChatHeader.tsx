import { MessageSquareMore, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface ChatHeaderProps {
  workspaceName: string;
  isConnected: boolean;
  collapsed?: boolean;
}

export const ChatHeader = ({
  workspaceName,
  isConnected,
  collapsed = false,
}: ChatHeaderProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-zinc-300/60 bg-white/60 backdrop-blur-sm px-4 h-10',
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

    </div>
  );
};
