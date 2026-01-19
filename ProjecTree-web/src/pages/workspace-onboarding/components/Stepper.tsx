import { ONBOARDING_TEXTS } from '../constants';

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  // constants에서 단계 정보 가져오기
  const steps = ONBOARDING_TEXTS.steps;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* 단계 원 */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-semibold
                  ${
                    step.number < currentStep
                      ? 'bg-blue-600 text-white' // 완료된 단계
                      : step.number === currentStep
                        ? 'bg-blue-600 text-white' // 현재 단계
                        : 'bg-gray-300 text-gray-600' // 미완료 단계
                  }
                `}
              >
                {step.number < currentStep ? '✓' : step.number}
              </div>
              <span className="text-sm mt-2 text-gray-700">{step.label}</span>
            </div>

            {/* 연결선 (마지막 단계가 아닐 때만) */}
            {index < steps.length - 1 && (
              <div
                className={`
                  w-16 h-1 mx-2 mb-6
                  ${step.number < currentStep ? 'bg-blue-600' : 'bg-gray-300'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
