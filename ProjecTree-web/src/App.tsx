import { router } from '@/routes/router';
import '@/shared/styles/index.css';
import { RouterProvider } from 'react-router';

export default function App() {
  return <RouterProvider router={router} />;
}
