# ac-lit

Framework y ecosistema propio, basado en **[Lit v3](https://lit.dev)**, para crear aplicaciones web y Web Components. Incluye una CLI de scaffolding (`ac`), paquetes base reutilizables (tokens, mixins) y un catálogo de componentes instalables de forma independiente vía npm/pnpm.

Pensado como entorno de práctica real: un desarrollador puede clonar, instalar la CLI, generar componentes y levantar un servidor de desarrollo local tal como lo haría en un proyecto de producción.

> Estado: en definición activa. La arquitectura y convenciones están documentadas en [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md); la implementación del CLI y los paquetes se está construyendo de forma incremental.

## Estructura

Ver [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md) para la estructura completa del monorepo, los scopes de npm (`@ac-base/*`, `@ac-components/*`) y las convenciones de naming.

## CLI (`ac`)

```bash
cd packages/components
node ../../cli/bin/ac.js component:create ac-mi-componente   # o `ac component:create ...` una vez instalado
```

Ver [`cli/README.md`](./cli/README.md) para el detalle de comandos (`ac help`, `ac component:create`, passthrough genérico `ac <script>`, etc.).

## Desarrollo local

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

Lee [`CONTRIBUTING.md`](./CONTRIBUTING.md) antes de abrir un PR: ahí está el flujo de ramas, la convención de commits ([Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)) y el proceso de versionado con Changesets.

## Licencia

[MIT](./LICENSE)
