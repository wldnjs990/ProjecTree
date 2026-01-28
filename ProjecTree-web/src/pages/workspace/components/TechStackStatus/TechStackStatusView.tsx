import { useState, useMemo } from 'react';
import { Layers, GitBranch, AlertCircle } from 'lucide-react';
import { SummaryCard } from './components/SummaryCard';
import { FilterSection } from './components/FilterSection';
import { NodeMappingList } from './components/NodeMappingList';
import {
  mockTechStackSummary,
  mockTechStackMappings,
} from '../../constants/mockData';
import type { NodeLevel, TechStackNode } from './types';
import { useNodes } from '../../stores/nodeStore';

interface TechStackStatusViewProps {
  onNodeClick?: (nodeId: string) => void;
}

/**
 * 기술 스택 현황 페이지 메인 컴포넌트
 *
 * 구조:
 * 1. Summary Cards (상단 3개 통계 카드)
 * 2. Filter Section (레벨 토글 + 정렬/조건 드롭다운)
 * 3. Node Mapping List (노드 리스트 테이블)
 */
export function TechStackStatusView({ onNodeClick }: TechStackStatusViewProps) {
  // Zustand 스토어에서 노드 가져오기
  const nodes = useNodes();

  // 필터 상태 관리
  const [selectedLevel, setSelectedLevel] = useState<NodeLevel | 'all'>('task');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');

  // 노드 데이터 변환 및 필터링
  const techStackNodes = useMemo(() => {
    // Task(Level 3)와 Advanced(Level 4) 노드만 필터링
    const filteredNodes = nodes.filter((node) => {
      const nodeType = node.type;
      if (selectedLevel === 'task') return nodeType === 'task';
      if (selectedLevel === 'advanced') return nodeType === 'advanced';
      return nodeType === 'task' || nodeType === 'advanced';
    });

    // mockTechStackMappings와 조합
    const combined: TechStackNode[] = filteredNodes.map((node) => {
      const mapping = mockTechStackMappings.find((m) => m.nodeId === node.id);
      return {
        id: node.id,
        title: (node.data.title as string) || '',
        priority: (node.data.priority as 'P0' | 'P1' | 'P2') || 'P2',
        status:
          (node.data.status as 'progress' | 'pending' | 'completed') ||
          'pending',
        confirmedTechs: mapping?.confirmedTechs || [],
        lastUpdated: mapping?.lastUpdated || new Date().toISOString(),
        level: node.type === 'task' ? ('task' as const) : ('advanced' as const),
      };
    });

    // 정렬 적용
    if (sortBy === 'recent') {
      combined.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
    } else if (sortBy === 'priority') {
      const priorityOrder = { P0: 0, P1: 1, P2: 2 };
      combined.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    return combined;
  }, [nodes, selectedLevel, sortBy]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Summary Cards */}
      <div className="p-6 border-b bg-background">
        <div className="grid grid-cols-3 gap-6">
          {/* 기술 스택 수 */}
          <SummaryCard
            title="기술 스택 수"
            value={`${mockTechStackSummary.totalTechStacks}개`}
            change={mockTechStackSummary.weeklyChange}
            icon={Layers}
          />

          {/* 매핑된 노드 수 */}
          <SummaryCard
            title="매핑된 노드 수"
            value={`${mockTechStackSummary.mappedNodes}개`}
            change={mockTechStackSummary.mappedNodesChange}
            icon={GitBranch}
          />

          {/* P0 비중 */}
          <SummaryCard
            title="P0 비중"
            value={`${mockTechStackSummary.p0Percentage}%`}
            icon={AlertCircle}
            subtitle={`${mockTechStackSummary.p0Count}개 노드`}
          />
        </div>
      </div>

      {/* Filter Section */}
      <FilterSection
        selectedLevel={selectedLevel}
        sortBy={sortBy}
        filterBy={filterBy}
        onLevelChange={setSelectedLevel}
        onSortChange={setSortBy}
        onFilterChange={setFilterBy}
      />

      {/* Node Mapping List */}
      <div className="flex-1 overflow-auto">
        <NodeMappingList nodes={techStackNodes} onNodeClick={onNodeClick} />
      </div>
    </div>
  );
}
