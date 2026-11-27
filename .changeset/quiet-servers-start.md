---
'@ac-base/cli': patch
---

Corrige la reinstalación de dependencias al ejecutar `aclit component:serve` después de `npm install`. La CLI ejecuta los scripts con npm o pnpm según la configuración o el lockfile del proyecto. La plantilla de componentes compila y vigila los estilos directamente, sin invocar pnpm desde los scripts de desarrollo.

Si generaste el componente con una versión anterior, actualiza `component:serve`, `component:build` y `component:test` en su `package.json` con los scripts de la plantilla nueva. Si quedaron los dos lockfiles, declara el gestor elegido en `packageManager` y conserva su instalación.
