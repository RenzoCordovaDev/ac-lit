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
      // `case-basic.html` ya no es un asset estático de `demo/public/` (lo era
      // cuando ac-demo-case lo cargaba con fetch + innerHTML): ahora es un
      // documento completo con su propio <script type="module"> cargado en un
      // <iframe> (ver demo-case.js), así que necesita ser su propio entry
      // point para que Vite resuelva sus imports `@ac-base/...` en el build.
      input: {
        main: fileURLToPath(new URL('./demo/index.html', import.meta.url)),
        'case-basic': fileURLToPath(new URL('./demo/case-basic.html', import.meta.url)),
      },
    },
  },
});
