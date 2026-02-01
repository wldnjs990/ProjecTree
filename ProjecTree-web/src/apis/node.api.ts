import type { ApiResponse } from './api.type';
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
    name: string;
    advantage: string;
    disadvantage: string;
    description: string;
    ref: string;
    recommendation_score: number;
  };
  comparison: string;
}
const getAiNodeTechRecommendation = async (
  nodeId: number
): Promise<ApiResponse<AiNodeRecommendationResponse>> => {
  const response = await wasApiClient.post<
    ApiResponse<AiNodeRecommendationResponse>
  >(`/nodes/${nodeId}/tech-stack/recommendation`);
  return response.data;
};

export { postCreateNode, getAiNodeTechRecommendation };
