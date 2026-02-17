import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserAvatar } from '@/shared/components/UserAvatar';
import type { OnlineUsersProps } from '../types';

export function OnlineUsers({ users }: OnlineUsersProps) {
  // 나(Me) 찾기 - 닉네임을 우선 사용
  const myInfo = users.find((u) => u.isMe) || users[0];
  const otherUsers = users.filter((u) => u.id !== myInfo?.id);

  if (!myInfo) return null;

  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none rounded-full group">
          <div className="flex items-center gap-1 h-8 px-0.5 rounded-full hover:bg-white/60 hover:shadow-sm group-data-[state=open]:bg-white/80 group-data-[state=open]:shadow-sm transition-all duration-200 cursor-pointer pr-2">
            <UserAvatar
              initials={myInfo.initials}
              color={myInfo.color}
              size="md"
            />
            <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 rounded-xl border-zinc-200/60 bg-white/80 backdrop-blur-md shadow-lg p-1.5"
        >
          {/* 내 프로필 */}
          <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50/50 mb-1">
            <UserAvatar
              initials={myInfo.initials}
              color={myInfo.color}
              size="sm"
            />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-sm truncate text-zinc-900">
                {myInfo.nickname || myInfo.name}
              </span>
              <span className="text-[11px] text-zinc-500 font-medium shrink-0">
                (나)
              </span>
            </div>
          </div>

          <DropdownMenuSeparator className="my-1 bg-zinc-100" />

          {/* 나머지 멤버 리스트 */}
          <div className="max-h-[250px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300/50 [&::-webkit-scrollbar-thumb]:hover:bg-zinc-400/60 [&::-webkit-scrollbar-thumb]:rounded-full space-y-0.5">
            {otherUsers.map((user) => (
              <Tooltip key={user.id} delayDuration={300}>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center gap-3 p-2 rounded-lg cursor-default transition-colors hover:bg-zinc-100/50"
                  >
                    <UserAvatar
                      initials={user.initials}
                      color={user.color}
                      size="sm"
                      className="shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span
                        className="text-sm truncate text-zinc-700 font-medium"
                      >
                        {user.nickname || user.name}
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">
                  <p>{user.nickname || user.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
