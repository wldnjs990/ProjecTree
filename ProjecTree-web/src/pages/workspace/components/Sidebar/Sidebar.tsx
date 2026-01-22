import { FilterSection } from './FilterSection';
import { LegendSection } from './LegendSection';

interface SidebarProps {
  nodeTypeFilter: string | null;
  statusFilter: string | null;
  onNodeTypeChange: (value: string | null) => void;
  onStatusChange: (value: string | null) => void;
}

export function Sidebar({
  nodeTypeFilter,
  statusFilter,
  onNodeTypeChange,
  onStatusChange,
}: SidebarProps) {
  return (
    <aside className="w-56 h-full bg-[#FCFCFC] border-r border-[#EEEEEE] flex flex-col z-50">
      <FilterSection
        nodeTypeFilter={nodeTypeFilter}
        statusFilter={statusFilter}
        onNodeTypeChange={onNodeTypeChange}
        onStatusChange={onStatusChange}
      />
      <LegendSection />
    </aside>
  );
}
