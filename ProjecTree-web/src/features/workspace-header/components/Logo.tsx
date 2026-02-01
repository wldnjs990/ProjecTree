import { cn } from '@/shared/lib/utils';
import type { LogoProps } from '../types';

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-8 h-8 bg-[#1C69E3] rounded-lg',
        className
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" y="2" width="4" height="4" rx="0.5" stroke="white" strokeWidth="1.33" fill="none" />
        <rect x="10" y="2" width="4" height="4" rx="0.5" stroke="white" strokeWidth="1.33" fill="none" />
        <rect x="2" y="10" width="4" height="4" rx="0.5" stroke="white" strokeWidth="1.33" fill="none" />
        <rect x="6" y="6" width="6" height="6" rx="0.5" stroke="white" strokeWidth="1.33" fill="none" />
      </svg>
    </div>
  );
}
