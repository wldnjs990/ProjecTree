import { useEffect, useMemo, useState, useRef } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, Plus, X, Search, FileText, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
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

// ... (existing imports)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DOMAIN_OPTIONS } from '@/shared/constants/workspace';



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
    purpose: '',
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 도메인 관련 상태 및 로직
  const isCustomDomain =
    form.domain === '기타' ||
    (!!form.domain && !DOMAIN_OPTIONS.includes(form.domain as any));

  const [customDomain, setCustomDomain] = useState(() => {
    if (isCustomDomain && form.domain !== '기타') {
      return form.domain;
    }
    return '';
  });

  // form.domain이 변경될 때 customDomain 동기화
  useEffect(() => {
    if (isCustomDomain && form.domain !== '기타') {
      setCustomDomain(form.domain);
    } else if (!isCustomDomain) {
      setCustomDomain('');
    }
  }, [form.domain, isCustomDomain]);

  // 디버깅용 로그 삭제됨

  useEffect(() => {
    if (!workspaceDetail || !isOpen) return;

    // API 응답 구조 대응: 기본 정보가 info 객체 안에 있을 수 있음
    const info = (workspaceDetail as any).info || workspaceDetail;

    setForm({
      name: info.name ?? '',
      description: info.description ?? '',
      domain: info.domain ?? '',
      purpose: info.purpose ?? '',
      serviceType: info.serviceType ?? SERVICE_TYPE_OPTIONS[0].value,
      startDate: parseDate(info.startDate),
      endDate: parseDate(info.endDate),
      techStacks: parseTechStacks(info.workspaceTechStacks),
      epics: workspaceDetail.epics ?? [],
    });
    setNewFiles([]);
    setExistingFiles(workspaceDetail.files ?? []);
    setSearchTerm('');
    setShowSuggestions(false);

    // 모달 열릴 때 커스텀 도메인 상태 초기화
    const initialDomain = info.domain ?? '';
    const initialIsCustom = initialDomain === '기타' || (!!initialDomain && !DOMAIN_OPTIONS.includes(initialDomain as any));
    if (initialIsCustom && initialDomain !== '기타') {
      setCustomDomain(initialDomain);
    } else {
      setCustomDomain('');
    }

  }, [workspaceDetail, isOpen]);

  // ... (existing code)

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

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFilesAdded = (files: File[]) => {
    const validFiles = files.filter((file) => {
      // MIME 타입이 없거나 정확하지 않은 경우 확장자도 확인
      const isPdfType = file.type === 'application/pdf';
      const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');

      if (!isPdfType && !isPdfExtension) {
        toast.error('PDF 파일만 업로드 가능합니다.');
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error('파일 크기는 10MB 이하여야 합니다.');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setNewFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesAdded(Array.from(e.target.files));
      e.target.value = ''; // Reset input
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

      console.log('Sending update request:', requestData);
      const response = await updateWorkspace(workspaceId, requestData, newFiles);

      if (response.success) {
        toast.success('워크스페이스 설정이 저장되었습니다.');
        // ... (rest of success logic)
        if (onUpdated) {
          onUpdated({
            ...workspaceDetail, // Keep existing data
            ...requestData, // Overwrite with new data
            // Ensure tech stacks are passed correctly (API might return them differently, but for local update we use what we sent)
            workspaceTechStacks: requestData.workspaceTechStacks,
          } as any);
        }
        onOpenChange(false);
      } else {
        toast.error((response as any).message || '저장에 실패했습니다.');
        console.error('Update failed type:', typeof response);
        console.error('Update failed raw:', response);
        console.error('Update failed stringified:', JSON.stringify(response, null, 2));
      }
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
        aria-describedby={undefined}
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

          {!workspaceDetail ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-500"></div>
              <p className="text-zinc-500 font-medium">정보를 불러오는 중입니다...</p>
            </div>
          ) : (
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
                  maxLength={500}
                  rows={2}
                  className="resize-none border-zinc-200 bg-zinc-50/50 rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--figma-neon-green)]/20 focus-visible:border-[var(--figma-neon-green)] transition-all font-medium text-zinc-800 placeholder:text-zinc-400 min-h-[80px]"
                />
                <div className="text-right text-xs text-zinc-400">
                  {form.description.length}/500
                </div>
              </div>

              {/* 프로젝트 문서 */}
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label className="text-sm font-bold text-zinc-700">프로젝트 문서 업로드</Label>
                </div>
                <div className="space-y-3">
                  {/* 파일 업로드 영역 */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleFilesAdded(Array.from(e.dataTransfer.files));
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-xl transition-all cursor-pointer group",
                      isDragging
                        ? "border-[var(--figma-neon-green)] bg-green-50/50"
                        : "border-zinc-200 bg-zinc-50/50 hover:border-[var(--figma-neon-green)]/50 hover:bg-green-50/30"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6 text-zinc-400 mb-2" />
                    <p className="text-[13px] text-zinc-600 font-medium mb-3">PDF 파일을 여기에 놓아주세요</p>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="h-7 text-xs bg-[var(--figma-tech-green)] hover:bg-[var(--figma-tech-green)]/90 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      파일 업로드 (최대 10MB)
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                      accept=".pdf"
                    />
                  </div>

                  {/* 파일 목록 */}
                  {[...existingFiles, ...newFiles.map((f, i) => ({ id: `new-${i}`, orginFileName: f.name, size: f.size, isNew: true, index: i }))].length > 0 && (
                    <div className="space-y-2">
                      {/* 기존 파일 */}
                      {existingFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 p-3 bg-white border border-zinc-200/80 rounded-xl shadow-sm"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 text-[var(--figma-tech-green)]">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-zinc-800 truncate">
                              {file.orginFileName || (file as any).originFILEName || (file as any).originFileName || (file as any).fileName || (file as any).name}
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
                      {/* 새 파일 */}
                      {newFiles.map((file, idx) => (
                        <div
                          key={`new-${idx}`}
                          className="flex items-center gap-3 p-3 bg-white border border-zinc-200/80 rounded-xl shadow-sm"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 text-[var(--figma-tech-green)]">
                            <FileText className="w-5 h-5" />
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveNewFile(idx);
                            }}
                            className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 도메인 */}
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label className="text-sm font-bold text-zinc-700">도메인</Label>
                  <span className="text-red-500 text-sm">*</span>
                </div>
                <Select
                  value={isCustomDomain ? '기타' : form.domain}
                  onValueChange={(value) => {
                    if (value === '기타') {
                      setForm((prev) => ({ ...prev, domain: '기타' }));
                      setCustomDomain('');
                    } else {
                      setForm((prev) => ({ ...prev, domain: value }));
                      setCustomDomain('');
                    }
                  }}
                >
                  <SelectTrigger className="h-11 border-zinc-200 bg-zinc-50/50 rounded-xl focus:ring-2 focus:ring-[var(--figma-neon-green)]/20 focus:border-[var(--figma-neon-green)] transition-all font-medium text-zinc-800">
                    <SelectValue placeholder="도메인을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="z-[200]">
                    {DOMAIN_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 기타 선택 시 커스텀 입력 필드 */}
                {isCustomDomain && (
                  <div className="space-y-1 mt-2">
                    <Input
                      placeholder="도메인을 입력하세요"
                      value={customDomain}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomDomain(value);
                        setForm((prev) => ({ ...prev, domain: value || '기타' }));
                      }}
                      maxLength={10}
                      className="h-11 border-zinc-200 bg-zinc-50/50 rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--figma-neon-green)]/20 focus-visible:border-[var(--figma-neon-green)] transition-all font-medium text-zinc-800"
                    />
                    <div className="text-right text-xs text-zinc-400">
                      {customDomain.length}/10
                    </div>
                  </div>
                )}
              </div>

              {/* 기술 스택 */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-zinc-700">기술 스택</Label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <Search className="w-4 h-4 text-zinc-400" />
                  </div>
                  <Input
                    placeholder="사용할 기술스택 검색 (React, Spring...)"
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

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-1">
                  <Label className="text-sm font-semibold text-zinc-700">
                    목적
                  </Label>
                  <span className="text-red-500 font-medium">*</span>
                </div>
                <Input
                  placeholder="프로젝트 목적을 입력하세요 (예: 포트폴리오, 학습용)"
                  value={form.purpose}
                  onChange={(e) =>
                    setForm({ ...form, purpose: e.target.value })
                  }
                  maxLength={20}
                  className="h-[52px] rounded-xl bg-zinc-50 border-zinc-200 focus-visible:ring-green-500/20 focus-visible:border-green-500 transition-all font-['Pretendard'] text-[15px]"
                />
                <div className="flex justify-end">
                  <span className="text-xs text-zinc-400">
                    {form.purpose.length}/20
                  </span>
                </div>
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
          )}

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
