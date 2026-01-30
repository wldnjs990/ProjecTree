import { springClient } from "./../../spring/springClient";
import type { SendNodeDetail } from "../../../domain/node/node.detail";

interface SaveNodeDetailPayload {
  workspaceId: number;
  nodeId: number;
  detail: SendNodeDetail;
}

export async function saveNodeDetailToSpring(
  payload: SaveNodeDetailPayload,
): Promise<boolean> {
  try {
    await springClient.patch(
      `/api/internal/workspaces/${payload.workspaceId}/nodes/${payload.nodeId}/detail`,
      payload.detail,
    );
    return true;
  } catch (error: any) {
    console.error("Spring 저장 실패", {
      nodeId: payload.nodeId,
      message: error?.message,
      response: error?.response?.data,
    });
    return false;
  }
}
