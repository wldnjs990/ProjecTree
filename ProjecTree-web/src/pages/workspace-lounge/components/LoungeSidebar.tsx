import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/stores/userStore';
import { checkNicknameDuplicate, updateNickname, deleteMember } from '@/apis/member.api';
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
  FolderOpen,
  User,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings,
  Pencil,
} from 'lucide-react';

import type { FilterType } from '../types';

interface SidebarProps {
  // 사이드바 접힘 여부
  collapsed: boolean;
  // 접힘 토글 함수
  onToggle: () => void;

  // 현재 선택된 필터
  currentFilter: FilterType;
  // 필터 변경 핸들러
  onFilterChange: (filter: FilterType) => void;
}

type MenuItem = {
  id: FilterType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

// 사이드바 메뉴 항목 정의
const MENU_ITEMS: MenuItem[] = [
  { id: 'all', icon: FolderOpen, label: '전체 프로젝트' },
  { id: 'mine', icon: User, label: '내가 만든 것' },
  { id: 'joined', icon: Users, label: '참여 중인 것' },
];

/**
 * [Hook] 프로필 다이얼로그의 상태 관리
 * - 열림/닫힘 및 편집 모드 상태를 관리합니다.
 * - 다이얼로그가 닫히면 임시 수정된 닉네임을 초기화합니다.
 */
function useProfileDialogState(nickname: string) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(nickname);

  // 다이얼로그가 닫히면 편집 상태/임시값을 원상복구
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

/**
 * [컴포넌트] 프로필 설정 다이얼로그
 * - 닉네임 수정 및 회원 탈퇴 기능을 제공하는 팝업입니다.
 */
function ProfileDialog({
  nickname,
  setNickname,
  memberId,
  onDeleteSuccess,
}: {
  nickname: string;
  setNickname: (next: string) => void;
  memberId: number;
  onDeleteSuccess?: () => void;
}) {
  const navigate = useNavigate();
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

  // 유효성 검사 상태
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  // 1. 유효성 검사 및 중복 체크 로직 (Debounce 적용)
  useEffect(() => {
    // 편집 모드가 아니거나 입력이 없으면 초기화
    if (!editing || !temp) {
      setIsValid(false);
      setErrorMessage('');
      setSuccessMessage('');
      return;
    }

    // (1) 길이 및 형식 검사
    if (temp.length > 16) {
      setIsValid(false);
      setErrorMessage('닉네임은 16자 이내여야 합니다.');
      setSuccessMessage('');
      return;
    }

    const regex = /^[a-zA-Z0-9가-힣_]+$/;
    if (!regex.test(temp)) {
      setIsValid(false);
      setErrorMessage('한글, 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.');
      setSuccessMessage('');
      return;
    }

    // 기존 닉네임과 동일하면 체크 건너뜀
    if (temp === nickname) {
      setIsValid(true);
      setErrorMessage('');
      setSuccessMessage('');
      return;
    }

    // (2) 서버 중복 체크 요청 (Debounce 500ms)
    const checkDuplicateNickname = async () => {
      setIsChecking(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        const isAvailable = await checkNicknameDuplicate(temp);

        if (isAvailable) {
          setIsValid(true);
          setSuccessMessage('사용 가능한 닉네임입니다.');
        } else {
          setIsValid(false);
          setErrorMessage('이미 사용 중인 닉네임입니다.');
        }
      } catch (error) {
        console.error('중복 확인 실패', error);
        setErrorMessage('확인 중 오류가 발생했습니다.');
        setIsValid(false);
      } finally {
        setIsChecking(false);
      }
    };

    const timer = setTimeout(checkDuplicateNickname, 500);
    return () => clearTimeout(timer);
  }, [temp, editing, nickname]);

  const handleSave = useCallback(async () => {
    if (!isValid) return; // 유효하지 않으면 저장 불가

    const next = temp.trim();
    if (next.length === 0) return;

    try {
      // API를 통해 닉네임 변경
      await updateNickname(memberId, next);
      setNickname(next);
      setEditing(false);
    } catch (error) {
      console.error('닉네임 변경 실패', error);
      setErrorMessage('닉네임 변경에 실패했습니다.');
    }
  }, [temp, memberId, setNickname, setEditing, isValid]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      // API를 통해 회원 탈퇴
      await deleteMember(memberId);
      setOpen(false);
      if (onDeleteSuccess) onDeleteSuccess();
      // 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error('회원 탈퇴 실패', error);
    }
  }, [memberId, setOpen, onDeleteSuccess, navigate]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

      <DialogContent className="
        sm:max-w-106.25 
        bg-white/92
        backdrop-blur-2xl
        border border-white/60
        shadow-[0_20px_48px_-12px_rgba(0,0,0,0.12)]
        rounded-3xl
        z-[1001]
        p-0
        overflow-hidden
      ">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-[var(--figma-tech-green)] text-xl font-bold tracking-tight">프로필 정보</DialogTitle>
          <DialogDescription className="text-zinc-500">
            계정 정보를 확인하고 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="grid gap-2">
            <Label htmlFor="nickname" className="text-zinc-700 px-6 text-xs font-bold uppercase tracking-wider opacity-70">
              닉네임
            </Label>

            {editing ? (
              <div className="flex flex-col gap-2 h-18 justify-start px-6">
                <div className="flex gap-2">
                  <Input
                    id="nickname"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className={cn(
                      'bg-white/80 border-white/60 focus:ring-2 focus:ring-[var(--figma-neon-green)]/40 focus:border-[var(--figma-neon-green)] rounded-xl backdrop-blur-sm',
                      errorMessage &&
                      'border-red-300 focus:border-red-400 focus:ring-red-100',
                      successMessage &&
                      'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100'
                    )}
                    maxLength={16}
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
                    disabled={!isValid || isChecking}
                    className="bg-[var(--figma-neon-green)] hover:bg-[var(--figma-neon-green)]/90 text-[var(--figma-tech-green)] font-bold shadow-sm hover:shadow-[0_0_15px_rgba(74,222,128,0.4)] disabled:opacity-50 transition-all rounded-xl"
                  >
                    {isChecking ? '...' : '저장'}
                  </Button>
                </div>
                {/* 메시지 영역을 절대 위치로 두거나, 컨테이너 높이를 고정하여 layout shift 방지 */}
                <div className="h-4 flex items-center pl-1">
                  {errorMessage && (
                    <p className="text-xs text-red-500 font-medium">
                      {errorMessage}
                    </p>
                  )}
                  {successMessage && (
                    <p className="text-xs text-emerald-600 font-medium">
                      {successMessage}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              // 편집 모드가 아닐 때도 동일한 높이를 확보하기 위해 h-10 mb-8 적용
              <div className="px-6">
                <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/60 px-3 py-2 h-10 mb-8 backdrop-blur-sm">
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
        </div>

        <div className="border-t border-zinc-100 bg-zinc-50/50 p-6 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-zinc-900">회원 탈퇴</p>
              <p className="text-[12px] text-zinc-500">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 bg-white focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl transition-colors"
                >
                  탈퇴하기
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="
                bg-white/92
                backdrop-blur-2xl
                border border-white/60
                rounded-3xl
                shadow-2xl
                z-[1001]
                p-0
                overflow-hidden
              ">
                <AlertDialogHeader className="p-6">
                  <AlertDialogTitle className="text-zinc-900 font-bold">
                    정말 탈퇴하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500">
                    이 작업은 되돌릴 수 없습니다. 계정과 관련된 모든 데이터가
                    영구적으로 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="p-6 pt-2 bg-zinc-50/50 border-t border-zinc-100">
                  <AlertDialogCancel className="border-zinc-200 text-zinc-600 hover:bg-white bg-transparent rounded-xl">
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg rounded-xl"
                  >
                    탈퇴하기
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent >
    </Dialog >
  );
}

/**
 * [컴포넌트] 라운지 사이드바
 * - 좌측에 고정되어 네비게이션과 사용자 프로필 기능을 제공합니다.
 * - `collapsed` prop에 따라 너비가 조절됩니다 (64px <-> 256px).
 */
export function LoungeSidebar({
  collapsed,
  onToggle,
  currentFilter,
  onFilterChange,
}: SidebarProps) {
  // userStore에서 사용자 정보 가져오기
  const { user, clearUser } = useUserStore();
  const [nickname, setNickname] = useState(user?.nickname || '사용자');

  // 닉네임 첫 글자로 아바타 이니셜 생성
  const initialLetter = useMemo(
    () => nickname.trim().charAt(0) || '?',
    [nickname]
  );

  return (
    <aside
      className={cn(
        'group/sidebar flex flex-col border-r border-white/60 bg-gradient-to-b from-white/70 via-white/50 to-white/30 backdrop-blur-2xl shadow-[1px_0_30px_0_rgba(31,38,135,0.07)] transition-all duration-500 ease-out z-20 relative',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Floating Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-9 h-6 w-6 rounded-full bg-white border border-[var(--figma-forest-bg)] shadow-md flex items-center justify-center text-[var(--figma-forest-accent)] hover:text-[var(--figma-tech-green)] hover:scale-110 hover:border-[var(--figma-forest-accent)] transition-all z-50 outline-none focus:ring-2 focus:ring-[var(--figma-forest-bg)] opacity-0 group-hover/sidebar:opacity-100"
        aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
      {/* User Profile */}
      <div
        className={cn(
          'flex items-center gap-3 border-b border-white/20 p-4',
          collapsed && 'flex-col gap-2 p-2'
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--figma-forest-bg)] to-emerald-50 text-[var(--figma-tech-green)] text-sm font-bold shadow-inner ring-1 ring-[var(--figma-forest-accent)]/30">
          {initialLetter}
        </div>

        {collapsed ? (
          <div className="w-full flex justify-center">{/* Collapsed state is just avatar centered */}</div>
        ) : (
          <div className="flex flex-1 items-center justify-between overflow-hidden">
            <span className="font-semibold text-zinc-800 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis px-1">
              {nickname}
            </span>

            {user && (
              <ProfileDialog
                nickname={nickname}
                setNickname={setNickname}
                memberId={user.memberId}
                onDeleteSuccess={clearUser}
              />
            )}
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
    </aside>
  );
}
