import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

// 이 부분은 프로젝트의 멤버를 나타내는 인터페이스인데 우선 다른데서 쓰일 수 있다는 가정하에
// export를 썼으나, ProjectCard.tsx 보다 다른 곳에 있는 게 더 맞는 거 같음.
// 우선 해당 페이지를 임시로 구현하기 위해 넣었음. 
export interface Member {
  name: string;
  online: boolean;
}

// 프로젝트의 권한을 나타내는 타입
type UserRole = "Owner" | "Editor" | "Viewer";

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

    memberCount: number;
    onlineMemberCount: number;
  };
}

// Tailwind 클래스 문자열을 매핑한 딕셔너리(내가 참여한 프로젝트의 권한 구분을 깔끔하게하기 위함)
const roleStyles: Record<string, string> = {
  Owner: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Editor: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Viewer: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const onlineCount = project.members.filter((m) => m.online).length;

  return (
    <Card className="group cursor-pointer bg-white border border-zinc-200 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug text-zinc-900 tracking-tight group-hover:text-indigo-600 line-clamp-2 transition-colors">
            {project.title}
          </h3>
          <Badge
            variant="outline"
            className={cn("shrink-0 text-[11px] font-medium px-2 py-0.5", roleStyles[project.role])}
          >
            {project.role}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="mb-4 text-sm leading-relaxed text-zinc-500 line-clamp-2">{project.description}</p>

        <div className="flex items-center gap-3">
          {/* P0 - Red */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-red-600">P0</span>
              <span className="text-[10px] text-zinc-400">{project.progressP0}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-red-100">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{ width: `${project.progressP0}%` }}
              />
            </div>
          </div>

          {/* P1 - Yellow */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-yellow-600">P1</span>
              <span className="text-[10px] text-zinc-400">{project.progressP1}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-yellow-100">
              <div
                className="h-full rounded-full bg-yellow-500 transition-all"
                style={{ width: `${project.progressP1}%` }}
              />
            </div>
          </div>

          {/* P2 - Green */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-green-600">P2</span>
              <span className="text-[10px] text-zinc-400">{project.progressP2}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-green-100">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${project.progressP2}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-zinc-100">
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <Users className="h-4 w-4 text-zinc-400" />
          <span>{project.members.length}명의 멤버</span>
          {onlineCount > 0 && (
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {onlineCount}명 온라인
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-400">{project.lastModified}</span>
      </CardFooter>
    </Card>
  );
}
