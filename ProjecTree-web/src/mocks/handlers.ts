import { http, HttpResponse } from 'msw';
import { workspaces as mockWorkspaces } from '../pages/workspace-lounge/data/mockData';

/**
 * [MSW] API 모킹 핸들러 정의
 * - 여기서 정의한 URL로 요청이 오면, 브라우저가 실제 서버 대신 이 함수를 실행합니다.
 */
export const handlers = [
  // [GET] 내 워크스페이스 목록 조회
  // 클라이언트가 'fetch("/api/workspaces/my")'를 요청하면 이 핸들러가 가로챕니다.
  http.get('/api/workspaces/my', () => {

    // 가짜 응답(Mock Response)을 돌려줍니다.
    return HttpResponse.json({
      status: 'success',
      data: mockWorkspaces // mockData.ts 파일에 있는 더미 데이터를 그대로 반환
    });
  }),

  // [GET] 닉네임 중복 확인
  http.get('/api/members/check-nickname', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');

    // 'duplicate'라는 닉네임은 이미 사용 중이라고 가정
    const isTaken = query === 'duplicate';

    return HttpResponse.json({
      status: 'success',
      data: {
        available: !isTaken
      }
    });
  }),
];
