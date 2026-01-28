import { http, HttpResponse, delay } from 'msw';
import { workspaces as mockWorkspaces } from '../pages/workspace-lounge/data/mockData';
import {
  mockFetchMessages,
  getMockParticipants,
} from '../features/chat/types/mockData';

/**
 * [MSW] API 모킹 핸들러 정의
 * - 여기서 정의한 URL로 요청이 오면, 브라우저가 실제 서버 대신 이 함수를 실행합니다.
 */
export const handlers = [
  // [GET] 내 워크스페이스 목록 조회
  http.get('/api/workspaces/my', () => {
    return HttpResponse.json({
      status: 'success',
      data: mockWorkspaces,
    });
  }),

  // [GET] 닉네임 중복 확인
  http.get('/api/members/check-nickname', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    const isTaken = query === 'duplicate';

    return HttpResponse.json({
      status: 'success',
      data: {
        available: !isTaken,
      },
    });
  }),

  // [GET] 채팅 메시지 조회 (페이지네이션 지원)
  http.get('*/api/chat/:workspaceId/messages', async ({ request, params }) => {
    const { workspaceId } = params;
    const url = new URL(request.url);
    const before = url.searchParams.get('before') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);

    // mockFetchMessages를 사용하여 페이지네이션 지원
    const messages = await mockFetchMessages(workspaceId as string, {
      before,
      limit,
    });

    return HttpResponse.json({
      status: 'success',
      data: messages,
    });
  }),

  // [GET] 채팅 참여자 목록 조회
  http.get('*/api/chat/:workspaceId/participants', ({ params }) => {
    const { workspaceId } = params;

    const participants = getMockParticipants(workspaceId as string);

    return HttpResponse.json({
      status: 'success',
      data: participants,
    });
  }), // <--- 콤마(,) 필수: 다음 핸들러와 구분하기 위해 꼭 필요합니다.

  // [POST] 워크스페이스 생성
  http.post('*/api/workspaces', async ({ request }) => {
    try {
      // 요청 본문 확인 (FormData 파싱만 시도)
      await request.formData().catch(() => new FormData());
    } catch {
      // 무시
    }

    // 로딩 UI 테스트를 위해 3초 지연
    await delay(3000);

    return HttpResponse.json({
      status: 'success',
      data: {
        workspaceId: 'new-workspace-id-123',
      },
    });
  }),
];