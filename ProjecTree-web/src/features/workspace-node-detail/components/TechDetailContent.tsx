import { CheckCircle, ExternalLink, Info, XCircle } from 'lucide-react';
import type { TechRecommendation } from '../types';

interface TechDetailProps {
  tech: TechRecommendation;
}

export default function TechDetailContent({ tech }: TechDetailProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 설명 */}
      <div className="flex gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">설명</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {tech.description}
          </p>
        </div>
      </div>

      {/* 장점 */}
      <div className="flex gap-3 bg-green-50 p-3 rounded-lg">
        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-800 mb-1">장점</p>
          <p className="text-sm text-green-700 leading-relaxed">
            {tech.advantage}
          </p>
        </div>
      </div>

      {/* 단점 */}
      <div className="flex gap-3 bg-red-50 p-3 rounded-lg">
        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-800 mb-1">단점</p>
          <p className="text-sm text-red-700 leading-relaxed">
            {tech.disadvantage}
          </p>
        </div>
      </div>

      {/* 참고 링크 */}
      <a
        href={tech.ref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors mt-2"
      >
        <ExternalLink className="w-4 h-4" />
        <span className="truncate">{tech.ref}</span>
      </a>
    </div>
  );
}
