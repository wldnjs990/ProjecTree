import type { AvatarColor } from '@/shared/components/UserAvatar';

export type ViewTab = 'tree-editor' | 'feature-spec' | 'tech-selection';

export interface OnlineUser {
  id: string;
  initials: string;
  color: AvatarColor;
  isOnline: boolean;
}

export interface HeaderProps {
  projectName: string;
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onlineUsers: OnlineUser[];
  onSettingsClick?: () => void;
  onVoiceCallClick?: () => void;
  onInviteClick?: () => void;
  isVoiceChatActive?: boolean;
}

export interface ActionButtonsProps {
  onSettingsClick?: () => void;
  onVoiceCallClick?: () => void;
  onInviteClick?: () => void;
  isVoiceChatActive?: boolean;
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
