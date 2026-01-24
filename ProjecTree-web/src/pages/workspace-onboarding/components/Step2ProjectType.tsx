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

interface Step2ProjectTypeProps {
  data: {
    domain: string;
    purpose: string;
    serviceType: string;
  };
  onChange: (updates: Partial<Step2ProjectTypeProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2ProjectType({
  data,
  onChange,
  // onNext,
  // onPrev,
}: Step2ProjectTypeProps) {
  const [customDomain, setCustomDomain] = useState('');
  const isCustomDomain =
    data.domain === '기타' || !DOMAIN_OPTIONS.includes(data.domain as any);

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-['Roboto'] font-thin text-[18.8px] leading-7 tracking-[-0.5px] text-[var(--figma-text-cod-gray)]">
          프로젝트 유형 설정
        </h2>
        <p className="font-['Roboto'] font-thin text-[13.3px] leading-5 text-[var(--figma-text-emperor)]">
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
              className="font-['Roboto'] font-thin text-[13.1px] leading-[14px] text-[var(--figma-text-cod-gray)]"
            >
              도메인
            </Label>
            <span className="font-['Inter'] font-medium text-[14px] leading-5 text-[var(--figma-required-crimson)]">
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
              className="font-['Roboto'] font-thin text-[14px] leading-4 h-9 px-3 py-[8.25px] bg-[rgba(255,255,255,0.002)] border border-[var(--figma-border-mercury-alt)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-lg"
            >
              <SelectValue placeholder="도메인을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {DOMAIN_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
                className="font-['Roboto'] font-thin text-[14px] leading-4 h-9 px-3 py-[8.25px] bg-[rgba(255,255,255,0.002)] border border-[var(--figma-border-mercury-alt)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-lg"
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
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '13.1px',
              lineHeight: '14px',
              color: 'var(--figma-text-cod-gray)',
            }}
          >
            워크스페이스 목적
          </Label>
          <Input
            id="purpose"
            placeholder="ex) 학습, 포트폴리오"
            value={data.purpose}
            onChange={(e) => onChange({ purpose: e.target.value })}
            maxLength={20}
            className="font-['Roboto'] font-thin text-[14px] leading-4 h-[44px] px-3 py-[12.5px] bg-[rgba(255,255,255,0.002)] border border-[var(--figma-border-mercury)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-md"
          />
          <div className="flex justify-end">
            <span className="font-['Inter'] font-normal text-[12px] leading-4 text-[var(--figma-text-dove-gray)]">
              {data.purpose.length}/20
            </span>
          </div>
        </div>

        {/* 서비스 유형 */}
        <div className="flex flex-col gap-3">
          <Label className="font-['Roboto'] font-thin text-[13.2px] leading-[14px] text-[var(--figma-text-cod-gray)]">
            서비스 유형
          </Label>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value="web"
                id="web"
                name="serviceType"
                checked={data.serviceType === 'web'}
                onChange={(e) => onChange({ serviceType: e.target.value })}
                className="w-4 h-4 cursor-pointer"
              />
              <Label
                htmlFor="web"
                className="cursor-pointer font-['Roboto'] font-thin text-[13.2px] leading-[14px] text-[var(--figma-text-cod-gray)]"
              >
                Web
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value="mobile"
                id="mobile"
                name="serviceType"
                checked={data.serviceType === 'mobile'}
                onChange={(e) => onChange({ serviceType: e.target.value })}
                className="w-4 h-4 cursor-pointer"
              />
              <Label
                htmlFor="mobile"
                className="cursor-pointer font-['Roboto'] font-thin text-[13.2px] leading-[14px] text-[var(--figma-text-cod-gray)]"
              >
                Mobile App
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value="desktop"
                id="desktop"
                name="serviceType"
                checked={data.serviceType === 'desktop'}
                onChange={(e) => onChange({ serviceType: e.target.value })}
                className="w-4 h-4 cursor-pointer"
              />
              <Label
                htmlFor="desktop"
                className="cursor-pointer font-['Roboto'] font-thin text-[13.2px] leading-[14px] text-[var(--figma-text-cod-gray)]"
              >
                Desktop App
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value="other"
                id="serviceOther"
                name="serviceType"
                checked={data.serviceType === 'other'}
                onChange={(e) => onChange({ serviceType: e.target.value })}
                className="w-4 h-4 cursor-pointer"
              />
              <Label
                htmlFor="serviceOther"
                className="cursor-pointer font-['Roboto'] font-thin text-[13.2px] leading-[14px] text-[var(--figma-text-cod-gray)]"
              >
                기타
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
