import React, { useState, useRef } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Notebook,
  BookOpen,
  CheckSquare,
  Pin,
  FolderOpen,
  Folder,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ServerNodeType } from '@/features/workspace-core';
import { useNodeDetailStore } from '@/features/workspace-core';

export interface ProjectItem {
  id: string;
  type: ServerNodeType;
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
  PROJECT: { icon: FolderOpen, color: 'text-indigo-600' },
  EPIC: { icon: Notebook, color: 'text-violet-600' },
  STORY: { icon: BookOpen, color: 'text-lime-600' },
  TASK: { icon: CheckSquare, color: 'text-sky-600' },
  ADVANCE: { icon: Pin, color: 'text-gray-500' },
};

export function ProjectTreeItem({
  item,
  level = 0,
  onSelect,
  selectedId,
}: ProjectTreeItemProps) {
  const openSidebar = useNodeDetailStore((state) => state.openSidebar);
  const titleRef = useRef<HTMLSpanElement>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(true);
  const IconConfig = TYPE_ICONS[item.type];

  // Project 타입일 경우 isOpen 상태에 따라 아이콘 변경
  let Icon = IconConfig.icon;
  if (item.type === 'PROJECT') {
    Icon = isOpen ? FolderOpen : Folder;
  }

  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedId === item.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    // 상세 사이드바 열기 (fitView는 TreeCanvas에서 처리)
    openSidebar(item.id);
    onSelect?.(item);
  };

  const handleTooltipOpen = () => {
    const el = titleRef.current;
    if (!el) {
      setIsTooltipOpen(false);
      return;
    }
    setIsTooltipOpen(el.scrollWidth > el.clientWidth);
  };

  return (
    <div className="select-none w-full min-w-0">
      <div
        className={cn(
          'flex w-full max-w-full items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-xs group min-w-0 overflow-hidden box-border',
          isSelected
            ? 'bg-accent text-accent-foreground'
            : 'hover:bg-accent/50 text-muted-foreground'
        )}
        style={{ paddingLeft: `${level * 6 + 4}px` }}
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

        {Icon && <Icon className={cn('h-4 w-4', IconConfig.color)} />}
        <Tooltip open={isTooltipOpen}>
          <TooltipTrigger asChild>
            <span
              ref={titleRef}
              className="truncate flex-1 min-w-0 block pr-2"
              onPointerEnter={handleTooltipOpen}
              onPointerLeave={() => setIsTooltipOpen(false)}
              onFocus={handleTooltipOpen}
              onBlur={() => setIsTooltipOpen(false)}
            >
              {item.title}
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {isOpen && hasChildren && (
        <div className="min-w-0 w-full">
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
