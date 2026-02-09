/**
 * FeatureSpec 뷰에서 사용하는 공통 타입
 */

import type { AvatarColor } from '@/shared/components/UserAvatar';

export interface NodeData {
  label: string;
  level: number;
  priority: 'P0' | 'P1' | 'P2';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'HOLD';
  complexity?: number;
  assignee?: { id: string; name: string; initials: string; color: AvatarColor };
}

export interface FeatureSpecViewProps {}
