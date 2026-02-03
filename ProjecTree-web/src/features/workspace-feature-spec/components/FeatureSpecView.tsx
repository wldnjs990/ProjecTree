import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
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
      {/* Toolbar */}
      <div className="h-14 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl flex items-center justify-end px-4 gap-4 sticky top-0 z-10 transition-all duration-300 shadow-sm">
        <Button
          variant="outline"
          className="gap-2 bg-white/50 border-white/20 shadow-sm text-zinc-700 hover:bg-white/80 transition-all duration-300 rounded-xl backdrop-blur-sm text-sm font-medium h-9 px-4"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          내보내기
        </Button>
      </div>

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
      <div className="flex-1 overflow-auto">
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

      {/* Footer */}
      <div className="h-12 border-t border-white/20 bg-white/40 backdrop-blur-md flex items-center justify-between px-4 text-sm text-zinc-600 shadow-sm">
        <span className="font-medium">총 {filteredNodes.length}개 항목</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full bg-violet-500"
              aria-hidden="true"
            />
            <span>
              에픽{' '}
              {
                transformedNodes.filter(
                  (n) => (n.data as unknown as NodeData).level === 1
                ).length
              }
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full bg-lime-500"
              aria-hidden="true"
            />
            <span>
              스토리{' '}
              {
                transformedNodes.filter(
                  (n) => (n.data as unknown as NodeData).level === 2
                ).length
              }
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full bg-sky-500"
              aria-hidden="true"
            />
            <span>
              태스크{' '}
              {
                transformedNodes.filter(
                  (n) => (n.data as unknown as NodeData).level === 3
                ).length
              }
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full bg-gray-400"
              aria-hidden="true"
            />
            <span>
              어드밴스{' '}
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
