import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type AvatarColor = "blue" | "pink" | "orange" | "green" | "purple";

interface UserAvatarProps {
  initials: string;
  color?: AvatarColor;
  isOnline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorStyles: Record<AvatarColor, string> = {
  blue: "bg-[#2B7FFF]",
  pink: "bg-[#F6339A]",
  orange: "bg-[#FD9A00]",
  green: "bg-[#00C950]",
  purple: "bg-[#8B5CF6]",
};

/**
 * Record 타입은 객체 데이터 전용 타입입니다.
 * ex) sm 안에 { avatar: string; text: string; indicator: string }가 들어간다.
 */
const sizeStyles: Record<
  "sm" | "md" | "lg",
  { avatar: string; text: string; indicator: string }
> = {
  sm: {
    avatar: "h-6 w-6",
    text: "text-[10px]",
    indicator: "h-2 w-2 -right-0.5 -bottom-0.5",
  },
  md: {
    avatar: "h-7 w-7",
    text: "text-xs",
    indicator: "h-2.5 w-2.5 -right-0.5 -bottom-0.5",
  },
  lg: {
    avatar: "h-9 w-9",
    text: "text-sm",
    indicator: "h-3 w-3 -right-0.5 -bottom-0.5",
  },
};

/**
 * initials는 아바타 UI에 들어갈 유저의 이름입니다.
 * 이름 1글자만 넣으면 될 거 같습니다.
 */
export function UserAvatar({
  initials,
  color = "blue",
  isOnline,
  size = "md",
  className,
}: UserAvatarProps) {
  const sizeStyle = sizeStyles[size];

  return (
    <div className={cn("relative", className)}>
      {/* 아바타 */}
      <Avatar className={cn(sizeStyle.avatar, "border-2 border-white")}>
        <AvatarFallback
          className={cn(
            colorStyles[color],
            "text-white font-normal",
            sizeStyle.text,
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      {/* 온라인 활성화 뱃지 */}
      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute rounded-full border-2 border-white",
            sizeStyle.indicator,
            isOnline ? "bg-success" : "bg-gray-400",
          )}
        />
      )}
    </div>
  );
}
