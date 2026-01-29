import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://i14d107.p.ssafy.io',
        changeOrigin: true,
        secure: false,
      },
      '/livekit': {
        target: 'https://i14d107.p.ssafy.io',
        changeOrigin: true,
        ws: true,
        secure: false,
      },
    },
  },
});
