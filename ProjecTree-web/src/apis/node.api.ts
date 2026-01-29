import type { ApiResponse } from './api.type';
import wasApiClient from './client';

interface CreateNodePayload {
  nodeId: number;
}

const postCreateNode = async (
  nodeId: number,
  candidateId: number
): Promise<ApiResponse<CreateNodePayload>> => {
  const response = await wasApiClient.post<ApiResponse<CreateNodePayload>>(
    `/nodes/${nodeId}/candidates/${candidateId}`
  );
  return response.data;
};

export { postCreateNode };
