import type { Node, Edge } from '@xyflow/react';

/**
 * Feature Spec View 전용 목데이터
 * workspace-core의 mockData와 독립적으로 관리
 *
 * 주의: transformNodesForSpecView 함수를 거쳐 변환되므로
 * 원본 API 형식(title, difficult 등)으로 작성해야 함
 */

// Feature Spec View용 확장된 노드 데이터 (원본 API 형식)
export const mockFeatureSpecNodes: Node[] = [
  // PROJECT
  {
    id: '1',
    type: 'PROJECT',
    position: { x: 400, y: 50 },
    data: {
      title: 'AI 여행 추천 서비스',
      priority: 'P0',
      status: 'IN_PROGRESS',
      assignee: null,
    },
  },
  // ===== EPIC 1: 사용자 인증 =====
  {
    id: '2',
    type: 'EPIC',
    position: { x: 200, y: 180 },
    data: {
      title: 'User Authentication and Session Recovery Management Flow',
      priority: 'P0',
      status: 'progress',
      assignee: { id: '1', name: '김민수', initials: 'KM', color: 'blue' },
    },
  },
  {
    id: '3',
    type: 'STORY',
    position: { x: 100, y: 310 },
    data: {
      title:
        '사용자가 다양한 인증 수단으로 로그인하고 세션이 만료되어도 안전하게 복구할 수 있는 통합 인증 흐름 구현',
      priority: 'P0',
      status: 'progress',
      assignee: { id: '2', name: '이지은', initials: 'LJ', color: 'pink' },
    },
  },
  {
    id: '4',
    type: 'TASK',
    position: { x: 50, y: 440 },
    data: {
      title: 'Implement frontend login UI validation with inline errors',
      priority: 'P0',
      status: 'progress',
      assignee: { id: '2', name: '이지은', initials: 'LJ', color: 'pink' },
      difficult: 3,
    },
  },
  {
    id: '5',
    type: 'TASK',
    position: { x: 200, y: 440 },
    data: {
      title: '백엔드 로그인 API 구현',
      priority: 'P0',
      status: 'completed',
      assignee: { id: '1', name: '김민수', initials: 'KM', color: 'blue' },
      difficult: 4,
    },
  },
  {
    id: '6',
    type: 'ADVANCE',
    position: { x: 50, y: 570 },
    data: {
      title: 'Integrate OAuth2 social login callbacks and token refresh',
      priority: 'P1',
      status: 'pending',
      assignee: { id: '2', name: '이지은', initials: 'LJ', color: 'pink' },
      difficult: 5,
    },
  },
  {
    id: '7',
    type: 'STORY',
    position: { x: 300, y: 310 },
    data: {
      title:
        '사용자가 다양한 인증 수단으로 로그인하고 세션이 만료되어도 안전하게 복구할 수 있는 통합 인증 흐름 구현',
      priority: 'P1',
      status: 'progress',
      assignee: { id: '3', name: '박현우', initials: 'PH', color: 'green' },
    },
  },
  {
    id: '8',
    type: 'TASK',
    position: { x: 250, y: 440 },
    data: {
      title: '회원가입 폼 UI 구현',
      priority: 'P1',
      status: 'completed',
      assignee: { id: '3', name: '박현우', initials: 'PH', color: 'green' },
      difficult: 2,
    },
  },
  {
    id: '9',
    type: 'TASK',
    position: { x: 400, y: 440 },
    data: {
      title: '회원가입 API 구현',
      priority: 'P1',
      status: 'progress',
      assignee: { id: '1', name: '김민수', initials: 'KM', color: 'blue' },
      difficult: 3,
    },
  },
  {
    id: '10',
    type: 'STORY',
    position: { x: 500, y: 310 },
    data: {
      title: '사용자가 비밀번호를 재설정한다',
      priority: 'P2',
      status: 'pending',
      assignee: null,
    },
  },
  {
    id: '11',
    type: 'TASK',
    position: { x: 500, y: 440 },
    data: {
      title: '비밀번호 재설정 플로우 구현',
      priority: 'P2',
      status: 'pending',
      assignee: null,
      difficult: 3,
    },
  },
  // ===== EPIC 2: AI 추천 엔진 =====
  {
    id: '12',
    type: 'EPIC',
    position: { x: 600, y: 180 },
    data: {
      title: 'AI 추천 엔진',
      priority: 'P0',
      status: 'progress',
      assignee: { id: '4', name: '최수진', initials: 'CS', color: 'purple' },
    },
  },
  {
    id: '13',
    type: 'STORY',
    position: { x: 550, y: 310 },
    data: {
      title: '사용자가 맞춤 여행지를 추천받는다',
      priority: 'P0',
      status: 'progress',
      assignee: { id: '4', name: '최수진', initials: 'CS', color: 'purple' },
    },
  },
  {
    id: '14',
    type: 'TASK',
    position: { x: 500, y: 440 },
    data: {
      title: 'AI 추천 알고리즘 구현',
      priority: 'P0',
      status: 'progress',
      assignee: { id: '4', name: '최수진', initials: 'CS', color: 'purple' },
      difficult: 5,
    },
  },
  {
    id: '15',
    type: 'TASK',
    position: { x: 650, y: 440 },
    data: {
      title: '추천 결과 UI 구현',
      priority: 'P0',
      status: 'progress',
      assignee: { id: '5', name: '정서연', initials: 'JS', color: 'orange' },
      difficult: 4,
    },
  },
  {
    id: '16',
    type: 'ADVANCE',
    position: { x: 500, y: 570 },
    data: {
      title: '사용자 선호도 기반 필터링',
      priority: 'P1',
      status: 'completed',
      assignee: { id: '4', name: '최수진', initials: 'CS', color: 'purple' },
      difficult: 4,
    },
  },
  {
    id: '17',
    type: 'ADVANCE',
    position: { x: 650, y: 570 },
    data: {
      title:
        '사용자가 다양한 인증 수단으로 로그인하고 세션이 만료되어도 안전하게 복구할 수 있는 통합 인증 흐름 구현',
      priority: 'P2',
      status: 'pending',
      assignee: { id: '5', name: '정서연', initials: 'JS', color: 'orange' },
      difficult: 3,
    },
  },
  {
    id: '18',
    type: 'STORY',
    position: { x: 750, y: 310 },
    data: {
      title: '사용자가 여행 후기를 작성한다',
      priority: 'P2',
      status: 'pending',
      assignee: null,
    },
  },
  {
    id: '19',
    type: 'TASK',
    position: { x: 700, y: 440 },
    data: {
      title: '후기 작성 폼 구현',
      priority: 'P2',
      status: 'pending',
      assignee: null,
      difficult: 2,
    },
  },
  {
    id: '20',
    type: 'TASK',
    position: { x: 850, y: 440 },
    data: {
      title: '후기 저장 API 구현',
      priority: 'P2',
      status: 'pending',
      assignee: null,
      difficult: 2,
    },
  },
  // ===== EPIC 3: 결제 시스템 =====
  {
    id: '21',
    type: 'EPIC',
    position: { x: 1000, y: 180 },
    data: {
      title: '결제 시스템',
      priority: 'P1',
      status: 'pending',
      assignee: { id: '6', name: '강태영', initials: 'KT', color: 'blue' },
    },
  },
  {
    id: '22',
    type: 'STORY',
    position: { x: 950, y: 310 },
    data: {
      title: '사용자가 프리미엄 플랜을 구매한다',
      priority: 'P1',
      status: 'pending',
      assignee: { id: '6', name: '강태영', initials: 'KT', color: 'blue' },
    },
  },
  {
    id: '23',
    type: 'TASK',
    position: { x: 900, y: 440 },
    data: {
      title: '결제 UI 구현',
      priority: 'P1',
      status: 'pending',
      assignee: { id: '7', name: '윤미래', initials: 'YM', color: 'pink' },
      difficult: 3,
    },
  },
  {
    id: '24',
    type: 'TASK',
    position: { x: 1050, y: 440 },
    data: {
      title: '결제 게이트웨이 연동',
      priority: 'P1',
      status: 'pending',
      assignee: { id: '6', name: '강태영', initials: 'KT', color: 'blue' },
      difficult: 5,
    },
  },
  {
    id: '25',
    type: 'ADVANCE',
    position: { x: 1050, y: 570 },
    data: {
      title:
        '정기 결제 구독 기능 정기 결제 구독 기능 정기 결제 구독 기능 정기 결제 구독 기능 정기 결제 구독 기능',
      priority: 'P2',
      status: 'pending',
      assignee: { id: '6', name: '강태영', initials: 'KT', color: 'blue' },
      difficult: 4,
    },
  },
];

// Feature Spec View용 엣지 데이터
export const mockFeatureSpecEdges: Edge[] = [
  // PROJECT -> EPICs
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e1-12', source: '1', target: '12', type: 'smoothstep' },
  { id: 'e1-21', source: '1', target: '21', type: 'smoothstep' },

  // EPIC 1 -> STORYs
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  { id: 'e2-7', source: '2', target: '7', type: 'smoothstep' },
  { id: 'e2-10', source: '2', target: '10', type: 'smoothstep' },

  // STORY 3 -> TASKs
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
  { id: 'e3-5', source: '3', target: '5', type: 'smoothstep' },

  // TASK 4 -> ADVANCE
  { id: 'e4-6', source: '4', target: '6', type: 'smoothstep' },

  // STORY 7 -> TASKs
  { id: 'e7-8', source: '7', target: '8', type: 'smoothstep' },
  { id: 'e7-9', source: '7', target: '9', type: 'smoothstep' },

  // STORY 10 -> TASK
  { id: 'e10-11', source: '10', target: '11', type: 'smoothstep' },

  // EPIC 2 -> STORYs
  { id: 'e12-13', source: '12', target: '13', type: 'smoothstep' },
  { id: 'e12-18', source: '12', target: '18', type: 'smoothstep' },

  // STORY 13 -> TASKs
  { id: 'e13-14', source: '13', target: '14', type: 'smoothstep' },
  { id: 'e13-15', source: '13', target: '15', type: 'smoothstep' },

  // TASKs -> ADVANCEs
  { id: 'e14-16', source: '14', target: '16', type: 'smoothstep' },
  { id: 'e15-17', source: '15', target: '17', type: 'smoothstep' },

  // STORY 18 -> TASKs
  { id: 'e18-19', source: '18', target: '19', type: 'smoothstep' },
  { id: 'e18-20', source: '18', target: '20', type: 'smoothstep' },

  // EPIC 3 -> STORY
  { id: 'e21-22', source: '21', target: '22', type: 'smoothstep' },

  // STORY 22 -> TASKs
  { id: 'e22-23', source: '22', target: '23', type: 'smoothstep' },
  { id: 'e22-24', source: '22', target: '24', type: 'smoothstep' },

  // TASK 24 -> ADVANCE
  { id: 'e24-25', source: '24', target: '25', type: 'smoothstep' },
];
