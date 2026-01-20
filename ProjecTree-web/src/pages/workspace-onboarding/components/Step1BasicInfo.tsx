import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Step1BasicInfoProps {
  data: {
    workspaceName: string;
    workspaceKey: string;
    domain: string;
    purpose: string;
  };
  onChange: (updates: Partial<Step1BasicInfoProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step1BasicInfo({
  data,
  onChange,
  onNext,
  onPrev,
}: Step1BasicInfoProps) {
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
          워크스페이스 기본 설정
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
          AI가 이 정보를 바탕으로 프로젝트를 분석합니다.
        </p>
      </div>

      {/* 폼 필드 */}
      <div className="flex flex-col gap-5">
        {/* 워크스페이스명 */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="workspaceName"
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '13.1px',
              lineHeight: '14px',
              color: 'var(--figma-text-cod-gray)',
            }}
          >
            워크스페이스명
          </Label>
          <Input
            id="workspaceName"
            placeholder="Untitled-1"
            value={data.workspaceName}
            onChange={(e) => onChange({ workspaceName: e.target.value })}
            maxLength={20}
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '14px',
              lineHeight: '16px',
              height: '44px',
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
              {data.workspaceName.length}/20
            </span>
          </div>
        </div>

        {/* 워크스페이스 키 */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="workspaceKey"
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '13.1px',
              lineHeight: '14px',
              color: 'var(--figma-text-cod-gray)',
            }}
          >
            워크스페이스키
          </Label>
          <Input
            id="workspaceKey"
            placeholder="ex) ASDF"
            value={data.workspaceKey}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
              onChange({ workspaceKey: value });
            }}
            maxLength={4}
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '14px',
              lineHeight: '16px',
              height: '44px',
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
              {data.workspaceKey.length}/4
            </span>
          </div>
        </div>

        {/* 도메인 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="domain"
              style={{
                fontFamily: 'Roboto',
                fontWeight: 100,
                fontSize: '13.1px',
                lineHeight: '14px',
                color: 'var(--figma-text-cod-gray)',
              }}
            >
              도메인
            </Label>
            <span
              style={{
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '20px',
                color: 'var(--figma-required-crimson)',
              }}
            >
              *
            </span>
          </div>
          <Input
            id="domain"
            placeholder="ex) 여행"
            value={data.domain}
            onChange={(e) => onChange({ domain: e.target.value })}
            maxLength={10}
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '14px',
              lineHeight: '16px',
              height: '36px',
              padding: '8.25px 12px',
              background: 'rgba(255, 255, 255, 0.002)',
              border: '1px solid var(--figma-border-mercury-alt)',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
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
              {data.domain.length}/10
            </span>
          </div>
        </div>

        {/* 워크스페이스 목적 */}
        <div className="flex flex-col gap-3">
          <Label
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '13.2px',
              lineHeight: '14px',
              color: 'var(--figma-text-cod-gray)',
            }}
          >
            워크스페이스 목적
          </Label>
          <RadioGroup
            value={data.purpose}
            onValueChange={(value) => onChange({ purpose: value })}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="study"
                id="study"
                style={{
                  width: '16px',
                  height: '16px',
                  background: 'rgba(255, 255, 255, 0.002)',
                  border: '1px solid var(--figma-border-mercury)',
                  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                }}
              />
              <Label
                htmlFor="study"
                className="cursor-pointer"
                style={{
                  fontFamily: 'Roboto',
                  fontWeight: 100,
                  fontSize: '13.2px',
                  lineHeight: '14px',
                  color: 'var(--figma-text-cod-gray)',
                }}
              >
                학습
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="portfolio"
                id="portfolio"
                style={{
                  width: '16px',
                  height: '16px',
                  background: 'rgba(255, 255, 255, 0.002)',
                  border: '1px solid var(--figma-border-mercury)',
                  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                }}
              />
              <Label
                htmlFor="portfolio"
                className="cursor-pointer"
                style={{
                  fontFamily: 'Roboto',
                  fontWeight: 100,
                  fontSize: '13.1px',
                  lineHeight: '14px',
                  color: 'var(--figma-text-cod-gray)',
                }}
              >
                포트폴리오
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="other"
                id="other"
                style={{
                  width: '16px',
                  height: '16px',
                  background: 'rgba(255, 255, 255, 0.002)',
                  border: '1px solid var(--figma-border-mercury)',
                  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                }}
              />
              <Label
                htmlFor="other"
                className="cursor-pointer"
                style={{
                  fontFamily: 'Roboto',
                  fontWeight: 100,
                  fontSize: '13.2px',
                  lineHeight: '14px',
                  color: 'var(--figma-text-cod-gray)',
                }}
              >
                기타
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
