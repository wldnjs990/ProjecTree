import { useState, useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ProjectTreeItem } from './ProjectTreeItem';
import { ChatPanel } from '@/features/chat/components/ChatPanel';
import { buildProjectTree } from '@/lib/treeUtils';

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

  const projectData = useMemo(
    () => buildProjectTree(nodes, edges),
    [nodes, edges]
  );

  return (
    <aside className={className}>
      <ResizablePanelGroup
        orientation="vertical"
        className="flex flex-col h-full w-full rounded-none border-r bg-white"
      >
        {/* Top Panel: Project Explorer */}
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h2 className="text-sm font-semibold tracking-tight">
                Project Explorer
              </h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
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
          className="w-full h-px after:left-0 after:h-8 after:w-full after:-translate-y-1/2 after:translate-x-0"
        />

        {/* Bottom Panel: Team Chat */}
        <ResizablePanel defaultSize={70} minSize={20}>
          <div className="h-full">
            {/* ChatPanel already has its own layout, so we just stick it here */}
            {/* Passing "Team Chat" as workspace name to match requirements */}
            <ChatPanel workspaceId={workspaceId} workspaceName="Team Chat" />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </aside>
  );
}
