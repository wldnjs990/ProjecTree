import { cn } from '@/lib/utils';
import { forwardRef, type ReactElement } from 'react';

interface ConfirmTriggerProps {
  children: ReactElement;
  className?: string;
}
export const ConfirmTrigger = forwardRef<
  HTMLButtonElement,
  ConfirmTriggerProps
>(({ children, className, ...props }, ref) => {
  return (
    <button ref={ref} {...props} className={cn(className)}>
      {children}
    </button>
  );
});
