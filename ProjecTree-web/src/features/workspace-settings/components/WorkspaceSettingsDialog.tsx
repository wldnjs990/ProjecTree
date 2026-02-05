import { useEffect, useMemo, useState, useRef } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, Plus, X, Search, FileText, Trash2, Upload } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  getTechStacks,
  updateWorkspace,
  type UpdateWorkspaceRequest,
  type WorkspaceDetailData,
  type TechStackItem,
} from '@/apis/workspace.api';
import { cn } from '@/shared/lib/utils';

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
  startDate: Date | null;
  endDate: Date | null;
  techStacks: number[];
  epics: Epic[];
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
    startDate: null,
    endDate: null,
    techStacks: [],
    epics: [],
  });

  const [techOptions, setTechOptions] = useState<TechStackItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTechMap, setSelectedTechMap] = useState<Map<number, string>>(
    new Map()
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<WorkspaceDetailData['files']>([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!workspaceDetail || !isOpen) return;

    setForm({
      name: workspaceDetail.name ?? '',
      description: workspaceDetail.description ?? '',
      domain: workspaceDetail.domain ?? '',
      purpose: workspaceDetail.purpose ?? PURPOSE_OPTIONS[0].value,
      serviceType: workspaceDetail.serviceType ?? SERVICE_TYPE_OPTIONS[0].value,
      startDate: parseDate(workspaceDetail.startDate),
      endDate: parseDate(workspaceDetail.endDate),
      techStacks: parseTechStacks(workspaceDetail.workspaceTechStacks),
      epics: workspaceDetail.epics ?? [],
    });
    setNewFiles([]);
    setExistingFiles(workspaceDetail.files ?? []);
    setSearchTerm('');
    setShowSuggestions(false);
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
    setForm((prev) => ({
      ...prev,
      epics: [...prev.epics, { name: '', description: '' }],
    }));
  };

  const handleUpdateEpic = (index: number, updates: Partial<Epic>) => {
    setForm((prev) => ({
      ...prev,
      epics: prev.epics.map((epic, i) => (i === index ? { ...epic, ...updates } : epic)),
    }));
  };

  const handleRemoveEpic = (index: number) => {
    setForm((prev) => ({
      ...prev,
      epics: prev.epics.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const requestData: UpdateWorkspaceRequest = {
        name: form.name,
        description: form.description,
        domain: form.domain,
        purpose: form.purpose,
        serviceType: form.serviceType,
        startDate: form.startDate ? format(form.startDate, 'yyyy-MM-dd') : null,
        endDate: form.endDate ? format(form.endDate, 'yyyy-MM-dd') : null,
        workspaceTechStacks: form.techStacks,
        epics: form.epics,
      };

      await updateWorkspace(workspaceId, requestData, newFiles);

      if (onUpdated) {
        onUpdated({
          ...requestData,
          startDate: requestData.startDate ?? null,
          endDate: requestData.endDate ?? null,
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
        className="max-w-[512px] h-[90vh] p-0 overflow-hidden bg-white/90 backdrop-blur-2xl border border-white/60 shadow-[0_20px_48px_-12px_rgba(0,0,0,0.12)] rounded-3xl flex flex-col"
        showCloseButton={false}
      >
        <div className="flex flex-col h-full bg-transparent">
          <DialogHeader className="px-6 pt-6 pb-4 bg-white/50 backdrop-blur-sm border-b border-zinc-100/50">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900">
                워크스페이스 설정
              </DialogTitle>
              <button
                onClick={() => onOpenChange(false)}
                className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-scroll px-6 pt-6 pb-10 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[3px] [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400/50">
            {/* 프로젝트명 */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-bold text-zinc-700">프로젝트명</Label>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                maxLength={20}
                className="h-11 border-zinc-200 bg-zinc-50/50 rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--figma-neon-green)]/20 focus-visible:border-[var(--figma-neon-green)] transition-all font-medium text-zinc-800 placeholder:text-zinc-400"
              />
              <div className="text-right text-xs text-zinc-400">
                {form.name.length}/20
              </div>
            </div>

            {/* 프로젝트 주제 */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-bold text-zinc-700">프로젝트 주제</Label>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                maxLength={50}
                rows={2}
                className="resize-none border-zinc-200 bg-zinc-50/50 rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--figma-neon-green)]/20 focus-visible:border-[var(--figma-neon-green)] transition-all font-medium text-zinc-800 placeholder:text-zinc-400 min-h-[80px]"
              />
              <div className="text-right text-xs text-zinc-400">
                {form.description.length}/50
              </div>
            </div>

            {/* 프로젝트 문서 */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-bold text-zinc-700">프로젝트 문서</Label>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <div className="space-y-3">
                {/* 기존 파일 및 새로 추가된 파일 목록 */}
                {[...existingFiles, ...newFiles.map((f, i) => ({ id: i, orginFileName: f.name, size: f.size }))].length > 0 && (
                  <div className="space-y-2">
                    {existingFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 bg-white/60 border border-zinc-200/80 rounded-xl shadow-sm hover:bg-white transition-colors"
                      >
                        <div className="p-2 bg-red-50 rounded-lg">
                          <FileText className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-800 truncate">
                            {file.orginFileName}
                          </p>
                          <p className="text-xs text-zinc-500">
                            PDF {(file.size / 1024 / 1024).toFixed(1)}MB
                          </p>
                        </div>
                        <button className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
                          <X className="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
                        </button>
                      </div>
                    ))}
                    {newFiles.map((file, idx) => (
                      <div
                        key={`new-${idx}`}
                        className="flex items-center gap-3 p-3 bg-white/60 border border-zinc-200/80 rounded-xl shadow-sm hover:bg-white transition-colors"
                      >
                        <div className="p-2 bg-red-50 rounded-lg">
                          <FileText className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {(file.size / 1024 / 1024).toFixed(1)}MB
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveNewFile(idx)}
                          className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* 업로드 버튼 영역 */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 cursor-pointer hover:bg-zinc-50 hover:border-zinc-300 transition-all group"
                >
                  <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-zinc-500" />
                  </div>
                  <p className="text-sm text-zinc-800 font-bold">문서 업로드</p>
                  <p className="text-xs text-zinc-400 mt-1">파일을 선택하거나 드래그하세요</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                </div>
              </div>
            </div>

            {/* 도메인 */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-bold text-zinc-700">도메인</Label>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <Input
                value={form.domain}
                onChange={(e) => setForm((prev) => ({ ...prev, domain: e.target.value }))}
                maxLength={10}
                className="h-11 border-zinc-200 bg-zinc-50/50 rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--figma-neon-green)]/20 focus-visible:border-[var(--figma-neon-green)] transition-all font-medium text-zinc-800"
              />
              <div className="text-right text-xs text-zinc-400">
                {form.domain.length}/10
              </div>
            </div>

            {/* 기술 스택 */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-700">기술 스택</Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-zinc-400" />
                </div>
                <Input
                  placeholder="사용할 기술스택 검색"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                    setSelectedIndex(0);
                  }}
                  onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="h-11 pl-10 border-zinc-200 bg-zinc-50/50 rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--figma-neon-green)]/20 focus-visible:border-[var(--figma-neon-green)] transition-all text-sm font-medium"
                />
                {showSuggestions && filteredTechs.length > 0 && (
                  <div className="absolute top-full mt-2 max-h-60 w-full overflow-y-auto rounded-xl shadow-xl bg-white border border-zinc-100 z-50 p-1">
                    {filteredTechs.map((tech, index) => (
                      <div
                        key={tech.id}
                        className={cn(
                          "cursor-pointer px-4 py-2.5 text-sm rounded-lg transition-colors font-medium text-zinc-700",
                          index === selectedIndex ? "bg-zinc-100" : "hover:bg-zinc-50"
                        )}
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
                <div className="flex flex-wrap gap-2 p-4 bg-zinc-50/50 border border-zinc-200/50 rounded-xl min-h-[60px]">
                  {form.techStacks.map((techId) => (
                    <Badge
                      key={techId}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-zinc-700 border border-zinc-200 font-bold hover:bg-zinc-50 shadow-sm rounded-lg"
                    >
                      {getTechName(techId)}
                      <button
                        onClick={() => handleRemoveTech(techId)}
                        className="p-0.5 hover:bg-zinc-200 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3 text-zinc-400" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 예상 기간 */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-bold text-zinc-700">예상 기간</Label>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <div className="flex items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 h-11 justify-start text-left font-normal border-zinc-200 bg-zinc-50/50 rounded-xl hover:bg-zinc-50 focus:ring-2 focus:ring-[var(--figma-neon-green)]/20",
                        !form.startDate && "text-zinc-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
                      {form.startDate ? format(form.startDate, 'yyyy년 M월 d일', { locale: ko }) : '시작일'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl border-zinc-200 shadow-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={form.startDate || undefined}
                      onSelect={(date) => setForm((prev) => ({ ...prev, startDate: date || null }))}
                      initialFocus
                      locale={ko}
                      className="rounded-xl bg-white"
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-zinc-400 font-medium">~</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 h-11 justify-start text-left font-normal border-zinc-200 bg-zinc-50/50 rounded-xl hover:bg-zinc-50 focus:ring-2 focus:ring-[var(--figma-neon-green)]/20",
                        !form.endDate && "text-zinc-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
                      {form.endDate ? format(form.endDate, 'yyyy년 M월 d일', { locale: ko }) : '종료일'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl border-zinc-200 shadow-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={form.endDate || undefined}
                      onSelect={(date) => setForm((prev) => ({ ...prev, endDate: date || null }))}
                      initialFocus
                      disabled={(date) => (form.startDate ? date < form.startDate : false)}
                      locale={ko}
                      className="rounded-xl bg-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* 프로젝트 목적 */}
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-bold text-zinc-700">프로젝트 목적</Label>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <RadioGroup
                value={form.purpose}
                onValueChange={(val) => setForm((prev) => ({ ...prev, purpose: val }))}
                className="flex gap-6"
              >
                {PURPOSE_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <RadioGroupItem
                      value={opt.value}
                      id={opt.value}
                      className="text-[var(--figma-tech-green)] border-zinc-300 data-[state=checked]:border-[var(--figma-tech-green)]"
                    />
                    <Label htmlFor={opt.value} className="text-sm font-medium text-zinc-700 cursor-pointer group-hover:text-zinc-900 transition-colors">{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 에픽 정보 */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-zinc-700">에픽 정보</Label>
                <Button
                  onClick={handleAddEpic}
                  className="h-8 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  에픽 추가
                </Button>
              </div>

              <div className="space-y-4">
                {form.epics.map((epic, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-zinc-50/50 border border-zinc-200/60 rounded-2xl space-y-3 group hover:border-[var(--figma-neon-green)]/30 hover:bg-white transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">에픽 {idx + 1}</span>
                      <button
                        onClick={() => handleRemoveEpic(idx)}
                        className="p-1.5 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <Input
                      placeholder="에픽명 (20자 이내)"
                      value={epic.name}
                      onChange={(e) => handleUpdateEpic(idx, { name: e.target.value })}
                      maxLength={20}
                      className="h-10 border-zinc-200 bg-white rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--figma-neon-green)]"
                    />
                    <Textarea
                      placeholder="에픽 상세 설명 (200자 이내)"
                      value={epic.description}
                      onChange={(e) => handleUpdateEpic(idx, { description: e.target.value })}
                      maxLength={200}
                      rows={2}
                      className="resize-none border-zinc-200 bg-white rounded-xl min-h-[72px] focus-visible:ring-1 focus-visible:ring-[var(--figma-neon-green)]"
                    />
                  </div>
                ))}
                {form.epics.length === 0 && (
                  <div className="text-center py-6 text-zinc-400 text-sm bg-zinc-50/30 rounded-xl border border-dashed border-zinc-200">
                    등록된 에픽이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-5 flex items-center justify-end gap-3 border-t border-zinc-100 bg-white/50 backdrop-blur-sm">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-5 h-11 bg-white border-zinc-200 text-zinc-600 font-bold rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 h-11 bg-[var(--figma-neon-green)] text-[var(--figma-tech-green)] font-bold rounded-xl hover:bg-[var(--figma-neon-green)]/90 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
