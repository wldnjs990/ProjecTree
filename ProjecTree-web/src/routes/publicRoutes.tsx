import HomePage from '@/pages/HomePage';
import WorkspaceOnboardingPage from '@/pages/workspace-onboarding/WorkspaceOnboardingPage';
import UserOnboardingPage from '@/pages/user-onboarding/UserOnboardingPage';
import LoginPage from '@/pages/LoginPage';
import WorkSpacePage from '@/pages/workspace/WorkSpacePage';
import WorkspaceLoungePage from '@/pages/workspaceLounge/WorkspaceLoungePage';
import type { RouteObject } from 'react-router';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    loader: async () => {},
  },
  {
    path: '/workspaceLounge',
    element: <WorkspaceLoungePage />,
  },
  {
    path: '/workspace/:workspaceId',
    element: <WorkSpacePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
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
