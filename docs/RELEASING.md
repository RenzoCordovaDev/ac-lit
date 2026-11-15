# Guía de release — de un cambio a npm publicado

Esta guía es el paso a paso **completo** para llevar un cambio desde una rama nueva hasta quedar publicado en npm, con tag y GitHub Release. Hoy el flujo es 100% manual — la sigue quien tenga acceso de publish a las organizaciones `ac-base`/`ac-components` en npm.

Antes de empezar, necesitas:

- Acceso de publish a npm en las orgs `ac-base` y `ac-components`, con 2FA activo (hoy, llave de seguridad vía Windows Hello).
- `gh` (GitHub CLI) autenticado, con permisos sobre `RenzoCordovaDev/ac-lit`.
- El repo clonado y actualizado.

## Resumen

1. Rama + cambio + changeset → PR → merge a `main`.
2. Rama de versión (`pnpm version-packages`) → PR → merge a `main`.
3. `pnpm build`.
4. Stage del publish a npm, paquete por paquete.
5. Aprobar el staging en npmjs.com (2FA) — paso manual, no automatizable.
6. Tags de git.
7. GitHub Releases.

## Paso 1 — Rama, cambio y changeset

```bash
git checkout main && git pull --ff-only origin main
git checkout -b feat/mi-cambio   # o fix/, chore/, etc. — ver CONTRIBUTING.md
```

Haz el cambio. Si afecta uno o más paquetes publicables (cualquier cosa en `packages/` o `cli/`), agrega un changeset:

```bash
pnpm changeset
```

Eliges qué paquetes cambiaron y el tipo de bump (`patch`/`minor`/`major`); esto genera un archivo en `.changeset/` que tienes que incluir en el mismo PR. Si un paquete nuevo con dependencias internas (`workspace:^`) necesita que esas dependencias también suban de versión, no hace falta declararlo a mano — `updateInternalDependencies: "patch"` en `.changeset/config.json` ya lo hace solo en el paso siguiente.

Commitea, pushea, abre el PR, espera CI en verde y mergéalo (squash).

## Paso 2 — Version bump

Desde `main` ya actualizado con tu merge:

```bash
git checkout main && git pull --ff-only origin main
git checkout -b chore/release-x
pnpm version-packages
```

Esto corre `changeset version`: bumpea el `package.json` de cada paquete con un changeset pendiente, genera/actualiza su `CHANGELOG.md`, reescribe las dependencias internas afectadas a la nueva versión, y borra los archivos de `.changeset/` que consumió. Revisa el diff, commitea, pushea, abre PR y mergéalo — esta PR también pasa por CI y revisión como cualquier otra.

## Paso 3 — Build

Desde `main` ya actualizado con el merge del paso anterior:

```bash
git checkout main && git pull --ff-only origin main
pnpm build
```

## Paso 4 — Stage del publish (paquete por paquete)

**No corras `pnpm release` directo** — la cuenta de npm exige "staged publishing" con aprobación 2FA en **todas** las publicaciones (no solo paquetes nuevos), y ni Changesets ni pnpm saben manejar ese flujo: `pnpm release` va a fallar con `E_STAGE_REQUIRED`. Hay que stagear cada paquete que cambió de versión por separado, eligiendo la herramienta correcta según si tiene dependencias internas:

**Sin dependencias `workspace:*`** (hoy, solo `@ac-base/cli`) — usar `npm` real:

```bash
cd cli
npm stage publish --access public
```

**Con dependencias `workspace:^`** hacia otros paquetes del monorepo (todos los componentes del catálogo y `ac-demo-content`) — usar `pnpm`, porque **solo `pnpm` reescribe `workspace:^` a un rango real**; `npm stage publish` lo deja tal cual (`"workspace:^"` sin resolver, roto para cualquiera fuera del monorepo). La versión de `pnpm` fijada en el repo todavía no soporta `stage`, así que hace falta una más nueva vía `corepack`:

```bash
cd packages/components/<paquete>
corepack pnpm@latest --pm-on-fail=ignore stage publish --access public
```

Repite esto por cada paquete que haya cambiado de versión en el commit del Paso 2 (`git show --stat <sha>` para ver cuáles).

> **Verificación recomendada antes de pedir la aprobación**: baja al menos un tarball recién stageado y mira su `package.json` — sobre todo si hay paquetes que dependen entre sí dentro del mismo release (ej. un componente que usa otro componente del catálogo), para confirmar que la versión reescrita es la nueva, no la vieja publicada.
>
> ```bash
> npm stage download <id-del-stage>
> tar xzf <archivo>.tgz && cat package/package.json
> ```

## Paso 5 — Aprobar el staging (npmjs.com, 2FA)

Este paso **no se puede automatizar ni delegar** — lo tiene que hacer la persona dueña de la cuenta de npm:

1. Entrar a [npmjs.com](https://www.npmjs.com/) → perfil → **Staged Packages**.
2. Tildar "Add to batch" en cada versión de este release y aprobarlas todas juntas en un solo lote (una sola confirmación de 2FA).
3. Verificar que ya están publicadas: `npm view <paquete> version` para cada una.

Si algo salió mal con un stage (por ejemplo, hay que corregir algo y volver a stagear la misma versión), primero hay que **rechazarlo** ahí mismo (botón "Reject") — si no, `npm stage publish` tira `E409 Cannot stage previously published version` al reintentar.

## Paso 6 — Tags de git

`changeset publish` crea estos tags solo cuando él mismo hace el publish; como acá se publica por fuera de ese comando, se crean a mano, con el mismo formato que usa Changesets — `<nombre-del-paquete>@<version>` — apuntando al commit del Paso 2 ya en `main`:

```bash
git tag "@ac-base/cli@0.2.0" <sha-del-commit-de-version> -m "@ac-base/cli@0.2.0"
# repetir por cada paquete publicado
git push origin "@ac-base/cli@0.2.0" # ... y el resto
```

## Paso 7 — GitHub Releases

Tampoco se generan solos — un release por tag:

```bash
gh release create "@ac-base/cli@0.2.0" --title "@ac-base/cli@0.2.0" --notes "<texto — normalmente el mismo bloque del CHANGELOG.md de ese paquete>"
```

## Gotchas conocidos (leer antes de publicar)

- **`npm publish`/`npm stage publish` descarta en silencio (solo con un warning, no error) cualquier campo `bin` cuyo valor empiece con `./`** — por ejemplo `"./bin/x.js"`. Usar siempre la ruta sin el `./` inicial (`"bin/x.js"`).
- **`npm stage publish` no reescribe `"workspace:^"`** — usarlo solo para paquetes sin dependencias internas; para cualquier otro, `pnpm` (ver Paso 4).
- **`npm stage reject`/`npm stage approve` por CLI piden un login interactivo por navegador (OTP)** — en la práctica, resolver siempre la aprobación/rechazo desde la web de npmjs.com, no desde la terminal.
