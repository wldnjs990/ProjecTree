import { cn } from '@/shared/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ReactElement } from 'react';

interface ConfirmTriggerProps {
  children: ReactElement;
  className?: string;
  asChild?: boolean;
}
export const ConfirmTrigger = forwardRef<
  HTMLButtonElement,
  ConfirmTriggerProps
>(({ children, className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp ref={ref} {...props} className={cn(className)}>
      {children}
    </Comp>
  );
});
