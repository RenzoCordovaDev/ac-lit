---
'@ac-base/cli': minor
---

Agrega `PageMixin` + `pageBaseStyles` al template de `app:create` (`src/utils/page-mixin.js`): simplifica conectar una página a `@ac-base/ac-ccp` a dos métodos (`connectionOut`/`connectionIn`), sin repetir la declaración de `ccp` ni el `willUpdate` de inicialización en cada página.
