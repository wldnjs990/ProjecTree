import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronDown, BookOpen } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Node } from '@xyflow/react';
import { UserAvatar } from '@/shared/components/UserAvatar';
import { TruncatedLabel } from './TruncatedLabel';
import {
  statusBadge,
  statusLabel,
  priorityBadge,
  specGridCols,
  indentLevel,
} from '../constants/specConfig';
import type { NodeData } from '../types';

interface StoryGroupProps {
  story: Node;
  tasks: Array<Node & { advanceds: Node[] }>;
  TaskGroupComponent: React.ComponentType<{
    task: Node;
    advanceds: Node[];
  }>;
}

export function StoryGroup({
  story,
  tasks,
  TaskGroupComponent,
}: StoryGroupProps) {
  const data = story.data as unknown as NodeData;

  const storyContent = (
    <div
      aria-label={`스토리: ${data.label}`}
      className={cn(
        'py-3 px-4 bg-lime-50/70 hover:bg-lime-100/80 backdrop-blur-sm transition-all duration-300 motion-reduce:transition-none border-b border-lime-200/50 shadow-sm',
        'items-center text-left w-full',
        specGridCols
      )}
    >
      <div className={cn('flex items-center gap-2', indentLevel.STORY)}>
        {tasks.length > 0 ? (
          <div className="cursor-pointer hover:bg-lime-200 rounded transition-colors">
            <ChevronDown
              className="w-4 h-4 text-lime-600 transition-transform duration-200 -rotate-90 group-data-[state=open]:rotate-0"
              aria-hidden="true"
            />
          </div>
        ) : (
          <div className="w-4" />
        )}
        <BookOpen
          className="w-4 h-4 text-lime-600"
          aria-hidden="true"
        />
        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-lime-100 text-lime-700">
          스토리
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
      <div className="flex justify-center w-full min-w-0 px-3">
        <TruncatedLabel
          text={data.label}
          className="font-medium text-sm text-center"
        />
      </div>
      <div className="flex justify-center">
        <Badge
          className={cn('text-xs font-normal w-12 justify-center border', statusBadge[data.status])}
        >
          {statusLabel[data.status]}
        </Badge>
      </div>
      <div className="flex justify-center">
        <span className="text-xs text-gray-300">-</span>
      </div>
      <div className="flex justify-center">
        {data.assignee ? (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <span>
                  <UserAvatar
                    initials={data.assignee.initials}
                    color={data.assignee.color}
                    size="sm"
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <p>{data.assignee.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : <span className="text-xs text-gray-400">미정</span>}
      </div>
    </div>
  );

  if (tasks.length === 0) {
    return storyContent;
  }

  return (
    <AccordionItem value={story.id} className="border-b-0">
      <AccordionTrigger
        className={cn(
          'group hover:no-underline p-0 [&>svg:last-child]:hidden',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2'
        )}
      >
        {storyContent}
      </AccordionTrigger>
      <AccordionContent className="pb-0">
        <Accordion type="multiple" defaultValue={[]} className="w-full">
          {tasks.map((task) => (
            <TaskGroupComponent
              key={task.id}
              task={task}
              advanceds={task.advanceds}
            />
          ))}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}
