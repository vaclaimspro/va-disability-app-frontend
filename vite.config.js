import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Add this configuration to use the automatic JSX runtime
      jsxRuntime: 'automatic',
    }),
  ],
  build: {
    outDir: 'dist'
  }
});