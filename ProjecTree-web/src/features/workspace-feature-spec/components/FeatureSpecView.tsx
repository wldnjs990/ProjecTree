import { Notebook, BookOpen, CheckSquare, Pin } from 'lucide-react';
import type { Node, Edge } from '@xyflow/react';
import { transformNodesForSpecView, useNodes, useEdges } from '@/features/workspace-core';
import { EpicGroup } from './EpicGroup';
import { StoryGroup } from './StoryGroup';
import { TaskGroup } from './TaskGroup';
import { specGridCols, mockFeatureSpecNodes, mockFeatureSpecEdges } from '../constants';
import type { NodeData, FeatureSpecViewProps } from '../types';
import { Accordion } from '@/components/ui/accordion';

// 계층 구조로 노드 그룹화 (Edge 기반)
function groupNodesByHierarchy(nodes: Node[], edges: Edge[] = []) {
  const epics = nodes.filter(
    (n) => (n.data as unknown as NodeData).level === 1
  );

  // Edge 기반 자식 노드 찾기 헬퍼 함수
  const getChildren = (parentId: string) => {
    return edges
      .filter((edge) => edge.source === parentId)
      .map((edge) => nodes.find((n) => n.id === edge.target))
      .filter((node): node is Node => node !== undefined);
  };

  return epics.map((epic) => {
    const stories = getChildren(epic.id).filter(
      (n) => (n.data as unknown as NodeData).level === 2
    );

    const storiesWithTasks = stories.map((story) => {
      const tasks = getChildren(story.id).filter(
        (n) => (n.data as unknown as NodeData).level === 3
      );

      const tasksWithAdvanceds = tasks.map((task) => {
        const advanceds = getChildren(task.id).filter(
          (n) => (n.data as unknown as NodeData).level === 4
        );
        return { ...task, advanceds };
      });

      return { ...story, tasks: tasksWithAdvanceds };
    });

    return { ...epic, stories: storiesWithTasks };
  });
}

export function FeatureSpecView({ onNodeClick }: FeatureSpecViewProps) {
  // Zustand 스토어에서 노드/엣지 가져오기
  const realNodes = useNodes();
  const realEdges = useEdges();

  // 개발 환경에서 실제 데이터가 없으면 목데이터 사용
  const nodes = import.meta.env.DEV && realNodes.length === 0
    ? mockFeatureSpecNodes
    : realNodes;

  const edges = import.meta.env.DEV && realEdges.length === 0
    ? mockFeatureSpecEdges
    : realEdges;

  // 데이터 변환
  const transformedNodes = transformNodesForSpecView(nodes);
  const hierarchy = groupNodesByHierarchy(transformedNodes, edges);
  const filteredNodes = transformedNodes.filter(
    (n) => (n.data as NodeData).level > 0
  );

  return (
    <div className="flex flex-col h-full bg-transparent">

      {/* Content area with horizontal scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/30 [&::-webkit-scrollbar-thumb]:bg-zinc-300/50 [&::-webkit-scrollbar-thumb]:hover:bg-zinc-400/60 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="min-w-[1140px]">
          {/* Header row */}
          <div
            className={`py-3 px-4 bg-white/60 backdrop-blur-sm border-b border-white/30 text-xs font-semibold text-zinc-600 shadow-sm ${specGridCols}`}
          >
            <span className="text-center">유형</span>
            <span className="text-center">우선순위</span>
            <span className="text-center">기능명</span>
            <span className="text-center">상태</span>
            <span className="text-center">복잡도</span>
            <span className="text-center">담당자</span>
          </div>

          {/* Hierarchical list */}
          <Accordion type="multiple" defaultValue={[]} className="w-full">
            {hierarchy.map((epic) => (
              <EpicGroup
                key={epic.id}
                epic={epic}
                stories={epic.stories}
                onNodeClick={onNodeClick}
                StoryGroupComponent={(props) => (
                  <StoryGroup {...props} TaskGroupComponent={TaskGroup} />
                )}
              />
            ))}
          </Accordion>
        </div>
      </div>

      {/* Footer */}
      <div className="h-12 border-t border-white/20 bg-white/40 backdrop-blur-md flex items-center justify-between px-4 text-sm text-zinc-600 shadow-sm">
        <span className="font-medium flex-shrink-0">
          <span className="md:hidden">{filteredNodes.length}개</span>
          <span className="hidden md:inline">총 {filteredNodes.length}개 항목</span>
        </span>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1.5">
            <Notebook
              className="w-4 h-4 text-violet-600"
              aria-hidden="true"
            />
            <span>
              <span className="hidden md:inline">에픽{' '}</span>
              {
                transformedNodes.filter(
                  (n) => (n.data as unknown as NodeData).level === 1
                ).length
              }
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen
              className="w-4 h-4 text-lime-600"
              aria-hidden="true"
            />
            <span>
              <span className="hidden md:inline">스토리{' '}</span>
              {
                transformedNodes.filter(
                  (n) => (n.data as unknown as NodeData).level === 2
                ).length
              }
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckSquare
              className="w-4 h-4 text-sky-600"
              aria-hidden="true"
            />
            <span>
              <span className="hidden md:inline">태스크{' '}</span>
              {
                transformedNodes.filter(
                  (n) => (n.data as unknown as NodeData).level === 3
                ).length
              }
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Pin
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
            />
            <span>
              <span className="hidden md:inline">어드밴스{' '}</span>
              {
                transformedNodes.filter(
                  (n) => (n.data as unknown as NodeData).level === 4
                ).length
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
