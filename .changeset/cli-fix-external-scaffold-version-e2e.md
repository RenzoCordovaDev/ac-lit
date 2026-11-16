---
'@ac-base/cli': patch
---

`aclit component:create` corría fuera del workspace de `ac-lit` con dos bugs reales:

- El mapa de versiones reales (`cli/src/scaffold/external-package-versions.js`) seguía fijando `@ac-base/cli` a `^0.1.0`, una versión anterior al rename a `aclit` — un componente nuevo scaffoldeado afuera del monorepo terminaba con el binario viejo y roto como `devDependency`.
- `@ac-base/ac-e2e-testing` es `private` (nunca se publicó a npm) pero el template lo incluía igual como `devDependency` por defecto fuera del workspace, rompiendo `npm install`/`pnpm install` para cualquiera que no pasara `--no-e2e` a mano.

Ahora `@ac-base/cli` se fija a `^0.2.0`, y el e2e se desactiva automáticamente fuera del workspace (mismo efecto que `--no-e2e`, sin tener que pasarlo).
