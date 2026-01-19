import { ProjectCard } from "./components";

// 확인용 임시 데이터
const mockProject = {
  id: "1",
  title: "여행 일정 추천 AI 서비스",
  description: "사용자 취향을 분석해 여행지를 추천해주는 서비스입니다.",
  role: "Owner",
  progressP0: 45,
  progressP1: 30,
  progressP2: 60,
  lastModified: "2시간 전",
  members: [
    { name: "김싸피", avatar: "", online: true },
    { name: "이개발", avatar: "", online: false },
  ],
};

export default function WorkspaceLoungePage() {
  return (
    <div className="p-10 bg-zinc-50 h-screen">
      <h1 className="text-2xl font-bold mb-6">워크스페이스 라운지 (테스트)</h1>
      <div className="w-[400px]">
        {/* 방금 만든 카드를 여기에 배치! */}
        <ProjectCard project={mockProject} />
      </div>
    </div>
  );
}
