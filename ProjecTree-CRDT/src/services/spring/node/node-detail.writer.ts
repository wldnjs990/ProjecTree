import { springClient } from "./../../spring/springClient";
import type { SendNodeDetail } from "../../../domain/node/node.detail";

interface SaveNodeDetailPayload {
  workspaceId: number;
  nodeId: number;
  detail: SendNodeDetail;
}

export async function saveNodeDetailToSpring(payload: SaveNodeDetailPayload) {
  try {
    await springClient.post(
      `/api/internal/workspaces/${payload.workspaceId}/nodes/${payload.nodeId}/detail`,
      payload.detail,
    );
  } catch (error: any) {
    console.error("Spring 저장 실패", {
      nodeId: payload.nodeId,
      message: error?.message,
      response: error?.response?.data,
    });
  }
}
