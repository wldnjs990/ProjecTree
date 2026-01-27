import { springClient } from "./../../spring/springClient";

export interface SendNodePosition {
  nodeId: string;
  position: { x: number; y: number };
}

interface SaveNodePositionsBatchPayload {
  workspaceId: string;
  nodes: SendNodePosition[];
}
/**
 * Node → Spring
 * 노드 위치 batch 저장 요청
 */
export async function sendBatchToSpring(
  payload: SaveNodePositionsBatchPayload,
) {
  try {
    if (!payload.nodes || payload.nodes.length === 0) return;

    await springClient.put(
      `/api/internal/workspaces/${payload.workspaceId}/nodes/positions`,
      {
        nodes: payload.nodes,
      },
    );
  } catch (error: any) {
    console.error("Spring batch 위치 저장 실패", {
      workspaceId: payload.workspaceId,
      nodeCount: payload.nodes?.length,
      message: error?.message,
      response: error?.response?.data,
    });

    throw error;
  }
}
