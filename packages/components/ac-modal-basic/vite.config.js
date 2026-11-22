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
      // `case-basic.html`/`case-footer.html` ya no son assets estáticos de
      // `demo/public/` (lo eran cuando ac-demo-case los cargaba con fetch +
      // innerHTML): ahora son documentos completos con su propio
      // <script type="module"> cargado en un <iframe> (ver demo-case.js), así
      // que necesitan ser sus propios entry points para que Vite resuelva sus
      // imports `@ac-base/...`/`@ac-components/...` en el build.
      input: {
        main: fileURLToPath(new URL('./demo/index.html', import.meta.url)),
        'case-basic': fileURLToPath(new URL('./demo/case-basic.html', import.meta.url)),
        'case-footer': fileURLToPath(new URL('./demo/case-footer.html', import.meta.url)),
      },
    },
  },
});
