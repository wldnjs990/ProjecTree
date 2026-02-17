import { router } from '@/routes/router';
import '@/shared/styles/index.css';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </>
  );
}
