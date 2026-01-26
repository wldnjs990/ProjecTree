import { FilterSection } from './FilterSection';
import { LegendSection } from './LegendSection';
import { ChatPanel } from '@/features/chat/components/ChatPanel';

interface SidebarProps {
  workspaceId: string;
  workspaceName: string;
  nodeTypeFilter: string | null;
  statusFilter: string | null;
  onNodeTypeChange: (value: string | null) => void;
  onStatusChange: (value: string | null) => void;
}

export function Sidebar({
  workspaceId,
  workspaceName,
  nodeTypeFilter,
  statusFilter,
  onNodeTypeChange,
  onStatusChange,
}: SidebarProps) {
  return (
    <aside className="w-[350px] h-full bg-[#FCFCFC] border-r border-[#EEEEEE] flex flex-col">
      <div className="flex-none">
        <FilterSection
          nodeTypeFilter={nodeTypeFilter}
          statusFilter={statusFilter}
          onNodeTypeChange={onNodeTypeChange}
          onStatusChange={onStatusChange}
        />
        <LegendSection />
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatPanel workspaceId={workspaceId} workspaceName={workspaceName} />
      </div>
    </aside>
  );
}
