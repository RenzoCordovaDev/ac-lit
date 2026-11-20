---
'@ac-base/cli': patch
---

Ajusta el `PageMixin` del template de `app:create`: sin campos privados (`#algo`, por claridad didáctica), `setupChannels()` se llama desde `firstUpdated()` en vez de `willUpdate()`, agrega un canal global de ejemplo (`global.user.data`, publicado por Home) y mejora el diseño de las 4 páginas con más componentes del catálogo (`ac-card-basic`, `ac-divider-basic`) y estilos base de layout.
