import HomePage from '@/pages/HomePage';
import WorkspaceOnboardingPage from '@/pages/workspace-onboarding/WorkspaceOnboardingPage';
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
    path: '/workspace',
    element: <WorkSpacePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/workspace-onboarding',
    element: <WorkspaceOnboardingPage />,
  },
];
