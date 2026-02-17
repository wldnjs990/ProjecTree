interface TypingIndicatorProps {
    userCount: number;
}

export const TypingIndicator = ({ userCount }: TypingIndicatorProps) => {
    return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex gap-1">
                <span
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: '0ms' }}
                />
                <span
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: '150ms' }}
                />
                <span
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: '300ms' }}
                />
            </div>
            <span>{userCount}명이 입력 중...</span>
        </div>
    );
};
