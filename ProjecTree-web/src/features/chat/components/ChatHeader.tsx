import { Wifi, WifiOff } from 'lucide-react';

interface ChatHeaderProps {
  workspaceName: string;
  participantCount: number;
  isConnected: boolean;
}

export const ChatHeader = ({
  workspaceName,
  participantCount,
  isConnected,
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-900">{workspaceName}</h2>
        {isConnected ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
      </div>

      <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-medium text-gray-700">
          {participantCount}
        </span>
      </div>
    </div>
  );
};
