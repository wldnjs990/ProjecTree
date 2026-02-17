import { springInternalClient } from "../springInternalClient";

interface DeleteNodePayload {
  nodeId: number;
}

export async function deleteNodeToSpring(
  payload: DeleteNodePayload,
): Promise<boolean> {
  try {
    const result = await springInternalClient.delete(
      `/api/internal/nodes/${payload.nodeId}`,
    );

    console.log("[Delete Node] Spring response: ", result.data.success);
    return true;
  } catch (error: any) {
    console.error(
      "Spring 저장 실패",
      {
        nodeId: payload.nodeId,
        message: error?.message,
        response: error?.response?.data,
      },
      new Date().toISOString(),
    );
    return false;
  }
}
