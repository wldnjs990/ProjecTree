export default function Step5Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* 스피너 */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>

      {/* 메시지 */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          AI가 프로젝트를 분석 중입니다...
        </h3>
        <p className="text-gray-600">에픽과 하위 태스크를 생성하고 있습니다.</p>
      </div>

      {/* 점 애니메이션 */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></div>
      </div>
    </div>
  );
}
