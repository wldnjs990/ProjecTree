import { Badge } from '@/components/ui/badge';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown, CheckSquare, Pin } from 'lucide-react';
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

interface TaskGroupProps {
  task: Node;
  advanceds: Node[];
}

export function TaskGroup({ task, advanceds }: TaskGroupProps) {
  const data = task.data as unknown as NodeData;

  const taskContent = (
    <div
      aria-label={`태스크: ${data.label}`}
      className={cn(
        'py-3 px-4 bg-sky-50/70 hover:bg-sky-100/80 backdrop-blur-sm transition-all duration-300 motion-reduce:transition-none border-b border-sky-200/50 shadow-sm',
        'items-center text-left w-full',
        specGridCols
      )}
    >
      <div className={cn('flex items-center gap-2', indentLevel.TASK)}>
        {advanceds.length > 0 ? (
          <div className="cursor-pointer hover:bg-sky-200 rounded transition-colors">
            <ChevronDown
              className="w-4 h-4 text-sky-500 transition-transform duration-200 -rotate-90 group-data-[state=open]:rotate-0"
              aria-hidden="true"
            />
          </div>
        ) : (
          <span className="w-4" />
        )}
        <CheckSquare
          className="w-4 h-4 text-sky-600"
          aria-hidden="true"
        />
        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">
          태스크
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
        {data.complexity ? (
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={cn(
                  'text-xs',
                  star <= data.complexity!
                    ? 'text-yellow-500'
                    : 'text-gray-300'
                )}
              >
                ★
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex justify-center">
        {data.assignee ? (
          <UserAvatar
            initials={data.assignee.initials}
            color={data.assignee.color}
            size="sm"
          />
        ) : <span className="text-xs text-gray-400">미정</span>}
      </div>
    </div>
  );

  if (advanceds.length === 0) {
    return taskContent;
  }

  return (
    <AccordionItem value={task.id} className="border-b-0">
      <AccordionTrigger
        className={cn(
          'group hover:no-underline p-0 [&>svg:last-child]:hidden',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2'
        )}
      >
        {taskContent}
      </AccordionTrigger>
      <AccordionContent className="pb-0">
        {advanceds.map((advanced) => {
          const advancedData = advanced.data as unknown as NodeData;
          return (
            <div
              key={advanced.id}
              aria-label={`어드밴스: ${advancedData.label}`}
              className={cn(
                'py-3 px-4 bg-gray-50/70 hover:bg-gray-100/80 backdrop-blur-sm transition-all duration-300 motion-reduce:transition-none border-b border-gray-200/50 shadow-sm',
                'grid items-center',
                specGridCols
              )}
            >
              <div
                className={cn('flex items-center gap-2', indentLevel.ADVANCE)}
              >
                <div className="w-4" />
                <Pin
                  className="w1-4 h-4 text-gray-500"
                  aria-hidden="true"
                />
                <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                  어드밴스
                </span>
              </div>
              <div className="flex justify-center">
                <Badge
                  className={cn(
                    'text-[10px] font-medium border w-10 justify-center',
                    priorityBadge[advancedData.priority]
                  )}
                >
                  {advancedData.priority}
                </Badge>
              </div>
              <div className="flex justify-center w-full min-w-0 px-3">
                <TruncatedLabel
                  text={advancedData.label}
                  className="font-medium text-sm text-center"
                />
              </div>
              <div className="flex justify-center">
                <Badge
                  className={cn(
                    'text-xs font-normal w-12 justify-center border',
                    statusBadge[advancedData.status]
                  )}
                >
                  {statusLabel[advancedData.status]}
                </Badge>
              </div>
              <div className="flex justify-center">
                {advancedData.complexity ? (
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={cn(
                          'text-xs',
                          star <= advancedData.complexity!
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        )}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex justify-center">
                {advancedData.assignee ? (
                  <UserAvatar
                    initials={advancedData.assignee.initials}
                    color={advancedData.assignee.color}
                    size="sm"
                  />
                ) : <span className="text-xs text-gray-400">미정</span>}
              </div>
            </div>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}
