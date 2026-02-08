import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserStore, useUpdateNickname } from '@/shared/stores/userStore';
import { updateNickname } from '@/apis/member.api';
import { logout } from '@/apis/oauth.api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  FolderOpen,
  UserStar,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings,
  Pencil,
  House,
} from 'lucide-react';

import type { FilterType } from '../types';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

type MenuItem = {
  id: FilterType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

const MENU_ITEMS: MenuItem[] = [
  { id: 'all', icon: FolderOpen, label: '전체 워크스페이스' },
  { id: 'mine', icon: UserStar, label: '편집 가능' },
  { id: 'joined', icon: Users, label: '읽기 전용' },
];

function useProfileDialogState(nickname: string) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(nickname);

  useEffect(() => {
    if (!open) {
      setEditing(false);
      setTemp(nickname);
    }
  }, [open, nickname]);

  const startEdit = useCallback(() => {
    setTemp(nickname);
    setEditing(true);
  }, [nickname]);

  const cancelEdit = useCallback(() => {
    setTemp(nickname);
    setEditing(false);
  }, [nickname]);

  return {
    open,
    setOpen,
    editing,
    setEditing,
    temp,
    setTemp,
    startEdit,
    cancelEdit,
  };
}

function ProfileDialog({ nickname, email }: { nickname: string; email: string }) {
  const navigate = useNavigate();
  const updateStoreNickname = useUpdateNickname();
  const {
    open,
    setOpen,
    editing,
    temp,
    setTemp,
    startEdit,
    cancelEdit,
    setEditing,
  } = useProfileDialogState(nickname);

  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!editing || !temp) {
      setIsValid(false);
      setErrorMessage('');
      return;
    }

    const regex = /^[a-zA-Z0-9가-힣_]+$/;
    if (!regex.test(temp)) {
      setIsValid(false);
      setErrorMessage('한글, 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.');
      return;
    }

    if (temp === nickname) {
      setIsValid(true);
      setErrorMessage('');
      return;
    }

    setIsValid(true);
    setErrorMessage('');
  }, [temp, editing, nickname]);

  const handleSave = useCallback(async () => {
    if (!isValid) return;

    const next = temp.trim();
    if (next.length === 0) return;

    try {
      await updateNickname(next);
      updateStoreNickname(next);
      setEditing(false);
    } catch (_error) {
      setErrorMessage('닉네임 변경에 실패했습니다.');
    }
  }, [temp, updateStoreNickname, setEditing, isValid]);

  const handleLogout = useCallback(async () => {
    await logout();
    useUserStore.getState().clearUser();
    navigate('/login');
  }, [navigate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip open={open ? false : undefined}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-400 hover:text-[var(--figma-tech-green)] hover:bg-zinc-100/50 transition-colors"
              aria-label="프로필 설정 열기"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">프로필 설정</TooltipContent>
      </Tooltip>

      <DialogContent
        className="
        sm:max-w-106.25
        bg-white
        backdrop-blur-2xl
        border border-white/60
        shadow-[0_20px_48px_-12px_rgba(0,0,0,0.12)]
        rounded-3xl
        z-[1001]
        p-0
        overflow-hidden
      "
      >
        <DialogHeader className="p-6 pb-0 bg-white">
          <DialogTitle className="text-[var(--figma-tech-green)] text-xl font-bold tracking-tight">
            프로필 정보
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            계정 정보를 확인하고 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 bg-white">
          <div className="grid gap-2">
            <Label
              htmlFor="nickname"
              className="text-zinc-700 px-6 text-xs font-bold uppercase tracking-wider opacity-70"
            >
              닉네임
            </Label>

            {editing ? (
              <div className="flex flex-col gap-2 h-18 justify-start px-6">
                <div className="flex gap-2">
                  <Input
                    id="nickname"
                    value={temp}
                    onChange={(e) => {
                      if (e.target.value.length <= 16) {
                        setTemp(e.target.value);
                      }
                    }}
                    className={cn(
                      'bg-white/50 border-transparent shadow-sm focus:bg-white focus:ring-2 focus:ring-[var(--figma-neon-green)]/40 focus:border-[var(--figma-neon-green)] rounded-xl transition-colors duration-300 hover:bg-white/60',
                      errorMessage &&
                        'border-red-300 focus:border-red-400 focus:ring-red-100'
                    )}
                    autoFocus
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEdit}
                    className="border-white/60 bg-white/60 text-zinc-600 hover:bg-white/80 hover:text-zinc-900 rounded-xl backdrop-blur-sm"
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!isValid}
                    className="bg-[var(--figma-neon-green)] hover:bg-[var(--figma-neon-green)]/90 text-[var(--figma-tech-green)] font-bold shadow-sm hover:shadow-[0_0_15px_rgba(74,222,128,0.4)] disabled:opacity-50 transition-all rounded-xl"
                  >
                    저장
                  </Button>
                </div>
                <div className="h-4 flex items-center justify-between pl-1 pr-1">
                  {errorMessage ? (
                    <p className="text-xs text-red-500 font-medium">
                      {errorMessage}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-zinc-400">
                    {temp.length}/16
                  </span>
                </div>
              </div>
            ) : (
              <div className="px-6">
                <div className="flex items-center justify-between rounded-xl border-transparent bg-white/50 shadow-sm px-3 py-2 h-10 mb-4 hover:bg-white/60 transition-colors duration-300">
                  <span className="text-zinc-800 font-medium">{nickname}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-zinc-400 hover:text-[var(--figma-tech-green)] hover:bg-white/80"
                    onClick={startEdit}
                    aria-label="닉네임 편집"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-2 mt-2">
            <Label
              htmlFor="email"
              className="text-zinc-700 px-6 text-xs font-bold uppercase tracking-wider opacity-70"
            >
              이메일
            </Label>
            <div className="px-6">
              <div className="flex items-center rounded-xl px-3 py-2 h-10 mb-4">
                <span className="text-zinc-500 font-medium">{email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-100 bg-zinc-50/30 p-6 pt-5">
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-sm text-zinc-400 hover:text-zinc-500 transition-colors">
                  로그아웃
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent
                className="
                bg-white/92
                backdrop-blur-2xl
                border border-white/60
                rounded-3xl
                shadow-2xl
                z-[1001]
                p-0
                overflow-hidden
              "
              >
                <AlertDialogHeader className="p-6">
                  <AlertDialogTitle className="text-zinc-900 font-bold">
                    로그아웃 하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500">
                    로그아웃하면 다시 로그인해야 합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="px-6 py-4 bg-zinc-50/50 border-t border-zinc-100">
                  <AlertDialogCancel className="border-zinc-200 text-zinc-600 hover:bg-white bg-transparent rounded-xl">
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="border border-zinc-200 text-zinc-600 hover:bg-zinc-200 bg-zinc-100 rounded-xl"
                  >
                    로그아웃
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 로딩 스켈레톤 컴포넌트
function SidebarSkeleton({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={cn(
        'group/sidebar flex flex-col border-r border-white/60 bg-gradient-to-b from-white/70 via-white/50 to-white/30 backdrop-blur-2xl shadow-[1px_0_30px_0_rgba(31,38,135,0.07)] transition-all duration-500 ease-out z-20 relative',
        collapsed ? 'w-16' : 'w-75'
      )}
    >
      {/* Profile Skeleton */}
      <div
        className={cn(
          'flex items-center gap-3 border-b border-white/20 p-3',
          collapsed && 'flex-col gap-2 p-2'
        )}
      >
        <div className="h-9 w-9 rounded-full bg-zinc-200/60 animate-pulse" />
        {!collapsed && (
          <div className="h-5 w-20 bg-zinc-200/60 rounded animate-pulse" />
        )}
      </div>
      {/* Nav Skeleton */}
      <div className="flex-1 p-3 space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 bg-zinc-200/40 rounded-xl animate-pulse"
          />
        ))}
      </div>
    </aside>
  );
}

export function LoungeSidebar({
  collapsed,
  onToggle,
  currentFilter,
  onFilterChange,
}: SidebarProps) {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  // 타임아웃 후 리다이렉트
  useEffect(() => {
    if (user) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      if (!user) {
        navigate('/login');
      }
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  // 로딩 중이고 user 없으면 스켈레톤
  if (!user && isLoading) {
    return <SidebarSkeleton collapsed={collapsed} />;
  }

  // user 없고 로딩 끝났으면 null (리다이렉트 중)
  if (!user) {
    return null;
  }

  // user 확정 - 닉네임, 이메일 직접 사용
  const nickname = user.nickname;
  const email = user.email;
  const initialLetter = nickname?.trim().charAt(0) || '?';
  const toggleLabel = collapsed ? '사이드바 열기' : '사이드바 닫기';
  const tooltipSide = collapsed ? 'right' : 'bottom';
  const toggleButton = (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            'h-7 w-7 text-zinc-400 hover:text-[var(--figma-tech-green)] hover:bg-zinc-100/50 transition-colors',
            !collapsed && 'opacity-0 group-hover/header:opacity-100 transition-opacity duration-200'
          )}
          aria-label={toggleLabel}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{toggleLabel}</TooltipContent>
    </Tooltip>
  );

  return (
    <aside
      className={cn(
        'group/sidebar flex flex-col border-r border-white/60 bg-gradient-to-b from-white/70 via-white/50 to-white/30 backdrop-blur-2xl shadow-[1px_0_30px_0_rgba(31,38,135,0.07)] transition-all duration-500 ease-out z-20 relative',
        collapsed ? 'w-16' : 'w-75'
      )}
    >
      {/* User Profile */}
      <div
        className={cn(
          'group/header flex items-center justify-between border-b border-white/20 p-3',
          collapsed && 'flex-col gap-2 p-2'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 group',
            collapsed && 'flex-col gap-1'
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--figma-forest-bg)] to-emerald-50 text-[var(--figma-tech-green)] text-sm font-bold shadow-inner ring-1 ring-[var(--figma-forest-accent)]/30">
            {initialLetter}
          </div>
          {!collapsed && (
            <span
              className="font-semibold text-zinc-800 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
              title={nickname}
            >
              {nickname}
            </span>
          )}
        </div>

        {!collapsed && (
          <div className="flex items-center gap-1">
            {toggleButton}
            <ProfileDialog nickname={nickname} email={email} />
          </div>
        )}

        {collapsed && (
          <div className="flex w-full justify-end px-2">
            {toggleButton}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3" aria-label="워크스페이스 메뉴">
        {!collapsed && (
          <p className="mb-2 px-3 text-xs font-bold text-zinc-500 whitespace-nowrap overflow-hidden">
            워크스페이스
          </p>
        )}

        <ul className="space-y-0.5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentFilter === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onFilterChange(item.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 text-left group',
                    isActive
                      ? 'bg-white/70 text-[var(--figma-tech-green)] font-bold shadow-sm backdrop-blur-md'
                      : 'text-zinc-500 font-medium hover:bg-white/40 hover:text-zinc-800 hover:translate-x-1'
                  )}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/20 p-3">
        <button
          className="flex w-full items-center justify-start gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:text-emerald-600 hover:bg-white/70 transition-all duration-300"
          onClick={() => navigate('/')}
        >
          <House className="h-4 w-4" />
          {!collapsed && <span>홈으로 가기</span>}
        </button>
      </div>
    </aside>
  );
}
