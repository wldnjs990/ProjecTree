import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, X, Info } from 'lucide-react';

interface Step3ScheduleProps {
  data: {
    subject: string;
    specFiles: File[];
  };
  onChange: (updates: Partial<Step3ScheduleProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors?: Record<string, string>;
}

export default function Step3Schedule({
  data,
  onChange,
  // onNext,
  // onPrev,
  errors,
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
    <div className="flex flex-col gap-2">
      {/* 헤더 */}
      <div className="flex flex-col items-center gap-1">
        <h2 className="font-['Pretendard'] font-bold text-[22px] leading-tight tracking-[-0.02em] text-[#1A1A1A]">
          주제 및 자료
        </h2>
        <p className="font-['Pretendard'] font-medium text-[13px] text-[#757575]">
          프로젝트 주제와 관련 문서를 업로드하세요
        </p>
      </div>

      {/* 폼 필드 */}
      <div className="flex flex-col gap-3">
        {/* 프로젝트 주제 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Label
              htmlFor="subject"
              className="font-['Pretendard'] font-medium text-[13px] leading-[14px] text-[var(--figma-text-cod-gray)]"
            >
              프로젝트 주제
            </Label>
            <span className="font-[Inter] font-medium text-[14px] leading-5 text-[var(--figma-required-crimson)] text-red-500">
              *
            </span>
          </div>
          <Textarea
            id="subject"
            placeholder="예: AI가 사용자 취향을 분석해 최적의 여행 일정을 추천"
            value={data.subject}
            onChange={(e) => onChange({ subject: e.target.value })}
            maxLength={50}
            rows={2}
            className="resize-none font-['Pretendard'] font-normal text-[13.5px] leading-relaxed p-[10px] bg-white border-[var(--figma-border-mercury)] shadow-sm rounded-md focus-visible:ring-[var(--figma-forest-primary)] focus-visible:border-[var(--figma-forest-primary)] hover:border-[var(--figma-forest-accent)] transition-colors"
          />
          <div className="flex justify-end">
            <span className="font-['Pretendard'] font-normal text-[11px] leading-3 text-[var(--figma-text-dove-gray)]">
              {data.subject.length}/50
            </span>
          </div>
          {errors?.subject && (
            <p className="font-['Pretendard'] text-[13px] text-red-500 mt-1">
              {errors.subject}
            </p>
          )}
        </div>
        {/* 파일 업로드 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Label className="font-['Pretendard'] font-medium text-[13px] leading-[14px] text-[var(--figma-text-cod-gray)]">
              프로젝트 문서 업로드
            </Label>
            <div className="relative group">
              <Info className="h-4 w-4 text-[#BDBDBD] hover:text-[#4CAF50] transition-colors cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block px-4 py-3 bg-white border border-[#4ADE80] text-[#374151] text-xs rounded-xl shadow-[0_4px_14px_0_rgba(74,222,128,0.25)] z-50 w-[320px] whitespace-normal text-left leading-relaxed">
                <p>
                  기획서, 회의록 등을 업로드하면 <br />
                  <span className="text-[#16A34A] font-bold text-[13px]">
                    AI가 내용을 분석해 프로젝트 구조
                  </span>
                  를 자동으로 잡아줍니다.
                </p>
              </div>
            </div>
          </div>

          {/* 파일 업로드 영역 */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              p-3 text-center rounded-lg transition-all duration-200 border-2 border-dashed
              ${
                isDragging
                  ? 'border-[var(--figma-forest-accent)] bg-green-50'
                  : 'border-[var(--figma-border-mercury)] bg-transparent hover:border-[var(--figma-forest-accent)] hover:bg-green-50/30'
              }
            `}
          >
            <div className="flex flex-col items-center gap-1.5">
              <Upload className="h-6 w-6 text-[var(--figma-text-emperor)]" />
              <p className="font-['Pretendard'] font-normal text-[12.5px] text-[var(--figma-text-cod-gray)]">
                Drag & drop PDF files here
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
                  className="font-['Pretendard'] font-normal text-[11px] h-[28px] px-2.5 bg-[var(--figma-forest-primary)] text-[var(--figma-white)] rounded-md hover:bg-[#1B5E20] transition-colors mt-0.5"
                >
                  파일 업로드 (Max 10MB)
                </Button>
              </label>
            </div>
          </div>

          {/* 업로드된 파일 목록 */}
          {data.specFiles.length > 0 && (
            <div className="flex flex-col gap-2 mt-3 max-h-[150px] overflow-y-auto chat-scrollbar pr-2">
              {data.specFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 border border-[var(--figma-border-mercury)] rounded-lg bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[var(--figma-forest-bg)] text-[var(--figma-forest-primary)]">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-['Pretendard'] font-normal text-[14px] text-[var(--figma-text-cod-gray)]">
                        {file.name}
                      </p>
                      <p className="font-['Pretendard'] font-normal text-xs text-[var(--figma-text-dove-gray)]">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="p-1 hover:bg-black/5 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-[var(--figma-text-emperor)]" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 에러 메시지 */}
          {fileError && (
            <p className="font-['Pretendard'] font-normal text-xs text-red-500 mt-1">
              {fileError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
