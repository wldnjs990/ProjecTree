import { springInternalClient } from "../springInternalClient";

export interface SendNodePosition {
  nodeId: number;
  position: { x: number; y: number };
}

interface SaveNodePositionsBatchPayload {
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

    console.log(
      "[sendBatchToSpring] 위치 저장 요청",
      {
        nodeCount: payload.nodes.length,
      },
      new Date().toISOString(),
    );
    const result = await springInternalClient.patch(
      `/api/internal//nodes/positions`,
      {
        nodes: payload.nodes,
      },
    );

    console.log("[Update Position] Spring response: ", result.data.success);
  } catch (error: any) {
    console.error(
      "Spring batch 위치 저장 실패",
      {
        nodeCount: payload.nodes?.length,
        message: error?.message,
        response: error?.response?.data,
      },
      new Date().toISOString(),
    );

    throw error;
  }
}
