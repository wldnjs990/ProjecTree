import NotFoundPage from '@/pages/public/NotFoundPage';
import { createBrowserRouter } from 'react-router';
import { publicRoutes } from '@/routes/publicRoutes';

export const router = createBrowserRouter([
  ...publicRoutes,
  { path: '*', element: <NotFoundPage /> },
]);
