# @ac-base/cli

## 0.3.1

### Patch Changes

- 126833a: Corrige el rango externo de `@ac-base/ac-router` (`^0.1.0` → `^0.2.0`) en el scaffolding de `app:create` fuera del workspace — la versión anterior no existe en el registro público y rompía `npm install` en cualquier app generada afuera de `ac-lit`.

## 0.3.0

### Minor Changes

- f3246f9: Implementa `aclit app:create <nombre>`: genera un proyecto de app nuevo (sin prefijo ni scope de npm, `"private": true`) con una demo de 4 páginas, navegación por rutas con parámetros (`@ac-base/ac-router`) y pub/sub entre páginas (`@ac-base/ac-ccp`) ya integrados, usando componentes reales del catálogo.

## 0.2.1

### Patch Changes

- e275f37: `aclit component:create` corría fuera del workspace de `ac-lit` con dos bugs reales:

  - El mapa de versiones reales (`cli/src/scaffold/external-package-versions.js`) seguía fijando `@ac-base/cli` a `^0.1.0`, una versión anterior al rename a `aclit` — un componente nuevo scaffoldeado afuera del monorepo terminaba con el binario viejo y roto como `devDependency`.
  - `@ac-base/ac-e2e-testing` es `private` (nunca se publicó a npm) pero el template lo incluía igual como `devDependency` por defecto fuera del workspace, rompiendo `npm install`/`pnpm install` para cualquiera que no pasara `--no-e2e` a mano.

  Ahora `@ac-base/cli` se fija a `^0.2.0`, y el e2e se desactiva automáticamente fuera del workspace (mismo efecto que `--no-e2e`, sin tener que pasarlo).

## 0.2.0

### Minor Changes

- fe3991b: El binario del CLI se renombra de `ac` a `aclit`: en PowerShell, `ac` es un alias nativo de `Add-Content`, que resuelve antes que cualquier ejecutable del PATH — `ac component:create ...` nunca llegaba a este CLI en Windows (PowerShell intentaba correr `Add-Content` y tiraba `DriveNotFoundException`). Quien tenga `@ac-base/cli` instalado globalmente necesita reinstalarlo para que aparezca el nuevo binario `aclit`; no queda un alias de compatibilidad para `ac`.

  Además, todo paquete de componente (catálogo y el template de scaffolding del CLI) suma un script real `component:lint` (`eslint .`, acotado al paquete) — cierra el hueco donde `lint` era el único script que no seguía la convención `component:<verbo>`.

## 0.1.1

### Patch Changes

- 9006810: `ac component:create` ya no genera dependencias `"workspace:^"` rotas cuando corre fuera del workspace de `ac-lit` — detecta el contexto y usa la versión real publicada de cada paquete `@ac-base/*` en ese caso.
