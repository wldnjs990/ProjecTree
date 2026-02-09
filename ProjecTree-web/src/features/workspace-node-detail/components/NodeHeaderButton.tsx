import { type ReactElement } from 'react';
import { cn } from '@/shared/lib/utils';

export default function NodeHeaderButton({
  children,
  onClick,
  disabled = false,
}: {
  children: ReactElement;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'p-1 rounded-md transition-colors',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-gray-100'
      )}
    >
      {children}
    </button>
  );
}
