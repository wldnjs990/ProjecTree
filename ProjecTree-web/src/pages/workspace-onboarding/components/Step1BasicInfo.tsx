import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Step1BasicInfoProps {
  data: {
    workspaceName: string;
    workspaceKey: string;
    domain: string;
    purpose: string;
  };
  onChange: (updates: Partial<Step1BasicInfoProps['data']>) => void;
}

export default function Step1BasicInfo({
  data,
  onChange,
}: Step1BasicInfoProps) {
  return (
    <div className="space-y-6">
      {/* 워크스페이스명 */}
      <div className="space-y-2">
        <Label htmlFor="workspaceName">워크스페이스명</Label>
        <Input
          id="workspaceName"
          placeholder="Untitled-1"
          value={data.workspaceName}
          onChange={(e) => onChange({ workspaceName: e.target.value })}
        />
      </div>

      {/* 워크스페이스 키 */}
      <div className="space-y-2">
        <Label htmlFor="workspaceKey">워크스페이스 키</Label>
        <Input
          id="workspaceKey"
          placeholder="ex) ASDF"
          value={data.workspaceKey}
          onChange={(e) => onChange({ workspaceKey: e.target.value })}
        />
      </div>

      {/* 도메인 */}
      <div className="space-y-2">
        <Label htmlFor="domain">도메인 선택하세요</Label>
        <Select
          value={data.domain}
          onValueChange={(value) => onChange({ domain: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="도메인을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="여행">여행</SelectItem>
            <SelectItem value="전자상거래">전자상거래</SelectItem>
            <SelectItem value="교육">교육</SelectItem>
            <SelectItem value="헬스케어">헬스케어</SelectItem>
            <SelectItem value="금융">금융</SelectItem>
            <SelectItem value="게임">게임</SelectItem>
            <SelectItem value="기타">기타</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 워크스페이스 목적 */}
      <div className="space-y-2">
        <Label>워크스페이스 목적</Label>
        <RadioGroup
          value={data.purpose}
          onValueChange={(value) => onChange({ purpose: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="study" id="study" />
            <Label htmlFor="study" className="font-normal cursor-pointer">
              학습
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="portfolio" id="portfolio" />
            <Label htmlFor="portfolio" className="font-normal cursor-pointer">
              포트폴리오
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other" className="font-normal cursor-pointer">
              기타
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
