import { useState, useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import {
  ChevronLeft,
  ChevronRight,
  MessageSquareMore,
  Search,
} from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';
import { buildProjectTree } from '@/shared/lib/treeUtils';
import { ChatPanel } from '@/features/workspace-chat';
import { ProjectTreeItem } from '@/features/workspace-aside/ProjectTreeItem';

interface LeftSidebarProps {
  workspaceId: string;
  workspaceName?: string;
  className?: string; // Allow external styling (width, etc.)
  nodes: Node[];
  edges: Edge[];
}

export function LeftSidebar({
  workspaceId,
  className,
  nodes,
  edges,
}: LeftSidebarProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const projectData = useMemo(
    () => buildProjectTree(nodes, edges),
    [nodes, edges]
  );
  const toggleLabel = collapsed ? '사이드바 열기' : '사이드바 닫기';
  const tooltipSide = collapsed ? 'right' : 'bottom';
  const toggleButton = (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className={cn(
            'grid h-7 w-7 place-items-center leading-none text-zinc-400 hover:text-[var(--figma-tech-green)] hover:bg-zinc-100/50 transition-colors rounded-md',
            !collapsed && 'opacity-0 group-hover/header:opacity-100 transition-opacity duration-200'
          )}
          aria-label={toggleLabel}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{toggleLabel}</TooltipContent>
    </Tooltip>
  );

  return (
    <aside
      className={cn(
        'group/sidebar relative flex flex-col border-r border-zinc-300/60 bg-gradient-to-b from-white/70 via-white/50 to-white/30 backdrop-blur-2xl transition-all duration-500 ease-out shrink-0',
        collapsed
          ? 'w-16 min-w-16 max-w-16 basis-16'
          : 'w-75 min-w-75 max-w-75 basis-75',
        className
      )}
    >
      {collapsed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center gap-3 pt-4">
          {toggleButton}
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/70 text-zinc-600 shadow-sm hover:bg-white/90 transition-colors"
            aria-label="프로젝트 탐색"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/70 text-zinc-600 shadow-sm hover:bg-white/90 transition-colors"
            aria-label="팀 채팅"
          >
            <MessageSquareMore className="h-4 w-4" />
          </button>
        </div>
      )}
      <ResizablePanelGroup
        orientation="vertical"
        className={cn(
          'flex flex-col h-full w-full rounded-none bg-transparent min-w-0 overflow-hidden',
          collapsed && 'opacity-0 pointer-events-none'
        )}
      >
        {/* Top Panel: Project Explorer */}
        <ResizablePanel
          defaultSize="40%"
          minSize="40px"
          className="min-w-0 min-h-0"
        >
          <div className="flex h-full flex-col min-w-0 w-full overflow-hidden">
            <div
              className={cn(
                'group/header flex items-center justify-between px-4 h-10 border-b border-zinc-300/60 bg-white/60 backdrop-blur-sm',
                collapsed && 'justify-center px-0 border-b-0 bg-transparent'
              )}
            >
              <div className="flex items-center">
                <Search className="h-4 w-4 text-zinc-500" />
                <h2
                  className={cn(
                    'text-sm font-medium text-[#0B0B0B] tracking-tight whitespace-nowrap overflow-hidden transition-[opacity,transform,max-width,margin] duration-300 ease-out',
                    collapsed
                      ? 'max-w-0 opacity-0 translate-x-1 ml-0'
                      : 'max-w-[160px] opacity-100 translate-x-0 ml-2'
                  )}
                >
                  프로젝트 탐색
                </h2>
              </div>
            {!collapsed && (
              <div className="flex items-center">
                {toggleButton}
              </div>
            )}
            </div>
            <ScrollArea
              className={cn(
                'flex-1 min-w-0 w-full max-w-full overflow-x-hidden [&>div>div]:!block [&>div>div]:!min-w-0',
                collapsed && 'hidden'
              )}
            >
              <div className="box-border w-full max-w-full px-2 py-2 overflow-x-hidden">
                {projectData.map((item) => (
                  <ProjectTreeItem
                    key={item.id}
                    item={item}
                    onSelect={(i) => setSelectedId(i.id)}
                    selectedId={selectedId}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className={cn(
            'w-full h-px bg-white/40 after:left-0 after:h-8 after:w-full after:-translate-y-1/2 after:translate-x-0 after:bg-white/40 [&>div]:border-white/40 [&>div]:bg-white/70 [&>div]:text-zinc-400',
            collapsed && 'hidden'
          )}
        />

        {/* Bottom Panel: Team Chat */}
        <ResizablePanel
          defaultSize="60%"
          minSize="40px"
          className="min-w-0 min-h-0"
        >
          <div className="h-full w-full min-w-0">
            {/* ChatPanel already has its own layout, so we just stick it here */}
            {/* Passing "Team Chat" as workspace name to match requirements */}
            <ChatPanel
              workspaceId={workspaceId}
              workspaceName="팀 채팅"
              collapsed={collapsed}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </aside >
  );
}
