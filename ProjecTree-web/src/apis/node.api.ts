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

interface CreateCustomNodeBody {
  name: string;
  description: string;
  nodeType: string;
  parentNodeId: number;
  workspaceId: number;
  xpos: number;
  ypos: number;
}

const postCreateCustomNode = async (
  body: CreateCustomNodeBody
): Promise<ApiResponse<CreateNodeResponse>> => {
  const response = await wasApiClient.post<ApiResponse<CreateNodeResponse>>(
    '/nodes/custom',
    body
  );
  return response.data;
};

interface CustomNodeTechRecommendationBody {
  workspaceId: number;
  techVocaId: number;
}
const postCustomNodeTechRecommendation = async (
  nodeId: number,
  body: CustomNodeTechRecommendationBody
): Promise<ApiResponse<{}>> => {
  const response = await wasApiClient.post(`/nodes/${nodeId}/tech-stack`, body);
  return response.data;
};

export {
  postCreateNode,
  postCreateCustomNode,
  getAiNodeTechRecommendation,
  postCustomNodeTechRecommendation,
};
