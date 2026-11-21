// Niveles, capítulos y laboratorios del Laboratorio de aprendizaje -- al entrar se elige un
// nivel (Básico/Intermedio/Avanzado); dentro de cada nivel la ruta es progresiva y
// estrictamente secuencial (un laboratorio se desbloquea solo cuando el anterior de su
// capítulo está completo, y un capítulo solo cuando el anterior está 100% completo). Igual
// que catalog-meta.js/catalog-api.js: data hand-authored, sin generación automática.
//
// Niveles: Intermedio/Avanzado NO son "lo mismo pero más difícil" -- cada uno suma temas
// nuevos que Básico no cubre (testing, accesibilidad, e2e, analítica...). Por eso hoy solo
// Básico tiene contenido real; Intermedio/Avanzado existen como estructura (su propia
// página, su propio progreso) con `chapters: []`, a escribir en otra sesión.
//
// Forma de cada laboratorio: { id, title, objective, context, steps: [...], hint, selfCheck, estimatedMinutes }
// Forma de cada capítulo: { id, title, summary, labs: [...], estimatedMinutes, outcomes: [...] }
// Forma de cada nivel: { id, title, description, prerequisite, icon, chapters: [...] }

/* Requisitos de software -- se muestran una sola vez, centrados, en la pantalla de
   selección de nivel (aplican por igual a los 3 niveles, no se repiten por tarjeta).
   Vista técnica: comandos reales para confirmar la versión instalada, no una lista
   de prosa -- se omiten a propósito ítems implícitos para cualquier entorno de
   desarrollo (editor, navegador, terminal). */
export const LAB_REQUIREMENTS = {
  equipo:
    'Windows 10/11, macOS 12+ o cualquier distro Linux reciente -- sin requisito de hardware especial.',
  checks: [
    { command: 'node -v', comment: '>=18 requerido (el repo fija 22 en .nvmrc)' },
    {
      command: 'corepack enable && corepack prepare pnpm@9.15.9 --activate',
      comment: 'activa la versión de pnpm que usa el repo',
    },
    { command: 'git --version', comment: null },
  ],
};

const BASICO_CHAPTERS = [
  {
    id: 'fundamentos',
    title: 'Capítulo 0 — Fundamentos y estándares',
    summary:
      'Tokens de diseño, naming de scripts component:*, y Conventional Commits -- las reglas que vas a aplicar en todo lo que sigue.',
    estimatedMinutes: 70,
    outcomes: [
      'Justificar qué token de diseño corresponde a cada propiedad visual en vez de usar valores literales.',
      'Explicar la convención component:* y el riesgo real de un script con nombre distinto.',
      'Escribir y validar mensajes Conventional Commits, incluidos breaking changes.',
      'Agregar claves de texto traducible siguiendo el naming y el orden de resolución del proyecto.',
    ],
    labs: [
      {
        id: 'fund-1',
        title: 'Tokens Emerald Pro en un componente real',
        objective:
          'Un token de diseño es un valor con nombre (un radio, un espaciado, un color) que varios componentes comparten -- cambiarlo en un solo lugar actualiza los 38 componentes del catálogo a la vez.',
        estimatedMinutes: 20,
        content: [
          {
            type: 'p',
            text: 'Si cada componente escribiera border-radius: 16px a mano, cambiar el radio del catálogo entero significaría editar 38 archivos. Emerald Pro resuelve esto con tokens: variables CSS con nombre, definidas una sola vez en @ac-base/ac-core, que cada componente referencia en vez de escribir el valor literal.',
          },
          { type: 'heading', text: 'La escala de radio de borde' },
          {
            type: 'p',
            text: 'Son 4 pasos, de menor a mayor superficie: un control chico dentro de otro más grande usa un paso menos que su contenedor. --radius-full queda aparte, reservado para estados binarios y tags (switch, radio, badge) -- nunca para una superficie como una card.',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'packages/base/ac-core/src/tokens/base.css',
            code: `--radius-sm: 0.5rem;  /* 8px  -- elementos chicos/icónicos (botón de cerrar, marca del checkbox) */
--radius-md: 1rem;    /* 16px -- controles (botón, input, select, tabs) */
--radius-lg: 1.5rem;  /* 24px -- superficies (card, panel, toast, popover) */
--radius-xl: 2rem;    /* 32px -- la superficie más grande del catálogo (modal) */
--radius-full: 9999px;`,
          },
          { type: 'heading', text: 'Espaciado y tipografía' },
          {
            type: 'p',
            text: 'El espaciado sigue una grilla de 4px (--space-1 a --space-6), y la tipografía tiene 4 tamaños con nombre según su rol -- nunca un valor en px suelto.',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'packages/base/ac-core/src/tokens/base.css',
            code: `--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem;  /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem;    /* 16px */

--font-size-xs: 0.75rem; /* badge, texto micro */
--font-size-sm: 0.85rem; /* ayuda, hints */
--font-size-md: 0.95rem; /* cuerpo, default */
--font-size-lg: 1.1rem;  /* títulos */
--font-weight-bold: 700;`,
          },
          { type: 'heading', text: 'Cómo se ven aplicados: ac-badge-basic' },
          {
            type: 'p',
            text: 'Un badge es un indicador de estado (una "pastilla"), no una superficie -- por eso usa --radius-full y no --radius-md. Así se ve su regla base real:',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'packages/components/ac-badge-basic/src/badge-basic.styles.scss',
            code: `.ac-badge-basic {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
  border-radius: var(--radius-full, 9999px);
  font-weight: var(--font-weight-bold, 700);
  font-size: var(--font-size-xs, 0.75rem);
  line-height: var(--line-height-tight, 1.4);
}`,
          },
          {
            type: 'note',
            text: 'var(--nombre, respaldo) se lee así: lo que va antes de la coma es el token que manda; lo que va después solo aplica si ese token no está definido en absoluto (no es un segundo intento, es un valor fijo de emergencia).',
          },
          { type: 'heading', text: 'Los 4 colores semánticos de estado' },
          {
            type: 'p',
            text: 'Las 4 variantes del badge usan colores FIJOS que no cambian entre tema claro y oscuro -- un estado de "error" debe verse igual de rojo sin importar el tema de la página. Por eso no usan --color-muted ni --color-surface (esos sí cambian con el tema):',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'packages/components/ac-badge-basic/src/badge-basic.styles.scss',
            code: `.ac-badge--neutral  { background: var(--color-neutral, #44433d); color: #fff; }
.ac-badge--success  { background: var(--color-success, #499c54); color: #000; }
.ac-badge--warning  { background: var(--color-warning, #e8a400); color: #000; }
.ac-badge--danger   { background: var(--color-danger, #e05555);  color: #000; }`,
          },
        ],
        checkpoint:
          'Puedes nombrar los 4 pasos de la escala de radio y explicar por qué un badge usa --radius-full en vez de --radius-md, y por qué sus 4 colores de estado no cambian entre tema claro y oscuro.',
      },
      {
        id: 'fund-2',
        title: 'Scripts component:* y el riesgo del script silencioso',
        objective:
          'Cada paquete expone el mismo juego de scripts (component:build, component:test, ...) bajo el mismo nombre exacto, para que la raíz del repo pueda correrlos en los 38 a la vez sin saber qué hay adentro de cada uno.',
        estimatedMinutes: 20,
        content: [
          {
            type: 'p',
            text: 'npm/pnpm corren scripts por nombre exacto. Si la raíz del monorepo quiere "construir todos los paquetes afectados", necesita que todos usen el MISMO nombre de script -- de ahí el prefijo component:, reservado para cualquier tarea que exista en todo paquete con una demo.',
          },
          { type: 'heading', text: 'Los scripts reales de un componente' },
          {
            type: 'code',
            lang: 'json',
            filename: 'packages/components/ac-badge-basic/package.json',
            code: `"scripts": {
  "component:lint": "eslint .",
  "component:build:styles": "node ./node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs src/badge-basic.styles.scss src/badge-basic.styles.js BadgeBasicStyles",
  "component:serve": "pnpm run component:build:styles && concurrently -k -n styles,vite -c blue,green \\"pnpm run component:build:styles:watch\\" \\"vite demo\\"",
  "component:build": "pnpm run component:build:styles && vite build",
  "component:test": "pnpm run component:build:styles && web-test-runner \\"test/**/*.test.js\\"",
  "component:test:e2e": "pnpm run component:build && start-server-and-test component:preview http://localhost:4173 component:test:e2e:run"
}`,
          },
          { type: 'heading', text: 'Cómo los dispara la raíz del repo' },
          {
            type: 'p',
            text: 'La raíz nunca corre "todos los paquetes a ciegas": scripts/affected.mjs calcula qué paquetes cambiaron (comparando contra origin/main) y le pide a pnpm que corra, SOLO en esos paquetes, un script con ese nombre exacto.',
          },
          {
            type: 'code',
            lang: 'json',
            filename: 'package.json (raíz)',
            code: `"scripts": {
  "build": "node scripts/affected.mjs pnpm-run component:build",
  "test": "node scripts/affected.mjs pnpm-run test component:test --concurrency=1",
  "lint": "node scripts/affected.mjs eslint"
}`,
          },
          {
            type: 'p',
            text: 'Acá está el riesgo real: pnpm corre con el flag --if-present. Si un paquete nuevo llamara a su script "test" en vez de "component:test", pnpm NO tira ningún error -- simplemente no encuentra ese nombre en ESE paquete y lo salta en silencio. El resultado: CI queda en verde sin haber corrido ni un solo test de ese paquete.',
          },
          {
            type: 'note',
            text: 'cli/test/package-scripts.test.js es la prueba que existe específicamente para que esto no pase desapercibido: falla si algún paquete con demo/ no tiene el juego completo de scripts component:*.',
          },
        ],
        checkpoint:
          'Puedes explicar por qué pnpm omite sin error un script con nombre distinto a component:test/component:build, y por qué eso dejaría el CI en verde sin haber corrido nada para ese paquete.',
      },
      {
        id: 'fund-3',
        title: 'Conventional Commits con commitlint',
        objective:
          'Todo commit de este repo pasa por commitlint antes de aceptarse -- un mensaje que no cumple el formato se rechaza automáticamente, antes de llegar a CI.',
        estimatedMinutes: 15,
        content: [
          {
            type: 'p',
            text: 'El formato es tipo(scope): descripción, forzado localmente por un hook de Husky (commit-msg) que corre commitlint en cada commit.',
          },
          {
            type: 'code',
            filename: 'Formato',
            code: `<tipo>(<scope>): <descripción en minúscula, sin punto final>

[cuerpo opcional]

[footer opcional]`,
          },
          { type: 'heading', text: 'Tipos permitidos y la regla del scope' },
          {
            type: 'p',
            text: 'Tipos: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert. El scope es el nombre corto del paquete afectado, pero tiene una regla propia de este repo (no es parte del estándar): debe ir en kebab-case.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'commitlint.config.cjs',
            code: `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', 'kebab-case'],
  },
};`,
          },
          { type: 'heading', text: 'Ejemplos reales de este repo' },
          {
            type: 'code',
            filename: 'Ejemplos válidos',
            code: `feat(cli): agregar comando \`aclit generate component\`
fix(button): corregir foco perdido al deshabilitar el botón
docs(conventions): documentar convención de nombres de eventos
chore: configurar husky y commitlint`,
          },
          {
            type: 'p',
            text: 'Un cambio que rompe la API pública de un componente (por ejemplo, renombrar una propiedad) lleva un ! justo antes de los dos puntos:',
          },
          {
            type: 'code',
            filename: 'Breaking change',
            code: `feat(modal)!: renombrar la propiedad size a dimension`,
          },
          {
            type: 'note',
            text: 'Puedes validar un mensaje sin hacer ningún commit real: echo "tu mensaje" | pnpm exec commitlint -- es exactamente lo que corre el hook commit-msg al commitear de verdad.',
          },
        ],
        checkpoint:
          'Puedes escribir un feat, un fix y un cambio con ! (breaking) que pasarían commitlint, y sabes que el scope va en kebab-case, no en el estándar de Conventional Commits en sí sino como regla propia de este repo.',
      },
      {
        id: 'fund-4',
        title: 'Textos traducibles con this.t()',
        objective:
          "Ningún componente del catálogo escribe texto fijo en el template -- this.t('clave') resuelve el texto correcto según el idioma activo, con una cadena de 4 pasos antes de rendirse.",
        estimatedMinutes: 15,
        content: [
          {
            type: 'p',
            text: 'AcIntlMixin agrega this.t(key, params?) a cualquier componente. El orden de resolución, de mayor a menor prioridad: (1) una traducción puesta en ESA instancia puntual, (2) una traducción agregada por la app consumidora vía addTextTranslations(), (3) el locales.json propio del componente, y (4) si nada de eso existe, la clave se muestra tal cual -- la señal de que algo quedó mal conectado.',
          },
          { type: 'heading', text: 'locales.json real de un componente' },
          {
            type: 'p',
            text: 'Un objeto por código BCP-47, con una clave por texto. El naming sigue siempre el mismo patrón: <componente>-<descripción>.',
          },
          {
            type: 'code',
            lang: 'json',
            filename: 'packages/components/ac-badge-basic/locales.json',
            code: `{
  "es-PE": { "badge-basic-new": "Nuevo" },
  "en-EN": { "badge-basic-new": "New" },
  "pt-BR": { "badge-basic-new": "Novo" }
}`,
          },
          { type: 'heading', text: 'Usarlo en el template' },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/badge-basic.js (fragmento ilustrativo)',
            code: `render() {
  return html\`<span class="ac-badge-basic">\${this.t('badge-basic-new')}</span>\`;
}`,
          },
          {
            type: 'p',
            text: 'Si una clave aparece tal cual en pantalla (por ejemplo "mi-componente-submit-text" en vez de "Enviar"), casi siempre el código de idioma activo no coincide exactamente con el de locales.json -- es el síntoma más común de un texto traducible mal conectado.',
          },
        ],
        checkpoint:
          'Puedes enumerar los 4 pasos de resolución de un texto traducible, y escribir una clave nueva siguiendo <componente>-<descripción> con su traducción es-PE y en-EN.',
      },
    ],
  },
  {
    id: 'construccion',
    title: 'Capítulo 1 — Construcción',
    summary:
      'Construye un componente propio de punta a punta: desde `aclit component:create` hasta un flujo completo con API pública/privada, eventos, estilos, modal, transición interna y multipasos.',
    estimatedMinutes: 525,
    outcomes: [
      'Scaffoldear un componente real de punta a punta con el CLI propio.',
      'Componer un flujo complejo con 18 componentes del catálogo sin montar nada a mano.',
      'Separar API pública vs. privada en una clase Lit.',
      'Cablear el 100% de los eventos de forma declarativa, incluido tu propio patrón de emisión (_emit()).',
      'Aplicar tu propio sistema de estilos SCSS sobre los tokens del design system.',
      'Construir un ciclo completo de guardado/éxito/error/reset usando ref().',
    ],
    // Componente de referencia real (`catalog-site/lab-reference/<nombre>/`,
    // ver docs/CONVENTIONS.md) -- `renderLabContent()` en catalog.js arma el
    // link "Ver solución" a partir de este nombre de carpeta cuando existe.
    referenceDemo: 'ac-registro-wizard',
    labs: [
      {
        id: 'construccion-01-scaffold',
        title: '1. Scaffoldear el componente y levantar la demo vacía',
        estimatedMinutes: 25,
        objective:
          'Vas a instalar el CLI de ac-lit y generar con él la estructura base de un componente nuevo, fuera del catálogo publicable -- tu propio banco de pruebas para construir `ac-registro-wizard` durante todo este capítulo.',
        content: [
          { type: 'heading', text: 'Instala el CLI' },
          {
            type: 'p',
            text: 'El CLI de ac-lit (`@ac-base/cli`) es el que genera la estructura base de cualquier componente del catálogo -- y también la de este laboratorio. Instálalo como paquete global:',
          },
          { type: 'code', lang: 'bash', code: 'npm install -g @ac-base/cli' },
          { type: 'heading', text: 'Genera el scaffold fuera del catálogo publicable' },
          {
            type: 'p',
            text: 'Vas a construir `ac-registro-wizard` dentro de `catalog-site/lab-reference/`, no en `packages/components/` -- ese directorio es solo para componentes que se publican de verdad. Párate ahí y corre el mismo comando que usarías para cualquier componente real; el nombre tiene que empezar con `ac-`, el CLI lo exige igual:',
          },
          {
            type: 'code',
            lang: 'bash',
            code: 'cd catalog-site/lab-reference\naclit component:create ac-registro-wizard',
          },
          {
            type: 'p',
            text: 'El comando crea la carpeta completa por ti: `package.json`, `src/`, `demo/`, `test/`, `test_e2e/` y los mismos scripts `component:*` que tendría cualquier componente real -- no hace falta crear nada a mano antes de correrlo.',
          },
          { type: 'heading', text: 'Marca el paquete como privado' },
          {
            type: 'p',
            text: 'El scaffold que genera el CLI trae un bloque `publishConfig`, porque por defecto asume que vas a publicar el componente a npm. Como este paquete nunca se publica, bórralo por completo y agrega `"private": true` justo después de `"version"` -- es la única edición manual que falta. Así se ve el `package.json` final (abreviado):',
          },
          {
            type: 'code',
            lang: 'json',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/package.json',
            code: '{\n  "name": "@ac-components/ac-registro-wizard",\n  "version": "0.1.1",\n  "private": true,\n  "description": "ac-lit registro-wizard Web Component — componente de referencia del Laboratorio de aprendizaje (catalog-site/), nunca publicado a npm.",\n  "scripts": {\n    "component:lint": "eslint .",\n    "component:build:styles": "node ./node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs ...",\n    "component:serve": "pnpm run component:build:styles && concurrently -k -n styles,vite -c blue,green \\"pnpm run component:build:styles:watch\\" \\"vite demo\\"",\n    "component:build": "pnpm run component:build:styles && vite build",\n    "component:test": "pnpm run component:build:styles && web-test-runner \\"test/**/*.test.js\\"",\n    "component:test:e2e": "pnpm run component:build && start-server-and-test component:preview http://localhost:4173 component:test:e2e:run"\n  },\n  "dependencies": {\n    "@ac-base/ac-component-mixin": "workspace:^",\n    "@ac-base/ac-intl-mixin": "workspace:^",\n    "@ac-components/ac-api-users": "workspace:^",\n    "@ac-components/ac-button-basic": "workspace:^"\n  },\n  "peerDependencies": { "lit": "^3.0.0" }\n}',
          },
          {
            type: 'p',
            text: 'Fíjate en los `scripts`: todos llevan el prefijo `component:` (`component:serve`, `component:build`, `component:test`...) -- es la misma convención que usa cualquier paquete del catálogo real, así el agregador de scripts del monorepo los reconoce.',
          },
          { type: 'heading', text: 'Instala dependencias y levanta la demo' },
          {
            type: 'p',
            text: '`pnpm-workspace.yaml` ya incluye el patrón `catalog-site/lab-reference/*`, así que tu paquete nuevo entra automáticamente al workspace en cuanto corres `pnpm install` desde la raíz del repo.',
          },
          {
            type: 'code',
            lang: 'bash',
            code: 'pnpm install\npnpm --filter @ac-components/ac-registro-wizard run component:serve',
          },
          {
            type: 'note',
            text: 'Si `pnpm install` falla resolviendo `workspace:^`, revisa que el nombre de la carpeta en `catalog-site/lab-reference/` coincida exactamente con el patrón del workspace -- un glob que no matchea deja el paquete afuera y el protocolo `workspace:^` no tiene contra qué resolver.',
          },
        ],
        checkpoint:
          'La demo abre en el navegador, con `ac-demo-content` alrededor (cabecera, selector ES/EN, tema, dispositivo) y tu componente mostrando el placeholder del scaffold -- un `<span>` con el texto "Hola" -- sin ningún error en la consola.',
      },
      {
        id: 'construccion-02-first-component',
        title: '2. Instalar y declarar tu primer componente del catálogo',
        estimatedMinutes: 25,
        objective:
          'Vas a agregar una dependencia real del catálogo (`ac-input-basic`) a tu componente y declararla en tu `render()`, para ver un componente del catálogo funcionando dentro de tu propia demo.',
        content: [
          { type: 'heading', text: 'Un componente del catálogo es una dependencia más' },
          {
            type: 'p',
            text: 'Se instala, se importa por su efecto de registro y se declara directo en el HTML que devuelve tu `render()` -- exactamente igual que cualquier otra dependencia del monorepo. La única diferencia con un paquete externo es el protocolo `workspace:^`, porque vive en el mismo repo.',
          },
          { type: 'heading', text: 'Agrega la dependencia a tu package.json' },
          {
            type: 'code',
            lang: 'json',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/package.json',
            code: '{\n  "dependencies": {\n    "@ac-base/ac-component-mixin": "workspace:^",\n    "@ac-components/ac-input-basic": "workspace:^"\n  }\n}',
          },
          { type: 'code', lang: 'bash', code: 'pnpm install' },
          { type: 'heading', text: 'Impórtalo por su efecto de registro' },
          {
            type: 'p',
            text: 'Un import sin asignarlo a ninguna variable ejecuta el `customElements.define(...)` que trae el paquete -- después de esa línea, el tag ya existe para el navegador. Agrégalo arriba de `src/registro-wizard.js`:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/src/registro-wizard.js',
            code: "import '@ac-components/ac-input-basic';",
          },
          { type: 'heading', text: 'Declaralo directo en el render()' },
          {
            type: 'p',
            text: "Nunca `document.createElement('ac-input-basic')` ni montarlo a mano: en Lit, un componente hijo se escribe directo en el template `html` que devuelve `render()`, con sus propiedades como bindings. Así lo hace, en el código real del wizard, el campo de nombre del paso 1:",
          },
          {
            type: 'code',
            lang: 'js',
            filename:
              'catalog-site/lab-reference/ac-registro-wizard/src/elements/step-datos/registro-wizard-step-datos.js',
            code: "<ac-input-basic\n  label=${this.t('registro-wizard-nombre-label')}\n  .value=${this.nombre}\n  .error=${this.nombreError}\n  @ac-input-basic-input=${this._onNombreInput}\n></ac-input-basic>",
          },
          {
            type: 'p',
            text: '`label` es un atributo de texto plano -- un string que ya tradujiste con `this.t()`. `.value` y `.error` llevan el punto porque son properties de Lit: pasan el valor real, no su representación como string. Y `@ac-input-basic-input` escucha el evento propio que dispara `ac-input-basic` en cada tecla -- su `event.detail.value` es lo que vas a reemitir hacia arriba.',
          },
          {
            type: 'note',
            text: 'Si el componente no aparece, lo primero a revisar es que el tag que escribiste en el template sea idéntico al que devuelve el `static get is()` del paquete que importaste -- un typo ahí no tira ningún error: el navegador simplemente no reconoce el tag y lo trata como un elemento desconocido, sin estilos ni comportamiento.',
          },
        ],
        checkpoint:
          '`ac-input-basic` se ve dentro de tu componente (no al lado, como hermano, en el HTML de la demo) y escribir en el campo dispara su evento `ac-input-basic-input` -- visible con un `console.log` temporal en el handler o en el panel de eventos de las dev tools.',
      },
      {
        id: 'construccion-03-more-components-and-init',
        title: '3. Sumar el resto de componentes y construir `init()`',
        estimatedMinutes: 75,
        objective:
          'Vas a declarar en el `render()` todos los componentes del catálogo que tu wizard necesita (18 en total) y a escribir el método público `init()`, que simula una lectura inicial contra `ac-api-users`.',
        content: [
          { type: 'heading', text: 'ac-api-users vive en el template aunque no pinte nada' },
          {
            type: 'p',
            text: '`ac-api-users` no tiene interfaz visual: es un simulador de API, no un control de formulario. Pero para que puedas invocar sus métodos y recibir sus eventos, el navegador necesita el elemento montado de verdad en el DOM -- Lit solo crea y actualiza nodos para lo que declaras en el template que devuelve `render()`; un componente que nunca declaras ahí simplemente no existe, y no hay método que invocar sobre un elemento que no existe. Por eso se declara como un hijo más, aunque no renderice nada visible:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/src/registro-wizard.js',
            code: '<ac-api-users\n  ${ref(this._apiUsersRef)}\n  version=${API_VERSION}\n  @ac-api-users-get-user-success=${this._onInitDataSuccess}\n  @ac-api-users-get-user-error=${this._onInitDataError}\n  @ac-api-users-register-success=${this._onRegisterSuccess}\n  @ac-api-users-register-error=${this._onRegisterError}\n></ac-api-users>',
          },
          { type: 'heading', text: 'Declara el resto de componentes del catálogo' },
          {
            type: 'p',
            text: 'La versión completa de referencia usa 18 componentes del catálogo en total, agrupados por dónde los vas a usar: estructura (`ac-transition-container`, `ac-expandable-multistep` + `ac-expandable-step`, `ac-modal-basic`), paso 1/datos (`ac-input-basic` x2, `ac-select-basic`), paso 2/preferencias (`ac-checkbox-basic`, `ac-switch-basic`, `ac-radio-basic`), paso 3/resumen (`ac-avatar-basic`, `ac-badge-basic`, `ac-text-basic`, `ac-divider-basic`) y transversales (`ac-button-basic`, `ac-tooltip-basic`, `ac-spinner-basic`, `ac-notification-basic`), más `ac-api-users` del paso anterior. Cada uno sigue exactamente el mismo patrón de tres pasos que ya usaste con `ac-input-basic` en el laboratorio anterior: se agrega a `dependencies` con `workspace:^`, se importa por su efecto de registro arriba del archivo, y se declara directo en el `render()` -- ningún `document.createElement`, ningún componente montado a mano.',
          },
          {
            type: 'heading',
            text: 'createRef() y ref(): invocar un método, no solo leer una property',
          },
          {
            type: 'p',
            text: 'Un binding `.prop=${valor}` solo sirve para pasarle datos a un hijo de forma declarativa: Lit se encarga de escribirlo en la property cada vez que `valor` cambia, pero nunca te da acceso al nodo en sí. El problema es que `obtenerDatosUsuario(...)` no es una property que puedas bindear -- es un MÉTODO que necesitás invocar en un momento preciso (cuando corre `init()`), no cada vez que el componente vuelve a renderizar. Para eso existe `ref()`: te da una referencia real al elemento del DOM, resuelta por Lit en el momento correcto del ciclo de render, sin que tengas que buscarlo a mano con `querySelector` ni arriesgarte a que todavía no exista.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/src/registro-wizard.js',
            code: "import { createRef, ref } from 'lit/directives/ref.js';",
          },
          {
            type: 'p',
            text: 'En el constructor, cada ref arranca como un contenedor vacío hasta que el template se renderiza por primera vez:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/src/registro-wizard.js',
            code: 'constructor() {\n  super();\n  this.contained = false;\n  this.getBoundary = null;\n  this._infoOpen = false;\n  this._resetState();\n  this._apiUsersRef = createRef();\n  this._stepsRef = createRef();\n}',
          },
          {
            type: 'p',
            text: 'Y en el template, `${ref(this._apiUsersRef)}` (el que ya viste en el bloque de `ac-api-users` de arriba) es lo que conecta esa referencia con el nodo real una vez que existe en el DOM -- después de eso, `this._apiUsersRef.value` ES el elemento `<ac-api-users>`, con todos sus métodos disponibles.',
          },
          { type: 'heading', text: 'Escribe init()' },
          {
            type: 'p',
            text: 'El método público `init()` es la única llamada de LECTURA del wizard -- distinta del método de GUARDADO que vas a cablear en un laboratorio posterior. Usa la referencia para invocar `obtenerDatosUsuario` sobre el mock, con el id de usuario simulado que importa de `utils/constants.js` (`INIT_USER_ID`, que vale `1`), exactamente como lo haría cualquier app consumidora al montar el componente:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'catalog-site/lab-reference/ac-registro-wizard/src/registro-wizard.js',
            code: 'init() {\n  this._apiUsersRef.value?.obtenerDatosUsuario(INIT_USER_ID);\n}',
          },
          {
            type: 'note',
            text: 'El `?.` importa: la primera vez que el componente se conecta, el template todavía puede no haberse renderizado y `this._apiUsersRef.value` sigue siendo `undefined`. Sin el optional chaining, llamar `init()` demasiado pronto lanzaría un error en vez de simplemente no hacer nada todavía. Nunca reemplaces este patrón por `this.shadowRoot.querySelector(...)`.',
          },
        ],
        checkpoint:
          'Con la demo abierta, llamar `wizard.init()` dispara la lectura simulada contra `ac-api-users` sin ningún error en consola -- podés confirmarlo con un `console.log` temporal dentro del handler de éxito, o viendo que el estado interno del wizard cambia.',
      },
      {
        id: 'construccion-04-private-methods',
        title: '4. Separar la lógica interna en métodos privados',
        estimatedMinutes: 50,
        objective:
          'Entender por qué la API pública de un componente real se reduce a 2 métodos (`init()`/`reset()`) y mover toda la lógica interna a métodos privados con prefijo `_`, usando `state: true` para el estado que no es API pública.',
        content: [
          { type: 'heading', text: 'Solo dos métodos públicos' },
          {
            type: 'p',
            text: 'La clase completa de `ac-registro-wizard` expone exactamente 2 métodos sin prefijo: `init()` (dispara la lectura inicial contra `ac-api-users`) y `reset()` (vuelve todo el wizard a su estado inicial). Todo lo demás -- cada handler de evento, el armado del payload de guardado, la reacción a éxito/error -- lleva el prefijo `_` y es lógica interna que nadie fuera del componente necesita invocar.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `  init() {
    this._apiUsersRef.value?.obtenerDatosUsuario(INIT_USER_ID);
  }

  reset() {
    this._resetState();
    this._stepsRef.value?.reset();
    this._emit('ac-registro-wizard-reset');
  }`,
          },
          { type: 'heading', text: 'Estado interno: `state: true`, nunca `type`/`reflect`' },
          {
            type: 'p',
            text: 'Cada property que guarda estado interno del wizard (el valor de un campo, si el modal está abierto, si se está guardando) se declara con `{ state: true }` en `static get properties()`. Es distinto de una property pública como `contained` (que SÍ usa `type: Boolean, reflect: true`, porque es parte de la API del componente y necesita verse como atributo HTML). `state: true` le dice a Lit "esto dispara un re-render, pero no es un atributo ni una API pública" -- justo lo que necesitan las 11 properties que solo le importan al componente mismo.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `  static get properties() {
    return {
      contained: { type: Boolean, reflect: true },   // si debe contenerse en un marco simulado (lo asigna ac-demo-content)
      _open: { state: true },           // transición raíz visible -- arranca en true, este wizard ES la pantalla raíz
      _modalOpen: { state: true },      // modal de éxito visible
      _infoOpen: { state: true },       // modal de info general visible
      _nombre: { state: true },
      _email: { state: true },
      _rol: { state: true },
      _notificaciones: { state: true },
      _terminos: { state: true },
      _plan: { state: true },           // default PLAN_MENSUAL
      _loading: { state: true },        // llamada de guardado en curso
      _errorMessage: { state: true },
      _welcomeUser: { state: true },    // datos de bienvenida precargados por init()
      _registeredUser: { state: true }, // datos ya registrados, para el modal de éxito
    };
  }`,
          },
          { type: 'heading', text: 'Qué va en un método separado vs. una línea inline' },
          {
            type: 'p',
            text: 'El criterio es simple: si un handler solo lee un valor del evento y lo guarda (`this._nombre = event.detail.value`), puede quedar en una línea dentro del propio handler. Pero si hace algo más -- validar, armar un payload, decidir qué otras properties cambian -- va en un método privado con nombre propio. Mirá `_onConfirmClick`: valida `_terminos`, y solo si pasa arma el objeto que le manda a `registrarUsuario`. Y `_onRegisterSuccess`: no es solo "guardar el dato", son 4 cambios de estado coordinados más la emisión de un evento propio.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `  _onConfirmClick() {
    if (!this._terminos) {
      this._errorMessage = this.t('registro-wizard-terminos-error');
      return;
    }
    this._errorMessage = '';
    this._loading = true;
    this._apiUsersRef.value?.registrarUsuario({
      nombre: this._nombre,
      email: this._email,
      rol: this._rol || DEFAULT_ROL,
    });
  }

  _onRegisterSuccess(event) {
    this._loading = false;
    this._errorMessage = '';
    this._registeredUser = event.detail.data;
    this._open = false;
    this._modalOpen = true;
    this._emit('ac-registro-wizard-register-success', { data: event.detail.data });
  }`,
          },
          {
            type: 'note',
            text: 'Todas las properties de estado se inicializan juntas en `_resetState()`, un método privado que el constructor llama una vez y que `reset()` reutiliza más adelante -- así nunca hay dos lugares distintos decidiendo cuál es el valor inicial de una property.',
          },
        ],
        checkpoint:
          'Revisando la clase, los únicos dos métodos sin `_` son `init` y `reset`; cada property de estado interno usa `{ state: true }`, y `_onConfirmClick`/`_onRegisterSuccess` muestran por qué una lógica con más de un paso va en su propio método privado.',
      },
      {
        id: 'construccion-05-declarative-events',
        title: '5. Cablear cada evento de forma declarativa',
        estimatedMinutes: 75,
        objective:
          'Dominar las dos caras del mismo patrón: escuchar eventos de los hijos con bindings `@evento=${...}` directo en el template, y emitir los eventos propios del componente con un único método `_emit(name, detail)` -- sin que aparezca nunca un `addEventListener` imperativo.',
        content: [
          { type: 'heading', text: 'Escuchar: bindings declarativos, nunca addEventListener' },
          {
            type: 'p',
            text: 'El padre de este wizard no escucha por separado los eventos de cada campo del formulario (nombre, email, rol, notificaciones, términos, plan): esa complejidad vive en un único hijo, `<registro-wizard-steps>`, que consolida los 3 pasos y emite eventos ya resueltos. El padre solo pone un `@evento=${this._handler}` por cada uno, directo en el template -- igual que hace con los 4 eventos de `<ac-api-users>` (2 de lectura inicial, 2 de guardado).',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js (render())',
            code: `      <ac-api-users
        \${ref(this._apiUsersRef)}
        version=\${API_VERSION}
        @ac-api-users-get-user-success=\${this._onInitDataSuccess}
        @ac-api-users-get-user-error=\${this._onInitDataError}
        @ac-api-users-register-success=\${this._onRegisterSuccess}
        @ac-api-users-register-error=\${this._onRegisterError}
      ></ac-api-users>`,
          },
          {
            type: 'p',
            text: 'Y así se ve el binding con `<registro-wizard-steps>`: 8 propiedades que bajan por `.prop=${...}` y 8 eventos que suben por `@evento=${...}`, todos en el mismo elemento. Ninguno de los dos lados necesita código imperativo -- Lit vuelve a conectar los bindings en cada render, así que no hay que preocuparse por "desconectar" nada.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js (render())',
            code: `          <registro-wizard-steps
            \${ref(this._stepsRef)}
            .nombre=\${this._nombre}
            .email=\${this._email}
            .rol=\${this._rol}
            .welcomeName=\${this._welcomeUser?.nombre ?? ''}
            .terminos=\${this._terminos}
            .notificaciones=\${this._notificaciones}
            .plan=\${this._plan}
            .loading=\${this._loading}
            @registro-wizard-steps-nombre-change=\${this._onNombreInput}
            @registro-wizard-steps-email-change=\${this._onEmailInput}
            @registro-wizard-steps-rol-change=\${this._onRolChange}
            @registro-wizard-steps-terminos-change=\${this._onTerminosChange}
            @registro-wizard-steps-notificaciones-change=\${this._onNotificacionesChange}
            @registro-wizard-steps-plan-change=\${this._onPlanChange}
            @registro-wizard-steps-confirm-click=\${this._onConfirmClick}
            @registro-wizard-steps-step-change=\${this._onStepsStepChange}
          ></registro-wizard-steps>`,
          },
          { type: 'heading', text: 'Emitir: un único `_emit(name, detail)`' },
          {
            type: 'p',
            text: 'Para el otro sentido -- avisar hacia afuera que algo pasó -- todo el componente pasa por un solo método privado. Es el único lugar de la clase que construye un `CustomEvent` a mano; cualquier otro método que necesite avisar algo lo llama a él, nunca repite el `new CustomEvent(...)` por su cuenta.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `  _emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }`,
          },
          {
            type: 'note',
            text: 'Nunca vas a ver un `addEventListener` imperativo en este patrón (ni en `connectedCallback` ni en ningún otro lado): si necesitás escuchar algo, el binding `@evento=${...}` va en el template, junto al elemento que lo dispara. Eso mantiene cada escucha visible en un solo lugar, atada al propio `render()` -- sin riesgo de dejar un listener colgado si el elemento se quita del DOM.',
          },
        ],
        checkpoint:
          'Buscar `addEventListener` en `src/registro-wizard.js` no devuelve ningún resultado: los 4 eventos de `ac-api-users` y los 8 de `registro-wizard-steps` se escuchan con bindings `@evento` en el template, y `_emit(name, detail)` es el único lugar de la clase que crea un `CustomEvent`.',
      },
      {
        id: 'construccion-06-styles',
        title: '6. Aplicar tus propios estilos desde `.scss`',
        estimatedMinutes: 35,
        objective:
          'Escribir `src/registro-wizard.styles.scss`, compilarlo al módulo `.styles.js` que Lit consume con el script `component:build:styles` de `@ac-base/cli`, y agregarlo a `static get styles()` junto a `componentBaseStyles`.',
        content: [
          {
            type: 'heading',
            text: 'El pipeline: `.scss` -> `.styles.js` -> `static get styles()`',
          },
          {
            type: 'p',
            text: 'Ningún componente del catálogo escribe CSS directo en el JS. El flujo es siempre el mismo: escribís un archivo `.scss` normal, un script lo compila a un módulo `.js` que exporta un `css` de Lit, y ese archivo compilado (que nunca se versiona, está en `.gitignore`) se importa en el componente. Así se ve el `.scss` real de este wizard -- 18 líneas, sin nada exótico: dos reglas de `:host` y una clase para el layout del body, usando tokens de `@ac-base/ac-core` con un valor de respaldo después de la coma.',
          },
          {
            type: 'code',
            lang: 'scss',
            filename: 'src/registro-wizard.styles.scss',
            code: `:host {
  display: block;
  box-sizing: border-box;
  max-width: 100%;
}

:host([hidden]) {
  display: none;
}

.registro-wizard__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4, 1rem);
  padding: var(--space-4, 1rem);
  box-sizing: border-box;
  max-width: 100%;
}`,
          },
          { type: 'heading', text: 'Compilar: `component:build:styles`' },
          {
            type: 'p',
            text: 'El `package.json` que generó el CLI en el laboratorio 1 ya trae el script `component:build:styles` -- no hace falta escribirlo, solo correrlo. Por debajo, ese script llama al compilador de `@ac-base/cli` con 3 argumentos: el `.scss` de entrada, el `.js` de salida y el nombre de la constante que exporta.',
          },
          {
            type: 'code',
            lang: 'bash',
            code: 'node ./node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs src/registro-wizard.styles.scss src/registro-wizard.styles.js RegistroWizardStyles',
          },
          { type: 'heading', text: 'Usarlo: importar y sumarlo a `static get styles()`' },
          {
            type: 'p',
            text: 'El archivo compilado exporta la constante que le pasaste como tercer argumento (`RegistroWizardStyles`). Se importa una sola vez arriba del componente y se agrega al arreglo que devuelve `static get styles()`, junto a `componentBaseStyles` -- el mismo `componentBaseStyles` que ya trae el scaffold desde el laboratorio 1, con los estilos base que comparte todo el catálogo.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `import { RegistroWizardStyles } from './registro-wizard.styles.js';

// ...

  static get styles() {
    return [componentBaseStyles, RegistroWizardStyles];
  }`,
          },
          {
            type: 'note',
            text: '`src/registro-wizard.styles.js` nunca se versiona -- si cambiás de máquina o clonás el repo de nuevo, el componente va a renderizar sin estilos hasta que corras `component:build:styles` otra vez. `pnpm --filter <tu-paquete> run component:serve` ya corre ese script en modo watch en paralelo (vía `concurrently`, generado por el CLI), así que cada guardado del `.scss` recompila y recarga la demo sola.',
          },
        ],
        checkpoint:
          'La demo refleja el espaciado y el layout del `.scss` (gap y padding del body, sin nada de eso en el HTML), `static get styles()` incluye `componentBaseStyles` y `RegistroWizardStyles`, y guardar el `.scss` con `component:serve` corriendo recarga la demo sin que hayas tocado nada más.',
      },
      {
        id: 'construccion-07-modal',
        title: '7. Sumar `ac-modal-basic` para la confirmación final',
        estimatedMinutes: 25,
        objective:
          'Entender cómo `ac-modal-basic` reacciona a eventos (nunca se cierra solo) y por qué su contenido real vive en un componente hijo aparte, no inline en el padre.',
        content: [
          { type: 'heading', text: '`ac-modal-basic` no decide nada por su cuenta' },
          {
            type: 'p',
            text: 'Igual que `ac-transition-container`, `ac-modal-basic` solo dispara eventos cuando el usuario toca sus botones -- quien lo consume decide qué hacer con cada uno. El modal de éxito del wizard usa `size="full"`, un `header` y un `primary-text` traducibles con `this.t()`, y se abre/cierra con una property privada de estado: `_modalOpen`. Así se declara en `registro-wizard.js`:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `<ac-modal-basic
  ?open=\${this._modalOpen}
  ?contained=\${this.contained}
  .getBoundary=\${this.getBoundary}
  size="full"
  header=\${this.t('registro-wizard-modal-header')}
  primary-text=\${this.t('registro-wizard-modal-primary')}
  @ac-modal-basic-primary-click=\${this._onModalPrimaryClick}
>
  <registro-wizard-modal-resultado
    .userId=\${this._registeredUser?.id ?? null}
    .nombre=\${this._registeredUser?.nombre ?? ''}
    .email=\${this._registeredUser?.email ?? ''}
    .rol=\${this._registeredUser?.rol ?? ''}
  ></registro-wizard-modal-resultado>
</ac-modal-basic>`,
          },
          {
            type: 'p',
            text: 'El click en "Cerrar" dispara `@ac-modal-basic-primary-click`, que llama a `_onModalPrimaryClick`. En la versión final ese método también reinicia todo el formulario -- el detalle completo de `reset()` lo armás en el laboratorio 10:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `_onModalPrimaryClick() { this._modalOpen = false; this.reset(); }`,
          },
          { type: 'heading', text: 'El contenido real vive en un componente hijo' },
          {
            type: 'p',
            text: '`ac-modal-basic` solo aporta la estructura (overlay, header, botones). Lo que se ve adentro -- avatar, mensaje, badge del rol -- es un componente propio, `registro-wizard-modal-resultado`, que recibe cuatro properties planas (`userId`, `nombre`, `email`, `rol`) y no dispara ningún evento: es puramente de presentación. Fijate que su `render()` no pinta nada hasta tener un nombre real, para no mostrar el modal vacío un instante antes de que lleguen los datos:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/modal-resultado/registro-wizard-modal-resultado.js',
            code: `render() {
  if (!this.nombre) return html\`\`;

  return html\`
    <div class="registro-wizard-modal-resultado__content">
      <ac-avatar-basic name=\${this.nombre} size="lg"></ac-avatar-basic>
      <ac-text-basic tag="p" size="lg"
        >Usuario #\${this.userId} registrado con éxito.</ac-text-basic
      >
      <ac-text-basic tag="p" size="md">\${this.nombre} · \${this.email}</ac-text-basic>
      <ac-badge-basic ambient="success">\${ROL_BADGE_LABEL[this.rol] ?? this.rol}</ac-badge-basic>
    </div>
  \`;
}`,
          },
          { type: 'heading', text: 'El mismo patrón, para un segundo modal' },
          {
            type: 'p',
            text: 'El wizard tiene un segundo modal, abierto desde el ícono ⓘ de la cabecera: `registro-wizard-modal-info`, con información general sobre el flujo. Es un hermano del modal de éxito dentro de `registro-wizard.js` -- mismo `ac-modal-basic` como estructura, mismo criterio de delegar el contenido a un componente hijo, solo que este no recibe ninguna property (es texto estático traducido con `this.t()`) ni dispara eventos:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `<ac-modal-basic
  ?open=\${this._infoOpen}
  ?contained=\${this.contained}
  .getBoundary=\${this.getBoundary}
  header=\${this.t('registro-wizard-info-title')}
  @ac-modal-basic-close=\${this._onInfoModalClose}
>
  <registro-wizard-modal-info></registro-wizard-modal-info>
</ac-modal-basic>`,
          },
          {
            type: 'note',
            text: 'El patrón se repite en todo el catálogo: un componente estructural (`ac-modal-basic`) que solo sabe abrir/cerrar y emitir eventos, más un componente hijo liviano y sin lógica propia que aporta el contenido real. Separar así evita que `ac-modal-basic` tenga que conocer los datos de cada caso de uso que lo consume.',
          },
        ],
        checkpoint:
          'Podés explicar por qué `ac-modal-basic` no decide solo cuándo cerrarse, qué cuatro properties recibe `registro-wizard-modal-resultado` y por qué su `render()` no pinta nada sin un nombre, y qué patrón comparte con `registro-wizard-modal-info`.',
      },
      {
        id: 'construccion-08-transition-container',
        title: '8. Envolver todo el flujo en `ac-transition-container`',
        estimatedMinutes: 35,
        objective:
          'Entender por qué `_open` arranca en `true` en este wizard (no hay pantalla "anterior"), qué hace `hide-menu-icon` y qué decide hacer el componente cuando la flecha de volver -- fija, no se puede ocultar -- recibe un click.',
        content: [
          { type: 'heading', text: 'Este wizard ES la pantalla raíz' },
          {
            type: 'p',
            text: 'En un uso típico de `ac-transition-container` hay una navegación real: un menú, y una sub-pantalla a la que se entra con una transición. Acá no: el wizard completo es la pantalla raíz, visible desde que el componente se monta, sin ningún botón "Abrir" previo. Por eso `_open` arranca en `true` -- no en `false` esperando un click -- y así queda declarado en el estado y pasado al contenedor:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `static get properties() {
  return {
    // ...
    _open: { state: true },   // transición raíz visible -- arranca en true, este wizard ES la pantalla raíz, no tiene "anterior"
    // ...
  };
}

_resetState() {
  this._open = true;
  this._modalOpen = false;
  // ... el resto de las properties privadas vuelven a su valor inicial
}`,
          },
          { type: 'heading', text: '`hide-menu-icon` sí, la flecha de volver no' },
          {
            type: 'p',
            text: '`hide-menu-icon` oculta el ícono de hamburguesa cuando el flujo no lo necesita. La flecha de volver, en cambio, es fija: `ac-transition-container` siempre la muestra, y tu componente siempre tiene que decidir qué hacer con su click -- aunque la decisión sea "reiniciar" en vez de "navegar hacia atrás", porque acá no existe una pantalla anterior real. El `slot="header-end"` deja sumar una acción extra a la cabecera -- en este caso, el ícono de información que abre el segundo modal del laboratorio 7:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `<ac-transition-container
  ?open=\${this._open}
  ?contained=\${this.contained}
  .getBoundary=\${this.getBoundary}
  header-text=\${this.t('registro-wizard-header-text')}
  hide-menu-icon
  @ac-transition-container-header-back-icon-click=\${this._onBackIconClick}
>
  <ac-icon-button-basic slot="header-end" name="info" ambient="secondary"
    a11y-label=\${this.t('registro-wizard-info-aria')}
    @click=\${this._onInfoIconClick}
  ></ac-icon-button-basic>
  <div class="registro-wizard__body">
    <!-- ... el resto del flujo, ver laboratorio 9 ... -->
  </div>
</ac-transition-container>`,
          },
          {
            type: 'p',
            text: 'Los dos handlers son deliberadamente simples: la flecha de volver reinicia todo el flujo en vez de navegar, y el ícono de información solo abre el modal que ya conocés del laboratorio 7.',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `_onBackIconClick() { this.reset(); }   // este wizard no tiene pantalla anterior: la flecha de volver reinicia el flujo
_onInfoIconClick() { this._infoOpen = true; }`,
          },
          {
            type: 'note',
            text: '`<ac-api-users>` y los dos `<ac-modal-basic>` son hermanos de `ac-transition-container`, nunca van anidados dentro de su contenido -- en el laboratorio 10 vas a ver el bug real que eso evita.',
          },
        ],
        checkpoint:
          'Podés explicar por qué `_open` arranca en `true`, qué diferencia hay entre `hide-menu-icon` (opcional) y la flecha de volver (fija), qué hace `_onBackIconClick` en este wizard puntual y para qué sirve el slot `header-end`.',
      },
      {
        id: 'construccion-09-multistep',
        title: '9. Convertir el flujo interno en multipasos',
        estimatedMinutes: 75,
        objective:
          'Entender cómo `registro-wizard-steps` encapsula el multistep interno (`ac-expandable-multistep` + 3 `ac-expandable-step`) y expone hacia su padre una API simple -- properties planas y eventos ya consolidados -- en vez de que el padre tenga que lidiar con cada paso individual.',
        content: [
          { type: 'heading', text: 'Un componente hijo que encapsula todo el multistep' },
          {
            type: 'p',
            text: 'El multistep interno no vive dentro de `registro-wizard.js`: vive en un componente propio, `registro-wizard-steps`. El padre no conoce `ac-expandable-multistep` ni los 3 pasos individuales -- solo le pasa sus datos como properties planas (`.nombre`, `.email`, `.rol`, ...) y escucha un puñado de eventos ya consolidados:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `<registro-wizard-steps
  \${ref(this._stepsRef)}
  .nombre=\${this._nombre} .email=\${this._email} .rol=\${this._rol}
  .welcomeName=\${this._welcomeUser?.nombre ?? ''}
  .terminos=\${this._terminos} .notificaciones=\${this._notificaciones} .plan=\${this._plan}
  .loading=\${this._loading}
  @registro-wizard-steps-confirm-click=\${this._onConfirmClick}
  @registro-wizard-steps-step-change=\${this._onStepsStepChange}
></registro-wizard-steps>`,
          },
          { type: 'heading', text: 'Puertas adentro: el multistep coordina, los 3 pasos emiten' },
          {
            type: 'p',
            text: 'Dentro de `registro-wizard-steps` sí aparece `ac-expandable-multistep` con sus 3 `ac-expandable-step`, cada uno con una `createRef()` propia. El contenido real de cada paso es, a su vez, otro componente hijo (`registro-wizard-step-datos`, `-step-preferencias`, `-step-resumen`). Este es el `render()` completo:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/steps/registro-wizard-steps.js',
            code: `render() {
  return html\`
    <ac-expandable-multistep
      @ac-expandable-multistep-active-step-change=\${this._onMultistepStepChange}
    >
      <ac-expandable-step
        \${ref(this._step1Ref)}
        header=\${this.t('registro-wizard-step1-header')}
        active
      >
        <registro-wizard-step-datos
          .nombre=\${this.nombre}
          .email=\${this.email}
          .rol=\${this.rol}
          .nombreError=\${this._nombreError}
          .welcomeName=\${this.welcomeName}
          @registro-wizard-step-datos-nombre-input=\${this._onNombreInput}
          @registro-wizard-step-datos-email-input=\${this._onEmailInput}
          @registro-wizard-step-datos-rol-change=\${this._onRolChange}
          @registro-wizard-step-datos-next-click=\${this._onStep1NextClick}
        ></registro-wizard-step-datos>
      </ac-expandable-step>

      <ac-expandable-step \${ref(this._step2Ref)} header=\${this.t('registro-wizard-step2-header')}>
        <registro-wizard-step-preferencias
          .terminos=\${this.terminos}
          .notificaciones=\${this.notificaciones}
          .plan=\${this.plan}
          @registro-wizard-step-preferencias-terminos-change=\${this._onTerminosChange}
          @registro-wizard-step-preferencias-notificaciones-change=\${this._onNotificacionesChange}
          @registro-wizard-step-preferencias-plan-change=\${this._onPlanChange}
          @registro-wizard-step-preferencias-next-click=\${this._onStep2NextClick}
        ></registro-wizard-step-preferencias>
      </ac-expandable-step>

      <ac-expandable-step \${ref(this._step3Ref)} header=\${this.t('registro-wizard-step3-header')}>
        <registro-wizard-step-resumen
          .nombre=\${this.nombre}
          .email=\${this.email}
          .rol=\${this.rol}
          .plan=\${this.plan}
          .notificaciones=\${this.notificaciones}
          .loading=\${this.loading}
          @registro-wizard-step-resumen-confirm-click=\${this._onConfirmClick}
        ></registro-wizard-step-resumen>
      </ac-expandable-step>
    </ac-expandable-multistep>
  \`;
}`,
          },
          {
            type: 'p',
            text: 'El paso 1 nunca avanza solo: `registro-wizard-steps` valida nombre/correo y, si pasan, llama al método público `complete()` del step por `ref()` -- nunca asigna `active`/`completed` a mano, porque eso no pasa por el flujo reactivo que escucha `ac-expandable-multistep`:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/steps/registro-wizard-steps.js',
            code: `_onStep1NextClick() {
  if (!this.nombre.trim() || !this.email.trim()) {
    this._nombreError = this.t('registro-wizard-nombre-error');
    return;
  }
  this._step1Ref.value?.complete();
}`,
          },
          {
            type: 'heading',
            text: 'Hacia abajo: cada paso delega en su propio componente de contenido',
          },
          {
            type: 'p',
            text: '`registro-wizard-step-datos` (paso 1) no guarda ningún estado propio de los datos: recibe `nombre`/`email`/`rol`/`nombreError`/`welcomeName` por property y reemite cada interacción como un evento propio, siempre con el mismo método `_emit` que ya viste en `registro-wizard.js`:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/step-datos/registro-wizard-step-datos.js',
            code: `_onNombreInput(event) {
  this._emit('registro-wizard-step-datos-nombre-input', { value: event.detail.value });
}

_onNextClick() {
  this._emit('registro-wizard-step-datos-next-click');
}

_emit(name, detail = {}) {
  this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
}`,
          },
          {
            type: 'p',
            text: 'El paso 3 (`registro-wizard-step-resumen`) hace lo mismo con el botón "Confirmar": mientras `loading` es `true` (una property que le llega desde el padre, a través de `registro-wizard-steps`), muestra un spinner en vez del botón:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/step-resumen/registro-wizard-step-resumen.js',
            code: `\${
  this.loading
    ? html\`<ac-spinner-basic size="md" ambient="primary"></ac-spinner-basic>\`
    : html\`<ac-button-basic
        ambient="primary"
        @ac-button-basic-click=\${this._onConfirmClick}
        >\${this.t('registro-wizard-confirm')}</ac-button-basic
      >\`
}`,
          },
          { type: 'heading', text: 'Hacia arriba: la API simple que ve el padre' },
          {
            type: 'p',
            text: '`registro-wizard-steps` reemite cada evento de hoja (y el cambio de paso del multistep) como su propio evento namespaced -- `registro-wizard-steps-nombre-change`, `-email-change`, `-rol-change`, `-terminos-change`, `-notificaciones-change`, `-plan-change`, `-confirm-click` y `-step-change`. Así, `registro-wizard.js` nunca escucha nada de los 3 pasos individuales, solo de este único componente:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/steps/registro-wizard-steps.js',
            code: `_onMultistepStepChange(event) {
  this._emit('registro-wizard-steps-step-change', {
    step: event.detail.stepNumber,
    totalSteps: event.detail.totalSteps,
  });
}`,
          },
          {
            type: 'note',
            text: 'Composición real en tres niveles: el padre (`registro-wizard`) coordina estado y guardado; el hijo compuesto (`registro-wizard-steps`) coordina la navegación entre pasos; los hijos de hoja (`step-datos`/`-preferencias`/`-resumen`) no guardan nada, solo muestran y emiten. Cada nivel expone una API más chica que el nivel de abajo.',
          },
        ],
        checkpoint:
          'Podés explicar qué hace automáticamente `ac-expandable-multistep`, por qué `registro-wizard-steps` llama a `step.complete()` por `ref()` en vez de asignar `active`/`completed` a mano, y cómo ese mismo componente expone hacia `registro-wizard.js` properties planas y eventos consolidados en vez de obligar al padre a tratar con cada paso.',
      },
      {
        id: 'construccion-10-close-the-loop',
        title: '10. Cerrar el ciclo: guardar, confirmar y `reset()`',
        estimatedMinutes: 105,
        objective:
          'Recorrer el flujo completo de guardado -- validación, llamada simulada, éxito, error -- y entender por qué `reset()` tiene que resetear también al componente hijo de pasos, no solo al padre.',
        content: [
          { type: 'heading', text: 'El flujo completo de "Confirmar"' },
          {
            type: 'p',
            text: 'El evento `registro-wizard-steps-confirm-click` (el que armaste en el laboratorio 9) llega a `_onConfirmClick`, en `registro-wizard.js`. Antes de llamar a la API, valida que se hayan aceptado los términos -- si no, fija un mensaje de error y no llama a nada:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `_onConfirmClick() {
  if (!this._terminos) {
    this._errorMessage = this.t('registro-wizard-terminos-error');
    return;
  }
  this._errorMessage = '';
  this._loading = true;
  this._apiUsersRef.value?.registrarUsuario({
    nombre: this._nombre,
    email: this._email,
    rol: this._rol || DEFAULT_ROL,
  });
}`,
          },
          { type: 'heading', text: 'Éxito: cerrar la transición, abrir el modal' },
          {
            type: 'p',
            text: 'Cuando `ac-api-users` responde con éxito, `_onRegisterSuccess` guarda los datos reales, cierra la transición raíz del laboratorio 8 y abre el modal del laboratorio 7 -- en el mismo gesto:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `_onRegisterSuccess(event) {
  this._loading = false;
  this._errorMessage = '';
  this._registeredUser = event.detail.data;
  this._open = false;       // cierra la transición
  this._modalOpen = true;   // abre el modal de éxito
  this._emit('ac-registro-wizard-register-success', { data: event.detail.data });
}`,
          },
          { type: 'heading', text: 'Error: solo un mensaje, nada se cierra' },
          {
            type: 'p',
            text: 'Si la llamada falla, `_onRegisterError` solo fija `_errorMessage` -- nunca toca `_open` ni `_modalOpen`, para que la transición se quede abierta y el usuario pueda reintentar sin perder lo que ya escribió. El mensaje se muestra con un `ac-notification-basic` inline, declarado como hermano del resto del cuerpo:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `_onRegisterError(event) {
  this._loading = false;
  this._errorMessage = event.detail.error?.message ?? this.t('registro-wizard-register-error');
  this._emit('ac-registro-wizard-register-error', { error: event.detail.error });
}`,
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `\${this._errorMessage
  ? html\`<ac-notification-basic ambient="danger" .message=\${this._errorMessage} @ac-notification-basic-dismiss-click=\${this._onDismissError}></ac-notification-basic>\`
  : ''}`,
          },
          { type: 'heading', text: '`reset()` real: resetea al padre Y al hijo de pasos' },
          {
            type: 'p',
            text: 'El botón "Cerrar" del modal (laboratorio 7) y la flecha de volver (laboratorio 8) llaman, los dos, a `reset()`. Ese método no solo restaura las properties privadas del padre -- también llama a `reset()` sobre `registro-wizard-steps`, por la misma `createRef()` que ya usás para llamar `init()`:',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/registro-wizard.js',
            code: `reset() {
  this._resetState();
  this._stepsRef.value?.reset();
  this._emit('ac-registro-wizard-reset');
}`,
          },
          {
            type: 'p',
            text: 'Ese segundo `reset()` -- el de `registro-wizard-steps` -- es el que devuelve los 3 `ac-expandable-step` a su estado inicial (paso 1 activo, pasos 2 y 3 ni completados ni activos):',
          },
          {
            type: 'code',
            lang: 'js',
            filename: 'src/elements/steps/registro-wizard-steps.js',
            code: `reset() {
  this._nombreError = '';
  if (this._step1Ref.value) {
    this._step1Ref.value.completed = false;
    this._step1Ref.value.active = true;
  }
  if (this._step2Ref.value) {
    this._step2Ref.value.completed = false;
    this._step2Ref.value.active = false;
  }
  if (this._step3Ref.value) {
    this._step3Ref.value.completed = false;
    this._step3Ref.value.active = false;
  }
}`,
          },
          {
            type: 'note',
            text: 'El bug real que esto evita: si `reset()` del padre solo restaurara sus propias properties (nombre, correo, rol...) sin llamar también al `reset()` de `registro-wizard-steps`, el formulario se vería "vacío" por fuera -- pero el multistep seguiría mostrando el paso 3 (resumen) activo por dentro, con datos que ya no existen. Resetear un componente compuesto significa resetear también a sus hijos con estado propio, no solo al estado que vive en el padre.',
          },
        ],
        checkpoint:
          'Podés trazar el ciclo completo (confirmar → loading → éxito o error) citando los cuatro métodos reales, y explicar por qué `reset()` del padre tiene que llamar también al `reset()` de `registro-wizard-steps`, con el bug concreto que eso evita.',
      },
    ],
  },
  {
    id: 'testing-unitario',
    title: 'Capítulo 2 — Testing unitario',
    summary: 'Cubre con tests el componente que construiste en el Capítulo 1.',
    estimatedMinutes: 150,
    outcomes: [
      'Escribir tests unitarios (suite/test) que cubran el componente construido en el Capítulo 1.',
    ],
    labs: [],
  },
  {
    id: 'accesibilidad',
    title: 'Capítulo 3 — Accesibilidad',
    summary: 'Audita y corrige la accesibilidad de tu componente con axe-core.',
    estimatedMinutes: 90,
    outcomes: [
      'Auditar con axe-core e interpretar/corregir violaciones reales sin romper el diseño.',
    ],
    labs: [],
  },
  {
    id: 'e2e',
    title: 'Capítulo 4 — Testing E2E',
    summary: 'Escribe un escenario Gherkin de punta a punta para tu flujo completo.',
    estimatedMinutes: 150,
    outcomes: [
      'Escribir un escenario Gherkin/WebdriverIO de punta a punta sobre el flujo completo propio.',
    ],
    labs: [],
  },
  {
    id: 'contribucion',
    title: 'Capítulo 5 — Flujo de contribución (bonus)',
    summary: 'Changesets, abrir una PR y leer los checks de CI -- sobre tu propio fork.',
    estimatedMinutes: 60,
    outcomes: [
      'Generar un changeset, abrir una PR propia, y leer/interpretar los checks de CI antes de mergear.',
    ],
    labs: [],
  },
];

// Íconos propios de las 3 tarjetas de nivel y de sus features -- mismo estilo
// stroke-based del resto del sitio (viewBox 24x24), sin depender del catálogo
// de componentes.
const CODE_ICON = '<path d="M8 9l-3 3 3 3M16 9l3 3-3 3"/>';
const LAYERS_ICON = '<path d="M12 3L3 8l9 5 9-5-9-5z"/><path d="M3 13l9 5 9-5"/>';
const TROPHY_ICON =
  '<path d="M8 3h8v4a4 4 0 0 1-8 0V3z"/><path d="M8 4H5a2 2 0 0 0 2 4M16 4h3a2 2 0 0 1-2 4"/><path d="M12 11v4"/><path d="M9 19h6"/>';
const PLAY_FEATURE_ICON = '<path d="M7 5l10 7-10 7V5z" fill="currentColor" stroke="none"/>';
const DOC_FEATURE_ICON =
  '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>';
const CHECK_FEATURE_ICON = '<path d="M5 12.5l4.5 4.5L15 7.5" stroke-width="2.5"/>';
const FLASK_FEATURE_ICON =
  '<path d="M9 2v6.5L4 18a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3L15 8.5V2"/><path d="M8 2h8"/>';
const BOLT_FEATURE_ICON =
  '<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" stroke="none"/>';
const CHART_FEATURE_ICON = '<path d="M4 20V10M12 20V4M20 20v-6"/>';
const ROCKET_FEATURE_ICON =
  '<path d="M12 2c3 2 4 6 4 10 0 2-1 4-2 5l-2 2-2-2c-1-1-2-3-2-5 0-4 1-8 4-10z"/><path d="M9 15l-3 3 1 1M15 15l3 3-1 1"/>';
const STAR_FEATURE_ICON =
  '<path d="M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16l-5.3 2.8 1-5.8-4.2-4.1 5.9-.9L12 3z" fill="currentColor" stroke="none"/>';

export const LAB_LEVELS = [
  {
    id: 'basico',
    title: 'Básico',
    levelLabel: 'Nivel 1',
    description:
      'Construí tu primer componente guiado paso a paso, con código de referencia en cada laboratorio.',
    icon: CODE_ICON,
    ctaLabel: 'Comenzar',
    features: [
      { icon: PLAY_FEATURE_ICON, text: 'Laboratorios prácticos' },
      { icon: DOC_FEATURE_ICON, text: 'Código de ejemplo' },
      { icon: CHECK_FEATURE_ICON, text: 'Validación inmediata' },
    ],
    chapters: BASICO_CHAPTERS,
  },
  {
    id: 'intermedio',
    title: 'Intermedio',
    levelLabel: 'Nivel 2',
    description: 'Profundizá en testing y accesibilidad sobre lo que ya construiste.',
    icon: LAYERS_ICON,
    ctaLabel: 'Continuar',
    features: [
      { icon: FLASK_FEATURE_ICON, text: 'Casos avanzados' },
      { icon: CHECK_FEATURE_ICON, text: 'Buenas prácticas' },
      { icon: BOLT_FEATURE_ICON, text: 'Desafíos reales' },
    ],
    chapters: [],
  },
  {
    id: 'avanzado',
    title: 'Avanzado',
    levelLabel: 'Nivel 3',
    description: 'Testing E2E, analítica y los temas de producción que básico no cubre.',
    icon: TROPHY_ICON,
    ctaLabel: 'Explorar',
    features: [
      { icon: CHART_FEATURE_ICON, text: 'Proyectos completos' },
      { icon: ROCKET_FEATURE_ICON, text: 'Casos de uso reales' },
      { icon: STAR_FEATURE_ICON, text: 'Optimización y performance' },
    ],
    chapters: [],
  },
];
