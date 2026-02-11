import type { AvatarColor } from '@/shared/components/UserAvatar';

export type ViewTab = 'tree-editor' | 'feature-spec' | 'portfolio';

export interface OnlineUser {
  id: string;
  name: string;
  nickname: string;
  initials: string;
  color: AvatarColor;
  isOnline: boolean;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  isMe?: boolean;
}

export interface HeaderProps {
  workspaceId: number;
  projectName: string;
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onlineUsers: OnlineUser[];
  onSettingsClick?: () => void;
  onVoiceCallClick?: () => void;
  onInviteClick?: () => void;
  isVoiceChatActive?: boolean;
  isVoiceChatBarVisible?: boolean;
}

export interface ActionButtonsProps {
  onSettingsClick?: () => void;
  onVoiceCallClick?: () => void;
  onInviteClick?: () => void;
  isVoiceChatActive?: boolean;
  isVoiceChatBarVisible?: boolean;
}

export interface LogoProps {
  className?: string;
}

export interface OnlineUsersProps {
  users: OnlineUser[];
  onInviteClick?: () => void;
}

export interface ProjectDropdownProps {
  projectName: string;
  onProjectChange?: (projectId: string) => void;
}

export interface ViewTabsProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}
