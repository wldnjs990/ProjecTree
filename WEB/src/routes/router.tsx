import NotFoundPage from '@/pages/public/NotFoundPage';
import { createBrowserRouter } from 'react-router';
import { publicRoutes } from '@/routes/publicRoutes';
import { privateRoutes } from '@/routes/privateRoutes';

export const router = createBrowserRouter([
  ...publicRoutes,
  ...privateRoutes,
  { path: '*', element: <NotFoundPage /> },
]);
