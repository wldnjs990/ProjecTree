import { cn } from "@/lib/utils";
import { UserAvatar, type AvatarColor } from "@/shared/components/UserAvatar";

/**
 * 서버로부터 워크스페이스에 참가한 유저들의 데이터
 * TODO : 추후에 백엔드팀과 스펙 정의한 후 바꿔야함
 */
interface OnlineUser {
  id: string;
  initials: string;
  color: AvatarColor;
  isOnline: boolean;
}

interface CollabPanelProps {
  users: OnlineUser[];
  className?: string;
}

/**
 * N명 협업중인지 표시해주는 패널 컴포넌트
 */
export function CollabPanel({ users, className }: CollabPanelProps) {
  const onlineCount = users.filter((user) => user.isOnline).length;

  return (
    <div
      className={cn(
        "glass rounded-3xl p-4 shadow-lg border border-white/20",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">협업 중</span>

        <div className="flex -space-x-2">
          {/* 최대 2명까지 접속한 유저를 아바타로 띄워주기 */}
          {users
            .filter((u) => u.isOnline)
            .slice(0, 2)
            .map((user) => (
              <UserAvatar
                key={user.id}
                initials={user.initials}
                color={user.color}
                isOnline={user.isOnline}
                size="md"
              />
            ))}
        </div>

        <span className="text-xs font-medium text-success">
          {onlineCount}명 온라인
        </span>
      </div>
    </div>
  );
}
