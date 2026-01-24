import { Users, Wifi, WifiOff } from 'lucide-react';

interface ChatHeaderProps {
    workspaceName: string;
    participantCount: number;
    isConnected: boolean;
    onToggleParticipants: () => void;
}

export const ChatHeader = ({
    workspaceName,
    participantCount,
    isConnected,
    onToggleParticipants,
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

            <button
                onClick={onToggleParticipants}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
            >
                <Users className="h-4 w-4" />
                <span>{participantCount}</span>
            </button>
        </div>
    );
};
