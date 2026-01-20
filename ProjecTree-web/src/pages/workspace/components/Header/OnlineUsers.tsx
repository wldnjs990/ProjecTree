import { AvatarGroup } from '@/components/custom/AvatarGroup'
import type { AvatarColor } from '@/components/custom/UserAvatar'

interface OnlineUser {
  id: string
  initials: string
  color: AvatarColor
  isOnline: boolean
}

interface OnlineUsersProps {
  users: OnlineUser[]
  onInviteClick?: () => void
}

export function OnlineUsers({ users, onInviteClick }: OnlineUsersProps) {
  return (
    <AvatarGroup
      users={users}
      maxDisplay={3}
      showAddButton
      onAddClick={onInviteClick}
      size="md"
    />
  )
}
