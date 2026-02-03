import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown, Notebook } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Node } from '@xyflow/react';
import { UserAvatar } from '@/shared/components/UserAvatar';
import {
  statusBadge,
  statusLabel,
  priorityBadge,
  specGridCols,
  indentLevel,
} from '../constants/specConfig';
import type { NodeData } from '../types';

interface EpicGroupProps {
  epic: Node;
  stories: Array<Node & { tasks: Array<Node & { advanceds: Node[] }> }>;
  onNodeClick?: (nodeId: string) => void;
  StoryGroupComponent: React.ComponentType<{
    story: Node;
    tasks: Array<Node & { advanceds: Node[] }>;
    onNodeClick?: (nodeId: string) => void;
  }>;
}

export function EpicGroup({
  epic,
  stories,
  onNodeClick,
  StoryGroupComponent,
}: EpicGroupProps) {
  const data = epic.data as unknown as NodeData;

  const epicContent = (
    <div
      aria-label={`에픽: ${data.label}`}
      className={cn(
        'py-3 px-4 bg-violet-50/70 hover:bg-violet-100/80 backdrop-blur-sm transition-all duration-300 motion-reduce:transition-none border-b border-violet-200/50 shadow-sm',
        'items-center text-left w-full',
        specGridCols
      )}
    >
      <div className={cn('flex items-center gap-2', indentLevel.EPIC)}>
        {stories.length > 0 ? (
          <div className="cursor-pointer hover:bg-violet-200 rounded transition-colors">
            <ChevronDown
              className="w-4 h-4 text-violet-500 transition-transform duration-200 -rotate-90 group-data-[state=open]:rotate-0"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="w-4" />
        )}
        <Notebook
          className="w-4 h-4 text-violet-600"
          aria-hidden="true"
        />
        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">
          에픽
        </span>
      </div>
      <div className="flex justify-center">
        <Badge
          className={cn(
            'text-[10px] font-medium border w-10 justify-center',
            priorityBadge[data.priority]
          )}
        >
          {data.priority}
        </Badge>
      </div>
      <div className="flex justify-center">
        <span
          className="font-medium text-sm truncate cursor-pointer hover:underline inline-block"
          onClick={(e) => {
            e.stopPropagation();
            onNodeClick?.(epic.id);
          }}
        >
          {data.label}
        </span>
      </div>
      <div className="flex justify-center">
        <Badge
          className={cn('text-xs font-normal w-12 justify-center border', statusBadge[data.status])}
        >
          {statusLabel[data.status]}
        </Badge>
      </div>
      <div className="flex justify-center" />
      <div className="flex justify-center">
        {data.assignee ? (
          <UserAvatar
            initials={data.assignee.initials}
            color={data.assignee.color}
            size="sm"
          />
        ) : null}
      </div>
    </div>
  );

  if (stories.length === 0) {
    return epicContent;
  }

  return (
    <AccordionItem value={epic.id} className="border-b-0">
      <AccordionTrigger
        className={cn(
          'group hover:no-underline p-0 [&>svg:last-child]:hidden',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2'
        )}
      >
        {epicContent}
      </AccordionTrigger>
      <AccordionContent className="pb-0">
        <Accordion type="multiple" defaultValue={[]} className="w-full">
          {stories.map((story) => (
            <StoryGroupComponent
              key={story.id}
              story={story}
              tasks={story.tasks}
              onNodeClick={onNodeClick}
            />
          ))}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}
