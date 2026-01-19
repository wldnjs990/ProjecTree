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
}

export default function Step2Schedule({ data, onChange }: Step2ScheduleProps) {
  return (
    <div className="space-y-6">
      {/* 프로젝트 주제 */}
      <div className="space-y-2">
        <Label htmlFor="subject">프로젝트 주제</Label>
        <Textarea
          id="subject"
          placeholder="예: AI가 사용자 취향을 분석해 최적의 여행 일정을 추천
자세하게 적을수록 더 정확한 분석이 가능합니다."
          value={data.subject}
          onChange={(e) => onChange({ subject: e.target.value })}
          maxLength={200}
          rows={5}
          className="resize-none"
        />
        <p className="text-sm text-gray-500 text-right">
          {data.subject.length}/200
        </p>
      </div>

      {/* 예상 기간 */}
      <div className="space-y-2">
        <Label>예상 기간</Label>
        <div className="flex items-center gap-4">
          {/* 시작일 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.startDate ? (
                  format(data.startDate, 'PPP', { locale: ko })
                ) : (
                  <span className="text-gray-500">시작일</span>
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

          <span className="text-gray-500">~</span>

          {/* 종료일 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.endDate ? (
                  format(data.endDate, 'PPP', { locale: ko })
                ) : (
                  <span className="text-gray-500">종료일</span>
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
  );
}
