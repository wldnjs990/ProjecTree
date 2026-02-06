import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Logo } from './Logo';
import { ProjectDropdown } from './ProjectDropdown';
import { ViewTabs } from './ViewTabs';
import { ActionButtons } from './ActionButtons';
import { OnlineUsers } from './OnlineUsers';
import { MemberManagementModal } from './MemberManagementModal';
import type { HeaderProps } from '../types';

export function Header({
  workspaceId,
  projectName,
  activeTab,
  onTabChange,
  onlineUsers,
  onSettingsClick,
  onVoiceCallClick,
  isVoiceChatActive,
  isVoiceChatBarVisible,
}: HeaderProps) {
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);

  // 현재 사용자가 관리자(OWNER)인지 확인
  const currentUser = onlineUsers.find(user => user.isMe);
  const canManageMembers =
    currentUser?.role === 'OWNER' || currentUser?.role === 'EDITOR';

  return (
    <header className="flex items-center justify-between h-14 px-4 bg-white/95 backdrop-blur-sm border-b border-zinc-300/60 z-50 relative">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Logo />
          <ProjectDropdown projectName={projectName} />
        </div>

        <Separator orientation="vertical" className="h-6 bg-zinc-200/60" />

        <ViewTabs activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      <div className="flex items-center gap-2">
        <ActionButtons
          onSettingsClick={onSettingsClick}
          onVoiceCallClick={onVoiceCallClick}
          onInviteClick={canManageMembers ? () => setMemberModalOpen(true) : undefined}
          isVoiceChatActive={isVoiceChatActive}
          isVoiceChatBarVisible={isVoiceChatBarVisible}
        />

        <Separator orientation="vertical" className="h-6 mx-1 bg-zinc-200/60" />

        <OnlineUsers users={onlineUsers} />
      </div>

      {canManageMembers && (
        <MemberManagementModal
          open={isMemberModalOpen}
          onOpenChange={setMemberModalOpen}
          onlineUsers={onlineUsers}
          workspaceId={workspaceId}
        />
      )}
    </header>
  );
}
