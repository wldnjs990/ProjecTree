import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Step3ScheduleProps {
  data: {
    subject: string;
    startDate: Date | null;
    endDate: Date | null;
    specFiles: File[];
  };
  onChange: (updates: Partial<Step3ScheduleProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3Schedule({
  data,
  onChange,
  // onNext,
  // onPrev,
}: Step3ScheduleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string>('');

  // PDF만 허용
  const ALLOWED_FILE_TYPES = ['application/pdf'];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // 파일 검증 함수
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return '지원하지 않는 파일 형식입니다. PDF 파일만 업로드 가능합니다.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return '파일 크기는 10MB 이하여야 합니다.';
    }
    return null;
  };

  // 파일 처리 함수 (다중 파일 지원)
  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    let errorMsg = '';

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        errorMsg = error;
        break;
      }
      validFiles.push(file);
    }

    if (errorMsg) {
      setFileError(errorMsg);
      return;
    }

    setFileError('');
    onChange({ specFiles: [...data.specFiles, ...validFiles] });
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  // 개별 파일 삭제 핸들러
  const handleRemoveFile = (index: number) => {
    const newFiles = data.specFiles.filter((_, i) => i !== index);
    onChange({ specFiles: newFiles });
    setFileError('');
  };
  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-['Roboto'] font-thin text-[18.8px] leading-7 tracking-[-0.5px] text-[var(--figma-text-cod-gray)]">
          주제 및 일정
        </h2>
        <p className="font-['Roboto'] font-thin text-[13.3px] leading-5 text-[var(--figma-text-emperor)]">
          프로젝트 주제와 예상 기간을 입력하세요
        </p>
      </div>

      {/* 폼 필드 */}
      <div className="flex flex-col gap-5">
        {/* 프로젝트 주제 */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="subject"
            className="font-['Roboto'] font-thin text-[13.1px] leading-[14px] text-[var(--figma-text-cod-gray)]"
          >
            프로젝트 주제
          </Label>
          <Textarea
            id="subject"
            placeholder="예: AI가 사용자 취향을 분석해 최적의 여행 일정을 추천&#10;자세하게 적을수록 더 정확한 분석이 가능합니다."
            value={data.subject}
            onChange={(e) => onChange({ subject: e.target.value })}
            maxLength={50}
            rows={5}
            className="resize-none font-['Roboto'] font-thin text-[14px] leading-4 px-3 py-[12.5px] bg-[rgba(255,255,255,0.002)] border border-[var(--figma-border-mercury)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-md"
          />
          <div className="flex justify-end">
            <span className="font-['Inter'] font-normal text-[12px] leading-4 text-[var(--figma-text-dove-gray)]">
              {data.subject.length}/50
            </span>
          </div>
        </div>

        {/* 파일 업로드 */}
        <div className="flex flex-col gap-2">
          <Label className="font-['Roboto'] font-thin text-[13.1px] leading-[14px] text-[var(--figma-text-cod-gray)]">
            프로젝트 문서 업로드
          </Label>
          <p className="font-['Roboto'] font-thin text-[12px] leading-4 text-[var(--figma-text-emperor)] mb-2"></p>

          {/* 파일 업로드 영역 (항상 표시) */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 dashed rounded-lg p-8 text-center transition-all duration-200 ${isDragging
              ? 'border-[var(--figma-primary-blue)] bg-[rgba(59,130,246,0.05)]'
              : 'border-[var(--figma-border-mercury)] bg-[rgba(255,255,255,0.002)]'
              }`}
          >
            <div className="flex flex-col items-center gap-3">
              <Upload
                className="h-10 w-10 text-[var(--figma-text-emperor)]"
              />
              <p className="font-['Roboto'] font-thin text-[14px] text-[var(--figma-text-cod-gray)]">
                Drag & drop PDF files here
              </p>
              <p className="font-['Roboto'] font-thin text-[12px] text-[var(--figma-text-dove-gray)]">
                Allowed types: application/pdf (최대 10MB)
              </p>
              <label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                  multiple
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector(
                      'input[type="file"]'
                    ) as HTMLInputElement;
                    input?.click();
                  }}
                  className="font-['Roboto'] font-thin text-[13.2px] px-4 py-2 bg-[var(--figma-text-cod-gray)] text-[var(--figma-white)] rounded-md border-none cursor-pointer"
                >
                  파일 업로드
                </Button>
              </label>
            </div>
          </div>

          {/* 업로드된 파일 목록 */}
          {data.specFiles.length > 0 && (
            <div className="flex flex-col gap-2 mt-3">
              {data.specFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="border border-[var(--figma-border-mercury)] rounded-lg px-4 py-3 bg-[rgba(255,255,255,0.002)] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-md bg-[var(--figma-gray-concrete)] flex items-center justify-center"
                    >
                      <Upload className="h-5 w-5 text-[#666]" />
                    </div>
                    <div>
                      <p className="font-['Roboto'] font-thin text-[14px] text-[var(--figma-text-cod-gray)]">
                        {file.name}
                      </p>
                      <p className="font-['Roboto'] font-thin text-[12px] text-[var(--figma-text-dove-gray)]">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="bg-transparent border-none cursor-pointer p-1"
                  >
                    <X
                      className="h-5 w-5 text-[var(--figma-text-emperor)]"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 에러 메시지 */}
          {fileError && (
            <p className="font-['Roboto'] font-thin text-[12px] text-[var(--figma-required-crimson)] mt-1">
              {fileError}
            </p>
          )}
        </div>

        {/* 예상 기간 */}
        <div className="flex flex-col gap-2">
          <Label className="font-['Roboto'] font-thin text-[13.1px] leading-[14px] text-[var(--figma-text-cod-gray)]">
            예상 기간
          </Label>
          <div className="flex items-center gap-4">
            {/* 시작일 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-50 justify-start text-left font-normal font-['Roboto'] font-thin text-[14px] h-[44px] bg-[rgba(255,255,255,0.002)] border border-[var(--figma-border-mercury)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-md"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.startDate ? (
                    format(data.startDate, 'PPP', { locale: ko })
                  ) : (
                    <span className="text-[var(--figma-text-emperor)]">
                      시작일
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.startDate || undefined}
                  onSelect={(date) => onChange({ startDate: date || null })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span className="text-[var(--figma-text-emperor)]">~</span>

            {/* 종료일 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-50 justify-start text-left font-normal font-['Roboto'] font-thin text-[14px] h-[44px] bg-[rgba(255,255,255,0.002)] border border-[var(--figma-border-mercury)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-md"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.endDate ? (
                    format(data.endDate, 'PPP', { locale: ko })
                  ) : (
                    <span className="text-[var(--figma-text-emperor)]">
                      종료일
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.endDate || undefined}
                  onSelect={(date) => onChange({ endDate: date || null })}
                  initialFocus
                  disabled={(date) =>
                    data.startDate ? date < data.startDate : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
