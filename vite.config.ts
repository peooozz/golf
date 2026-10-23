import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Keep chunks modular so Three.js loads cleanly on mid-range mobile devices
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    target: 'es2020',
    sourcemap: false
  }
});
