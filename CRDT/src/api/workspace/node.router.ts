import { Router, type Request, type Response } from "express";
import {
  isValidNodePayload,
  type IncomingNodePayload,
} from "../../domain/node/nodePayload";
import { getYDocByRoom } from "../../yjs/ydoc-gateway";

const router: Router = Router({ mergeParams: true });

router.post("/", (req: Request, res: Response) => {
  console.log("create nodes start", new Date().toISOString());
  const { workspaceId } = req.params;
  const body = req.body;

  console.log({ "node payload": body });

  if (!workspaceId || typeof workspaceId !== "string") {
    console.error("Invalid workspace Id", new Date().toLocaleDateString());
    return res.status(400).json({ message: "Invalid workspace Id" });
  }
  if (!isValidNodePayload(body)) {
    console.error("Invalid node payload", new Date().toLocaleDateString());
    return res.status(400).json({ message: "Invalid node payload" });
  }

  const node: IncomingNodePayload = body;
  const doc = getYDocByRoom(workspaceId);

  doc.transact(() => {
    const nodes = doc.getMap("nodes");

    let yNode = nodes.get(String(node.id));
    if (!yNode) {
      yNode = new (nodes.constructor as any)();
      nodes.set(String(node.id), yNode);
    }

    yNode.set("type", node.nodeType);
    yNode.set("parentId", String(node.parentId));
    yNode.set("position", {
      x: node.position.xpos,
      y: node.position.ypos,
    });
    yNode.set("data", {
      title: node.name,
      taskId: node.data.identifier,
      category: node.data.taskType,
      status: node.data.status,
      priority: node.data.priority,
      difficult: node.data.difficult,
    });

    const details = doc.getMap("nodeDetails");
    const detail = Object.fromEntries(
      Object.entries(node.data).filter(([, v]) => v !== undefined),
    );
    details.set(String(node.id), detail);

    // previewNodeId가 있으면 preview 노드 삭제 + pending 해제
    if (node.previewNodeId) {
      const previewNodes = doc.getMap("previewNodes");
      const nodeCreatingPending = doc.getMap("nodeCreatingPending");

      if (previewNodes.has(node.previewNodeId)) {
        previewNodes.delete(node.previewNodeId);
      }
      nodeCreatingPending.set(node.previewNodeId, false);
    }
  });

  console.log("create nodes success", new Date().toISOString());
  res.status(200).json({ status: "ok" });
});

// Pending 리셋 API - 노드 생성 실패 시 fallback용
router.post("/creating/pending-reset", (req: Request, res: Response) => {
  console.log("reset node creating pending start", new Date().toISOString());

  const { workspaceId } = req.params;
  const { previewNodeId } = req.body as { previewNodeId: string };

  if (!workspaceId || !previewNodeId) {
    console.error("Invalid params", new Date().toISOString());
    return res.status(400).json({
      message: "Invalid params - workspaceId and previewNodeId are required",
      timeStamp: new Date().toISOString(),
    });
  }

  const doc = getYDocByRoom(workspaceId as string);
  doc.transact(() => {
    const nodeCreatingPending = doc.getMap("nodeCreatingPending");
    nodeCreatingPending.set(previewNodeId, false);

    // 프리뷰 노드도 제거
    const previewNodes = doc.getMap("previewNodes");
    if (previewNodes.has(previewNodeId)) {
      previewNodes.delete(previewNodeId);
    }
  });

  console.log("reset node creating pending success", new Date().toISOString());
  res.status(200).json({ status: "ok" });
});

export default router;
