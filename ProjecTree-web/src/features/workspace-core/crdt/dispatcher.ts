import { getAiStreamKey } from '../stores';
import { useNodeDetailStore } from '../stores/nodeDetailStore';
import type {
  AiMessagePayload,
  CrdtEnvelope,
} from '../types/crdtMessage';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAiMessagePayload(payload: unknown): payload is AiMessagePayload {
  if (!isRecord(payload)) return false;
  return (
    typeof payload.nodeId === 'number' &&
    (payload.category === 'TECH' ||
      payload.category === 'CANDIDATE' ||
      payload.category === 'NODE') &&
    typeof payload.content === 'string'
  );
}

function handleAiMessage(payload: AiMessagePayload) {
  const { category, content, nodeId } = payload;
  const key = getAiStreamKey(category, nodeId);
  const { updateAiStream, clearAiStream } = useNodeDetailStore.getState();

  if (content === '') {
    clearAiStream(key);
    return;
  }

  updateAiStream(key, content);
}

export function dispatchCrdtMessage(message: unknown): void {
  if (!isRecord(message)) return;
  if (typeof message.type !== 'string') return;

  const envelope = message as {
    type: CrdtEnvelope['type'] | string;
    payload?: unknown;
  };

  switch (envelope.type) {
    case 'AI_MESSAGE':
      if (isAiMessagePayload(envelope.payload)) {
        handleAiMessage(envelope.payload);
      }
      break;
    default:
      break;
  }
}
