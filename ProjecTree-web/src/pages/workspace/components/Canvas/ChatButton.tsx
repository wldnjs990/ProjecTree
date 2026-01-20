import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface ChatButtonInterface {
  className?: string;
  unreadMessages?: number;
  onChatClick?: () => void;
}

export default function ChatButton({
  className,
  unreadMessages,
  onChatClick,
}: ChatButtonInterface) {
  return (
    <>
      {/* Chat Button */}
      <button
        onClick={onChatClick}
        className={cn(
          "relative glass w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-white/20 hover:bg-white/95 transition-colors",
          className,
        )}
      >
        <MessageCircle className="h-5 w-5 text-[#0F172A]" />

        {unreadMessages && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] font-medium text-white">
            {unreadMessages > 9 ? "9+" : unreadMessages}
          </span>
        )}
      </button>
    </>
  );
}
