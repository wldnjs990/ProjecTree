import { springClient } from "./../../spring/springClient";

interface SaveNodeTechPayload {
  workspaceId: number;
  nodeId: number;
  selectedTechId: number;
  requestId?: string;
}

export async function saveNodeTechToSpring(
  payload: SaveNodeTechPayload,
): Promise<boolean> {
  try {
    // TODO: 스프링 restAPI 엔드포인트 성훈님께 물어보기
    await springClient.post(
      `/api/internal/workspaces/${payload.workspaceId}/nodes/${payload.nodeId}/tech`,
      {
        workspaceId: payload.workspaceId,
        nodeId: payload.nodeId,
        selectedTechId: payload.selectedTechId,
      },
    );
    console.log("Spring node tech saved", {
      workspaceId: payload.workspaceId,
      nodeId: payload.nodeId,
      selectedTechId: payload.selectedTechId,
      requestId: payload.requestId,
    });
    return true;
  } catch (error: any) {
    console.error("Spring node tech save failed", {
      workspaceId: payload.workspaceId,
      nodeId: payload.nodeId,
      selectedTechId: payload.selectedTechId,
      requestId: payload.requestId,
      message: error?.message,
      response: error?.response?.data,
    });
    return false;
  }
}
