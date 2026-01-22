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
    specFile: null as File | null,
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
      className="min-h-screen"
      style={{ background: 'var(--figma-bg-alabaster)' }}
    >
      {/* 왼쪽 상단 뒤로가기 버튼 */}
      <div className="fixed left-4 top-4 z-20">
        <button
          onClick={() => navigate('/workspaceLounge')}
          className="flex items-center gap-1 rounded-lg p-2 transition-colors hover:bg-gray-100"
          style={{
            fontFamily: 'Roboto',
            fontWeight: 100,
            fontSize: '14px',
            color: 'var(--figma-text-cod-gray)',
          }}
        >
          <ChevronLeft className="h-5 w-5" />
          뒤로가기
        </button>
      </div>

      {/* Stepper - position: fixed로 완전 고정 */}
      <div
        className="fixed top-0 left-0 right-0 z-10 flex justify-center pt-6 pb-2"
        style={{ background: 'var(--figma-bg-alabaster)' }}
      >
        <div
          style={{
            maxWidth: '512px',
            width: '100%',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          <Stepper currentStep={currentStep} />
        </div>
      </div>

      {/* 카드 컨테이너 - 상단 여백 추가 (Stepper 높이만큼) */}
      <div
        className="flex justify-center px-4"
        style={{ paddingTop: '110px', paddingBottom: '100px' }}
      >
        <div
          className="flex flex-col p-8"
          style={{
            maxWidth: '512px',
            width: '100%',
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

      {/* 하단 고정 버튼 */}
      <div
        className="fixed bottom-0 left-0 right-0 z-10 flex justify-center py-4"
        style={{ background: 'var(--figma-bg-alabaster)' }}
      >
        <div
          className="flex w-full justify-between px-4"
          style={{ maxWidth: '512px' }}
        >
          {currentStep > 1 ? (
            <button
              onClick={handlePrev}
              style={{
                fontFamily: 'Roboto',
                fontWeight: 100,
                fontSize: '13.2px',
                lineHeight: '20px',
                padding: '8px 32px',
                background: 'transparent',
                color: 'var(--figma-text-emperor)',
                borderRadius: '6px',
                border: '1px solid var(--figma-border-mercury)',
                cursor: 'pointer',
              }}
            >
              이전
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            style={{
              fontFamily: 'Roboto',
              fontWeight: 100,
              fontSize: '13.2px',
              lineHeight: '20px',
              padding: '8px 32px',
              background: 'var(--figma-primary-blue)',
              color: 'var(--figma-white)',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {currentStep === 6 ? 'AI 분석 시작' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}
