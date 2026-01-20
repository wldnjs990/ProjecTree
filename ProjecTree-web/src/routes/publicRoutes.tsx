import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import type { RouteObject } from 'react-router';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    loader: async () => {},
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
];
