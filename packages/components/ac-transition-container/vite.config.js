import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'demo',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./demo/index.html', import.meta.url)),
        'case-basic': fileURLToPath(new URL('./demo/case-basic.html', import.meta.url)),
        'case-sequential': fileURLToPath(new URL('./demo/case-sequential.html', import.meta.url)),
      },
    },
  },
});
