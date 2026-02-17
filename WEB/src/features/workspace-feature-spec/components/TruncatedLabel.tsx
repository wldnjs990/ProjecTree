import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

type TruncatedLabelProps = HTMLAttributes<HTMLSpanElement> & {
  text: string;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
};

export function TruncatedLabel({
  text,
  className,
  tooltipSide = 'top',
  ...spanProps
}: TruncatedLabelProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [open, setOpen] = useState(false);

  const checkOverflow = () => {
    const element = textRef.current;
    if (!element) {
      return false;
    }
    const hasOverflow =
      element.scrollWidth > element.clientWidth ||
      element.scrollHeight > element.clientHeight;
    setIsOverflow((prev) => (prev === hasOverflow ? prev : hasOverflow));
    return hasOverflow;
  };

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(checkOverflow);
    return () => cancelAnimationFrame(frame);
  }, [text]);

  useEffect(() => {
    const element = textRef.current;
    if (!element) {
      return;
    }

    checkOverflow();

    if (document.fonts?.ready) {
      document.fonts.ready.then(checkOverflow).catch(() => undefined);
    }

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [text]);

  useEffect(() => {
    if (!isOverflow && open) {
      setOpen(false);
    }
  }, [isOverflow, open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setOpen(false);
      return;
    }
    setOpen(checkOverflow());
  };

  const label = (
    <span
      ref={textRef}
      className={cn('block w-full min-w-0 truncate', className)}
      {...spanProps}
    >
      {text}
    </span>
  );

  return (
    <Tooltip open={open} onOpenChange={handleOpenChange}>
      <TooltipTrigger asChild>{label}</TooltipTrigger>
      <TooltipContent side={tooltipSide}>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}
