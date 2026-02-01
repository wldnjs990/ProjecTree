import { Separator } from '@/components/ui/separator';
import { Logo } from './Logo';
import { ProjectDropdown } from './ProjectDropdown';
import { ViewTabs } from './ViewTabs';
import { ActionButtons } from './ActionButtons';
import { OnlineUsers } from './OnlineUsers';
import type { HeaderProps } from '../types';

export function Header({
  projectName,
  activeTab,
  onTabChange,
  onlineUsers,
  onSettingsClick,
  onVoiceCallClick,
  onInviteClick,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-14 px-4 bg-white border-b border-[#EEEEEE] z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Logo />
          <ProjectDropdown projectName={projectName} />
        </div>

        <Separator orientation="vertical" className="h-6" />

        <ViewTabs activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      <div className="flex items-center gap-2">
        <ActionButtons
          onSettingsClick={onSettingsClick}
          onVoiceCallClick={onVoiceCallClick}
          onInviteClick={onInviteClick}
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        <OnlineUsers users={onlineUsers} onInviteClick={onInviteClick} />
      </div>
    </header>
  );
}
