import { router } from '@/routes/router';
import '@/styles/index.css';
import { RouterProvider } from 'react-router';

export default function App() {
  return <RouterProvider router={router} />;
}
