import LandingPage from '@/pages/public/LandingPage';
import LoginPage from '@/pages/public/LoginPage';
import OAuthCallback from '@/pages/public/OauthCallback';
import UserOnboardingPage from '@/pages/private/UserOnboardingPage';
import WorkSpacePage from '@/pages/private/WorkSpacePage';
import WorkspaceLoungePage from '@/pages/private/WorkspaceLoungePage';
import WorkspaceOnboardingPage from '@/pages/private/WorkspaceOnboardingPage';
import type { RouteObject } from 'react-router';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
    loader: async () => {},
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
