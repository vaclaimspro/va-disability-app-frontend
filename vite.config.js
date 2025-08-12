import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  build: {
    outDir: 'dist',
    commonjsOptions: {
      include: [/node_modules/],
      exclude: ['crc32']
    },
  },
  optimizeDeps: {
    exclude: [
      'aws-amplify',
      '@aws-amplify/auth',
      '@aws-amplify/api',
      '@aws-amplify/datastore',
      '@aws-amplify/storage'
    ],
    esbuildOptions: {
      resolveExtensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
      mainFields: ['module', 'main', 'browser'],
      external: ['crc32'] // Keep this as well
    }
  },
  define: {
    'process.env': {}
  },
  // --- NEW CONFIGURATION ADDED BELOW ---
  ssr: {
    noExternal: ['crc32'], // Force crc32 to be inlined
  }
  // --- END NEW CONFIGURATION ---
});