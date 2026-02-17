import { CheckCircle, ExternalLink, Info, Plus, XCircle } from 'lucide-react';
import type { TechRecommendation } from '../types';

interface TechDetailProps {
  tech: TechRecommendation;
}

// 커스텀 기술 여부 판별
function isCustomTech(tech: TechRecommendation): boolean {
  return (
    !tech.description &&
    !tech.advantage &&
    !tech.disAdvantage &&
    tech.recommendScore <= 0
  );
}

export default function TechDetailContent({ tech }: TechDetailProps) {
  const isCustom = isCustomTech(tech);

  // 커스텀 기술인 경우 간단한 안내 메시지만 표시
  if (isCustom) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex gap-3 bg-purple-50 p-4 rounded-lg">
          <Plus className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-purple-800 mb-1">
              직접 추가한 기술
            </p>
            <p className="text-sm text-purple-700 leading-relaxed">
              이 기술은 사용자가 직접 추가한 기술입니다.
              <br />
              확정 버튼을 눌러 이 기술을 선택할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 설명 */}
      {tech.description && (
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">설명</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {tech.description}
            </p>
          </div>
        </div>
      )}

      {/* 장점 */}
      {tech.advantage && (
        <div className="flex gap-3 bg-green-50 p-3 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800 mb-1">장점</p>
            <p className="text-sm text-green-700 leading-relaxed">
              {tech.advantage}
            </p>
          </div>
        </div>
      )}

      {/* 단점 */}
      {tech.disAdvantage && (
        <div className="flex gap-3 bg-red-50 p-3 rounded-lg">
          <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800 mb-1">단점</p>
            <p className="text-sm text-red-700 leading-relaxed">
              {tech.disAdvantage}
            </p>
          </div>
        </div>
      )}

      {/* 참고 링크 */}
      {tech.ref && (
        <a
          href={tech.ref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors mt-2 w-full max-w-full"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span className=" max-w-100 truncate min-w-0">{tech.ref}</span>
        </a>
      )}
    </div>
  );
}
