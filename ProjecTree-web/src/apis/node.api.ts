import type { ApiResponse } from './types';
import wasApiClient from './client';

interface CreateNodeBody {
  xpos: number;
  ypos: number;
}
interface CreateNodeResponse {
  nodeId: number;
}
const postCreateNode = async (
  body: CreateNodeBody,
  nodeId: number,
  candidateId: number
): Promise<ApiResponse<CreateNodeResponse>> => {
  const response = await wasApiClient.post<ApiResponse<CreateNodeResponse>>(
    `/nodes/${nodeId}/candidates/${candidateId}`,
    body
  );
  return response.data;
};

interface AiNodeRecommendationResponse {
  techs: {
    id: number;
    name: string;
    advantage: string;
    disAdvantage: string;
    description: string;
    ref: string;
    recommendScore: number;
  };
  comparison: string;
}
const getAiNodeTechRecommendation = async (
  nodeId: number,
  workspaceId: number
): Promise<ApiResponse<AiNodeRecommendationResponse>> => {
  const response = await wasApiClient.post<
    ApiResponse<AiNodeRecommendationResponse>
  >(`/nodes/${nodeId}/tech-stack/recommendation`, { workspaceId });
  return response.data;
};

export { postCreateNode, getAiNodeTechRecommendation };
