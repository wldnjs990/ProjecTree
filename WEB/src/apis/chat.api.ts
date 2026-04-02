import { wasApiClient } from '@/shared/libs/axiosClient';
import type {
  ChatMessage,
  ChatParticipant,
} from '@/features/workspace-chat/types/chat.types';

/**
 * [채팅 API] 메시지 조회 (페이지네이션 지원)
 * @param chatRoomId - 채팅방 ID
 * @param options - 페이지네이션 옵션
 * @param options.before - 커서 (이 메시지 ID 이전의 메시지를 가져옴)
 * @param options.limit - 가져올 메시지 개수
 * @returns { status: string, data: ChatMessage[] }
 */
export const fetchMessages = async (
  chatRoomId: string,
  options: { before?: string; limit: number }
): Promise<{ status: string; data: ChatMessage[] }> => {
  const response = await wasApiClient.get<{
    status: string;
    data: ChatMessage[];
  }>(`chat/${chatRoomId}/messages`, {
    params: options,
  });

  // axios response.data를 그대로 반환 = { status: 'success', data: ChatMessage[] }
  // 💥 중요: 백엔드 데이터(snake_case 등)를 프론트엔드 모델(camelCase)로 매핑
  const rawData = response.data.data || [];

  const mappedData: ChatMessage[] = rawData.map((raw: any) => ({
    id: raw.id?.toString() || Date.now().toString(),
    workspaceId:
      raw.workspace_id?.toString() || raw.workspaceId?.toString() || '',
    senderId:
      raw.senderId?.toString() ||
      raw.sender_id?.toString() ||
      raw.memberId?.toString() ||
      raw.userId?.toString() ||
      'unknown',
    senderName:
      raw.senderName ||
      raw.sender_name ||
      raw.nickname ||
      raw.name ||
      'Unknown',
    content: raw.content || '',
    timestamp: (() => {
      const t = raw.timestamp || raw.created_at || new Date().toISOString();
      return t.endsWith('Z') || t.includes('+') ? t : t + 'Z';
    })(),
    type: 'text' as const,
    senderAvatar:
      raw.senderAvatar || raw.sender_avatar || raw.profile_image || undefined,
  }));

  return { ...response.data, data: mappedData };
};

/**
 * [채팅 API] 참여자 목록 조회
 * @param chatRoomId - 채팅방 ID
 * @returns { status: string, data: ChatParticipant[] }
 */
export const fetchParticipants = async (
  chatRoomId: string
): Promise<{ status: string; data: ChatParticipant[] }> => {
  const response = await wasApiClient.get<{
    status: string;
    data: ChatParticipant[];
  }>(`chat/${chatRoomId}/participants`);

  // axios response.data를 그대로 반환 = { status: 'success', data: ChatParticipant[] }
  return response.data;
};
