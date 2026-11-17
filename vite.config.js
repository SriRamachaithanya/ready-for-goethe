import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Single source of truth for the base path:
// 1. Explicit VITE_BASE_PATH environment variable (if provided)
// 2. Vercel deployment (VERCEL env var is automatically set by Vercel platform) -> '/'
// 3. Local dev mode -> '/'
// 4. Default production build (e.g. GitHub Pages) -> '/exam-ready-german/'
const isVercel = Boolean(process.env.VERCEL);
const isDev = process.env.NODE_ENV !== 'production';
const BASE_PATH = process.env.VITE_BASE_PATH ?? (isVercel || isDev ? '/' : '/exam-ready-german/');

export default defineConfig({
  base: BASE_PATH,
  plugins: [react()],
});
