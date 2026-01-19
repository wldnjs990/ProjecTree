import HomePage from '@/pages/HomePage';
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
];
