import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { ProjectDropdownProps } from '../types';

const mockProjects = [
  { id: '1', name: 'AI 여행 추천 서비스 (매우 긴 이름을 테스트 중입니다)' },
  { id: '2', name: '이커머스 플랫폼 (텍스트가 넘치면 말줄임표 처리되어야 함)' },
  { id: '3', name: '소셜 미디어 앱' },
  { id: '4', name: '금융 자산 관리 대시보드' },
  { id: '5', name: '실시간 채팅 서비스' },
  { id: '6', name: '블록체인 거래소 (보안 강화 버전)' },
  { id: '7', name: 'IoT 스마트홈 컨트롤러' },
  { id: '8', name: 'SaaS 구독 관리 플랫폼' },
  { id: '9', name: '교육용 LMS 시스템' },
  { id: '10', name: '헬스케어 웨어러블 앱' },
  { id: '11', name: '메타버스 가상 오피스' },
];

export function ProjectDropdown({ projectName, onProjectChange }: ProjectDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 px-3 gap-1.5 font-medium text-sm text-[#0B0B0B] hover:bg-white/60 hover:shadow-sm data-[state=open]:bg-white/80 data-[state=open]:shadow-sm transition-all duration-200 justify-start"
        >
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <span className="truncate max-w-[160px] cursor-default block text-left">
                  {projectName}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{projectName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-56 max-h-[300px] overflow-y-auto rounded-xl border-zinc-200/60 bg-white/80 backdrop-blur-md shadow-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300/50 [&::-webkit-scrollbar-thumb]:hover:bg-zinc-400/60 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {mockProjects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => onProjectChange?.(project.id)}
            className="rounded-lg cursor-pointer"
          >
            {/* 리스트 아이템도 길어지면 truncate 처리 + 툴팁 */}
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <span className="truncate block w-full text-left">{project.name}</span>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{project.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
