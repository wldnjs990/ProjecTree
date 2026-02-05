import { Settings, Phone, Users } from 'lucide-react';
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
  isVoiceChatActive,
  isVoiceChatBarVisible,
}: ActionButtonsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 gap-1.5 text-[#636363] hover:bg-white/60 hover:shadow-sm transition-all duration-200"
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

        {/* ... 음성통화 부분 생략 ... */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 gap-1.5 text-[#636363] hover:bg-white/60 hover:shadow-sm transition-all duration-200 relative"
              onClick={onVoiceCallClick}
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">음성 통화</span>
              {/* 통화 중 표시 (초록색 점) */}
              {isVoiceChatActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {!isVoiceChatActive
                ? '팀 음성 통화 시작'
                : isVoiceChatBarVisible
                  ? '음성 통화 중 · 클릭하면 창을 숨기고 통화를 유지합니다'
                  : '음성 통화 중 · 클릭하면 창을 다시 표시합니다'}
            </p>
          </TooltipContent>
        </Tooltip>

        {onInviteClick && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 gap-1.5 text-[#636363] hover:bg-white/60 hover:shadow-sm transition-all duration-200"
                onClick={onInviteClick}
              >
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">멤버</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>멤버 관리</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
