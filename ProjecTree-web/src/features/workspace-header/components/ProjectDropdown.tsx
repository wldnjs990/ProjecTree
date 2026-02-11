import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
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
import { getMyWorkspaces, type WorkspaceCardData } from '@/apis/workspace-lounge.api';
import { useWorkspaceStore } from '@/features/workspace-core';
import type { ProjectDropdownProps } from '../types';

export function ProjectDropdown({ projectName }: ProjectDropdownProps) {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [projects, setProjects] = useState<WorkspaceCardData[]>([]);
  const setWorkspaceName = useWorkspaceStore((state) => state.setWorkspaceName);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getMyWorkspaces();
        setProjects(data);
        const current = data.find((p) => String(p.id) === String(workspaceId));
        if (current) setWorkspaceName(current.title);
      } catch (error) {
      }
    };
    fetchProjects();
  }, [workspaceId, setWorkspaceName]);

  const handleProjectChange = (workspaceId: string) => {
    // 같은 워크스페이스면 이동 안 함 (선택적)
    // 하지만 리로드 효과를 위해 이동 허용하거나, 현재 ID와 비교 가능
    navigate(`/workspace/${workspaceId}`);
  };

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
                  {projects.find((p) => String(p.id) === String(workspaceId))?.title || projectName}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {projects.find((p) => String(p.id) === String(workspaceId))?.title || projectName}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-56 max-h-[160px] overflow-y-auto rounded-xl border-zinc-200/60 bg-white/80 backdrop-blur-md shadow-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300/50 [&::-webkit-scrollbar-thumb]:hover:bg-zinc-400/60 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {projects.length === 0 ? (
          <div className="p-2 text-xs text-zinc-500 text-center">
            참여 중인 프로젝트가 없습니다.
          </div>
        ) : (
          projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => handleProjectChange(project.id)}
              className="rounded-lg cursor-pointer"
            >
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <span className="truncate block w-full text-left">{project.title}</span>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{project.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
