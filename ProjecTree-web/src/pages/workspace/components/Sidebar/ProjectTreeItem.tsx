import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Box,
  Bookmark,
  CheckSquare,
  Cpu,
  Plus,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type ProjectItemType =
  | 'project'
  | 'epic'
  | 'story'
  | 'task'
  | 'advanced';

export interface ProjectItem {
  id: string;
  type: ProjectItemType;
  title: string;
  children?: ProjectItem[];
}

interface ProjectTreeItemProps {
  item: ProjectItem;
  level?: number;
  onSelect?: (item: ProjectItem) => void;
  selectedId?: string | null;
}

const TYPE_ICONS = {
  project: { icon: Briefcase, color: 'text-indigo-600' },
  epic: { icon: Box, color: 'text-purple-500' },
  story: { icon: Bookmark, color: 'text-blue-500' },
  task: { icon: CheckSquare, color: 'text-green-500' },
  advanced: { icon: Cpu, color: 'text-orange-500' },
};

export function ProjectTreeItem({
  item,
  level = 0,
  onSelect,
  selectedId,
}: ProjectTreeItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const IconConfig = TYPE_ICONS[item.type];
  const Icon = IconConfig.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedId === item.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    onSelect?.(item);
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-sm group',
          isSelected
            ? 'bg-accent text-accent-foreground'
            : 'hover:bg-accent/50 text-muted-foreground'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        <div
          className={cn(
            'p-0.5 rounded-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors',
            !hasChildren && 'invisible'
          )}
          onClick={handleToggle}
        >
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </div>

        <Icon className={cn('h-4 w-4', IconConfig.color)} />
        <span className="truncate flex-1">{item.title}</span>

        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Add child to', item.id);
          }}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {isOpen && hasChildren && (
        <div>
          {item.children!.map((child) => (
            <ProjectTreeItem
              key={child.id}
              item={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
