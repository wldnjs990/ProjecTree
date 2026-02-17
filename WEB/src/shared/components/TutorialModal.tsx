import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  X,
  Network,
  Sparkles,
  MousePointer2,
  FileText,
  Headphones,
} from 'lucide-react';
import { useState } from 'react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    icon: Network,
    title: '시각화된 트리 에디터',
    description:
      '복잡한 기능 명세를 트리 구조로 한눈에 파악하고,\n드래그 앤 드롭으로 자유롭게 기획을 구조화하세요.',
  },
  {
    icon: Sparkles,
    title: 'AI 기획 & 기술 추천',
    description:
      '프로젝트 주제만 입력하면 AI가 에픽, 하위 기능,\n그리고 최적의 기술 스택까지 자동으로 제안해 줍니다.',
  },
  {
    icon: MousePointer2,
    title: '실시간 동시 편집',
    description:
      '팀원들의 커서와 편집 내용이 0.1초 단위로 공유되어,\n같은 공간에 있는 것처럼 생생하게 협업할 수 있습니다.',
  },
  {
    icon: FileText,
    title: '기능 명세서 자동 관리',
    description:
      '작성한 트리는 엑셀 형태의 명세서로 자동 변환되며,\nPDF나 마크다운(Markdown)으로 즉시 내보낼 수 있습니다.',
  },
  {
    icon: Headphones,
    title: '올인원 커뮤니케이션',
    description:
      '작업 흐름을 끊지 않고 내장된 채팅과 음성 통화(Voice Talk)로\n팀원들과 즉각적인 의사소통이 가능합니다.',
  },
];

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = tutorialSteps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setTimeout(() => setCurrentStep(1), 300); // 모달 닫힌 후 초기화
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentIcon = tutorialSteps[currentStep - 1].icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[800px] h-[550px] p-0 border-none shadow-2xl overflow-hidden block"
      >
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white shrink-0">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">
                ProjectTree 이용 가이드
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1 font-medium">
                서비스의 주요 기능을 빠르게 알아보세요. ({currentStep}/
                {totalSteps})
              </DialogDescription>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 min-h-0">
            <div className="w-full max-w-[500px] aspect-[16/9] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center mb-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-6 rounded-2xl bg-green-50 text-[#064E3B] mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <CurrentIcon className="w-16 h-16" strokeWidth={1.5} />
              </div>
            </div>

            <div className="text-center space-y-3 max-w-lg animate-fade-in-up">
              <h3 className="text-2xl font-bold text-gray-800">
                {tutorialSteps[currentStep - 1].title}
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-[15px]">
                {tutorialSteps[currentStep - 1].description}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 bg-white shrink-0">
            <div className="flex gap-2">
              {tutorialSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i + 1 === currentStep
                      ? 'w-8 bg-[#064E3B]'
                      : 'w-1.5 bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  variant="ghost"
                  onClick={handlePrev}
                  className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 font-medium"
                >
                  이전
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="bg-[#4ADE80] hover:bg-[#22c55e] text-[#064E3B] font-bold px-6 shadow-md shadow-green-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {currentStep === totalSteps ? '시작하기' : '다음 단계'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
