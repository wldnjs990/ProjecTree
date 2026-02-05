import { useNavigate } from 'react-router-dom';
import { TreeDeciduous } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { LogoProps } from '../types';

export function Logo({ className }: LogoProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 cursor-pointer hover:bg-emerald-200/80 transition-colors',
        className
      )}
      style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)' }}
      onClick={() => navigate('/')}
      title="홈으로 이동"
    >
      <TreeDeciduous className="h-4 w-4 text-emerald-600" />
    </div>
  );
}
