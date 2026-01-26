import type { EditableNodeDetail } from "../domain/node/node.detail";

export async function saveNodeDetailToSpring(
  nodeData: EditableNodeDetail
) {
  // TODO: fetch / axios 연동
  console.log(" Spring 저장:", nodeData);
}