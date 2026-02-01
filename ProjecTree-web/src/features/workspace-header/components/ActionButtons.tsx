import { Settings, Phone, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ActionButtonsProps } from '../types';

export function ActionButtons({
  onSettingsClick,
  onVoiceCallClick,
  onInviteClick,
}: ActionButtonsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 gap-1.5 text-[#636363]"
              onClick={onSettingsClick}
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">설정</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>프로젝트 설정</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 gap-1.5 text-[#636363]"
              onClick={onVoiceCallClick}
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">음성 통화</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>팀 음성 통화 시작</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 gap-1.5 text-[#636363]"
              onClick={onInviteClick}
            >
              <UserPlus className="h-4 w-4" />
              <span className="text-sm font-medium">초대</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>팀원 초대</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
