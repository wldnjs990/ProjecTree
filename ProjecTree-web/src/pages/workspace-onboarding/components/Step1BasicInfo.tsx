import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Step1BasicInfoProps {
  data: {
    workspaceName: string;
    workspaceKey: string;
  };
  onChange: (updates: Partial<Step1BasicInfoProps['data']>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step1BasicInfo({
  data,
  onChange,
  // onNext,
  // onPrev,
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
          워크스페이스명과 키를 설정하세요
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
      </div>
    </div>
  );
}
