import { memo } from 'react';
import type { Node, NodeProps } from '@xyflow/react';
import type { FlowNodeData } from '@/features/workspace-core';
import { WorkNode } from './WorkNode';
import {
  PreviewNode as PreviewNodeCard,
  type PreviewNodeData,
} from './PreviewNode';

/** Node fixed size */
export const NODE_DIMENSIONS = {
  width: 180,
  height: 100,
} as const;

export type ProjectNodeType = Node<FlowNodeData, 'PROJECT'>;
export type EpicNodeType = Node<FlowNodeData, 'EPIC'>;
export type StoryNodeType = Node<FlowNodeData, 'STORY'>;
export type TaskNodeType = Node<FlowNodeData, 'TASK'>;
export type AdvanceNodeType = Node<FlowNodeData, 'ADVANCE'>;
export type PreviewNodeType = Node<PreviewNodeData, 'PREVIEW'>;

function ProjectNodeComponent({ id, data, selected }: NodeProps<ProjectNodeType>) {
  return <WorkNode id={id} data={data} selected={selected} nodeType="PROJECT" />;
}

function EpicNodeComponent({ id, data, selected }: NodeProps<EpicNodeType>) {
  return <WorkNode id={id} data={data} selected={selected} nodeType="EPIC" />;
}

function StoryNodeComponent({ id, data, selected }: NodeProps<StoryNodeType>) {
  return <WorkNode id={id} data={data} selected={selected} nodeType="STORY" />;
}

function TaskNodeComponent({ id, data, selected }: NodeProps<TaskNodeType>) {
  return <WorkNode id={id} data={data} selected={selected} nodeType="TASK" />;
}

function AdvanceNodeComponent({ id, data, selected }: NodeProps<AdvanceNodeType>) {
  return <WorkNode id={id} data={data} selected={selected} nodeType="ADVANCE" />;
}

function PreviewNodeComponent({ id, data }: NodeProps<PreviewNodeType>) {
  return <PreviewNodeCard id={id} data={data} />;
}

export const ProjectNode = memo(ProjectNodeComponent);
export const EpicNode = memo(EpicNodeComponent);
export const StoryNode = memo(StoryNodeComponent);
export const TaskNode = memo(TaskNodeComponent);
export const AdvancedNode = memo(AdvanceNodeComponent);
export const PreviewNode = memo(PreviewNodeComponent);
