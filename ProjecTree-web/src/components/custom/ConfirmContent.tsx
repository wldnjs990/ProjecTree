import { cn } from '@/lib/utils';
import { forwardRef, type ReactElement } from 'react';

interface ConfirmContentProps {
  children: ReactElement;
  className: string;
}
export const ConfirmContent = forwardRef<HTMLDivElement, ConfirmContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className={cn(className)}>
        {children}
      </div>
    );
  }
);
