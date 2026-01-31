import LandingPage from '@/pages/public/LandingPage/LandingPage';
import LoginPage from '@/pages/public/LoginPage';
import OAuthCallback from '@/pages/public/OauthCallback';
import UserOnboardingPage from '@/pages/private/user-onboarding/UserOnboardingPage';
import WorkSpacePage from '@/pages/private/workspace/WorkSpacePage';
import WorkspaceLoungePage from '@/pages/private/workspace-lounge/WorkspaceLoungePage';
import WorkspaceOnboardingPage from '@/pages/private/workspace-onboarding/WorkspaceOnboardingPage';
import type { RouteObject } from 'react-router';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
    loader: async () => { },
  },
  {
    path: '/workspace-lounge',
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
    path: '/oauth/callback',
    element: <OAuthCallback />,
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
