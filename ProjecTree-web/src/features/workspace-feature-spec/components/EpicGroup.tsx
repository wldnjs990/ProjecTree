import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Node } from '@xyflow/react';
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

  return (
    <AccordionItem value={epic.id} className="border-b-0">
      <AccordionTrigger
        className={cn(
          'hover:no-underline p-0 [&>svg:last-child]:hidden',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2'
        )}
      >
        <div
          aria-label={`에픽: ${data.label}`}
          className={cn(
            'py-3 bg-violet-50 hover:bg-violet-100 transition-colors motion-reduce:transition-none border-b border-violet-200',
            'items-center text-left w-full',
            specGridCols
          )}
        >
          <div className={cn('flex items-center gap-2', indentLevel.EPIC)}>
            <div className="cursor-pointer hover:bg-violet-200 rounded p-0.5 transition-colors">
              <ChevronRight
                className="w-4 h-4 text-violet-500 transition-transform duration-200 group-data-[state=open]:rotate-90"
                aria-hidden="true"
              />
            </div>
            <div
              className="w-2 h-2 rounded-full bg-violet-500"
              aria-hidden="true"
            />
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">
              에픽
            </span>
          </div>
          <div className="flex justify-center">
            <Badge
              className={cn(
                'text-[10px] font-medium border',
                priorityBadge[data.priority]
              )}
            >
              {data.priority}
            </Badge>
          </div>
          <div className="flex justify-center">
            <span
              className="font-semibold text-sm truncate cursor-pointer hover:underline inline-block"
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
              className={cn('text-xs font-normal', statusBadge[data.status])}
            >
              {statusLabel[data.status]}
            </Badge>
          </div>
          <div className="flex justify-center" />
          <div className="flex justify-center">
            {data.assignee ? (
              <Avatar className="w-5 h-5">
                <AvatarFallback className="text-[9px] bg-primary text-primary-foreground">
                  {data.assignee.initials}
                </AvatarFallback>
              </Avatar>
            ) : null}
          </div>
        </div>
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
