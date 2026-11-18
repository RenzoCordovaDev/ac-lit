// Capítulos y laboratorios del Laboratorio de aprendizaje -- ruta progresiva y estrictamente
// secuencial (un laboratorio se desbloquea solo cuando el anterior de su capítulo está
// completo, y un capítulo solo cuando el anterior está 100% completo). Igual que
// catalog-meta.js/catalog-api.js: data hand-authored, sin generación automática.
//
// Forma de cada laboratorio: { id, title, objective, context, steps: [...], hint, selfCheck }

export const LAB_CHAPTERS = [
  {
    id: 'fundamentos',
    title: 'Capítulo 0 — Fundamentos y estándares',
    summary:
      'Tokens de diseño, naming de scripts component:*, y Conventional Commits -- las reglas que vas a aplicar en todo lo que sigue.',
    labs: [
      {
        id: 'fund-1',
        title: 'Tokens Emerald Pro en un componente real',
        objective:
          'Identificar qué tokens de diseño usa un componente existente, para qué propiedad y por qué, en lugar de valores literales.',
        context:
          'packages/components/ac-badge-basic/src/badge-basic.styles.scss (estilos) y packages/base/ac-core/src/tokens/base.css (definición de los tokens). Lee también la sección "Emerald Pro — sistema de diseño" de docs/CONVENTIONS.md.',
        steps: [
          'Abre badge-basic.styles.scss y localiza la regla .ac-badge-basic.',
          'Anota en una tabla cada valor de radio, espaciado y tipografía de esa regla: padding, border-radius, font-size, font-weight y line-height.',
          'Busca cada variable en base.css y anota su valor (por ejemplo --radius-full, --space-1, --space-2 y --font-size-xs).',
          'Explica con tus palabras por qué el badge usa --radius-full y no --radius-md (la pastilla está reservada para estados binarios, tags y badges, no para superficies).',
          'Localiza la variante .ac-badge--success e identifica qué tokens de color usa y por qué no usa --color-muted, --color-bg ni --color-surface.',
          'Revisa los valores entre comas dentro de var(...) y anota que lo que va después de la coma es solo un respaldo si el token no existe.',
        ],
        hint: 'Una variable se lee como var(--nombre, respaldo): lo que va antes de la coma es el token que manda; lo que va después solo aplica si el token no está definido.',
        selfCheck:
          'Tienes una tabla con las propiedades del badge, el token de cada una y su valor, y puedes justificar --radius-full (badge = tag/estado) y el uso de tokens de color fijos en la variante success.',
      },
      {
        id: 'fund-2',
        title: 'Scripts component:* y el riesgo del script silencioso',
        objective:
          'Explicar por qué los scripts de paquete llevan el prefijo component: y qué pasaría si un paquete usara un nombre genérico como test.',
        context:
          'docs/CONVENTIONS.md, sección "Scripts de paquete (component:*)"; packages/components/ac-badge-basic/package.json (bloque "scripts") y el package.json raíz (scripts test y build, que pasan por scripts/affected.mjs).',
        steps: [
          'Lee la tabla de scripts de la sección "Scripts de paquete (component:*)" de docs/CONVENTIONS.md.',
          'Abre el bloque "scripts" de packages/components/ac-badge-basic/package.json y localiza component:test y component:build.',
          'Abre el package.json raíz y localiza los scripts test y build; anota que llaman a scripts/affected.mjs con pnpm-run y el nombre component:test o component:build.',
          'Escribe en 3 o 4 líneas qué pasaría si un paquete nuevo nombrara su script de test como test en vez de component:test, y por qué el agregador no avisaría.',
          'Anota qué scripts no existen en un paquete de la familia ac-api-* y por qué, según la sección de APIs simuladas.',
        ],
        hint: 'Piensa en el flag --if-present: si el script no existe con ese nombre exacto, pnpm no falla, simplemente lo salta sin decir nada.',
        selfCheck:
          'Tu explicación dice que pnpm omite sin error un script con nombre distinto, que el CI quedaría en verde sin ejecutar esos tests, y nombra cli/test/package-scripts.test.js como la prueba que lo impide.',
      },
      {
        id: 'fund-3',
        title: 'Conventional Commits con commitlint',
        objective:
          'Escribir mensajes de commit válidos para un feat, un fix y un cambio que rompe la API, y comprobarlos con commitlint sin hacer ningún commit.',
        context:
          'CONTRIBUTING.md, sección "Convención de commits", y commitlint.config.cjs en la raíz del repo (extiende @commitlint/config-conventional y exige el scope en kebab-case).',
        steps: [
          'Lee la sección "Convención de commits" de CONTRIBUTING.md y anota el formato tipo(scope): descripción.',
          'Abre commitlint.config.cjs y anota la regla scope-case con kebab-case.',
          'Escribe un mensaje feat para un cambio hipotético, por ejemplo: feat(badge): agregar variante outline.',
          'Escribe un mensaje fix para un bug hipotético, por ejemplo: fix(link): corregir foco perdido al activar con teclado.',
          'Escribe un mensaje con ! para un cambio que rompe la API, por ejemplo: feat(modal)!: renombrar la propiedad size a dimension.',
          'Valida cada mensaje con: echo "<tu mensaje>" | pnpm exec commitlint (el hook commit-msg hace lo mismo al commitear).',
          'Valida también un mensaje malo, por ejemplo "agrego cosas", y confirma que commitlint lo rechaza.',
        ],
        hint: 'El ! va justo antes de los dos puntos, como en feat(modal)!: ..., y el scope debe ir en kebab-case, sin mayúsculas ni espacios. Si commitlint falla, el mensaje de error dice qué regla se incumplió.',
        selfCheck:
          'Los tres mensajes válidos pasan echo "..." | pnpm exec commitlint sin errores, y el mensaje sin tipo falla. No hiciste ningún commit real.',
      },
      {
        id: 'fund-4',
        title: 'Textos traducibles con this.t()',
        objective:
          'Explicar cómo se resuelve un texto traducible de un componente y escribir una clave que siga la convención de naming.',
        context:
          'docs/CONVENTIONS.md, sección "Controles de formulario y texto", punto "Texto traducible (this.t())", y el locales.json de packages/components/ac-badge-basic (con las claves es-PE, en-EN y pt-BR).',
        steps: [
          'Lee el punto "Texto traducible (this.t())" en docs/CONVENTIONS.md.',
          'Abre packages/components/ac-badge-basic/locales.json y anota su forma: un objeto por código BCP-47 con claves del tipo <componente>-<descripcion>.',
          'Escribe con tus palabras el orden de resolución de un texto: instancia, luego app (addTextTranslations), luego locales.json y, si no hay nada, la clave misma.',
          'Escribe, para un componente hipotético mi-componente, una clave de botón (por ejemplo mi-componente-submit-text) con su traducción es-PE y en-EN.',
          'Confirma que la clave respeta la tabla de naming de la sección "Convenciones de naming" de docs/CONVENTIONS.md.',
        ],
        hint: 'Si una clave aparece tal cual en pantalla en vez de su traducción, casi siempre el código de idioma no coincide exactamente con el de locales.json.',
        selfCheck:
          'Puedes enumerar el orden de resolución en cuatro pasos, y tu clave de ejemplo sigue el patrón <componente>-<descripcion> con traducciones es-PE y en-EN.',
      },
    ],
  },
  {
    id: 'construccion',
    title: 'Capítulo 1 — Construcción',
    summary:
      'Construye un componente propio de punta a punta: desde `aclit component:create` hasta un flujo completo con API pública/privada, eventos, estilos, modal, transición interna y multipasos.',
    labs: [],
  },
  {
    id: 'testing-unitario',
    title: 'Capítulo 2 — Testing unitario',
    summary: 'Cubre con tests el componente que construiste en el Capítulo 1.',
    labs: [],
  },
  {
    id: 'accesibilidad',
    title: 'Capítulo 3 — Accesibilidad',
    summary: 'Audita y corrige la accesibilidad de tu componente con axe-core.',
    labs: [],
  },
  {
    id: 'e2e',
    title: 'Capítulo 4 — Testing E2E',
    summary: 'Escribe un escenario Gherkin de punta a punta para tu flujo completo.',
    labs: [],
  },
  {
    id: 'contribucion',
    title: 'Capítulo 5 — Flujo de contribución (bonus)',
    summary: 'Changesets, abrir una PR y leer los checks de CI -- sobre tu propio fork.',
    labs: [],
  },
];
