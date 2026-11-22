---
'@ac-base/ac-demo-content': minor
---

`ac-demo-case` ahora soporta un segundo formato para `href`: un documento completo (`<!doctype html>...<html>...`) se carga en un `<iframe>` en vez de con `fetch` + `innerHTML` — así el caso puede traer su propio `<script type="module">` (sin acumular lógica en el `demo.js` compartido de todo el demo) y, de paso, un `<dialog>` nativo o un `popover` abierto adentro queda acotado al propio iframe sin necesitar `contained`/`getBoundary`, sin importar cuántos niveles de shadow DOM tenga el componente por dentro. El camino de siempre (fragmento por `innerHTML`) sigue funcionando exactamente igual, sin ningún cambio.

Nuevo export `@ac-base/ac-demo-content/case-event-bridge.js`: lo importa el `<script>` de un caso "documento completo" para reenviar al documento padre, vía `postMessage`, los eventos que `ac-demo-content` necesita loguear en su panel de eventos (un `CustomEvent` con `composed: true` no cruza el límite de un iframe por su cuenta) y para replicar el idioma global (`setGlobalLocale`) hacia ese realm de JS aparte.
