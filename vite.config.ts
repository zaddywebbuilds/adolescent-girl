import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Project Pages are served from a sub-path, so every asset URL needs it.
// Change to '/' if the site later moves to a custom domain.
export const BASE = '/adolescent-girl/';

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
