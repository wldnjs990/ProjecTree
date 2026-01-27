import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { Users } from "lucide-react";


export interface Member {
  name: string;
  avatar: string;

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
    updatedAt: string;

    members: Member[];
  };
}



/**
 * [컴포넌트] 단일 프로젝트 카드 UI
 * - 프로젝트의 제목, 설명, 진행률(P0/P1/P2), 멤버 수, 최근 수정일을 표시합니다.
 */
export function ProjectCard({ project }: ProjectCardProps) {


  return (
    <Card className="
  group h-full flex flex-col gap-0
  bg-gradient-to-br from-white/70 via-white/40 to-white/20
  backdrop-blur-2xl
  border border-white/60
  ring-1 ring-white/40 ring-inset
  shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]
  rounded-2xl overflow-hidden 
  transition-all duration-300 
  hover:translate-y-[-4px]
  hover:shadow-[0_12px_40px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(255,255,255,0.6)]
  hover:bg-gradient-to-br hover:from-white/80 hover:to-white/30
  p-0
">
      <CardHeader className="pb-4 pt-5 px-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-['Pretendard'] font-bold text-lg leading-snug text-zinc-900 group-hover:text-[var(--figma-tech-green)] transition-colors line-clamp-2 min-h-[50px]">
            {project.title}
          </h3>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 text-[11px] font-semibold px-2.5 py-0.5 border-0 transition-colors shadow-sm mt-0.5",
              project.role === "Owner"
                // Owner: Forest Glass (Brand Consistent)
                ? "bg-[var(--figma-forest-bg)]/80 backdrop-blur-md text-[var(--figma-forest-deep)]"
                : project.role === "Editor"
                  // Editor: Sky Blue Glass (Balanced)
                  ? "bg-sky-100/50 backdrop-blur-md text-sky-700"
                  // Viewer: Zinc Glass (Balanced)
                  : "bg-zinc-100/50 backdrop-blur-md text-zinc-600"
            )}
          >
            {project.role}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-8 flex-1 flex flex-col gap-5">
        <p className="font-['Pretendard'] text-[14px] leading-relaxed text-zinc-500 line-clamp-2 h-[46px]">
          {project.description}
        </p>

        <div className="flex items-center gap-3 mt-auto">
          {/* P0 */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-600">P0</span>
              <span className="text-[11px] font-medium text-zinc-500">{project.progressP0}%</span>
            </div>
            {/* Track: Glass groove effect */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
              <div
                className="h-full rounded-full bg-rose-500 transition-all duration-500 ease-out"
                style={{ width: `${project.progressP0}%` }}
              />
            </div>
          </div>

          {/* P1 */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-500">P1</span>
              <span className="text-[11px] font-medium text-zinc-500">{project.progressP1}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500 ease-out"
                style={{ width: `${project.progressP1}%` }}
              />
            </div>
          </div>

          {/* P2 */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--figma-forest-accent)]">P2</span>
              <span className="text-[11px] font-medium text-zinc-500">{project.progressP2}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
              <div
                className="h-full rounded-full bg-[var(--figma-forest-accent)] transition-all duration-500 ease-out"
                style={{ width: `${project.progressP2}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-5 py-5 flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 rounded-b-2xl">
        {/* rounded-b-2xl 추가: 부모 Card의 rounded-2xl과 곡률을 맞춰서 빈틈을 없앱니다 */}

        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
          <Users className="h-3.5 w-3.5 text-zinc-400" />
          <span>{project.members.length}명</span>

        </div>

        <span className="text-[11px] text-zinc-400 font-['Inter'] tracking-tight">{project.lastModified}</span>
      </CardFooter>
    </Card>
  );
}
