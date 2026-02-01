import { wasApiClient } from '@/apis/client';
import type {
  ApiNode,
  NodeDetailData,
} from '@/features/workspace-core';

// ===== 워크스페이스 트리 조회 =====

/** 워크스페이스 트리 조회 응답 타입 */
export interface WorkspaceTreeResponse {
  message: string;
  isSuccess: boolean;
  code: number;
  data: {
    tree: ApiNode[];
  };
}

/**
 * [워크스페이스 API] 워크스페이스 노드 트리 조회
 * @param workspaceId - 워크스페이스 ID
 */
export const getWorkspaceTree = async (
  workspaceId: number
): Promise<ApiNode[]> => {
  const response = await wasApiClient.get<WorkspaceTreeResponse>(
    `/workspaces/${workspaceId}`
  );
  return response.data.data.tree;
};

// ===== 노드 상세정보 조회 =====

/** 노드 상세정보 조회 응답 타입 */
export interface NodeDetailResponse {
  message: string;
  data: NodeDetailData;
  code: number;
  success: boolean;
}

/**
 * [노드 API] 노드 상세정보 조회
 * @param nodeId - 노드 ID
 */
export const getNodeDetail = async (
  nodeId: number
): Promise<NodeDetailData> => {
  const response = await wasApiClient.get<NodeDetailResponse>(
    `/nodes/${nodeId}`
  );
  return response.data.data;
};

// ===== 노드 후보 생성 (AI 추천) =====

import type { Candidate } from '@/features/workspace-core';
import type { ApiResponse } from './api.type';

/** 노드 후보 생성 응답 타입 */
export interface NodeCandidatesResponse {
  message: string;
  data: {
    candidates: Array<{
      name: string;
      description: string;
    }>;
  };
  code: number;
  success: boolean;
}

/**
 * [노드 API] AI 노드 후보 생성
 * @param nodeId - 부모 노드 ID
 */
export const generateNodeCandidates = async (
  nodeId: number
): Promise<Candidate[]> => {
  const response = await wasApiClient.post<NodeCandidatesResponse>(
    `nodes/${nodeId}/candidates`
  );
  console.log(response);
  // API 응답에서 id, taskType이 없으므로 클라이언트에서 임시 생성
  return response.data.data.candidates.map((c, index) => ({
    ...c,
    id: Date.now() + index,
    taskType: null,
  }));
};

export const selectNodeCandidates = async (
  nodeId: number,
  candidateId: number,
  body: { xpos: number; ypos: number }
): Promise<ApiResponse<{ nodeId: number }>> => {
  const response = await wasApiClient.post<ApiResponse<{ nodeId: number }>>(
    `nodes/${nodeId}/candidates/${candidateId}`,
    body
  );
  console.log(response);
  // API 응답에서 id, taskType이 없으므로 클라이언트에서 임시 생성
  return response.data;
};

// ===== 워크스페이스 생성 =====

/**
 * [타입] 프론트엔드 폼 데이터 (기존 유지)
 */
/**
 * [타입] 멤버 역할 (API 호환용)
 */
export type Role = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface CreateWorkspaceFormData {
  name: string;
  workspaceKey: string;
  domain: string;
  purpose: string;
  serviceType: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  specFiles: File[];
  techStacks: number[]; // 🚨 변경: 이름(string) -> ID(number) 목록으로 변경
  epics: Array<{ name: string; description: string }>; // 🚨 변경: ID 제거 (백엔드 X, 프론트엔드도 Index 사용)
  memberRoles: Array<{ email: string; role: string }>;
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
 * [API] 워크스페이스 생성
 */
export const createWorkspace = async (
  data: CreateWorkspaceFormData
): Promise<WorkspaceResponse> => {
  // 파일이 포함되어 있으므로 FormData 사용
  const formData = new FormData();

  // 1. JSON 데이터 객체 생성
  // 에픽 변환 (id 제거)
  // 에픽: 이미 { name, description } 형태이므로 그대로 사용 가능
  // 만약 추가적인 가공이 필요하다면 여기서 처리
  const epics = data.epics;

  // JSON 데이터 구성
  const requestData = {
    name: data.name,
    description: data.description,
    domain: data.domain,
    purpose: data.purpose,
    serviceType: data.serviceType,
    identifierPrefix: data.workspaceKey,
    startDate: data.startDate
      ? data.startDate.toISOString().split('T')[0]
      : null,
    endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : null,
    memberRoles: data.memberRoles, // 🚨 이제 그대로 전송 (Record<string, Role>)
    workspaceTechStacks: data.techStacks, // 🚨 백엔드 요청대로 필드명 변경 및 활성화
    epics: epics, // 🚨 재변경: 백엔드 DTO(epics) 확인 -> epics (복수형)
  };

  // 📝 디버깅 로그 추가
  console.log('🚀 [API 요청 데이터 확인 - 최종 수정 버전]');
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
