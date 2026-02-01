import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Assignee } from '../types';

// 임시 팀원 목록 (나중에 API에서 가져올 예정)
const teamMembers: Assignee[] = [
  { id: '1', name: '김민수' },
  { id: '2', name: '이지은' },
  { id: '3', name: '박현우' },
];

// 담당자 선택 컴포넌트 (편집 모드)
interface AssigneeSelectProps {
  value: Assignee | null;
  onChange?: (value: Assignee | null) => void;
}
function AssigneeSelect({ value, onChange }: AssigneeSelectProps) {
  const handleChange = (selectedId: string) => {
    if (selectedId === 'none') {
      onChange?.(null);
    } else {
      const member = teamMembers.find((m) => m.id === selectedId);
      if (member) {
        onChange?.(member);
      }
    }
  };

  return (
    <Select value={value?.id || 'none'} onValueChange={handleChange}>
      <SelectTrigger className="w-full h-9 text-sm">
        <SelectValue placeholder="담당자 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <span className="text-muted-foreground">미지정</span>
        </SelectItem>
        {teamMembers.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#1C69E3] flex items-center justify-center text-xs text-white">
                {member.name?.slice(0, 2) ?? '??'}
              </div>
              <span>{member.name ?? '알 수 없음'}</span>
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
  // assignee가 없거나 name이 없으면 미지정 표시
  if (!assignee || !assignee.name) {
    return <span className="text-sm text-muted-foreground">미지정</span>;
  }

  return (
    <div className="flex items-center gap-2 px-2 py-2 bg-[rgba(238,238,238,0.5)] rounded-md">
      <div className="w-6 h-6 rounded-full bg-[#1C69E3] flex items-center justify-center text-xs text-white">
        {assignee.name.slice(0, 2)}
      </div>
      <span className="text-sm text-[#0B0B0B]">{assignee.name}</span>
    </div>
  );
}

// 병합 =========================================================
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
  else return <SelectedAssignee assignee={value} />;
};
