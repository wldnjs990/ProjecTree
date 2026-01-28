import { wasApiClient } from '@/apis/client';

export interface CreateWorkspaceRequest {
  workspaceName: string;
  workspaceKey: string;
  domain: string;
  purpose: string;
  serviceType: string;
  subject: string;
  startDate: Date | null;
  endDate: Date | null;
  specFiles: File[];
  techStacks: string[];
  epics: Array<{ id: string; name: string; description: string }>;
  teamMembers: Array<{ email: string; role: string }>;
}

export interface WorkspaceResponse {
  status: string;
  data: {
    workspaceId: string;
    // 필요한 다른 응답 데이터 추가 가능
  };
}

/**
 * [워크스페이스 API] 워크스페이스 생성
 * @param data - 워크스페이스 생성 정보
 */
export const createWorkspace = async (data: CreateWorkspaceRequest) => {
  // 파일이 포함되어 있으므로 FormData 사용
  const formData = new FormData();

  formData.append('workspaceName', data.workspaceName);
  formData.append('workspaceKey', data.workspaceKey);
  formData.append('domain', data.domain);
  formData.append('purpose', data.purpose);
  formData.append('serviceType', data.serviceType);
  formData.append('subject', data.subject);
  if (data.startDate)
    formData.append('startDate', data.startDate.toISOString());
  if (data.endDate) formData.append('endDate', data.endDate.toISOString());

  // 배열 데이터 처리
  data.techStacks.forEach((stack) => formData.append('techStacks', stack));
  formData.append('epics', JSON.stringify(data.epics));
  formData.append('teamMembers', JSON.stringify(data.teamMembers));

  // 파일 처리
  data.specFiles.forEach((file) => formData.append('specFiles', file));

  const response = await wasApiClient.post<WorkspaceResponse>(
    '/api/workspaces',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};
