import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download } from "lucide-react";
import type { Node, Edge } from "@xyflow/react";
import { transformNodesForSpecView } from "../../utils/transformNodeData";
import { EpicGroup } from "./components/EpicGroup";
import { StoryGroup } from "./components/StoryGroup";
import { TaskGroup } from "./components/TaskGroup";
import { specGridCols } from "./constants/specConfig";
import type { NodeData } from "./types";
import { Accordion } from "@/components/ui/accordion";

interface FeatureSpecViewProps {
  nodes: Node[];
  edges?: Edge[];
  onNodeClick?: (nodeId: string) => void;
}

// 계층 구조로 노드 그룹화 (Edge 기반)
function groupNodesByHierarchy(nodes: Node[], edges: Edge[] = []) {
  const epics = nodes.filter((n) => (n.data as unknown as NodeData).level === 1);

  // Edge 기반 자식 노드 찾기 헬퍼 함수
  const getChildren = (parentId: string) => {
    return edges
      .filter((edge) => edge.source === parentId)
      .map((edge) => nodes.find((n) => n.id === edge.target))
      .filter((node): node is Node => node !== undefined);
  };

  return epics.map((epic) => {
    const stories = getChildren(epic.id).filter((n) => (n.data as unknown as NodeData).level === 2);

    const storiesWithTasks = stories.map((story) => {
      const tasks = getChildren(story.id).filter((n) => (n.data as unknown as NodeData).level === 3);

      const tasksWithAdvanceds = tasks.map((task) => {
        const advanceds = getChildren(task.id).filter((n) => (n.data as unknown as NodeData).level === 4);
        return { ...task, advanceds };
      });

      return { ...story, tasks: tasksWithAdvanceds };
    });

    return { ...epic, stories: storiesWithTasks };
  });
}

export function FeatureSpecView({ nodes, edges = [], onNodeClick }: FeatureSpecViewProps) {
  // 데이터 변환
  const transformedNodes = transformNodesForSpecView(nodes);
  const hierarchy = groupNodesByHierarchy(transformedNodes, edges);
  const filteredNodes = transformedNodes.filter((n) => (n.data as NodeData).level > 0);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="h-14 border-b border-border flex items-center justify-end px-4 gap-4">
        <Button variant="outline" size="sm" className="gap-1.5 bg-transparent">
          <Download className="w-4 h-4" aria-hidden="true" />
          내보내기
        </Button>
      </div>

      {/* Header row */}
      <div className={`py-2 bg-muted/50 border-b text-xs font-medium text-muted-foreground ${specGridCols}`}>
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
      <div className="h-12 border-t border-border flex items-center justify-between px-4 text-sm text-muted-foreground">
        <span>총 {filteredNodes.length}개 항목</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-violet-500" aria-hidden="true" />
            <span>에픽 {transformedNodes.filter((n) => (n.data as unknown as NodeData).level === 1).length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-lime-500" aria-hidden="true" />
            <span>스토리 {transformedNodes.filter((n) => (n.data as unknown as NodeData).level === 2).length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-sky-500" aria-hidden="true" />
            <span>태스크 {transformedNodes.filter((n) => (n.data as unknown as NodeData).level === 3).length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-400" aria-hidden="true" />
            <span>어드밴스 {transformedNodes.filter((n) => (n.data as unknown as NodeData).level === 4).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
