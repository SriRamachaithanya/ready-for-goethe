import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Single source of truth for the base path:
// Defaults to '/exam-ready-german/' for production builds (GitHub Pages),
// or '/' for local development unless overridden by VITE_BASE_PATH.
const BASE_PATH = process.env.VITE_BASE_PATH ?? (process.env.NODE_ENV === 'production' ? '/exam-ready-german/' : '/');

export default defineConfig({
  base: BASE_PATH,
  plugins: [react()],
});
