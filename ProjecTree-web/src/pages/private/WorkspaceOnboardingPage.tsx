import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import {
  Stepper,
  Step1BasicInfo,
  Step2ProjectType,
  Step3Schedule,
  Step4TechStack,
  Step5TeamInvite,
  Step6EpicSetup,
  Step7Loading,
  ONBOARDING_TEXTS,
} from '@/features/workspace-onboarding';
import { createWorkspace } from '@/apis/workspace.api';
import type { Role } from '@/apis/workspace.api';

export default function WorkspaceOnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const steps = ONBOARDING_TEXTS.steps;
  const totalSteps = steps.length;
  const currentStepLabel =
    steps.find((step) => step.number === currentStep)?.label ?? '';

  const [formData, setFormData] = useState({
    name: '',
    workspaceKey: '',
    domain: '',
    purpose: '',
    serviceType: '',
    description: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    specFiles: [] as File[],
    techStacks: [] as number[], // 🚨 ID 기반 (number)
    epics: [] as Array<{ name: string; description: string }>,
    memberRoles: {} as Record<string, Role>, // 🚨 변경: Map 구조 (이메일 -> 역할)
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // 입력 시 해당 필드의 에러 제거
    if (Object.keys(errors).length > 0) {
      const newErrors = { ...errors };
      Object.keys(updates).forEach((key) => {
        delete newErrors[key];
      });
      setErrors(newErrors);
    }
  };

  const handleNext = async () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = '워크스페이스명을 입력해주세요.';
      }
      if (!formData.workspaceKey.trim()) {
        newErrors.workspaceKey = '워크스페이스 키를 입력해주세요.';
      } else if (formData.workspaceKey.length !== 4) {
        newErrors.workspaceKey = '워크스페이스 키는 4자여야 합니다.';
      }
    }

    if (currentStep === 2) {
      if (!formData.domain) {
        newErrors.domain = '도메인을 선택해주세요.';
      }
      if (!formData.serviceType) {
        newErrors.serviceType = '서비스 유형을 선택해주세요.';
      }
    }

    if (currentStep === 3) {
      if (!formData.description.trim()) {
        newErrors.description = '프로젝트 주제를 입력해주세요.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 6) {
      setIsLoading(true);
      try {
        console.log('[API] 워크스페이스 생성 요청 시작...');
        const response = await createWorkspace(formData);
        console.log('[API] 워크스페이스 생성 성공:', response);

        // 성공 시 워크스페이스 라운지로 이동
        alert(`워크스페이스가 생성되었습니다! (ID: ${response.data})`);
        navigate('/workspace-lounge');
      } catch (error) {
        console.error('[API] 워크스페이스 생성 실패:', error);
        alert('워크스페이스 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[var(--figma-tech-green)] font-['Pretendard'] overflow-hidden relative">
      {/* Background Gradients & Noise (Global) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Minimalist Dot Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Top-Left Ambient Light (Neon Green) */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--figma-neon-green)] opacity-[0.08] blur-[120px]" />

        {/* Bottom-Right Shadow (Dark Depth) */}
        <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] rounded-full bg-[#001E10] opacity-[0.6] blur-[100px]" />

        {/* Center Subtle Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-white opacity-[0.02] blur-[80px]" />
      </div>

      {/* Left Side (Marketing/Vision) */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 overflow-hidden z-10">
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
      <div className="onboarding-right-panel w-full lg:w-[70%] bg-white relative flex flex-col items-center justify-center p-8 lg:px-24 lg:py-12 shadow-2xl">
        {/* Mobile Header */}
        <div className="lg:hidden w-full absolute top-0 left-0 p-4 bg-[var(--figma-tech-green)] text-white flex justify-between z-50">
          <span className="font-bold">ProjecTree</span>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-white/80">
              {currentStepLabel}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                0{currentStep}
              </span>
              <div className="h-[2px] w-10 bg-white/20">
                <div
                  className="h-full bg-[var(--figma-neon-green)] transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-white/60">
                0{totalSteps}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[500px] h-[600px] flex flex-col justify-between relative z-20 pt-16 lg:pt-0">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Step7Loading />
            </div>
          ) : (
            <>
              {/* Top Section: Indicator + Form */}
              <div className="w-full">
                {/* Step Indicator */}
                <div className="hidden lg:flex items-center gap-2 mb-8">
                  <span className="text-[var(--figma-tech-green)] font-bold text-lg">
                    0{currentStep}
                  </span>
                  <div className="h-[2px] w-12 bg-gray-200">
                    <div
                      className="h-full bg-[var(--figma-neon-green)] transition-all duration-300"
                      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-300 font-medium text-lg">
                    0{totalSteps}
                  </span>
                </div>

                {/* Form Container with Input Override */}
                <div className="onboarding-input-override animate-fade-in-up">
                  {currentStep === 1 && (
                    <Step1BasicInfo
                      data={formData}
                      errors={errors}
                      onChange={handleFormDataChange}
                      onNext={handleNext}
                      onPrev={handlePrev}
                    />
                  )}
                  {currentStep === 2 && (
                    <Step2ProjectType
                      data={formData}
                      errors={errors}
                      onChange={handleFormDataChange}
                      onNext={handleNext}
                      onPrev={handlePrev}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3Schedule
                      data={formData}
                      errors={errors}
                      onChange={handleFormDataChange}
                      onNext={handleNext}
                      onPrev={handlePrev}
                    />
                  )}
                  {currentStep === 4 && (
                    <Step4TechStack
                      data={formData}
                      onChange={handleFormDataChange}
                      onNext={handleNext}
                      onPrev={handlePrev}
                    />
                  )}
                  {currentStep === 5 && (
                    <Step5TeamInvite
                      data={formData}
                      onChange={handleFormDataChange}
                      onNext={handleNext}
                      onPrev={handlePrev}
                    />
                  )}
                  {currentStep === 6 && (
                    <Step6EpicSetup
                      data={formData}
                      onChange={handleFormDataChange}
                      onNext={handleNext}
                      onPrev={handlePrev}
                    />
                  )}
                </div>
              </div>

              {/* Bottom Section: Actions */}
              <div className="flex flex-col gap-4 mt-auto pt-4">
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
        className="absolute bottom-12 left-12 z-50 inline-flex items-center gap-2 text-[var(--figma-neon-green)]/60 hover:text-[var(--figma-neon-green)] transition-colors font-medium text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        돌아가기
      </button>
    </div>
  );
}
