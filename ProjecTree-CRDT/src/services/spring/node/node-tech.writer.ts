import { springInternalClient } from "./../../spring/springInternalClient";

interface SaveNodeTechPayload {
  nodeId: number;
  selectedTechId: number;
  requestId?: string;
}

export async function saveNodeTechToSpring(
  payload: SaveNodeTechPayload,
): Promise<boolean> {
  try {
    await springInternalClient.post(
      `/api/internal/nodes/${payload.nodeId}/tech`,
      {
        nodeId: payload.nodeId,
        selectedTechId: payload.selectedTechId,
      },
    );
    return true;
  } catch (error: any) {
    console.error("Spring node tech save failed", {
      nodeId: payload.nodeId,
      selectedTechId: payload.selectedTechId,
      requestId: payload.requestId,
      message: error?.message,
      response: error?.response?.data,
    });
    return false;
  }
}
