import { ONBOARDING_TEXTS } from '../constants';

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  const steps = ONBOARDING_TEXTS.steps;

  return (
    <div className="mb-4 flex justify-center">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* 단계 원과 라벨 */}
            <div className="flex flex-col items-center">
              {/* 원형 배경 */}
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
                style={{
                  backgroundColor:
                    step.number <= currentStep
                      ? 'var(--figma-primary-blue)'
                      : 'var(--figma-gray-concrete)',
                  color:
                    step.number <= currentStep
                      ? 'var(--figma-white)'
                      : 'var(--figma-text-emperor)',
                  fontFamily: 'Roboto',
                  fontWeight: 100,
                  fontSize: '14px',
                  lineHeight: '20px',
                }}
              >
                {step.number}
              </div>
              {/* 라벨 */}
              <span
                className="mt-2 text-center"
                style={{
                  fontFamily: 'Roboto',
                  fontWeight: 100,
                  fontSize: '11.4px',
                  lineHeight: '16px',
                  color:
                    step.number <= currentStep
                      ? 'var(--figma-text-cod-gray)'
                      : 'var(--figma-text-emperor)',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.label}
              </span>
            </div>

            {/* 연결선 (마지막 단계가 아닐 때만) */}
            {index < steps.length - 1 && (
              <div
                className="mx-2 mb-6"
                style={{
                  width: '48px',
                  height: '2px',
                  backgroundColor: 'var(--figma-gray-concrete)',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
