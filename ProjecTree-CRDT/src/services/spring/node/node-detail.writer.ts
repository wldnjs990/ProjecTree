import { springInternalClient } from "../springInternalClient";
import type { SendNodeDetail } from "../../../domain/node/node.detail";

interface SaveNodeDetailPayload {
  nodeId: number;
  detail: SendNodeDetail;
}

export async function saveNodeDetailToSpring(
  payload: SaveNodeDetailPayload,
): Promise<boolean> {
  try {
    const result = await springInternalClient.patch(
      `/api/internal/nodes/${payload.nodeId}/detail`,
      payload.detail,
    );

    console.log("[Save Detail] Spring response: ", result.data.success);
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
