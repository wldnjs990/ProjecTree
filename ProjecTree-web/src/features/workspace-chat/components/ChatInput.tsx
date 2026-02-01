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
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // 타이핑 시작
    if (e.target.value.length === 1) {
      onStartTyping();
    }

    // 타이핑 종료 디바운싱
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 1000);
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim() || disabled) return;

      onSendMessage(message);
      setMessage('');
      onStopTyping();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
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
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <textarea
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
            disabled={disabled}
            maxLength={8192}
            rows={1}
            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
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
