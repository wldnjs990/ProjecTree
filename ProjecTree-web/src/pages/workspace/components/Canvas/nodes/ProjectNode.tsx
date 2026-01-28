import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { StatusTag } from "@/components/custom/StatusTag";
import {
  PriorityBadge,
  type Priority,
} from "@/components/custom/PriorityBadge";

export interface ProjectNodeData extends Record<string, unknown> {
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority?: Priority;
}

export type ProjectNodeType = Node<ProjectNodeData, "project">;

function ProjectNodeComponent({ data, selected }: NodeProps<ProjectNodeType>) {
  const nodeData = data;

  return (
    <div
      className={cn(
        "relative bg-[#F5F3FF] rounded-2xl border-2 border-[#90A1B9] shadow-md p-3 min-w-40",
        selected && "ring-2 ring-[#90A1B9] ring-offset-2",
      )}
    >
      {/* Priority Badge */}
      {nodeData.priority && (
        <div className="absolute -top-2 -left-2">
          <PriorityBadge priority={nodeData.priority} />
        </div>
      )}

      {/* Tags */}
      <div className="flex gap-1.5 mb-2">
        <StatusTag type="project" />
        <StatusTag type={nodeData.status} />
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-[#0B0B0B]">{nodeData.title}</p>

      {/* Handle for connections - Edge color: #8B5CF6 (project→epic) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-[#8B5CF6] border-2 border-white"
      />
    </div>
  );
}

export const ProjectNode = memo(ProjectNodeComponent);
