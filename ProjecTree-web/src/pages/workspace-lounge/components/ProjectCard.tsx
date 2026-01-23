import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

export interface Member {
  name: string;
  avatar: string;
  online: boolean;
}

// 프로젝트의 권한을 나타내는 타입
type UserRole = 'Owner' | 'Editor' | 'Viewer';

// 프로젝트의 정보를 나타내는 인터페이스
export interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    role: UserRole;

    progressP0: number;
    progressP1: number;
    progressP2: number;

    lastModified: string;
    updatedAt: string;

    members: Member[];
  };
}

// 권한(Role)에 따른 뱃지 스타일 매핑
const roleStyles: Record<string, string> = {
  Owner: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Editor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Viewer: 'bg-zinc-100 text-zinc-600 border-zinc-200',
};

/**
 * [컴포넌트] 단일 프로젝트 카드 UI
 * - 프로젝트의 제목, 설명, 진행률(P0/P1/P2), 멤버 수, 최근 수정일을 표시합니다.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  // 온라인 상태인 멤버 수 계산 (Derived state)
  const onlineMemberCount = project.members.filter((m) => m.online).length;

  return (
    <Card className="group cursor-pointer bg-white border border-zinc-200 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-200 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug text-zinc-900 tracking-tight group-hover:text-indigo-600 line-clamp-2 transition-colors">
            {project.title}
          </h3>
          <Badge
            variant="outline"
            className={cn(
              'shrink-0 text-[11px] font-medium px-2 py-0.5',
              roleStyles[project.role]
            )}
          >
            {project.role}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-1 flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-zinc-500 truncate">
          {project.description.length > 50
            ? `${project.description.slice(0, 50)}...`
            : project.description}
        </p>

        <div className="flex items-center gap-2 mt-auto">
          {/* P0 */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-red-600">P0</span>
              <span className="text-[10px] text-zinc-400">
                {project.progressP0}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{ width: `${project.progressP0}%` }}
              />
            </div>
          </div>

          {/* P1 */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-yellow-600">
                P1
              </span>
              <span className="text-[10px] text-zinc-400">
                {project.progressP1}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-yellow-500 transition-all"
                style={{ width: `${project.progressP1}%` }}
              />
            </div>
          </div>

          {/* P2 */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-green-600">P2</span>
              <span className="text-[10px] text-zinc-400">
                {project.progressP2}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${project.progressP2}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-zinc-100 bg-zinc-50/30">
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <Users className="h-4 w-4 text-zinc-400" />
          <span>{project.members.length}명의 멤버</span>
          {onlineMemberCount > 0 && (
            <span className="flex items-center gap-1 text-emerald-600 font-medium ml-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {onlineMemberCount} ON
            </span>
          )}
        </div>

        <span className="text-xs text-zinc-400">{project.lastModified}</span>
      </CardFooter>
    </Card>
  );
}
