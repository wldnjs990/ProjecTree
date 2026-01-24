import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import Stepper from './components/Stepper';
import Step1BasicInfo from './components/Step1BasicInfo';
import Step2ProjectType from './components/Step2ProjectType';
import Step3Schedule from './components/Step3Schedule';
import Step4TechStack from './components/Step4TechStack';
import Step5TeamInvite from './components/Step5TeamInvite';
import Step6EpicSetup from './components/Step6EpicSetup';
import Step7Loading from './components/Step7Loading';

export default function WorkspaceOnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    workspaceName: '',
    workspaceKey: '',
    domain: '',
    purpose: '',
    serviceType: '',
    subject: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    specFiles: [] as File[],
    techStacks: [] as string[],
    epics: [] as Array<{ id: string; name: string; description: string }>,
    teamMembers: [] as Array<{ email: string; role: string }>,
  });

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 6) {
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
    return <Step7Loading />;
  }

  return (
    <div
      className="min-h-screen bg-[var(--figma-bg-alabaster)]"
    >
      {/* 왼쪽 상단 뒤로가기 버튼 */}
      <div className="fixed left-4 top-4 z-20">
        <button
          onClick={() => navigate('/workspaceLounge')}
          className="flex items-center gap-1 rounded-lg p-2 transition-colors hover:bg-gray-100 font-['Roboto'] font-thin text-[14px] text-[var(--figma-text-cod-gray)]"
        >
          <ChevronLeft className="h-5 w-5" />
          뒤로가기
        </button>
      </div>

      {/* Stepper - position: fixed로 완전 고정 */}
      <div className="fixed top-0 left-0 right-0 z-10 flex justify-center pt-6 pb-2 bg-[var(--figma-bg-alabaster)]">
        <div className="w-full max-w-[512px] px-4">
          <Stepper currentStep={currentStep} />
        </div>
      </div>

      {/* 카드 컨테이너 - 상단 여백 추가 (Stepper 높이만큼) */}
      <div className="flex justify-center px-4 pt-[110px] pb-[100px]">
        <div className="flex flex-col p-8 w-full max-w-[512px] bg-[var(--figma-white)] border border-[var(--figma-border-mercury)] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] rounded-xl">
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
            <Step2ProjectType
              data={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {currentStep === 3 && (
            <Step3Schedule
              data={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {currentStep === 4 && (
            <Step4TechStack
              data={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {currentStep === 5 && (
            <Step5TeamInvite
              data={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {currentStep === 6 && (
            <Step6EpicSetup
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

      <div className="fixed bottom-0 left-0 right-0 z-10 flex justify-center py-4 bg-[var(--figma-bg-alabaster)]">
        <div className="flex w-full justify-between px-4 max-w-[512px]">
          {currentStep > 1 ? (
            <button
              onClick={handlePrev}
              className="font-['Roboto'] font-thin text-[13.2px] leading-5 px-8 py-2 bg-transparent text-[var(--figma-text-emperor)] rounded-md border border-[var(--figma-border-mercury)] cursor-pointer"
            >
              이전
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            className="font-['Roboto'] font-thin text-[13.2px] leading-5 px-8 py-2 bg-[var(--figma-primary-blue)] text-[var(--figma-white)] rounded-md border-none cursor-pointer"
          >
            {currentStep === 6 ? 'AI 분석 시작' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}
