import { cn } from "@/lib/utils";
import { UserAvatar, type AvatarColor } from "./UserAvatar";
import { Plus } from "lucide-react";

interface User {
  id: string;
  initials: string;
  color: AvatarColor;
  isOnline?: boolean;
}

interface AvatarGroupProps {
  users: User[];
  maxDisplay?: number;
  showAddButton?: boolean;
  onAddClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarGroup({
  users,
  maxDisplay = 3,
  showAddButton = false,
  onAddClick,
  size = "md",
  className,
}: AvatarGroupProps) {
  const displayedUsers = users.slice(0, maxDisplay);
  const remainingCount = users.length - maxDisplay;

  const overlapSize = {
    sm: "-ml-2",
    md: "-ml-2",
    lg: "-ml-3",
  };

  const buttonSize = {
    sm: "h-6 w-6",
    md: "h-7 w-7",
    lg: "h-9 w-9",
  };

  return (
    <div className={cn("flex items-center", className)}>
      {displayedUsers.map((user, index) => (
        <div
          key={user.id}
          className={cn(index > 0 && overlapSize[size])}
          style={{ zIndex: displayedUsers.length - index }}
        >
          <UserAvatar
            initials={user.initials}
            color={user.color}
            isOnline={user.isOnline}
            size={size}
          />
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            overlapSize[size],
            buttonSize[size],
            "flex items-center justify-center rounded-full bg-secondary border-2 border-white text-xs font-medium text-gray-600",
          )}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}

      {showAddButton && (
        <button
          onClick={onAddClick}
          className={cn(
            overlapSize[size],
            buttonSize[size],
            "flex items-center justify-center rounded-full bg-secondary border-2 border-white hover:bg-[#DEDEDE] transition-colors",
          )}
          style={{ zIndex: 0 }}
        >
          <Plus className="h-3.5 w-3.5 text-gray-600" />
        </button>
      )}
    </div>
  );
}
