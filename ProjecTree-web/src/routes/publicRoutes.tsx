import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import WorkspaceLoungePage from '@/pages/workspaceLounge/WorkspaceLoungePage';
import type { RouteObject } from 'react-router';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    loader: async () => { },
  },
  {
    path: '/workspaceLounge',
    element: <WorkspaceLoungePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
];
