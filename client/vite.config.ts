import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/images': 'http://localhost:8080',
      '/videos': 'http://localhost:8080',
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
