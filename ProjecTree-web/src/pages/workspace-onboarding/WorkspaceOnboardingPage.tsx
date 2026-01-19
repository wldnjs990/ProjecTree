import { useState } from 'react';
import Stepper from './components/Stepper';
import Step1BasicInfo from './components/Step1BasicInfo';
import Step2Schedule from './components/Step2Schedule';
import Step3TechStack from './components/Step3TechStack';
import Step4TeamEpic from './components/Step4TeamEpic';
import Step5Loading from './components/Step5Loading';

export default function WorkspaceOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    workspaceName: '',
    workspaceKey: '',
    domain: '',
    purpose: '',
    subject: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    techStacks: [] as string[],
    epics: [] as Array<{ id: string; name: string; description: string }>,
    teamMembers: [] as Array<{ email: string; role: string }>,
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 4) {
      setIsLoading(true);
      setTimeout(() => {
        console.log('워크스페이스 생성 완료!', formData);
      }, 3000);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return <Step5Loading />;
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-24"
      style={{ background: 'var(--figma-bg-alabaster)' }}
    >
      <div className="w-full" style={{ maxWidth: '512px' }}>
        {/* Stepper */}
        <Stepper currentStep={currentStep} />

        {/* 카드 컨테이너 */}
        <div
          className="flex flex-col p-8"
          style={{
            background: 'var(--figma-white)',
            border: '1px solid var(--figma-border-mercury)',
            boxShadow:
              '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
          }}
        >
          {/* 현재 단계 컴포넌트 */}
          {currentStep === 1 && (
            <Step1BasicInfo
              data={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {currentStep === 2 && (
            <Step2Schedule
              data={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {currentStep === 3 && (
            <Step3TechStack
              data={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {currentStep === 4 && (
            <Step4TeamEpic
              data={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}
        </div>
      </div>
    </div>
  );
}
