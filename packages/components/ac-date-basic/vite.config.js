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
        'case-long': fileURLToPath(new URL('./demo/case-long.html', import.meta.url)),
        'case-format': fileURLToPath(new URL('./demo/case-format.html', import.meta.url)),
      },
    },
  },
});
