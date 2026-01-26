import type { ChatParticipant } from '../types/chat.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatParticipantListProps {
    participants: ChatParticipant[];
}

export const ChatParticipantList = ({
    participants,
}: ChatParticipantListProps) => {
    const onlineCount = participants.filter((p) => p.isOnline).length;

    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">
                    참여자 ({onlineCount}/{participants.length})
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {participants.map((participant) => (
                    <div
                        key={participant.id}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
                    >
                        <div className="relative">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={participant.avatar} alt={participant.name} />
                                <AvatarFallback>{participant.name[0]}</AvatarFallback>
                            </Avatar>
                            {participant.isOnline && (
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                {participant.name}
                            </p>
                            <p className="text-xs text-gray-500">{participant.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
