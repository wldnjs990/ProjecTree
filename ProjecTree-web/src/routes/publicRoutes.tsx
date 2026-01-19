import HomePage from '@/pages/HomePage';
import WorkspaceOnboardingPage from '@/pages/workspace-onboarding/WorkspaceOnboardingPage';
import type { RouteObject } from 'react-router';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    loader: async () => {},
  },
  {
    path: '/workspace-onboarding',
    element: <WorkspaceOnboardingPage />,
  },
];
