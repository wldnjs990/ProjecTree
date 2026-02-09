import { useState, useRef, useCallback } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
  disabled?: boolean;
}

export const ChatInput = ({
  onSendMessage,
  onStartTyping,
  onStopTyping,
  disabled = false,
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const isTypingRef = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // 텍스트가 있으면 타이핑 상태 유지
    if (e.target.value.length > 0) {
      if (!isTypingRef.current) {
        onStartTyping();
        isTypingRef.current = true;
      }
    } else {
      // 텍스트가 없으면 종료
      if (isTypingRef.current) {
        onStopTyping();
        isTypingRef.current = false;
      }
    }
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim() || disabled) return;

      onSendMessage(message);
      setMessage('');

      // 전송 시 타이핑 종료
      if (isTypingRef.current) {
        onStopTyping();
        isTypingRef.current = false;
      }
    },
    [message, disabled, onSendMessage, onStopTyping]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/40 bg-white/60 backdrop-blur-sm p-4"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <textarea
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요"
            disabled={disabled}
            maxLength={8192}
            rows={1}
            className="flex-1 resize-none rounded-lg border border-white/60 bg-white/80 px-4 py-2 text-sm text-zinc-900 shadow-sm focus:border-[var(--figma-neon-green)] focus:outline-none focus:ring-2 focus:ring-[var(--figma-neon-green)]/30 placeholder:text-zinc-400 transition-colors disabled:bg-white/40"
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="rounded-lg bg-[var(--figma-neon-green)] p-2 text-[var(--figma-tech-green)] shadow-sm hover:bg-[var(--figma-neon-green)]/90 hover:shadow-[0_0_12px_rgba(74,222,128,0.35)] transition-all disabled:bg-zinc-200 disabled:text-zinc-400"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        {message.length > 8000 && (
          <div className="text-right text-xs text-red-500">
            {message.length.toLocaleString()} / 8,192
          </div>
        )}
      </div>
    </form>
  );
};
