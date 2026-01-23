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
    specFile: File | null;
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

  // 허용된 파일 형식
  const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/markdown',
    'text/plain',
  ];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // 파일 검증 함수
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return '지원하지 않는 파일 형식입니다. PDF, DOC, DOCX, MD, TXT 파일만 업로드 가능합니다.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return '파일 크기는 10MB 이하여야 합니다.';
    }
    return null;
  };

  // 파일 처리 함수
  const handleFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      return;
    }
    setFileError('');
    onChange({ specFile: file });
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // 파일 삭제 핸들러
  const handleRemoveFile = () => {
    onChange({ specFile: null });
    setFileError('');
  };
  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex flex-col items-center gap-2">
        <h2
          style={{
            fontFamily: 'Roboto',
            fontWeight: 100,
            fontSize: '18.8px',
            lineHeight: '28px',
            letterSpacing: '-0.5px',
            color: 'var(--figma-text-cod-gray)',
          }}
        >
          주제 및 일정
        </h2>
        <p
          style={{
            fontFamily: 'Roboto',
            fontWeight: 100,
            fontSize: '13.3px',
            lineHeight: '20px',
            color: 'var(--figma-text-emperor)',
          }}
        >
          프로젝트 주제와 예상 기간을 입력하세요
        </p>
      </div>

      {/* 폼 필드 */}
      <div className="flex flex-col gap-5">
        {/* 프로젝트 주제 */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="subject"
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '13.1px',
              lineHeight: '14px',
              color: 'var(--figma-text-cod-gray)',
            }}
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
            className="resize-none"
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '14px',
              lineHeight: '16px',
              padding: '12.5px 12px',
              background: 'rgba(255, 255, 255, 0.002)',
              border: '1px solid var(--figma-border-mercury)',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              borderRadius: '6px',
            }}
          />
          <div className="flex justify-end">
            <span
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                color: 'var(--figma-text-dove-gray)',
              }}
            >
              {data.subject.length}/50
            </span>
          </div>
        </div>

        {/* 파일 업로드 */}
        <div className="flex flex-col gap-2">
          <Label
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '13.1px',
              lineHeight: '14px',
              color: 'var(--figma-text-cod-gray)',
            }}
          >
            프로젝트 문서 업로드
          </Label>
          <p
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '12px',
              lineHeight: '16px',
              color: 'var(--figma-text-emperor)',
              marginBottom: '8px',
            }}
          ></p>

          {/* 파일이 업로드되지 않은 경우 */}
          {!data.specFile && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: isDragging
                  ? '2px dashed var(--figma-primary-blue)'
                  : '2px dashed var(--figma-border-mercury)',
                borderRadius: '8px',
                padding: '32px',
                textAlign: 'center',
                background: isDragging
                  ? 'rgba(59, 130, 246, 0.05)'
                  : 'rgba(255, 255, 255, 0.002)',
                transition: 'all 0.2s ease',
              }}
            >
              <div className="flex flex-col items-center gap-3">
                <Upload
                  className="h-10 w-10"
                  style={{ color: 'var(--figma-text-emperor)' }}
                />
                <p
                  style={{
                    fontFamily: 'Roboto',
                    fontWeight: 100,
                    fontSize: '14px',
                    color: 'var(--figma-text-cod-gray)',
                  }}
                >
                  Drag & drop files here
                </p>
                <p
                  style={{
                    fontFamily: 'Roboto',
                    fontWeight: 100,
                    fontSize: '12px',
                    color: 'var(--figma-text-dove-gray)',
                  }}
                >
                  Allowed types: image/png, image/jpeg, application/pdf
                </p>
                <label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.md,.txt"
                    style={{ display: 'none' }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const input = document.querySelector(
                        'input[type="file"]'
                      ) as HTMLInputElement;
                      input?.click();
                    }}
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: 100,
                      fontSize: '13.2px',
                      padding: '8px 16px',
                      background: 'var(--figma-text-cod-gray)',
                      color: 'var(--figma-white)',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    파일 업로드
                  </Button>
                </label>
              </div>
            </div>
          )}

          {/* 파일이 업로드된 경우 */}
          {data.specFile && (
            <div
              style={{
                border: '1px solid var(--figma-border-mercury)',
                borderRadius: '8px',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.002)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '6px',
                    background: 'var(--figma-gray-concrete)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Upload className="h-5 w-5" style={{ color: '#666' }} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: 100,
                      fontSize: '14px',
                      color: 'var(--figma-text-cod-gray)',
                    }}
                  >
                    {data.specFile.name}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: 100,
                      fontSize: '12px',
                      color: 'var(--figma-text-dove-gray)',
                    }}
                  >
                    {(data.specFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X
                  className="h-5 w-5"
                  style={{ color: 'var(--figma-text-emperor)' }}
                />
              </button>
            </div>
          )}

          {/* 에러 메시지 */}
          {fileError && (
            <p
              style={{
                fontFamily: 'Roboto',
                fontWeight: 100,
                fontSize: '12px',
                color: 'var(--figma-required-crimson)',
                marginTop: '4px',
              }}
            >
              {fileError}
            </p>
          )}
        </div>

        {/* 예상 기간 */}
        <div className="flex flex-col gap-2">
          <Label
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '13.1px',
              lineHeight: '14px',
              color: 'var(--figma-text-cod-gray)',
            }}
          >
            예상 기간
          </Label>
          <div className="flex items-center gap-4">
            {/* 시작일 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-50 justify-start text-left font-normal"
                  style={{
                    fontFamily: 'Roboto',
                    fontWeight: 100,
                    fontSize: '14px',
                    height: '44px',
                    background: 'rgba(255, 255, 255, 0.002)',
                    border: '1px solid var(--figma-border-mercury)',
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                    borderRadius: '6px',
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.startDate ? (
                    format(data.startDate, 'PPP', { locale: ko })
                  ) : (
                    <span style={{ color: 'var(--figma-text-emperor)' }}>
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

            <span style={{ color: 'var(--figma-text-emperor)' }}>~</span>

            {/* 종료일 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-50 justify-start text-left font-normal"
                  style={{
                    fontFamily: 'Roboto',
                    fontWeight: 100,
                    fontSize: '14px',
                    height: '44px',
                    background: 'rgba(255, 255, 255, 0.002)',
                    border: '1px solid var(--figma-border-mercury)',
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                    borderRadius: '6px',
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.endDate ? (
                    format(data.endDate, 'PPP', { locale: ko })
                  ) : (
                    <span style={{ color: 'var(--figma-text-emperor)' }}>
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
