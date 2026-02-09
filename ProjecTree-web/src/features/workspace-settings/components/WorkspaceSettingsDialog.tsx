import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, X, FileText, Upload, Search } from 'lucide-react';
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
  updateWorkspace,
  getTechStacks,
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

interface WorkspaceSettingsForm {
  name: string;
  description: string;
  domain: string;
  purpose: string;
  serviceType: string;
  startDate: Date | null;
  endDate: Date | null;
  techStacks: number[];
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

/**
 * 백엔드 techs 배열에서 ID 배열 추출
 * 백엔드 형식: { id: number, techStackName: string }[]
 */
const parseTechsToIds = (
  techs?: Array<{ id: number; techStackName: string }> | null
): number[] => {
  if (!techs || !Array.isArray(techs)) return [];
  return techs.map((tech) => tech.id);
};

/**
 * 백엔드 techs 배열에서 ID -> 이름 맵 생성
 */
const parseTechsToMap = (
  techs?: Array<{ id: number; techStackName: string }> | null
): Map<number, string> => {
  const map = new Map<number, string>();
  if (!techs || !Array.isArray(techs)) return map;
  techs.forEach((tech) => {
    map.set(tech.id, tech.techStackName);
  });
  return map;
};

const TECH_ORDER_KEY_PREFIX = 'workspace-tech-order';

const getTechOrderKey = (workspaceId: number) =>
  `${TECH_ORDER_KEY_PREFIX}:${workspaceId}`;

const loadTechOrder = (workspaceId: number): number[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(getTechOrderKey(workspaceId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id) => Number.isInteger(id));
  } catch {
    return [];
  }
};

const saveTechOrder = (workspaceId: number, ids: number[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      getTechOrderKey(workspaceId),
      JSON.stringify(ids)
    );
  } catch {
    // ignore storage errors
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
  });

  const [selectedTechMap, setSelectedTechMap] = useState<Map<number, string>>(
    new Map()
  );
  const [originalTechIds, setOriginalTechIds] = useState<Set<number>>(new Set()); // 서버에서 받은 기존 기술스택 ID
  const [techOptions, setTechOptions] = useState<TechStackItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<WorkspaceDetailData['files']>([]);
  const [deleteFileIds, setDeleteFileIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!workspaceDetail || !isOpen) return;

    // API 응답 구조 대응: 기본 정보가 info 객체 안에 있을 수 있음
    const info = (workspaceDetail as any).info || workspaceDetail;

    const apiTechIds = parseTechsToIds(info.techs);
    const savedOrder = loadTechOrder(workspaceId);
    const apiIdSet = new Set(apiTechIds);
    const savedFiltered = savedOrder.filter((id) => apiIdSet.has(id));
    const savedSet = new Set(savedFiltered);
    const newOnes = apiTechIds.filter((id) => !savedSet.has(id));
    const techIds =
      savedOrder.length > 0
        ? [...savedFiltered, ...newOnes]
        : apiTechIds.slice().reverse();
    const techMap = parseTechsToMap(info.techs);
    saveTechOrder(workspaceId, techIds);

    setForm({
      name: info.name ?? '',
      description: info.description ?? '',
      domain: info.domain ?? '',
      purpose: info.purpose ?? '',
      serviceType: info.serviceType ?? SERVICE_TYPE_OPTIONS[0].value,
      startDate: parseDate(info.startDate),
      endDate: parseDate(info.endDate),
      techStacks: techIds,
    });
    setSelectedTechMap(techMap);
    setOriginalTechIds(new Set(techIds)); // 서버에서 받은 기존 기술스택 ID 저장
    setNewFiles([]);
    setExistingFiles(workspaceDetail.files ?? []);
    setDeleteFileIds([]);
  }, [workspaceDetail, isOpen]);

  const getTechName = (id: number) => {
    return selectedTechMap.get(id) || `Tech ${id}`;
  };

  // 기술 스택 검색
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
      }
    };

    const timer = setTimeout(fetchTechs, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredTechs = techOptions.filter(
    (tech) => !form.techStacks.includes(tech.id)
  );

  const handleAddTech = (tech: TechStackItem) => {
    if (form.techStacks.includes(tech.id)) return;
    setForm((prev) => {
      const next = [...prev.techStacks, tech.id];
      saveTechOrder(workspaceId, next);
      return {
        ...prev,
        techStacks: next,
      };
    });
    setSelectedTechMap((prev) => new Map(prev).set(tech.id, tech.name));
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleRemoveTech = (techId: number) => {
    setForm((prev) => {
      const next = prev.techStacks.filter((id) => id !== techId);
      saveTechOrder(workspaceId, next);
      return {
        ...prev,
        techStacks: next,
      };
    });
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

  const handleRemoveExistingFile = (fileId: number) => {
    setExistingFiles((prev) => prev.filter((f) => f.id !== fileId));
    setDeleteFileIds((prev) => [...prev, fileId]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 기존 기술스택은 이미 DB에 있으므로, 새로 추가된 것만 전송
      const newTechStacks = form.techStacks.filter(
        (id) => !originalTechIds.has(id)
      );

      const requestData = {
        name: form.name,
        startDate: form.startDate ? format(form.startDate, 'yyyy-MM-dd') : null,
        endDate: form.endDate ? format(form.endDate, 'yyyy-MM-dd') : null,
        purpose: form.purpose,
        workspaceTechStacks: newTechStacks,
        ...(deleteFileIds.length > 0 && { deleteFiles: deleteFileIds }),
      };

      const response = await updateWorkspace(workspaceId, requestData, newFiles);

      if (response.success) {
        toast.success('워크스페이스 설정이 저장되었습니다.');
        if (onUpdated) {
          // info 객체 안의 데이터를 업데이트
          const currentInfo = (workspaceDetail as any)?.info || workspaceDetail;
          onUpdated({
            ...workspaceDetail,
            info: {
              ...currentInfo,
              name: form.name,
              startDate: form.startDate ? format(form.startDate, 'yyyy-MM-dd') : null,
              endDate: form.endDate ? format(form.endDate, 'yyyy-MM-dd') : null,
              purpose: form.purpose,
              techs: form.techStacks.map((id) => ({
                id,
                techStackName: selectedTechMap.get(id) || `Tech ${id}`,
              })),
            },
            files: existingFiles, // 삭제된 파일 반영
          } as any);
        }
        onOpenChange(false);
      } else {
        toast.error((response as any).message || '저장에 실패했습니다.');
      }
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다.');
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
                <Label className="text-sm font-bold text-zinc-700">프로젝트명</Label>
                <Input
                  value={form.name}
                  disabled
                  className="h-11 border-zinc-200 bg-zinc-100 rounded-xl font-medium text-zinc-600 cursor-not-allowed"
                />
              </div>

              {/* 프로젝트 주제 */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-zinc-700">프로젝트 주제</Label>
                <Textarea
                  value={form.description}
                  disabled
                  rows={2}
                  className="resize-none border-zinc-200 bg-zinc-100 rounded-xl font-medium text-zinc-600 cursor-not-allowed min-h-[80px]"
                />
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveExistingFile(file.id);
                            }}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-zinc-400 hover:text-red-500" />
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
                <Label className="text-sm font-bold text-zinc-700">도메인</Label>
                <Input
                  value={form.domain}
                  disabled
                  className="h-11 border-zinc-200 bg-zinc-100 rounded-xl font-medium text-zinc-600 cursor-not-allowed"
                />
              </div>

              {/* 기술 스택 */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-zinc-700">기술 스택</Label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <Search className="w-4 h-4 text-zinc-400" />
                  </div>
                  <Input
                    placeholder="기술스택 검색 (React, Spring...)"
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
                    {form.techStacks.map((techId) => {
                      const isExisting = originalTechIds.has(techId);
                      return (
                        <Badge
                          key={techId}
                          className={cn(
                            "px-3 py-1.5 font-bold shadow-sm rounded-lg flex items-center gap-1.5",
                            isExisting
                              ? "bg-zinc-100 text-zinc-600 border border-zinc-300" // 기존 기술스택 (제거 불가)
                              : "bg-green-50 text-green-700 border border-green-300" // 새로 추가 (제거 가능)
                          )}
                        >
                          {getTechName(techId)}
                          {!isExisting && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTech(techId)}
                              className="ml-1 p-0.5 hover:bg-green-200 rounded transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 예상 기간 */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-zinc-700">예상 기간</Label>
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
