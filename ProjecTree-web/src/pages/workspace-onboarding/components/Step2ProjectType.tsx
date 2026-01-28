import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DOMAIN_OPTIONS } from '../domainOptions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Step2ProjectTypeProps {
  data: {
    domain: string;
    purpose: string;
    serviceType: string;
  };
  onChange: (updates: Partial<Step2ProjectTypeProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
  errors?: Record<string, string>;
}

export default function Step2ProjectType({
  data,
  onChange,
  // onNext,
  // onPrev,
  errors,
}: Step2ProjectTypeProps) {
  const [customDomain, setCustomDomain] = useState('');
  const isCustomDomain =
    data.domain === '기타' || (!!data.domain && !DOMAIN_OPTIONS.includes(data.domain as any));

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-['Pretendard'] font-bold text-[24px] leading-tight tracking-[-0.02em] text-[#1A1A1A]">
          프로젝트 유형 설정
        </h2>
        <p className="font-['Pretendard'] font-medium text-[15px] text-[#757575]">
          도메인, 목적, 서비스 유형을 선택하세요
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
                <SelectItem key={option} value={option} className="font-['Pretendard']">
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
              <RadioGroupItem value="web" id="web" className="text-[var(--figma-forest-primary)]" />
              <Label
                htmlFor="web"
                className="cursor-pointer font-['Pretendard'] font-normal text-[13.2px] leading-[14px] text-[var(--figma-text-cod-gray)]"
              >
                Web
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="mobile" id="mobile" className="text-[var(--figma-forest-primary)]" />
              <Label
                htmlFor="mobile"
                className="cursor-pointer font-['Pretendard'] font-normal text-[13.2px] leading-[14px] text-[var(--figma-text-cod-gray)]"
              >
                Mobile App
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="desktop" id="desktop" className="text-[var(--figma-forest-primary)]" />
              <Label
                htmlFor="desktop"
                className="cursor-pointer font-['Pretendard'] font-normal text-[13.2px] leading-[14px] text-[var(--figma-text-cod-gray)]"
              >
                Desktop App
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="other" id="serviceOther" className="text-[var(--figma-forest-primary)]" />
              <Label
                htmlFor="serviceOther"
                className="cursor-pointer font-['Pretendard'] font-normal text-[13.2px] leading-[14px] text-[var(--figma-text-cod-gray)]"
              >
                기타
              </Label>
            </div>
          </RadioGroup>
          {errors?.serviceType && (
            <p className="font-['Pretendard'] text-[13px] text-red-500 mt-1">
              {errors.serviceType}
            </p>
          )}
        </div>
      </div >
    </div >
  );
}
