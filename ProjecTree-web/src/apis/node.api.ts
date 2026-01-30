import type { ApiResponse } from './api.type';
import wasApiClient from './client';

interface CreateNodeBody {
  xpos: number;
  ypos: number;
}
interface CreateNodePayload {
  nodeId: number;
}
const postCreateNode = async (
  body: CreateNodeBody,
  nodeId: number,
  candidateId: number
): Promise<ApiResponse<CreateNodePayload>> => {
  const response = await wasApiClient.post<ApiResponse<CreateNodePayload>>(
    `/nodes/${nodeId}/candidates/${candidateId}`,
    body
  );
  return response.data;
};

export { postCreateNode };
