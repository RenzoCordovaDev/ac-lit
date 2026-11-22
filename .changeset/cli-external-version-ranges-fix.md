---
'@ac-base/cli': patch
---

Corrige los rangos externos de `@ac-base/ac-demo-content` (`^0.1.0` → `^0.3.0`) y `@ac-base/cli` (`^0.2.0` → `^0.5.0`) en el scaffolding fuera del workspace (`external-package-versions.js`) — con rangos `^0.x`, la versión anterior no cubre las versiones reales ya publicadas y rompía (o dejaba sin el soporte de iframe nuevo de `ac-demo-content`) cualquier componente scaffoldeado hoy fuera de `ac-lit`.
