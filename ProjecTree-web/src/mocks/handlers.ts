import { http, HttpResponse, delay } from 'msw';
import { workspaces as mockWorkspaces } from '@/pages/private/workspace-lounge/data/mockData';
import {
  mockFetchMessages,
  getMockParticipants,
} from '../features/chat/types/mockData';

/**
 * 프론트엔드 mockData를 백엔드 API 형식으로 변환
 */
const transformToApiFormat = (workspace: (typeof mockWorkspaces)[0]) => {
  const roleMap: Record<string, 'OWNER' | 'EDITOR' | 'VIEWER'> = {
    Owner: 'OWNER',
    Editor: 'EDITOR',
    Viewer: 'VIEWER',
  };

  return {
    workspaceId: Number(workspace.id),
    name: workspace.title,
    description: workspace.description,
    totalNodes: 45,
    totalCompletedNodes: 22,
    totalMembers: workspace.members.length,
    role: roleMap[workspace.role] || 'VIEWER',
    progress: {
      p0: { total: 100, completed: workspace.progressP0 },
      p1: { total: 100, completed: workspace.progressP1 },
      p2: { total: 100, completed: workspace.progressP2 },
    },
    updatedAt: workspace.updatedAt,
  };
};

/**
 * [MSW] API 모킹 핸들러 정의
 * - 여기서 정의한 URL로 요청이 오면, 브라우저가 실제 서버 대신 이 함수를 실행합니다.
 */
export const handlers = [
  // [GET] 내가 속한 워크스페이스 목록 조회 (워크스페이스 라운지)
  http.get('*/workspaces/:memberId/my', () => {
    const apiFormatData = mockWorkspaces.map(transformToApiFormat);
    return HttpResponse.json({
      status: 'success',
      data: apiFormatData,
    });
  }),

  // [GET] 닉네임 중복 확인
  http.get('*/members/nickname-check', ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');
    // 'duplicate'라는 닉네임만 중복으로 처리 (테스트용)
    const isTaken = nickname === 'duplicate';

    return HttpResponse.json({
      message: 'success',
      data: { available: !isTaken },
      code: 0,
      success: true,
    });
  }),

  // [PUT] 닉네임 변경
  http.put('*/members/:id/nickname', ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');

    return HttpResponse.json({
      message: '닉네임이 변경되었습니다.',
      data: { nickname },
      code: 0,
      success: true,
    });
  }),

  // [DELETE] 회원 탈퇴
  http.delete('*/members/:id', () => {
    return HttpResponse.json({
      message: '회원 탈퇴가 완료되었습니다.',
      data: {},
      code: 0,
      success: true,
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

  // [POST] 워크스페이스 생성 (백엔드 명세서 기준)
  http.post('*/workspaces', async ({ request }) => {
    try {
      // FormData 파싱
      const formData = await request.formData();

      // 로그 출력 (개발 중 확인용)
      console.log('[MSW] 워크스페이스 생성 요청:');
      console.log('- name:', formData.get('name'));
      console.log('- description:', formData.get('description'));
      console.log('- domain:', formData.get('domain'));
      console.log('- purpose:', formData.get('purpose'));
      console.log('- serviceType:', formData.get('serviceType'));
      console.log('- identifierPrefix:', formData.get('identifierPrefix'));
      console.log('- startDate:', formData.get('startDate'));
      console.log('- endDate:', formData.get('endDate'));
      console.log('- memberRoles:', formData.get('memberRoles'));
      console.log('- specFiles:', formData.getAll('specFiles'));
    } catch (error) {
      console.error('[MSW] FormData 파싱 실패:', error);
    }

    // 로딩 UI 테스트를 위해 3초 지연
    await delay(3000);

    // 백엔드 명세서에 맞는 응답 형식
    return HttpResponse.json({
      message: '워크스페이스가 성공적으로 생성되었습니다.',
      data: 'new-workspace-id-123',
      code: 1073741824, // 숫자 타입
      success: true,
    });
  }),
];
