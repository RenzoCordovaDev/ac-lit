---
'@ac-base/cli': patch
---

Corrige el rango externo de `@ac-base/ac-router` (`^0.1.0` → `^0.2.0`) en el scaffolding de `app:create` fuera del workspace — la versión anterior no existe en el registro público y rompía `npm install` en cualquier app generada afuera de `ac-lit`.
