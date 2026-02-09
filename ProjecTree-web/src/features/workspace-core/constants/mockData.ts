import type { AvatarColor } from '@/shared/components/UserAvatar';

// ===== 기타 목데이터 =====

// Mock online users
// Mock online users
export interface MockUser {
  id: string;
  name: string; // 실명
  nickname: string; // 닉네임
  initials: string;
  color: AvatarColor;
  isOnline: boolean;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  isMe?: boolean; // 내 자신인지 여부 (UI 테스트용)
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: '김싸피',
    nickname: 'ProjecTree 마스터',
    initials: 'KM',
    color: 'blue',
    isOnline: true,
    role: 'OWNER',
    isMe: true,
  },
  {
    id: '2',
    name: '이수민',
    nickname: 'Front-end Wizard',
    initials: 'LJ',
    color: 'pink',
    isOnline: true,
    role: 'EDITOR',
  },
  {
    id: '3',
    name: '박현수',
    nickname: 'Backend Guru',
    initials: 'PH',
    color: 'orange',
    isOnline: false,
    role: 'EDITOR',
  },
  {
    id: '4',
    name: '최유리',
    nickname: 'Design Master',
    initials: 'CY',
    color: 'green',
    isOnline: false,
    role: 'VIEWER',
  },
];

