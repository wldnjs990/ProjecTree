import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Plus } from 'lucide-react';

interface Epic {
  id: string;
  name: string;
  description: string;
}

interface TeamMember {
  email: string;
  role: string;
}

interface Step4TeamEpicProps {
  data: {
    epics: Epic[];
    teamMembers: TeamMember[];
  };
  onChange: (updates: Partial<Step4TeamEpicProps['data']>) => void;
}

export default function Step4TeamEpic({ data, onChange }: Step4TeamEpicProps) {
  const [epicName, setEpicName] = useState('');
  const [epicDescription, setEpicDescription] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('편집자 - 편집 가능');

  // 에픽 추가
  const handleAddEpic = () => {
    if (epicName.trim()) {
      const newEpic: Epic = {
        id: Date.now().toString(),
        name: epicName,
        description: epicDescription,
      };
      onChange({ epics: [...data.epics, newEpic] });
      setEpicName('');
      setEpicDescription('');
    }
  };

  // 에픽 삭제
  const handleRemoveEpic = (id: string) => {
    onChange({
      epics: data.epics.filter((epic) => epic.id !== id),
    });
  };

  // 팀원 초대
  const handleInviteMember = () => {
    if (memberEmail.trim() && memberEmail.includes('@')) {
      const newMember: TeamMember = {
        email: memberEmail,
        role: memberRole,
      };
      onChange({ teamMembers: [...data.teamMembers, newMember] });
      setMemberEmail('');
      setMemberRole('편집자 - 편집 가능');
    }
  };

  return (
    <div className="space-y-8">
      {/* 초기 에픽 설정 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">초기 에픽 설정</h3>

        {/* 에픽명과 추가 버튼 */}
        <div className="flex gap-2">
          <Input
            placeholder="에픽명 (20자 이내)"
            value={epicName}
            onChange={(e) => setEpicName(e.target.value)}
            maxLength={20}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleAddEpic}
            disabled={!epicName.trim()}
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-1" />
            에픽 추가
          </Button>
        </div>

        {/* 에픽 설명 */}
        <Textarea
          placeholder="에픽 설명 (선택사항)"
          value={epicDescription}
          onChange={(e) => setEpicDescription(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>

      {/* 에픽 목록 */}
      {data.epics.length > 0 && (
        <div className="space-y-2">
          {data.epics.map((epic) => (
            <div
              key={epic.id}
              className="flex items-start justify-between p-3 border rounded-lg bg-gray-50"
            >
              <div className="flex-1">
                <h4 className="font-medium">{epic.name}</h4>
                <p className="text-sm text-gray-600">{epic.description}</p>
              </div>
              <button
                onClick={() => handleRemoveEpic(epic.id)}
                className="ml-2 hover:bg-gray-200 rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 이메일 초대 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">이메일 초대</h3>

        <div className="space-y-2">
          <Input
            type="email"
            placeholder="name@company.com"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>권한</Label>
          <Select value={memberRole} onValueChange={setMemberRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="편집자 - 편집 가능">
                편집자 - 편집 가능
              </SelectItem>
              <SelectItem value="뷰어 - 보기만 가능">
                뷰어 - 보기만 가능
              </SelectItem>
              <SelectItem value="관리자 - 모든 권한">
                관리자 - 모든 권한
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full"
          onClick={handleInviteMember}
          disabled={!memberEmail.trim() || !memberEmail.includes('@')}
        >
          초대 메일 보내기
        </Button>
      </div>

      {/* 초대된 팀원 목록 */}
      {data.teamMembers.length > 0 && (
        <div className="space-y-2">
          <Label>초대된 팀원</Label>
          {data.teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded bg-gray-50"
            >
              <span className="text-sm">{member.email}</span>
              <span className="text-sm text-gray-600">{member.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
