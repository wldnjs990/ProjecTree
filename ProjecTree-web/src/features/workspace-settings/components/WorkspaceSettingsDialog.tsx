import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  getTechStacks,
  updateWorkspace,
  type UpdateWorkspaceRequest,
  type WorkspaceDetailData,
  type TechStackItem,
  type Role,
} from '@/apis/workspace.api';

interface WorkspaceSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: number;
  workspaceDetail: WorkspaceDetailData | null;
  onUpdated?: (detail: Partial<WorkspaceDetailData>) => void;
}

type Epic = { name: string; description: string };

interface WorkspaceSettingsForm {
  name: string;
  description: string;
  domain: string;
  purpose: string;
  serviceType: string;
  identifierPrefix: string;
  startDate: Date | null;
  endDate: Date | null;
  techStacks: number[];
  epics: Epic[];
  memberRoles: Record<string, Role>;
}

const PURPOSE_OPTIONS = [
  { label: '학습', value: '학습' },
  { label: '포트폴리오', value: '포트폴리오' },
  { label: '기타', value: '기타' },
] as const;

const SERVICE_TYPE_OPTIONS = [
  { label: 'WEB', value: 'WEB' },
  { label: 'APP', value: 'APP' },
] as const;

const parseDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parseTechStacks = (value?: number[] | string | null): number[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function WorkspaceSettingsDialog({
  isOpen,
  onOpenChange,
  workspaceId,
  workspaceDetail,
  onUpdated,
}: WorkspaceSettingsDialogProps) {
  const [form, setForm] = useState<WorkspaceSettingsForm>({
    name: '',
    description: '',
    domain: '',
    purpose: PURPOSE_OPTIONS[0].value,
    serviceType: SERVICE_TYPE_OPTIONS[0].value,
    identifierPrefix: '',
    startDate: null,
    endDate: null,
    techStacks: [],
    epics: [],
    memberRoles: {},
  });

  const [techOptions, setTechOptions] = useState<TechStackItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTechMap, setSelectedTechMap] = useState<Map<number, string>>(
    new Map()
  );
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [epicName, setEpicName] = useState('');
  const [epicDescription, setEpicDescription] = useState('');

  const memberInfos = workspaceDetail?.teamInfo?.memberInfos ?? [];
  const allowedRoles: Role[] = ['OWNER', 'EDITOR', 'VIEWER'];
  const membersWithRoles = memberInfos.filter((member) =>
    allowedRoles.includes(member.role as Role)
  );

  useEffect(() => {
    if (!workspaceDetail) return;
    const memberRoles: Record<string, Role> = {};
    membersWithRoles.forEach((member) => {
      if (!member.email) return;
      memberRoles[member.email] = member.role as Role;
    });

    setForm({
      name: workspaceDetail.name ?? '',
      description: workspaceDetail.description ?? '',
      domain: workspaceDetail.domain ?? '',
      purpose: workspaceDetail.purpose ?? PURPOSE_OPTIONS[0].value,
      serviceType:
        workspaceDetail.serviceType ?? SERVICE_TYPE_OPTIONS[0].value,
      identifierPrefix: workspaceDetail.identifierPrefix ?? '',
      startDate: parseDate(workspaceDetail.startDate),
      endDate: parseDate(workspaceDetail.endDate),
      techStacks: parseTechStacks(workspaceDetail.workspaceTechStacks),
      epics: workspaceDetail.epics ?? [],
      memberRoles,
    });
    setFiles([]);
    setSearchTerm('');
    setShowSuggestions(false);
    setSelectedIndex(0);
  }, [workspaceDetail, isOpen]);

  useEffect(() => {
    const fetchTechs = async () => {
      if (!searchTerm.trim()) {
        setTechOptions([]);
        return;
      }
      try {
        const results = await getTechStacks(searchTerm);
        setTechOptions(results);
      } catch (error) {
        console.error('Failed to fetch tech stacks:', error);
      }
    };

    const timer = setTimeout(fetchTechs, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredTechs = useMemo(
    () => techOptions.filter((tech) => !form.techStacks.includes(tech.id)),
    [techOptions, form.techStacks]
  );

  const handleAddTech = (tech: TechStackItem) => {
    if (form.techStacks.includes(tech.id)) return;
    setForm((prev) => ({
      ...prev,
      techStacks: [...prev.techStacks, tech.id],
    }));
    setSelectedTechMap((prev) => new Map(prev).set(tech.id, tech.name));
    setSearchTerm('');
    setShowSuggestions(false);
    setSelectedIndex(0);
  };

  const handleRemoveTech = (techId: number) => {
    setForm((prev) => ({
      ...prev,
      techStacks: prev.techStacks.filter((id) => id !== techId),
    }));
  };

  const getTechName = (id: number) => {
    return (
      selectedTechMap.get(id) ||
      techOptions.find((t) => t.id === id)?.name ||
      `Tech ${id}`
    );
  };

  const handleAddEpic = () => {
    if (!epicName.trim()) return;
    setForm((prev) => ({
      ...prev,
      epics: [
        ...prev.epics,
        { name: epicName.trim(), description: epicDescription },
      ],
    }));
    setEpicName('');
    setEpicDescription('');
  };

  const handleRemoveEpic = (index: number) => {
    setForm((prev) => ({
      ...prev,
      epics: prev.epics.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const requestData: UpdateWorkspaceRequest = {
        memberRoles: form.memberRoles,
        domain: form.domain,
        name: form.name,
        description: form.description,
        purpose: form.purpose,
        serviceType: form.serviceType,
        identifierPrefix: form.identifierPrefix,
        startDate: form.startDate
          ? form.startDate.toISOString().split('T')[0]
          : null,
        endDate: form.endDate
          ? form.endDate.toISOString().split('T')[0]
          : null,
        workspaceTechStacks: form.techStacks,
        epics: form.epics,
      };

      await updateWorkspace(workspaceId, requestData, files);

      const updatedMemberInfos = membersWithRoles.map((member) =>
        member.email
          ? { ...member, role: form.memberRoles[member.email] ?? member.role }
          : member
      );

      if (onUpdated) {
        onUpdated({
          name: form.name,
          description: form.description,
          domain: form.domain,
          purpose: form.purpose,
          serviceType: form.serviceType,
          identifierPrefix: form.identifierPrefix,
          startDate: requestData.startDate ?? null,
          endDate: requestData.endDate ?? null,
          workspaceTechStacks: form.techStacks,
          epics: form.epics,
          teamInfo: workspaceDetail?.teamInfo
            ? {
                ...workspaceDetail.teamInfo,
                memberInfos: updatedMemberInfos,
              }
            : workspaceDetail?.teamInfo,
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update workspace:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[512px] max-w-[calc(100%-2rem)] h-[90vh] p-0 overflow-hidden"
        showCloseButton
      >
        <div className="flex flex-col h-full min-h-0">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-[#E4E4E4]">
            <DialogTitle className="text-[20px] text-[#0B0B0B]">
              워크스페이스 설정
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-6">
            <div className="space-y-2">
              <Label className="text-sm text-[#0B0B0B] font-medium">
                프로젝트명 <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                maxLength={20}
              />
              <div className="text-right text-xs text-[#636363]">
                {form.name.length}/20
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#0B0B0B] font-medium">
                프로젝트 설명 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                maxLength={50}
                rows={3}
                className="resize-none"
              />
              <div className="text-right text-xs text-[#636363]">
                {form.description.length}/50
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#0B0B0B] font-medium">
                도메인 <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.domain}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, domain: e.target.value }))
                }
                maxLength={10}
              />
              <div className="text-right text-xs text-[#636363]">
                {form.domain.length}/10
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#0B0B0B] font-medium">
                기술 스택
              </Label>
              <div className="relative">
                <Input
                  placeholder="사용할 기술스택 검색"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                    setSelectedIndex(0);
                  }}
                  onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  onKeyDown={(e) => {
                    if (!showSuggestions || filteredTechs.length === 0) return;
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setSelectedIndex((prev) =>
                        prev < filteredTechs.length - 1 ? prev + 1 : prev
                      );
                    }
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                    }
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (filteredTechs[selectedIndex]) {
                        handleAddTech(filteredTechs[selectedIndex]);
                      }
                    }
                  }}
                />
                {showSuggestions && filteredTechs.length > 0 && (
                  <div className="absolute top-full mt-1 max-h-60 w-full overflow-y-auto rounded-lg shadow-xl bg-white border border-[#E4E4E4] z-50">
                    {filteredTechs.map((tech, index) => (
                      <div
                        key={tech.id}
                        className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                          index === selectedIndex
                            ? 'bg-[#F3F4F6]'
                            : 'hover:bg-[#F3F4F6]'
                        }`}
                        onClick={() => handleAddTech(tech)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        {tech.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {form.techStacks.length > 0 && (
                <div className="flex flex-wrap gap-2 rounded-lg p-3 bg-[#F3F4F6] border border-[#E4E4E4]">
                  {form.techStacks.map((techId) => (
                    <Badge
                      key={techId}
                      variant="secondary"
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white text-[#0B0B0B] border border-[#E4E4E4]"
                    >
                      {getTechName(techId)}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTech(techId);
                        }}
                        className="rounded-full p-0.5 hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#0B0B0B] font-medium">
                예상 기간
              </Label>
              <div className="flex items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`flex-1 justify-start text-left font-normal ${
                        !form.startDate && 'text-muted-foreground'
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.startDate ? (
                        format(form.startDate, 'PPP', { locale: ko })
                      ) : (
                        <span>시작일</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.startDate || undefined}
                      onSelect={(date) =>
                        setForm((prev) => ({
                          ...prev,
                          startDate: date || null,
                        }))
                      }
                      initialFocus
                      locale={ko}
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-[#636363]">~</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`flex-1 justify-start text-left font-normal ${
                        !form.endDate && 'text-muted-foreground'
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.endDate ? (
                        format(form.endDate, 'PPP', { locale: ko })
                      ) : (
                        <span>종료일</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.endDate || undefined}
                      onSelect={(date) =>
                        setForm((prev) => ({
                          ...prev,
                          endDate: date || null,
                        }))
                      }
                      initialFocus
                      disabled={(date) =>
                        form.startDate ? date < form.startDate : false
                      }
                      locale={ko}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#0B0B0B] font-medium">
                프로젝트 목적
              </Label>
              <RadioGroup
                value={form.purpose}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, purpose: value }))
                }
                className="flex gap-4"
              >
                {PURPOSE_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#0B0B0B] font-medium">
                서비스 타입
              </Label>
              <RadioGroup
                value={form.serviceType}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, serviceType: value }))
                }
                className="flex gap-4"
              >
                {SERVICE_TYPE_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#0B0B0B] font-medium">
                프로젝트 Prefix
              </Label>
              <Input
                value={form.identifierPrefix}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    identifierPrefix: e.target.value.toUpperCase(),
                  }))
                }
                maxLength={5}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#0B0B0B] font-medium">
                  에픽 정보
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddEpic}
                  disabled={!epicName.trim()}
                  className="h-8 px-3"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  에픽 추가
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="에픽명"
                  value={epicName}
                  onChange={(e) => setEpicName(e.target.value)}
                  maxLength={20}
                />
                <Textarea
                  placeholder="에픽 설명"
                  value={epicDescription}
                  onChange={(e) => setEpicDescription(e.target.value)}
                  maxLength={50}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {form.epics.length > 0 && (
                <div className="flex flex-col gap-2">
                  {form.epics.map((epic, index) => (
                    <div
                      key={`${epic.name}-${index}`}
                      className="flex items-start justify-between rounded-lg p-3 bg-white border border-[#E4E4E4] shadow-sm"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#0B0B0B]">
                          {epic.name}
                        </div>
                        <div className="text-xs text-[#636363]">
                          {epic.description}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveEpic(index)}
                        className="ml-2 rounded-full p-1 hover:bg-black/10 transition-colors"
                      >
                        <X className="h-4 w-4 text-[#666]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#0B0B0B] font-medium">
                팀 멤버 권한
              </Label>
              <div className="space-y-2">
                {membersWithRoles.map((member) => {
                  const email = member.email;
                  if (!email) return null;
                  return (
                    <div
                      key={email}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="text-sm text-[#0B0B0B]">
                        {member.nickname
                          ? `${member.nickname} (${email})`
                          : email}
                      </div>
                      <Select
                        value={form.memberRoles[email] ?? (member.role as Role)}
                        onValueChange={(value: Role) =>
                          setForm((prev) => ({
                            ...prev,
                            memberRoles: {
                              ...prev.memberRoles,
                              [email]: value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OWNER">OWNER</SelectItem>
                          <SelectItem value="EDITOR">EDITOR</SelectItem>
                          <SelectItem value="VIEWER">VIEWER</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#0B0B0B] font-medium">
                프로젝트 문서
              </Label>
              <Input
                type="file"
                multiple
                onChange={(e) =>
                  setFiles(e.target.files ? Array.from(e.target.files) : [])
                }
              />
              {files.length > 0 && (
                <div className="text-xs text-[#636363]">
                  {files.length}개 파일 선택됨
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#E4E4E4] bg-[#F7F7F7]">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              취소
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
