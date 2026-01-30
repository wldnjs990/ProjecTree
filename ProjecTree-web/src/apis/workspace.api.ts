import { wasApiClient } from '@/apis/client';

/**
 * [타입] 프론트엔드 폼 데이터 (기존 유지)
 */
export interface CreateWorkspaceFormData {
  workspaceName: string;
  workspaceKey: string;
  domain: string;
  purpose: string;
  serviceType: string;
  subject: string;
  startDate: Date | null;
  endDate: Date | null;
  specFiles: File[];
  techStacks: number[]; // 🚨 변경: 이름(string) -> ID(number) 목록으로 변경
  epics: Array<{ id: string; name: string; description: string }>; // id는 프론트엔드 UI용
  teamMembers: Array<{ email: string; role: string }>;
}

/**
 * [타입] 백엔드 API 응답 (명세서 기준)
 */
export interface WorkspaceResponse {
  message: string;
  data: string;
  code: number; // 숫자 타입 (예: 1073741824)
  success: boolean;
}

/**
 * [타입] 기술 스택 아이템 (API 조회용)
 */
export interface TechStackItem {
  id: number;
  name: string;
}

/**
 * [가짜 API] 기술 스택 목록 조회
 * (백엔드가 /api/tech-stacks 만들면, axios 호출로 교체 예정)
 */
export const getTechStacks = async (): Promise<TechStackItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 🟢 가짜 데이터 (ID, Name만 넘김)
      resolve([
        { id: 1, name: 'React' },
        { id: 2, name: 'Vue' },
        { id: 3, name: 'Angular' },
        { id: 4, name: 'Spring Boot' },
        { id: 5, name: 'Django' },
        { id: 6, name: 'Node.js' },
        { id: 7, name: 'MySQL' },
        { id: 8, name: 'PostgreSQL' },
        { id: 9, name: 'MongoDB' },
        { id: 10, name: 'Docker' },
        { id: 11, name: 'Kubernetes' },
        { id: 12, name: 'AWS' },
        { id: 13, name: 'Next.js' },
        { id: 14, name: 'NestJS' },
      ]);
    }, 300); // 0.3초 로딩 흉내
  });
};

/**
 * [워크스페이스 API] 워크스페이스 생성
 * @param data - 워크스페이스 생성 정보
 * @returns 워크스페이스 생성 응답
 */
export const createWorkspace = async (data: CreateWorkspaceFormData) => {
  // 파일이 포함되어 있으므로 FormData 사용
  const formData = new FormData();

  // 1. JSON 데이터 객체 생성
  // 멤버 역할 변환 (한글 -> 영어 Enum)
  const roleMap: Record<string, string> = {
    '관리자 - 모든 권한': 'OWNER',
    '편집자 - 편집 가능': 'EDITOR',
    '뷰어 - 보기만 가능': 'VIEWER', // UI 텍스트와 일치시킴
  };

  const memberRoles: Record<string, string> = {};
  data.teamMembers.forEach((member) => {
    // 1. 이미 영어라면 그대로 사용
    if (['OWNER', 'EDITOR', 'VIEWER'].includes(member.role)) {
      memberRoles[member.email] = member.role;
    } else {
      // 2. 한글이라면 매핑된 영어 값 사용 (없으면 기본값 EDITOR)
      memberRoles[member.email] = roleMap[member.role] || 'EDITOR';
    }
  });

  // 에픽 변환 (id 제거)
  const epics = data.epics.map(({ name, description }) => ({
    name,
    description,
  }));

  // JSON 데이터 구성
  const requestData = {
    name: data.workspaceName,
    description: data.subject,
    domain: data.domain,
    purpose: data.purpose,
    serviceType: data.serviceType, // 🚨 UI에서 이미 WEB/APP으로 관리하므로 그대로 전송
    identifierPrefix: data.workspaceKey,
    startDate: data.startDate
      ? data.startDate.toISOString().split('T')[0]
      : null,
    endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : null,
    memberRoles,
  };

  // techStacks가 있을 때만 추가 (백엔드 준비되면 주석 해제)
  // if (data.techStacks && data.techStacks.length > 0) {
  //   (requestData as any).techStacks = data.techStacks; // 이제 [1, 5, 10] 같은 ID 배열이 들어감
  // }

  // epics가 있을 때만 추가 (사용자 요청으로 제거 - 백엔드 미구현)
  // if (epics && epics.length > 0) {
  //   (requestData as any).epics = epics;
  // }

  // 📝 디버깅 로그 추가 (이 내용을 캡쳐해주세요!)
  console.log('🚀 [API 요청 데이터 확인 - 최신 버전(기술스택 미포함)]');
  console.log('1. JSON 데이터:', JSON.stringify(requestData, null, 2));
  console.log('2. 파일 개수:', data.specFiles.length);
  data.specFiles.forEach((file, index) => {
    console.log(`   - 파일 ${index + 1}:`, file.name, file.size, file.type);
  });

  // 2. FormData에 데이터 담기
  // JSON 객체 -> Blob (application/json) -> 'data' 필드
  formData.append(
    'data',
    new Blob([JSON.stringify(requestData)], { type: 'application/json' })
  );

  // 파일 -> 'files' 필드 (Swagger 기준)
  data.specFiles.forEach((file) => formData.append('files', file));

  const response = await wasApiClient.post<WorkspaceResponse>(
    '/workspaces',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};
