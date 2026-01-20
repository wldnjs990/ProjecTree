import { useState } from "react";
import { LoungeSidebar, WorkspaceContent } from "./components";

/**
 * [페이지] 워크스페이스 라운지 메인 페이지
 * - 사이드바(LoungeSidebar)와 메인 콘텐츠(WorkspaceContent)를 포함하는 레이아웃 컨테이너
 * - 사이드바의 접힘/펼침 상태(sidebarCollapsed)를 관리하여 자식 컴포넌트에 전달
 */
export default function WorkspaceLoungePage() {
  // 사이드바 접힘 상태 관리 (true: 접힘, false: 펼쳐짐)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* 1. 좌측 사이드바: 네비게이션 및 프로필 설정 */}
      <LoungeSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
      />

      {/* 2. 우측 메인 콘텐츠: 워크스페이스 목록 검색/필터/정렬 */}
      <WorkspaceContent />
    </div>
  );
}
