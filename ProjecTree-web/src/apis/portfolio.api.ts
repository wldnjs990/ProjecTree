import { wasApiClient } from '../shared/lib/axiosClient';

/**
 * [타입] 포트폴리오 데이터
 */
export interface Portfolio {
  id: number;
  content: string;
}

/**
 * [타입] API 응답 래퍼
 */
export interface PortfolioResponse {
  data: Portfolio;
}

/**
 * [API] 포트폴리오 조회
 * GET /workspaces/{workspace-id}/portfolio
 * - 없으면 404 에러 반환
 */
export async function getPortfolio(
  workspaceId: number
): Promise<Portfolio | null> {
  try {
    const response = await wasApiClient.get<PortfolioResponse>(
      `/workspaces/${workspaceId}/portfolio`
    );
    return response.data.data;
  } catch (error: unknown) {
    // 404 에러는 포트폴리오가 없는 정상 케이스
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        return null;
      }
    }
    throw error;
  }
}

/**
 * [API] 포트폴리오 생성 (AI 생성)
 * POST /workspaces/{workspace-id}/portfolio
 * - content 없이 요청, 백엔드에서 AI로 자동 생성
 * - 생성 시간이 오래 걸릴 수 있음
 */
export async function generatePortfolio(
  workspaceId: number
): Promise<Portfolio> {
  const response = await wasApiClient.post<PortfolioResponse>(
    `/workspaces/${workspaceId}/portfolio`
  );
  return response.data.data;
}

/**
 * [API] 포트폴리오 수정
 * PATCH /workspaces/portfolio
 * - { id, content } 전송
 */
export async function updatePortfolio(
  id: number,
  content: string
): Promise<Portfolio> {
  const response = await wasApiClient.patch<PortfolioResponse>(
    '/workspaces/portfolio',
    { id, content }
  );
  return response.data.data;
}
