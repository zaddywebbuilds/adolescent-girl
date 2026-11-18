import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Served from the root of the custom domain deardaughterguide.shop.
// public/CNAME keeps that domain attached on every Actions deploy.
export const BASE = '/';

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('react-router')) return 'router';
        },
      },
    },
  },
});
