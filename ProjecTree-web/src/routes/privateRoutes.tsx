import UserOnboardingPage from '@/pages/private/UserOnboardingPage';
import WorkSpacePage from '@/pages/private/WorkSpacePage';
import WorkspaceLoungePage from '@/pages/private/WorkspaceLoungePage';
import WorkspaceOnboardingPage from '@/pages/private/WorkspaceOnboardingPage';
import type { RouteObject } from 'react-router';

export const privateRoutes: RouteObject[] = [
  {
    path: '/workspace-lounge',
    element: <WorkspaceLoungePage />,
  },
  {
    path: '/workspace/:workspaceId',
    element: <WorkSpacePage />,
  },
  {
    path: '/user-onboarding',
    element: <UserOnboardingPage />,
  },
  {
    path: '/workspace-onboarding',
    element: <WorkspaceOnboardingPage />,
  },
];
