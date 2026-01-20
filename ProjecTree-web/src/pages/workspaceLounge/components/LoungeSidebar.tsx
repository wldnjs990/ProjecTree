import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { FolderOpen, User, Users, Plus, ChevronLeft, ChevronRight, Settings, Pencil } from "lucide-react";

interface SidebarProps {
  // 사이드바 접힘 여부
  collapsed: boolean;
  // 접힘 토글 함수
  onToggle: () => void;

  /** 초기 닉네임 (실제로는 API에서 가져온 값 사용) */
  initialNickname?: string;
  /** 닉네임 변경 시 호출되는 콜백 */
  onNicknameSave?: (nextNickname: string) => void | Promise<void>;
  /** 회원 탈퇴 시 호출되는 콜백 */
  onDeleteAccount?: () => void | Promise<void>;
  /** 팀 생성 버튼 클릭 시 호출되는 콜백 */
  onCreateTeam?: () => void;
}

type MenuItem = {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

// 사이드바 메뉴 항목 정의
const MENU_ITEMS: MenuItem[] = [
  { to: "/projects", icon: FolderOpen, label: "전체 프로젝트" },
  { to: "/projects/mine", icon: User, label: "내가 만든 것" },
  { to: "/projects/joined", icon: Users, label: "참여 중인 것" },
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
  onNicknameSave,
  onDeleteAccount,
}: {
  nickname: string;
  setNickname: (next: string) => void;
  onNicknameSave?: (nextNickname: string) => void | Promise<void>;
  onDeleteAccount?: () => void | Promise<void>;
}) {
  const { open, setOpen, editing, temp, setTemp, startEdit, cancelEdit, setEditing } =
    useProfileDialogState(nickname);

  const handleSave = useCallback(async () => {
    const next = temp.trim();

    // 최소 검증: 빈 문자열 방지
    if (next.length === 0) return;

    // 서버 저장 훅이 있으면 먼저 호출
    if (onNicknameSave) await onNicknameSave(next);

    // 성공했다고 가정하고 로컬 상태 반영
    setNickname(next);
    setEditing(false);
  }, [temp, onNicknameSave, setNickname, setEditing]);

  const handleDeleteAccount = useCallback(async () => {
    if (onDeleteAccount) await onDeleteAccount();
    // 성공했다고 가정하고 닫기
    setOpen(false);
  }, [onDeleteAccount, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
          aria-label="프로필 설정 열기"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">프로필 정보</DialogTitle>
          <DialogDescription className="text-zinc-500">
            계정 정보를 확인하고 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nickname" className="text-zinc-700">
              닉네임
            </Label>

            {editing ? (
              <div className="flex gap-2">
                <Input
                  id="nickname"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="border-zinc-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  autoFocus
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelEdit}
                  className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 bg-transparent"
                >
                  취소
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  저장
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2">
                <span className="text-zinc-900">{nickname}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
                  onClick={startEdit}
                  aria-label="닉네임 편집"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-200 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-900">회원 탈퇴</p>
              <p className="text-xs text-zinc-500">계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
                >
                  탈퇴하기
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-zinc-900">정말 탈퇴하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500">
                    이 작업은 되돌릴 수 없습니다. 계정과 관련된 모든 데이터가 영구적으로 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 bg-transparent">
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">
                    탈퇴하기
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

/**
 * [컴포넌트] 라운지 사이드바
 * - 좌측에 고정되어 네비게이션과 사용자 프로필 기능을 제공합니다.
 * - `collapsed` prop에 따라 너비가 조절됩니다 (64px <-> 256px).
 */
export function LoungeSidebar({
  collapsed,
  onToggle,
  initialNickname = "김싸피",
  onNicknameSave,
  onDeleteAccount,
  onCreateTeam,
}: SidebarProps) {
  const [nickname, setNickname] = useState(initialNickname);

  // 닉네임 첫 글자로 아바타 이니셜 생성
  const initialLetter = useMemo(() => nickname.trim().charAt(0) || "?", [nickname]);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-zinc-200 bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* User Profile */}
      <div className={cn("flex items-center gap-3 border-b border-zinc-200 p-4", collapsed && "flex-col gap-2 p-2")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
          {initialLetter}
        </div>

        {collapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
            onClick={onToggle}
            aria-label="사이드바 펼치기"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex flex-1 items-center justify-between">
            <span className="font-medium text-zinc-900 tracking-tight">{nickname}</span>

            <div className="flex items-center gap-1">
              <ProfileDialog
                nickname={nickname}
                setNickname={setNickname}
                onNicknameSave={onNicknameSave}
                onDeleteAccount={onDeleteAccount}
              />

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
                onClick={onToggle}
                aria-label="사이드바 접기"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3" aria-label="워크스페이스 메뉴">
        {!collapsed && (
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">워크스페이스</p>
        )}

        <ul className="space-y-0.5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive ? "bg-indigo-50 text-indigo-700 font-medium" : "text-zinc-600 hover:bg-zinc-100"
                    )
                  }
                  aria-label={item.label}
                  end
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Action */}
      <div className="border-t border-zinc-200 p-3">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start gap-2 text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900",
            collapsed && "justify-center px-0"
          )}
          onClick={onCreateTeam}
          aria-label="팀 생성"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span>팀 생성</span>}
        </Button>
      </div>
    </aside>
  );
}
