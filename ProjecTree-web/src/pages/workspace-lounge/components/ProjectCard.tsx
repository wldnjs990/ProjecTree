import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { Users } from "lucide-react";


export interface Member {
  name: string;
  avatar: string;
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
    updatedAt: string;

    members: Member[];
  };
}



/**
 * [컴포넌트] 단일 프로젝트 카드 UI
 * - 프로젝트의 제목, 설명, 진행률(P0/P1/P2), 멤버 수, 최근 수정일을 표시합니다.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  // 온라인 상태인 멤버 수 계산 (Deriv<Card classNameed state)
  const onlineMemberCount = project.members.filter((m) => m.online).length;

  return (
    <Card className="
  group h-full flex flex-col 
  
  /* [핵심 1] 배경: 단색 대신 그라데이션 + 투명도 대폭 낮춤 (위는 40%, 아래는 10%) */
  bg-gradient-to-br from-white/40 to-white/10 
  
  /* [핵심 2] 블러: xl로 충분하지만, 배경이 잘 비치게 됨 */
  backdrop-blur-xl 
  
  /* [핵심 3] 테두리: 더 얇고 선명하게 (경계면 강조) */
  border border-white/50 
  
  /* [핵심 4] 그림자: 외부 그림자 + 내부 광택(inset) 추가로 두께감 표현 */
  shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.3)]
  
  rounded-2xl overflow-hidden 
  transition-all duration-300 
  
  /* 호버 효과: 마우스 올리면 조금 더 불투명해지며 빛나는 느낌 */
  hover:bg-gradient-to-br hover:from-white/60 hover:to-white/20
  hover:shadow-[0_20px_40px_rgba(74,222,128,0.2),inset_0_0_0_1px_rgba(255,255,255,0.5)] 
  hover:border-white/80 
  hover:-translate-y-1
  
  p-0
">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-['Pretendard'] font-bold text-lg leading-snug text-zinc-900 group-hover:text-[var(--figma-tech-green)] transition-colors line-clamp-2">
            {project.title}
          </h3>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 text-[11px] font-semibold px-2.5 py-0.5 border transition-colors shadow-sm",
              project.role === "Owner"
                // Owner badge also gets a mini-glass effect
                ? "bg-[var(--figma-forest-bg)]/80 backdrop-blur-sm text-[var(--figma-forest-deep)] border-[var(--figma-forest-accent)]/30"
                : project.role === "Editor"
                  ? "bg-emerald-50/80 backdrop-blur-sm text-emerald-700 border-emerald-200/50"
                  : "bg-zinc-100/80 backdrop-blur-sm text-zinc-600 border-zinc-200/50"
            )}
          >
            {project.role}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 flex-1 flex flex-col gap-5">
        <p className="font-['Pretendard'] text-[14px] leading-relaxed text-zinc-500 line-clamp-2 min-h-[42px]">
          {project.description}
        </p>

        <div className="flex items-center gap-3 mt-auto">
          {/* P0 */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-600">P0</span>
              <span className="text-[11px] font-medium text-zinc-400">{project.progressP0}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-rose-500 transition-all duration-500 ease-out group-hover:shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                style={{ width: `${project.progressP0}%` }}
              />
            </div>
          </div>

          {/* P1 */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-500">P1</span>
              <span className="text-[11px] font-medium text-zinc-400">{project.progressP1}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500 ease-out group-hover:shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                style={{ width: `${project.progressP1}%` }}
              />
            </div>
          </div>

          {/* P2 */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--figma-forest-accent)]">P2</span>
              <span className="text-[11px] font-medium text-zinc-400">{project.progressP2}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-[var(--figma-forest-accent)] transition-all duration-500 ease-out group-hover:shadow-[0_0_8px_rgba(76,175,80,0.4)]"
                style={{ width: `${project.progressP2}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-5 py-3 flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 rounded-b-2xl">
        {/* rounded-b-2xl 추가: 부모 Card의 rounded-2xl과 곡률을 맞춰서 빈틈을 없앱니다 */}

        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
          <Users className="h-3.5 w-3.5 text-zinc-400" />
          <span>{project.members.length}</span>
          {onlineMemberCount > 0 && (
            <span className="flex items-center gap-1 text-[var(--figma-forest-accent)] text-[10px] font-bold ml-1.5 bg-[var(--figma-forest-bg)] px-1.5 py-0.5 rounded-full border border-[var(--figma-forest-accent)]/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              {onlineMemberCount} ON
            </span>
          )}
        </div>

        <span className="text-[10px] text-zinc-400 font-['Inter'] tracking-tight">{project.lastModified}</span>
      </CardFooter>
    </Card>
  );
}
