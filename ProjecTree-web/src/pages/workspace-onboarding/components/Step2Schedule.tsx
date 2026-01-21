import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Step2ScheduleProps {
  data: {
    subject: string;
    startDate: Date | null;
    endDate: Date | null;
  };
  onChange: (updates: Partial<Step2ScheduleProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2Schedule({
  data,
  onChange,
  // onNext,
  // onPrev,
}: Step2ScheduleProps) {
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
            maxLength={200}
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
              {data.subject.length}/200
            </span>
          </div>
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
