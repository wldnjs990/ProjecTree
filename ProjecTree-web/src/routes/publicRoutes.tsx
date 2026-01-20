import HomePage from '@/pages/HomePage';
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
];
