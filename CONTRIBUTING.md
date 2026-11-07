# Contribuir a ac-lit

Gracias por aportar al ecosistema **ac-lit**. Esta guía resume cómo trabajamos: ramas, commits, versionado y publicación.

## Requisitos

- Node.js >= 18 (usamos `22`, ver [`.nvmrc`](./.nvmrc))
- [pnpm](https://pnpm.io/) vía Corepack: `corepack enable && corepack prepare pnpm@9.15.9 --activate`

```bash
pnpm install
```

El `pnpm install` deja activados los git hooks locales (Husky) automáticamente.

## Flujo de ramas (trunk-based)

- `main` es la única rama permanente y siempre debe quedar en estado desplegable.
- Todo cambio se hace en una rama corta creada desde `main`, con el prefijo igual al tipo de commit que predomina en el cambio:
  - `feat/<descripcion-corta>`
  - `fix/<descripcion-corta>`
  - `docs/<descripcion-corta>`
  - `chore/<descripcion-corta>`
  - `refactor/<descripcion-corta>`
  - `test/<descripcion-corta>`
  - `ci/<descripcion-corta>`
- Todo cambio llega a `main` vía **Pull Request**, nunca con push directo (la rama `main` está protegida).
- El PR debe pasar CI (lint + test) antes de poder mergearse.
- Se recomienda **squash merge** para mantener el historial de `main` limpio y en formato Conventional Commits (el título del squash = el commit final).

## Convención de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) estrictamente, forzado localmente con **commitlint + Husky** (hook `commit-msg`): un commit que no respete el formato es rechazado automáticamente.

Formato:

```
<tipo>(<scope>): <descripción en minúscula, sin punto final>

[cuerpo opcional]

[footer opcional]
```

**Tipos permitidos:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

**Scope:** el nombre corto del paquete afectado, en kebab-case, sin el scope de npm. Ejemplos: `core`, `cli`, `component-mixin`, `intl-mixin`, `button`, `link`. Usa `*` o deja el scope vacío para cambios que tocan todo el monorepo.

Ejemplos:

```
feat(cli): agregar comando `ac generate component`
fix(button): corregir foco perdido al deshabilitar el botón
docs(conventions): documentar convención de nombres de eventos
chore: configurar husky y commitlint
```

### Identidad de autor

Todos los commits de este repositorio se firman únicamente con la identidad del mantenedor configurada en el `git config` local del proyecto. **No se agregan trailers de co-autoría de herramientas de IA** salvo que el mantenedor lo indique explícitamente para un commit puntual.

## Versionado y changelog (Changesets)

Cada paquete en `packages/` y `cli/` versiona de forma **independiente** vía [Changesets](https://github.com/changesets/changesets).

Cuando tu cambio afecta uno o más paquetes publicables:

```bash
pnpm changeset
```

Esto te pregunta qué paquetes cambiaron, el tipo de bump (`patch`/`minor`/`major`) y genera un archivo en `.changeset/` que debe incluirse en el mismo PR.

El bump de versión real y la actualización de `CHANGELOG.md` por paquete ocurre luego, en un PR automático generado por CI (`pnpm version-packages`). La publicación a npm (`pnpm release`) corre en CI al mergear ese PR.

## Lint, formato y tests

```bash
pnpm lint          # ESLint sobre todo el monorepo
pnpm format        # Prettier --write
pnpm test          # tests de todos los paquetes (@open-wc/testing + @web/test-runner)
```

El hook `pre-commit` corre `lint-staged` (ESLint + Prettier) solo sobre los archivos en stage.

## Licencia

Al contribuir aceptas que tu código se publique bajo la licencia [MIT](./LICENSE) del proyecto.
