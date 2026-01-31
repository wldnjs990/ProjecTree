import type { ProjectCardProps } from "../components/ProjectCard";

/**
 * [데이터] 워크스페이스 목록 더미 데이터
 * - 실제 구현 시에는 API 호출 결과(`useEffect` 등)로 대체되어야 합니다.
 */
export const workspaces: ProjectCardProps["project"][] = [
  {
    id: "1",
    title: "여행 일정 추천 AI 서비스",
    description: "사용자 취향을 분석해 여행지를 추천해주는 서비스입니다.",
    role: "Owner",
    progressP0: 45,
    progressP1: 30,
    progressP2: 60,
    lastModified: "2시간 전",
    updatedAt: "2024-01-03T08:30:00Z",
    members: [
      { name: "김싸피", avatar: "" },
      { name: "이개발", avatar: "" },
      { name: "박디자인", avatar: "" },
    ],
  },
  {
    id: "2",
    title: "온라인 쇼핑몰 플랫폼",
    description: "중소 판매자를 위한 통합 이커머스 솔루션입니다.",
    role: "Editor",
    progressP0: 72,
    progressP1: 55,
    progressP2: 88,
    lastModified: "5시간 전",
    updatedAt: "2024-01-03T05:30:00Z",
    members: [
      { name: "최기획", avatar: "" },
      { name: "김싸피", avatar: "" },
    ],
  },
  {
    id: "3",
    title: "헬스케어 모니터링 앱",
    description: "실시간 건강 데이터 수집 및 분석 대시보드입니다.",
    role: "Viewer",
    progressP0: 28,
    progressP1: 40,
    progressP2: 15,
    lastModified: "1일 전",
    updatedAt: "2024-01-02T10:00:00Z",
    members: [
      { name: "정백엔드", avatar: "" },
      { name: "한프론트", avatar: "" },
      { name: "김싸피", avatar: "" },
    ],
  },
  {
    id: "4",
    title: "실시간 채팅 플랫폼",
    description: "WebSocket 기반의 그룹 메신저 애플리케이션입니다.",
    role: "Owner",
    progressP0: 88,
    progressP1: 92,
    progressP2: 75,
    lastModified: "30분 전",
    updatedAt: "2024-01-03T10:00:00Z",
    members: [
      { name: "김싸피", avatar: "" },
      { name: "송개발", avatar: "" },
    ],
  },
  {
    id: "5",
    title: "교육 콘텐츠 관리 시스템",
    description: "온라인 강의 제작 및 학습 진도 관리 플랫폼입니다.",
    role: "Editor",
    progressP0: 56,
    progressP1: 68,
    progressP2: 44,
    lastModified: "3시간 전",
    updatedAt: "2024-01-03T07:30:00Z",
    members: [
      { name: "박교수", avatar: "" },
      { name: "김싸피", avatar: "" },
      { name: "이학생", avatar: "" },
    ],
  },
  {
    id: "6",
    title: "IoT 스마트홈 대시보드",
    description: "가정 내 IoT 기기를 통합 관리하는 웹 인터페이스입니다.",
    role: "Viewer",
    progressP0: 15,
    progressP1: 22,
    progressP2: 35,
    lastModified: "2일 전",
    updatedAt: "2024-01-01T10:00:00Z",
    members: [
      { name: "최하드웨어", avatar: "" },
      { name: "김싸피", avatar: "" },
    ],
  },
];
