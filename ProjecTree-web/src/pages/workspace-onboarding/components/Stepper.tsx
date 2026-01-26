import { ONBOARDING_TEXTS } from '../constants';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  const steps = ONBOARDING_TEXTS.steps;

  return (
    <div className="flex flex-col gap-0 relative">
      {/* Connecting Line */}
      <div className="absolute left-[15px] top-[15px] bottom-[15px] w-[2px] bg-white/10 z-0" />

      {steps.map((step) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <div key={step.number} className="flex items-center gap-4 relative z-10 py-3">
            {/* Step Circle */}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300
                ${isActive
                  ? 'bg-white text-[var(--figma-forest-deep)] ring-4 ring-white/20 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                  : isCompleted
                    ? 'bg-[var(--figma-forest-accent)] text-[var(--figma-forest-deep)]'
                    : 'bg-transparent border-2 border-white/20 text-white/40' // Inactive
                }`}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : step.number}
            </div>

            {/* Step Label */}
            <div className="flex flex-col">
              <span
                className={`text-sm font-medium transition-colors duration-300
                  ${isActive
                    ? 'text-white font-bold'
                    : isCompleted
                      ? 'text-white/90'
                      : 'text-white/40'
                  }`}
              >
                {step.label}
              </span>
              {isActive && (
                <span className="text-xs text-[var(--figma-forest-accent)] animate-fade-in-up mt-0.5">
                  현재 진행 중
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
