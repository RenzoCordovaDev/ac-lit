# ac-lit

Framework y ecosistema propio, basado en **[Lit v3](https://lit.dev)**, para crear aplicaciones web y Web Components. Incluye una CLI de scaffolding (`aclit`), paquetes base reutilizables (tokens, mixins) y un catálogo de componentes instalables de forma independiente vía npm.

> La arquitectura y convenciones completas están documentadas en [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md).

## Usar un componente del catálogo

Todos los paquetes (`@ac-base/*`, `@ac-components/*`) están publicados en npm:

```bash
pnpm add @ac-components/ac-button-basic lit
# o: npm i @ac-components/ac-button-basic lit
```

```js
import '@ac-components/ac-button-basic';
```

```html
<ac-button-basic>Aceptar</ac-button-basic>
```

Cada componente trae su propio `README.md` con la API completa (propiedades, eventos, ejemplos) — ver `packages/components/`.

## Estructura del monorepo

Ver [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md) para la estructura completa, los scopes de npm (`@ac-base/*`, `@ac-components/*`) y las convenciones de naming.

## CLI (`aclit`)

```bash
cd packages/components
aclit component:create ac-mi-componente
```

Ver [`cli/README.md`](./cli/README.md) para el detalle de comandos (`aclit help`, `aclit component:create`, passthrough genérico `aclit <script>`, etc.).

## Desarrollo del repositorio

Requisitos: Node.js >= 18 y pnpm (vía Corepack).

```bash
corepack enable
pnpm install
```

```bash
pnpm lint            # ESLint
pnpm format          # Prettier
pnpm test            # tests unitarios de todos los paquetes
pnpm test:e2e        # tests E2E/BDD (los paquetes que tengan test_e2e/)
pnpm test:e2e:a11y   # tests de accesibilidad (axe-core)
pnpm build           # build de todos los paquetes
```

## Contribuir

Lee [`CONTRIBUTING.md`](./CONTRIBUTING.md) antes de abrir un PR: ahí está el flujo de ramas, la convención de commits ([Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)) y el proceso de versionado con Changesets. Si usás un asistente de IA para contribuir, [`AGENTS.md`](./AGENTS.md) tiene el contexto base del proyecto.

## Licencia

[MIT](./LICENSE)
