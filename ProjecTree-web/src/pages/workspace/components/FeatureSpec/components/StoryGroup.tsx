import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Node } from "@xyflow/react";
import { statusBadge, statusLabel, priorityBadge, specGridCols, indentLevel } from "../constants/specConfig";
import type { NodeData } from "../types";

interface StoryGroupProps {
  story: Node;
  tasks: Array<Node & { advanceds: Node[] }>;
  onNodeClick?: (nodeId: string) => void;
  TaskGroupComponent: React.ComponentType<{
    task: Node;
    advanceds: Node[];
    onNodeClick?: (nodeId: string) => void;
  }>;
}

export function StoryGroup({ story, tasks, onNodeClick, TaskGroupComponent }: StoryGroupProps) {
  const data = story.data as unknown as NodeData;

  return (
    <AccordionItem value={story.id} className="border-b-0">
      <AccordionTrigger
        className={cn(
          "hover:no-underline p-0 [&>svg:last-child]:hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2"
        )}
      >
        <div
          aria-label={`스토리: ${data.label}`}
          className={cn(
            "py-3 bg-lime-50 hover:bg-lime-100 transition-colors motion-reduce:transition-none border-b border-lime-200",
            "items-center text-left w-full",
            specGridCols
          )}
        >
          <div className={cn("flex items-center gap-2", indentLevel.story)}>
            {tasks.length > 0 ? (
              <div className="cursor-pointer hover:bg-lime-200 rounded p-0.5 transition-colors">
                <ChevronRight
                  className="w-4 h-4 text-lime-600 transition-transform duration-200 group-data-[state=open]:rotate-90"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <span className="w-4" />
            )}
            <div className="w-2 h-2 rounded-full bg-lime-500" aria-hidden="true" />
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-lime-100 text-lime-700">스토리</span>
          </div>
          <div className="flex justify-center">
            <Badge className={cn("text-[10px] font-medium border", priorityBadge[data.priority])}>{data.priority}</Badge>
          </div>
          <div className="flex justify-center">
            <span
              className="font-medium text-sm truncate cursor-pointer hover:underline inline-block"
              onClick={(e) => {
                e.stopPropagation();
                onNodeClick?.(story.id);
              }}
            >
              {data.label}
            </span>
          </div>
          <div className="flex justify-center">
            <Badge className={cn("text-xs font-normal", statusBadge[data.status])}>{statusLabel[data.status]}</Badge>
          </div>
          <div className="flex justify-center">
            {data.complexity ? (
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={cn("text-xs", star <= data.complexity! ? "text-yellow-500" : "text-gray-300")}
                  >
                    ★
                  </span>
                ))}
              </div>
            ) : null}
          </div>
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
          {tasks.map((task) => (
            <TaskGroupComponent key={task.id} task={task} advanceds={task.advanceds} onNodeClick={onNodeClick} />
          ))}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}
