import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Assignee } from '../types';
import { useWorkspaceDetail } from '@/features/workspace-core';

// 담당자 선택 컴포넌트 (편집 모드)
interface AssigneeSelectProps {
  value: Assignee | null;
  onChange?: (value: Assignee | null) => void;
}
function AssigneeSelect({ value, onChange }: AssigneeSelectProps) {
  const workspaceDetail = useWorkspaceDetail();

  const teamMembers = useMemo<Assignee[]>(() => {
    const members = workspaceDetail?.teamInfo?.memberInfos ?? [];
    const result: Assignee[] = [];
    for (const member of members) {
      const rawId = member.memberId ?? member.id;
      const numericId = Number(rawId);
      const name = member.nickname ?? member.name ?? member.email ?? '';
      if (!Number.isFinite(numericId) || !name) continue;
      result.push({ id: String(numericId), name });
    }
    return result;
  }, [workspaceDetail]);

  const displayName = value?.name || value?.nickname || '';
  const selectedId = value?.id ? String(value.id) : 'none';

  const options = useMemo<Assignee[]>(() => {
    if (selectedId === 'none') return teamMembers;
    const exists = teamMembers.some((member) => member.id === selectedId);
    if (exists) return teamMembers;
    const fallbackName = displayName || `ID ${selectedId}`;
    return [{ id: selectedId, name: fallbackName }, ...teamMembers];
  }, [teamMembers, displayName, selectedId]);

  const handleChange = (id: string) => {
    if (id === 'none') {
      onChange?.(null);
      return;
    }
    const member = options.find((m) => m.id === id);
    if (member) {
      onChange?.(member);
    }
  };

  return (
    <Select value={selectedId} onValueChange={handleChange}>
      <SelectTrigger className="w-full h-9 text-sm">
        <SelectValue placeholder="담당자 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <span className="text-muted-foreground">미지정</span>
        </SelectItem>
        {options.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#1C69E3] flex items-center justify-center text-xs text-white">
                {member.name?.slice(0, 2) ?? '??'}
              </div>
              <span>{member.name ?? '이름없음'}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// 선택된 담당자 표시 컴포넌트 (조회 모드)
interface SelectedAssigneeProps {
  assignee: Assignee | null;
}
function SelectedAssignee({ assignee }: SelectedAssigneeProps) {
  const display = assignee?.name || assignee?.nickname || '';
  // assignee가 없거나 표시할 이름이 없으면 미지정 표시
  if (!display) {
    return <span className="text-sm text-muted-foreground">미지정</span>;
  }

  return (
    <div className="flex items-center gap-2 px-2 py-2 bg-[rgba(238,238,238,0.5)] rounded-md">
      <div className="w-6 h-6 rounded-full bg-[#1C69E3] flex items-center justify-center text-xs text-white">
        {display.slice(0, 2)}
      </div>
      <span className="text-sm text-[#0B0B0B]">{display}</span>
    </div>
  );
}

// 종합 =========================================================
interface NodeAssigneeProps {
  value: Assignee | null;
  onChange?: (value: Assignee | null) => void;
  isEdit: boolean;
}
export const NodeAssignee = ({
  value,
  onChange,
  isEdit,
}: NodeAssigneeProps) => {
  if (isEdit) return <AssigneeSelect value={value} onChange={onChange} />;
  return <SelectedAssignee assignee={value} />;
};
