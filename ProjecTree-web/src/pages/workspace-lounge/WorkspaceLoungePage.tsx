import { useState } from "react";
import { LoungeSidebar, WorkspaceContent } from "./components";
import type { FilterType } from "./types";

/**
 * [페이지] 워크스페이스 라운지 메인 페이지
 * - 사이드바(LoungeSidebar)와 메인 콘텐츠(WorkspaceContent)를 포함하는 레이아웃 컨테이너
 * - 사이드바의 접힘/펼침 상태(sidebarCollapsed)와 필터 상태(filterType)를 관리하여 자식 컴포넌트에 전달
 */
export default function WorkspaceLoungePage() {
  // 사이드바 접힘 상태 관리 (true: 접힘, false: 펼쳐짐)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 필터링 상태 관리 ('all' | 'mine' | 'joined')
  const [filterType, setFilterType] = useState<FilterType>("all");

  return (
    <div className="flex h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-50 via-zinc-50 to-[var(--figma-forest-bg)]/30 overflow-hidden">
      {/* 1. 좌측 사이드바: 네비게이션 및 프로필 설정 */}
      <LoungeSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
        currentFilter={filterType}
        onFilterChange={setFilterType}
      />

      {/* 2. 우측 메인 콘텐츠: 워크스페이스 목록 검색/필터/정렬 */}
      <WorkspaceContent filterType={filterType} />
    </div>
  );
}
