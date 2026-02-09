import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DOMAIN_OPTIONS } from '@/shared/constants/workspace';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Step2ProjectTypeProps {
  data: {
    domain: string;
    purpose: string;
    serviceType: string;
    startDate: Date | null;
    endDate: Date | null;
  };
  onChange: (updates: Partial<Step2ProjectTypeProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors?: Record<string, string>;
}

export default function Step2ProjectType({
  data,
  onChange,
  errors,
}: Step2ProjectTypeProps) {
  const isCustomDomain =
    data.domain === '기타' ||
    (!!data.domain && !DOMAIN_OPTIONS.includes(data.domain as any));

  // 초기값 설정: data.domain이 커스텀 도메인이면 그 값을 사용
  const [customDomain, setCustomDomain] = useState(() => {
    if (isCustomDomain && data.domain !== '기타') {
      return data.domain;
    }
    return '';
  });

  // data.domain이 변경될 때 customDomain 동기화
  useEffect(() => {
    if (isCustomDomain && data.domain !== '기타') {
      setCustomDomain(data.domain);
    } else if (!isCustomDomain) {
      setCustomDomain('');
    }
  }, [data.domain, isCustomDomain]);

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-['Pretendard'] font-bold text-[22px] leading-tight tracking-[-0.02em] text-[#1A1A1A]">
          프로젝트 유형 및 일정
        </h2>
        <p className="font-['Pretendard'] font-medium text-[15px] text-[#757575]">
          프로젝트 유형과 예상 기간을 입력하세요
        </p>
      </div>

      {/* 폼 필드 */}
      <div className="flex flex-col gap-5">
        {/* 도메인 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="domain"
              className="font-[Roboto] font-medium text-[13.1px] leading-[14px] text-[var(--figma-text-cod-gray)]"
            >
              도메인
            </Label>
            <span className="font-[Inter] font-medium text-[14px] leading-5 text-[var(--figma-required-crimson)]">
              *
            </span>
            <div className="relative group">
              <Info className="h-4 w-4 text-[#BDBDBD] hover:text-[#4CAF50] transition-colors cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block px-4 py-3 bg-white border border-[#4ADE80] text-[#374151] text-xs rounded-xl shadow-[0_4px_14px_0_rgba(74,222,128,0.25)] z-50 w-[300px] whitespace-normal text-left leading-relaxed">
                <p>
                  선택하신 도메인에 맞춰 <br />
                  <span className="text-[#16A34A] font-bold text-[13px]">
                    AI가 최적의 기능과 기술 스택
                  </span>
                  을 추천해 드립니다.
                </p>
              </div>
            </div>
          </div>
          <Select
            value={isCustomDomain ? '기타' : data.domain}
            onValueChange={(value) => {
              if (value === '기타') {
                onChange({ domain: '기타' });
                setCustomDomain('');
              } else {
                onChange({ domain: value });
                setCustomDomain('');
              }
            }}
          >
            <SelectTrigger
              id="domain"
              className={`h-[36px] px-3 py-[8.25px] bg-white border-[var(--figma-border-mercury-alt)] shadow-sm rounded-lg font-['Pretendard'] font-normal text-[14px] leading-4 focus-visible:ring-[var(--figma-forest-primary)] hover:border-[var(--figma-forest-accent)] transition-colors ${errors?.domain ? 'border-red-500 hover:border-red-500' : ''}`}
            >
              <SelectValue placeholder="도메인을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {DOMAIN_OPTIONS.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="font-['Pretendard']"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.domain && (
            <p className="font-['Pretendard'] text-[13px] text-red-500 mt-1">
              {errors.domain}
            </p>
          )}
          {/* 기타 선택 시 커스텀 입력 필드 */}
          {isCustomDomain && (
            <div className="flex flex-col gap-2">
              <Input
                placeholder="도메인을 입력하세요"
                value={customDomain}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomDomain(value);
                  onChange({ domain: value || '기타' });
                }}
                maxLength={10}
                className="h-[36px] px-3 py-[8.25px] bg-white border-[var(--figma-border-mercury-alt)] shadow-sm rounded-lg font-['Pretendard'] font-normal text-[14px] leading-4 focus-visible:ring-[var(--figma-forest-primary)] hover:border-[var(--figma-forest-accent)] transition-colors"
              />
              <div className="flex justify-end">
                <span className="font-['Pretendard'] font-normal text-xs leading-4 text-[var(--figma-text-dove-gray)]">
                  {customDomain.length}/10
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 워크스페이스 목적 */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="purpose"
            className="font-['Pretendard'] font-medium text-[13.1px] leading-[14px] text-[var(--figma-text-cod-gray)]"
          >
            워크스페이스 목적
          </Label>
          <Input
            id="purpose"
            placeholder="ex) 학습, 포트폴리오"
            value={data.purpose}
            onChange={(e) => onChange({ purpose: e.target.value })}
            maxLength={20}
            className="h-[44px] px-3 py-[12.5px] bg-white border-[var(--figma-border-mercury)] shadow-sm rounded-md font-['Pretendard'] font-normal text-[14px] leading-4 focus-visible:ring-[var(--figma-forest-primary)] hover:border-[var(--figma-forest-accent)] transition-colors"
          />
          <div className="flex justify-end">
            <span className="font-['Pretendard'] font-normal text-xs leading-4 text-[var(--figma-text-dove-gray)]">
              {data.purpose.length}/20
            </span>
          </div>
        </div>

        {/* 서비스 유형 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <Label className="font-['Pretendard'] font-medium text-[13.2px] leading-[14px] text-[var(--figma-text-cod-gray)]">
              서비스 유형
            </Label>
            <span className="font-[Inter] font-medium text-[14px] leading-5 text-[var(--figma-required-crimson)] text-red-500">
              *
            </span>
          </div>
          <RadioGroup
            value={data.serviceType}
            onValueChange={(value) => onChange({ serviceType: value })}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="WEB"
                id="web"
                className="text-[var(--figma-forest-primary)]"
              />
              <Label
                htmlFor="web"
                className="cursor-pointer font-['Pretendard'] font-normal text-[13.2px] leading-[14px] text-[var(--figma-text-cod-gray)]"
              >
                Web
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="APP"
                id="app"
                className="text-[var(--figma-forest-primary)]"
              />
              <Label
                htmlFor="app"
                className="cursor-pointer font-['Pretendard'] font-normal text-[13.2px] leading-[14px] text-[var(--figma-text-cod-gray)]"
              >
                App
              </Label>
            </div>
          </RadioGroup>
          {errors?.serviceType && (
            <p className="font-['Pretendard'] text-[13px] text-red-500 mt-1">
              {errors.serviceType}
            </p>
          )}
        </div>

        {/* 예상 기간 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Label className="font-['Pretendard'] font-medium text-[13.1px] leading-[14px] text-[var(--figma-text-cod-gray)]">
              예상 기간
            </Label>
          </div>
          <div className="flex items-center gap-4">
            {/* 시작일 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`flex-1 justify-start text-left font-normal font-['Pretendard'] h-[44px] bg-white border-[var(--figma-border-mercury)] shadow-sm rounded-md hover:border-[var(--figma-forest-accent)] ${!data.startDate && 'text-muted-foreground'}`}
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
                  locale={ko}
                  className="rounded-md border border-[var(--figma-border-mercury)] shadow-lg"
                />
              </PopoverContent>
            </Popover>

            <span className="text-[var(--figma-text-emperor)] shrink-0">~</span>

            {/* 종료일 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`flex-1 justify-start text-left font-normal font-[Roboto] h-[44px] bg-white border-[var(--figma-border-mercury)] shadow-sm rounded-md hover:border-[var(--figma-forest-accent)] ${!data.endDate && 'text-muted-foreground'}`}
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
                  locale={ko}
                  className="rounded-md border border-[var(--figma-border-mercury)] shadow-lg"
                />
              </PopoverContent>
            </Popover>
          </div>
          {(errors?.startDate || errors?.endDate) && (
            <p className="font-['Pretendard'] text-[13px] text-red-500 mt-1">
              {errors?.startDate || errors?.endDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
