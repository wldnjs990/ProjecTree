import { useState } from 'react';
import Stepper from './components/Stepper';
import Step1BasicInfo from './components/Step1BasicInfo';
import Step2Schedule from './components/Step2Schedule';
import Step3TechStack from './components/Step3TechStack';
import Step4TeamEpic from './components/Step4TeamEpic';
import Step5Loading from './components/Step5Loading';
import { ONBOARDING_TEXTS } from './constants';

export default function WorkspaceOnboardingPage() {
  // State: 현재 단계 (1~4)
  const [currentStep, setCurrentStep] = useState(1);

  // State: 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // State: 폼 데이터 저장
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

  // 다음 단계로 이동
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 4) {
      // Step 4에서 "AI 분석 시작" 버튼 클릭
      setIsLoading(true);

      // 3초 후 다음 페이지로 이동 (실제로는 API 호출 후 이동)
      setTimeout(() => {
        // TODO: 실제로는 워크스페이스 생성 API 호출 후 결과 페이지로 이동
        console.log('워크스페이스 생성 완료!', formData);
        // navigate('/workspace/dashboard') 등으로 이동
      }, 3000);
    }
  };

  // 이전 단계로 이동
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 로딩 중일 때는 전체 화면 로딩 표시
  if (isLoading) {
    return <Step5Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 페이지 제목 */}
        <h1 className="text-3xl font-bold text-center mb-8">
          {ONBOARDING_TEXTS.pageTitle}
        </h1>

        {/* Stepper (4단계만 표시) */}
        <Stepper currentStep={currentStep} />

        {/* 현재 단계 정보 */}
        <div className="mt-8 mb-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">
            {ONBOARDING_TEXTS.steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600">
            {ONBOARDING_TEXTS.steps[currentStep - 1].description}
          </p>
        </div>

        {/* 폼 영역 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {currentStep === 1 && (
            <Step1BasicInfo
              data={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
            />
          )}

          {currentStep === 2 && (
            <Step2Schedule
              data={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
            />
          )}

          {currentStep === 3 && (
            <Step3TechStack
              data={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
            />
          )}

          {currentStep === 4 && (
            <Step4TeamEpic
              data={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
            />
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {ONBOARDING_TEXTS.buttons.prev}
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            {currentStep === 4 ? 'AI 분석 시작' : ONBOARDING_TEXTS.buttons.next}
          </button>
        </div>
      </div>
    </div>
  );
}
