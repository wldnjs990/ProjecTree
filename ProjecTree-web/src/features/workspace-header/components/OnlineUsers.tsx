import { AvatarGroup } from '@/shared/components/AvatarGroup';
import type { OnlineUsersProps } from '../types';

export function OnlineUsers({ users, onInviteClick }: OnlineUsersProps) {
  return (
    <AvatarGroup
      users={users}
      maxDisplay={3}
      showAddButton
      onAddClick={onInviteClick}
      size="md"
    />
  );
}
