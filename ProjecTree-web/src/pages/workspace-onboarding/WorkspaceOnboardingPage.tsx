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

  return (
    <div className="flex min-h-screen w-full bg-[var(--figma-tech-green)] font-['Pretendard'] overflow-hidden">
      {/* Left Side (Marketing/Vision) */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 overflow-hidden">
        {/* Abstract Geometric Lines Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(-45deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Brand */}
        <div className="relative z-10">
          <h1 className="text-xl font-bold text-[var(--figma-neon-green)] tracking-widest">
            PROJECTREE
          </h1>
        </div>

        {/* Stepper (Minimalist Overlay) */}
        <div className="absolute top-1/2 left-12 -translate-y-1/2 z-10">
          <Stepper currentStep={currentStep} />
        </div>
      </div>

      {/* Right Side (Content) with Diagonal Split */}
      <div
        className="w-full lg:w-[60%] bg-white relative flex flex-col items-center justify-center p-8 lg:p-24 shadow-2xl"
        style={{ clipPath: 'polygon(120px 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        {/* Mobile Header */}
        <div className="lg:hidden w-full absolute top-0 left-0 p-4 bg-[var(--figma-tech-green)] text-white flex justify-between z-50">
          <span className="font-bold">ProjecTree</span>
          <span>{currentStep}/6</span>
        </div>

        <div className="w-full max-w-[500px] flex flex-col gap-10 relative z-20">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Step7Loading />
            </div>
          ) : (
            <>
              {/* Step Indicator */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[var(--figma-tech-green)] font-bold text-lg">
                  0{currentStep}
                </span>
                <div className="h-[2px] w-12 bg-gray-200">
                  <div
                    className="h-full bg-[var(--figma-neon-green)] transition-all duration-300"
                    style={{ width: `${(currentStep / 6) * 100}%` }}
                  />
                </div>
                <span className="text-gray-300 font-medium text-lg">06</span>
              </div>

              {/* Form Container with Input Override */}
              <div className="onboarding-input-override animate-fade-in-up">
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

              {/* Actions */}
              <div className="flex flex-col gap-4 mt-8">
                <button
                  onClick={handleNext}
                  id="next-step-btn"
                  className="w-full h-[60px] rounded-full text-[18px] font-bold text-[var(--figma-tech-green)] bg-[var(--figma-neon-green)] hover:shadow-[0_0_30px_rgba(74,222,128,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {currentStep === 6 ? '워크스페이스 생성' : '다음 단계'}
                  <ChevronLeft className="rotate-180 h-5 w-5" />
                </button>

                {currentStep > 1 && (
                  <button
                    onClick={handlePrev}
                    className="text-gray-400 hover:text-[var(--figma-tech-green)] font-medium text-sm py-2 transition-colors"
                  >
                    이전 단계
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Back Button (Absolute) */}
      <button
        onClick={() => navigate('/workspace-lounge')}
        className="absolute bottom-8 right-8 z-50 text-gray-300 hover:text-[var(--figma-tech-green)] transition-colors"
      >
        나가기
      </button>
    </div>
  );
}
