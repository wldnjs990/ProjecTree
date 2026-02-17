import { toast } from 'sonner';
import { getAiStreamKey } from '../stores';
import { useNodeDetailStore } from '../stores/nodeDetailStore';
import type { AiMessageCategory, AiMessagePayload } from '../types/crdtMessage';

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCategory(value: unknown): value is AiMessageCategory {
  return value === 'TECH' || value === 'CANDIDATE' || value === 'NODE';
}

function normalizeStreamType(streamType: unknown): AiMessageCategory | null {
  if (streamType === 'candidates') return 'CANDIDATE';
  if (streamType === 'techs') return 'TECH';
  return null;
}

function extractPayloadFromEnvelope(message: Record<string, unknown>): AiMessagePayload | null {
  const payload = message.payload;
  if (!isRecord(payload)) return null;

  const nodeId = toNumber(payload.nodeId);
  const category = payload.category;
  const content = payload.content;
  if (nodeId == null || !isCategory(category) || typeof content !== 'string') {
    return null;
  }

  return { nodeId, category, content };
}

function handleAiMessage(message: Record<string, unknown>) {
  const { updateAiStream, clearAiStream } = useNodeDetailStore.getState();
  const envelopePayload = extractPayloadFromEnvelope(message);

  if (envelopePayload) {
    const key = getAiStreamKey(envelopePayload.category, envelopePayload.nodeId);
    if (envelopePayload.content === '') {
      clearAiStream(key);
      return;
    }
    updateAiStream(key, envelopePayload.content);
    return;
  }

  const nodeId = toNumber(message.nodeId);
  const category = isCategory(message.category)
    ? message.category
    : normalizeStreamType(message.streamType);
  const text = typeof message.text === 'string'
    ? message.text
    : typeof message.content === 'string'
      ? message.content
      : null;
  const isComplete = message.isComplete === true;

  if (!category || nodeId == null) return;

  const key = getAiStreamKey(category, nodeId);
  if (isComplete || text === '') {
    clearAiStream(key);
    return;
  }
  if (text) {
    updateAiStream(key, text);
  }
}

function handleSaveError(message: Record<string, unknown>) {
  const payload = isRecord(message.payload) ? message.payload : null;
  const action = typeof message.action === 'string'
    ? message.action
    : payload && typeof payload.action === 'string'
      ? payload.action
      : null;

  if (action === 'delete_node') {
    toast.error('노드 삭제에 실패했습니다.');
    return;
  }
  if (action === 'delete_candidate') {
    toast.error('후보 노드 삭제에 실패했습니다.');
    return;
  }
  toast.error('저장에 실패했습니다.');
}

export function processCrdtMessage(message: unknown): void {
  if (!isRecord(message) || typeof message.type !== 'string') return;

  if (message.type === 'AI_MESSAGE') {
    handleAiMessage(message);
    return;
  }
  if (message.type === 'save_error' || message.type === 'SAVE_ERROR') {
    handleSaveError(message);
  }
}
