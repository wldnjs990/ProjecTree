import { wasApiClient } from '@/apis/client';
import type {
  ChatMessage,
  ChatParticipant,
} from '@/features/workspace-chat/types/chat.types';

/**
 * [채팅 API] 메시지 조회 (페이지네이션 지원)
 * @param workspaceId - 워크스페이스 ID
 * @param options - 페이지네이션 옵션
 * @param options.before - 커서 (이 메시지 ID 이전의 메시지를 가져옴)
 * @param options.limit - 가져올 메시지 개수
 * @returns { status: string, data: ChatMessage[] }
 */
export const fetchMessages = async (
  workspaceId: string,
  options: { before?: string; limit: number }
): Promise<{ status: string; data: ChatMessage[] }> => {
  const response = await wasApiClient.get<{
    status: string;
    data: ChatMessage[];
  }>(`chat/${workspaceId}/messages`, {
    params: options,
  });

  // axios response.data를 그대로 반환 = { status: 'success', data: ChatMessage[] }
  return response.data;
};

/**
 * [채팅 API] 참여자 목록 조회
 * @param workspaceId - 워크스페이스 ID
 * @returns { status: string, data: ChatParticipant[] }
 */
export const fetchParticipants = async (
  workspaceId: string
): Promise<{ status: string; data: ChatParticipant[] }> => {
  const response = await wasApiClient.get<{
    status: string;
    data: ChatParticipant[];
  }>(`chat/${workspaceId}/participants`);

  // axios response.data를 그대로 반환 = { status: 'success', data: ChatParticipant[] }
  return response.data;
};
