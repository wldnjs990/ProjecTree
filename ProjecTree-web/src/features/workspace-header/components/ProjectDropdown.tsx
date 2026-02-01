import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { ProjectDropdownProps } from '../types';

const mockProjects = [
  { id: '1', name: 'AI 여행 추천 서비스' },
  { id: '2', name: '이커머스 플랫폼' },
  { id: '3', name: '소셜 미디어 앱' },
];

export function ProjectDropdown({ projectName, onProjectChange }: ProjectDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 px-3 gap-1 font-medium text-sm text-[#0B0B0B]"
        >
          {projectName}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {mockProjects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => onProjectChange?.(project.id)}
          >
            {project.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
