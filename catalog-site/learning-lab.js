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
    // Componente de referencia real (`catalog-site/lab-reference/<nombre>/`,
    // ver docs/CONVENTIONS.md) -- `renderLabChapters()` en catalog.js arma el
    // link "Ver solución" a partir de este nombre de carpeta cuando existe.
    referenceDemo: 'ac-registro-wizard',
    labs: [
      {
        id: 'construccion-01-scaffold',
        title: '1. Scaffoldear el componente y levantar la demo vacía',
        objective:
          'Instalar el CLI de ac-lit y generar la estructura base de un componente nuevo, fuera del catálogo publicable, para usarlo como tu propio banco de pruebas durante todo este capítulo.',
        context:
          'El componente de referencia de este capítulo se llama `ac-registro-wizard` y vive en `catalog-site/lab-reference/ac-registro-wizard/` -- no en `packages/components/` (ese directorio es solo para componentes que se publican de verdad). Pero, salvo por eso, es un paquete real: lo genera el mismo `aclit component:create` que generaría cualquier componente del catálogo, con `package.json`, `src/`, `demo/`, `test/`, `test_e2e/` y los mismos scripts `component:*` -- la única diferencia real es que queda `"private": true` y nunca se publica.',
        steps: [
          'Instala el CLI globalmente: `npm install -g @ac-base/cli`.',
          'Párate en `catalog-site/lab-reference/` y corre `aclit component:create ac-<tu-nombre>` (el nombre tiene que empezar con `ac-`, el CLI lo exige igual que a cualquier componente real) -- el comando crea la carpeta por vos, no hace falta crearla a mano antes.',
          'Abre el `package.json` generado: agrega `"private": true` justo después de `"version"` y borra el bloque `"publishConfig"` completo -- es la única edición manual necesaria, para dejar explícito que este paquete nunca se publica.',
          'Confirma que `pnpm-workspace.yaml` ya incluye el patrón `catalog-site/lab-reference/*` (debería estar desde el primer componente de referencia de este catálogo) y corre `pnpm install` desde la raíz del repo.',
          'Levanta la demo con `pnpm --filter <tu-paquete> run component:serve` y confirma que abre en el navegador, con el contenido de placeholder que trae el scaffold (un `<span>` con el texto "Hola").',
        ],
        hint: 'Si `pnpm install` falla resolviendo `workspace:^`, revisa que el nombre de carpeta en `catalog-site/lab-reference/` coincida exactamente con el patrón que agregaste a `pnpm-workspace.yaml` -- un patrón de glob que no matchea deja el paquete fuera del workspace y el protocolo `workspace:^` no tiene contra qué resolver.',
        selfCheck:
          'La demo carga en `http://localhost:5173` (o el puerto que hayas configurado) sin errores en la consola del navegador, con `ac-demo-content` alrededor (cabecera, selector ES/EN, tema, dispositivo) y tu componente mostrando "Hola" -- el placeholder que trae el scaffold, todavía sin tu lógica.',
      },
      {
        id: 'construccion-02-first-component',
        title: '2. Instalar y declarar tu primer componente del catálogo',
        objective:
          'Agregar una dependencia real del catálogo (`@ac-components/ac-button-basic`) a tu propio componente y verla funcionar dentro de tu demo.',
        context:
          "Un componente del catálogo se consume exactamente igual que cualquier dependencia de npm: se agrega al `package.json` (con el protocolo `workspace:^`, porque vive en el mismo monorepo), se importa por su efecto de registro (`import '@ac-components/ac-button-basic'`) y se declara directo en el `render()` de Lit -- nunca `document.createElement`.",
        steps: [
          'Agrega `"@ac-components/ac-button-basic": "workspace:^"` a las `dependencies` de tu `package.json` y corre `pnpm install` de nuevo.',
          'Abre `src/registro-wizard.js` y reconoce lo que el CLI ya generó: la clase extiende `ComponentMixin(LitElement)` (no `LitElement` a secas -- heredás `ambient`, `this.t()` y `componentBaseStyles` gratis), `static get is()` ya devuelve tu tag con el prefijo `ac-` completo, y `render()` ya tiene un `<span>` de placeholder.',
          "Agrega `import '@ac-components/ac-button-basic';` arriba del archivo, junto a los imports de `lit`/`ComponentMixin` que ya están.",
          'Reemplaza el `<span>` de placeholder del `render()` por un `<ac-button-basic>` de prueba, declarado directo ahí (nunca `document.createElement`).',
          'Recarga la demo y confirma que el botón del catálogo se ve y reacciona al click (abre el panel de eventos del navegador o un `console.log` temporal en un listener declarativo).',
        ],
        hint: 'El `index.js` que generó el CLI ya registra el custom element e importa `src/registro-wizard.js` -- no hace falta tocarlo. Si el botón no aparece, revisa que el tag que usaste en el HTML coincida exactamente con lo que devuelve `static get is()`.',
        selfCheck:
          '`<ac-button-basic>` se ve dentro de tu componente (no al lado, como hermano en el HTML de la demo) y un click dispara su evento `ac-button-basic-click` -- visible en un `console.log` temporal o en las dev tools.',
      },
      {
        id: 'construccion-03-more-components-and-init',
        title: '3. Sumar el resto de componentes y construir `init()`',
        objective:
          'Declarar en el `render()` todos los componentes del catálogo que tu wizard necesita (más de 10 en total) y escribir el método público `init()`, que simula una lectura inicial contra `ac-api-users`.',
        context:
          'La versión de referencia usa 18 componentes distintos del catálogo: estructura (`ac-transition-container`, `ac-expandable-multistep` + `ac-expandable-step`, `ac-modal-basic`), paso 1/datos (`ac-input-basic` x2, `ac-select-basic`), paso 2/preferencias (`ac-checkbox-basic`, `ac-switch-basic`, `ac-radio-basic`), paso 3/resumen (`ac-avatar-basic`, `ac-badge-basic`, `ac-text-basic`, `ac-divider-basic`) y transversales (`ac-button-basic`, `ac-tooltip-basic`, `ac-spinner-basic`, `ac-notification-basic`) más el simulador `ac-api-users`. `init()` es la ÚNICA llamada de LECTURA (`obtenerDatosUsuario`) -- distinta del método de GUARDADO que vas a usar más adelante en el botón "Confirmar" (`registrarUsuario`).',
        steps: [
          'Agrega cada paquete que vayas a usar a `dependencies` (`workspace:^`) y corre `pnpm install`.',
          'Importa cada uno arriba de `src/registro-wizard.js` y declara todos directo en el `render()` (ningún `document.createElement`, ningún componente montado a mano).',
          'Declara `<ac-api-users>` también en el template (no pinta nada, pero necesita estar en el DOM para recibir llamadas y emitir eventos) y crea una referencia con `createRef()` de `lit/directives/ref.js`, asignada con `${ref(this._apiUsersRef)}`.',
          'Escribe el método público `init()`: `this._apiUsersRef.value?.obtenerDatosUsuario(1)` -- dispara la lectura simulada contra el mock de `ac-api-users`.',
          "Llama `wizard.init()` una vez desde `demo/demo.js`, después de `customElements.whenDefined('ac-registro-wizard')`, como lo haría cualquier app consumidora al montar el componente.",
        ],
        hint: 'Usar `ref()` es obligatorio acá porque necesitas invocar un MÉTODO sobre `ac-api-users` (no solo leer una property) -- para eso existe, a diferencia de un binding `.prop=${...}` normal. Nunca reemplaces esto por `this.shadowRoot.querySelector(...)`.',
        selfCheck:
          'Con la demo abierta, `init()` dispara la llamada (visible como un `console.log` temporal dentro del handler de éxito, o observando que el estado interno cambia) sin lanzar ningún error en consola.',
      },
      {
        id: 'construccion-04-private-methods',
        title: '4. Separar la lógica interna en métodos privados',
        objective:
          'Mover toda la lógica de `init()` y del resto del flujo a métodos privados con prefijo `_`, dejando la clase con exactamente 2 métodos públicos.',
        context:
          'La API pública de `registro-wizard` es intencionalmente mínima: solo `init()` y `reset()`. Todo lo demás -- manejar cada evento de cada control, validar el paso 1, armar el payload de `registrarUsuario`, reaccionar al éxito/error del guardado -- vive en métodos privados (`_onNombreInput`, `_onStep1NextClick`, `_onConfirmClick`, `_onRegisterSuccess`, `_onRegisterError`, etc.), igual que `_formatUser`/`_applyQueryParams` en `ac-api-users`.',
        steps: [
          'Declara las properties privadas de estado (`_open`, `_nombre`, `_email`, `_rol`, `_notificaciones`, `_terminos`, `_plan`, `_loading`, `_errorMessage`, `_welcomeUser`, `_registeredUser`, ...) con `state: true` en `static get properties()` -- nunca `type: String`/`reflect: true` como en un componente del catálogo, porque esto es estado interno, no una API pública.',
          'Inicializa todas en el constructor (o en un `_resetState()` privado que el constructor llama) para que `reset()` pueda reutilizarlo más adelante.',
          'Escribe un método privado por cada interacción (`_onNombreInput`, `_onRolChange`, `_onTerminosChange`, `_onStep1NextClick`, ...), cada uno actualizando solo su property correspondiente.',
          'Verifica que ningún método público quede expuesto además de `init()`/`reset()` -- todo lo demás debe llevar el prefijo `_`.',
        ],
        hint: 'Si te cuesta decidir qué va en un método privado separado vs. inline en el template, usa el mismo criterio de `ac-api-users`: formateo/lógica de datos en un método con nombre propio: solo lectura directa de un valor (`event.detail.value`) puede quedar en una línea dentro del handler.',
        selfCheck:
          '`grep -n "^\\s*[a-zA-Z]" src/registro-wizard.js` (o una revisión visual de la clase) muestra que los únicos dos métodos sin `_` son `init` y `reset`.',
      },
      {
        id: 'construccion-05-declarative-events',
        title: '5. Cablear cada evento de forma declarativa',
        objective:
          'Escuchar todos los eventos de los componentes hijos (y de `ac-api-users`) con bindings `@evento=${...}` directo en el template, nunca con `addEventListener` imperativo.',
        context:
          'El patrón tiene dos caras, y este componente usa las dos. Por un lado, cada evento que te interesa de un hijo (`ac-input-basic`, `ac-select-basic`, `ac-checkbox-basic`, `ac-switch-basic`, `ac-radio-basic`, `ac-button-basic`, `ac-modal-basic`, `ac-transition-container`, `ac-expandable-multistep` y `ac-api-users`) se escucha con un binding `@ac-<componente>-<evento>=${this._handler}` en el template, con el handler siempre privado. Por el otro, tu propio componente también DISPARA sus propios eventos hacia quien lo consuma (igual que `ac-expandable-step` o `ac-modal-basic` emiten los suyos): `ac-registro-wizard-step-change` (cuando el multistep avanza), `ac-registro-wizard-register-success`/`-register-error` (cuando termina el guardado) y `ac-registro-wizard-reset` (cuando se llama `reset()`) -- así se cierra el circuito completo: tu componente escucha hacia abajo y emite hacia arriba.',
        steps: [
          'Repasa cada componente hijo y su README (`packages/components/<componente>/README.md`) para confirmar el nombre exacto de sus eventos.',
          'En el `render()`, agrega un binding `@evento=${this._handler}` por cada interacción que te importe (cambios de los campos, click de cada botón, click de cerrar/primary del modal, click de la flecha de volver del `ac-transition-container`, el cambio de paso activo de `ac-expandable-multistep`, y los 4 eventos de `ac-api-users` que usas: `-get-user-success/error`, `-register-success/error`).',
          'Escribe un método privado `_emit(name, detail = {})` que haga `this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }))` -- es el único lugar del componente que construye un `CustomEvent` a mano.',
          'Llama a `this._emit(...)` con el nombre namespaced correcto (`ac-registro-wizard-<evento>`) desde los handlers donde corresponda: al cambiar de paso, al terminar el guardado (éxito o error) y al final de `reset()`.',
          'Confirma que ningún `addEventListener` imperativo quedó en el código (ni en `connectedCallback` ni en ningún otro lado) -- si necesitas escuchar algo, el binding va en el template.',
          'Agrega los 4 eventos propios al atributo `events` de `<ac-demo-content>` en `demo/index.html` y prueba cada control desde la demo, confirmando en el panel de eventos del navegador que tanto los eventos que escuchás como los que emitís aparecen con su `detail` correcto.',
        ],
        hint: 'Un evento que bubbles desde un nieto (ej. el click de un botón dentro de un `ac-expandable-step`) sigue llegando a un `@evento` puesto en el elemento que lo declara directamente -- no necesitas "re-escucharlo" más arriba salvo que quieras delegación explícita, como hace `ac-expandable-multistep` con sus steps.',
        selfCheck:
          'Una búsqueda de `addEventListener` en `src/registro-wizard.js` no devuelve ningún resultado -- todo el cableado de eventos vive en bindings `@evento` del template. Y en el panel de eventos de la demo, completar el flujo muestra tanto los eventos que escuchás de tus hijos como los 4 `ac-registro-wizard-*` que tu propio componente dispara.',
      },
      {
        id: 'construccion-06-styles',
        title: '6. Aplicar tus propios estilos desde `.scss`',
        objective:
          'Escribir `src/registro-wizard.styles.scss` y compilarlo al patrón `*.styles.js` que Lit consume, igual que cualquier componente real del catálogo.',
        context:
          'El pipeline de estilos es el mismo que usa todo el catálogo: se escribe un `.scss`, se compila a un módulo JS (`compile-scss-to-lit.cjs`, de `@ac-base/cli`) que exporta un `css` de Lit, y ese archivo compilado (gitignored) se importa en el componente. El `package.json` que generó el CLI en el paso 1 ya trae la batería completa de scripts `component:*` (`component:build:styles`, `component:build:styles:watch`, `component:serve`, etc.) -- no hay que escribir ninguno a mano, solo escribir el `.scss` y correr los scripts que ya están.',
        steps: [
          'Crea `src/registro-wizard.styles.scss` con el layout que necesites (espaciado entre el paso activo y sus acciones, el bloque de resumen del paso 3, etc.) -- reutiliza tokens de `@ac-base/ac-core` (`--space-*`, `--radius-*`, `--color-muted`) con fallback, igual que cualquier componente del catálogo.',
          'Corre `pnpm --filter <tu-paquete> run component:build:styles` y confirma que genera `src/registro-wizard.styles.js`.',
          'Importa `RegistroWizardStyles` en `src/registro-wizard.js` y agrégalo a `static get styles()`, junto a `componentBaseStyles` que ya trae el scaffold.',
          'Corre `pnpm --filter <tu-paquete> run component:serve` (ya incluye `component:build:styles:watch` en paralelo vía `concurrently`, generado por el CLI) y confirma que cada guardado del `.scss` recarga sola la demo.',
        ],
        hint: '`src/*.styles.js` nunca se versiona (está en `.gitignore`, igual que en cualquier componente del catálogo) -- si cambias de máquina o clonas de nuevo, hay que volver a correr `component:build:styles` antes de que el componente renderice con estilos.',
        selfCheck:
          'La demo refleja los estilos del `.scss` (espaciado, bordes) sin ningún estilo inline en el HTML, y guardar el `.scss` con el watcher corriendo recarga la demo sola.',
      },
      {
        id: 'construccion-07-modal',
        title: '7. Sumar `ac-modal-basic` para la confirmación final',
        objective:
          'Declarar un `ac-modal-basic` en el template, controlado por una property privada de estado (`_modalOpen`), listo para mostrar el resultado del guardado.',
        context:
          '`ac-modal-basic` no se cierra solo: sus botones disparan eventos (`ac-modal-basic-primary-click`, etc.) y quien lo consume decide qué hacer. En este paso solo lo declaras y lo conectas a tu estado -- todavía no tiene datos reales adentro (eso llega en el paso 10, cuando el guardado tenga éxito).',
        steps: [
          'Agrega `@ac-components/ac-modal-basic` a las dependencias (si no lo hiciste en el paso 3) y declara `_modalOpen` como property privada de estado, inicializada en `false`.',
          'Declara `<ac-modal-basic ?open=${this._modalOpen} header="Registro exitoso" primary-text="Cerrar" @ac-modal-basic-primary-click=${this._onModalPrimaryClick}>` dentro del `render()`.',
          'Escribe `_onModalPrimaryClick()` como un método privado temporal que solo pone `this._modalOpen = false` (todavía sin resetear el formulario -- eso llega en el paso 10).',
          'Fuerza `_modalOpen = true` temporalmente (ej. desde la consola del navegador) para confirmar que el modal abre y cierra correctamente antes de cablearlo al flujo real.',
        ],
        hint: 'El contenido del modal puede quedar vacío o con un placeholder por ahora -- lo real (nombre/correo/rol ya registrados) se llena recién en el paso 10, a partir del `detail.data` del evento de éxito de `registrarUsuario`.',
        selfCheck:
          'Forzando `_modalOpen = true` desde la consola del navegador, el modal aparece centrado con animación de entrada, y su botón "Cerrar" lo cierra sin errores.',
      },
      {
        id: 'construccion-08-transition-container',
        title: '8. Envolver todo el flujo en `ac-transition-container`',
        objective:
          'Hacer que `render()` devuelva un único `ac-transition-container` como raíz, visible desde que el componente se monta (sin ningún botón disparador).',
        context:
          'Esto es un requisito no negociable de este laboratorio: `this._open` arranca en `true` y se pasa como `?open=${this._open}` -- a diferencia de un uso típico de navegación (menú → sub-pantalla), acá no hay pantalla "anterior": el wizard completo ES la pantalla raíz.',
        steps: [
          'Declara `_open` como property privada de estado, inicializada en `true`.',
          'Envuelve los pasos del formulario dentro de un único `<ac-transition-container ?open=${this._open} header-text="Registro de usuario" hide-menu-icon>` en el `render()` -- pero deja `<ac-api-users>` y `<ac-modal-basic>` como hermanos de ese `ac-transition-container`, NO anidados dentro de su slot por defecto (ver el hint).',
          'Escucha `@ac-transition-container-header-back-icon-click` con un handler privado -- en esta versión de referencia, como no hay pantalla anterior a la que volver, ese click reinicia el flujo (llama a `reset()`, ver paso 10).',
          'Confirma visualmente que el contenedor entra deslizando al cargar la demo, sin que hiciera falta ningún click previo.',
        ],
        hint: '`hide-menu-icon` es válido si tu flujo no necesita el ícono de hamburguesa -- pero la flecha de volver NO se puede ocultar (es fija en `ac-transition-container`, ver `docs/CONVENTIONS.md`): tu componente siempre necesita decidir qué hacer con ese click, aunque sea "reiniciar". Resiste la tentación de meter TODO (incluido el modal de confirmación) dentro de este contenedor "porque ya envuelve el flujo": un `<dialog>` nativo cerrado recibe `display: none`, y eso apaga también cualquier cosa anidada adentro aunque tenga su propio `open` en `true` -- el modal de confirmación del paso 10 necesita poder mostrarse justo cuando este contenedor se cierra, así que tiene que vivir afuera.',
        selfCheck:
          'Al recargar la demo, el wizard aparece ya desplegado (sin ningún botón "Abrir") y la flecha de volver de la cabecera hace algo coherente al hacer click.',
      },
      {
        id: 'construccion-09-multistep',
        title: '9. Convertir el flujo interno en multipasos',
        objective:
          'Reemplazar el contenido plano por `ac-expandable-multistep` con 3 `ac-expandable-step` (datos, preferencias, resumen), avanzando entre ellos con `complete()`.',
        context:
          'El padre (`ac-expandable-multistep`) coordina solo: numera los steps por `slotchange`, activa el primero automáticamente, y escucha `ac-expandable-step-complete`/`-edit` para avanzar/retroceder. Tu wizard nunca escucha esos dos eventos directamente -- en vez de eso, llama `step.complete()` por `ref()` desde el botón "Siguiente" de cada paso, después de tu propia validación.',
        steps: [
          'Declara `<ac-expandable-multistep>` dentro del `ac-transition-container`, con 3 `<ac-expandable-step header="...">` como hijos directos (paso 1 "Datos personales", paso 2 "Preferencias", paso 3 "Resumen").',
          'Crea una `createRef()` por cada uno de los 3 pasos y asígnalas con `${ref(this._step1Ref)}`/`${ref(this._step2Ref)}`/`${ref(this._step3Ref)}` -- aunque el paso 3 no necesite avanzar a ningún lado con `complete()`, sí vas a necesitar su referencia más adelante (paso 10) para resetear su `active`/`completed` cuando el multistep lo haya activado.',
          'Mueve los campos del paso 1 (`ac-input-basic` x2, `ac-select-basic`, el `ac-tooltip-basic` de ayuda) dentro del primer `ac-expandable-step`, y los del paso 2 (`ac-checkbox-basic`, `ac-switch-basic`, `ac-radio-basic` x2) dentro del segundo.',
          'En el botón "Siguiente" del paso 1, valida `_nombre`/`_email` y, si pasan, llama `this._step1Ref.value.complete()` (nunca fuerces `active`/`completed` a mano: usa el método público del step).',
          'Repite para el paso 2 (sin validación adicional, o la que tenga sentido para tu versión) llamando `this._step2Ref.value.complete()`.',
          'Mueve el resumen (`ac-avatar-basic`, `ac-badge-basic`, `ac-text-basic`, `ac-divider-basic`) dentro del tercer `ac-expandable-step`, leyendo directo de tus properties privadas (`_nombre`, `_rol`, `_plan`, `_notificaciones`).',
        ],
        hint: 'Si al completar el paso 1 no avanza al paso 2, revisa que estés llamando al método público `complete()` del step (que internamente hace `completed = true; active = false` y SÍ dispara `ac-expandable-step-complete`) y no asignando las properties a mano -- asignarlas directo no pasa por el mismo flujo reactivo que el multistep escucha.',
        selfCheck:
          'Completar el paso 1 colapsa su contenido en una barra resumen y expande automáticamente el paso 2; el link "Modificar" de esa barra vuelve a abrir el paso 1 sin perder lo ya escrito.',
      },
      {
        id: 'construccion-10-close-the-loop',
        title: '10. Cerrar el ciclo: guardar, confirmar y `reset()`',
        objective:
          'Cablear el botón "Confirmar" del paso 3 al guardado simulado contra `ac-api-users`, manejar éxito y error, y escribir `reset()`.',
        context:
          'Este es el flujo completo que el resto de laboratorios de este capítulo construyeron pieza por pieza: click en "Confirmar" → `ac-spinner-basic` mientras la llamada está en curso → si tiene éxito, `_open = false` (cierra la transición) y `_modalOpen = true` con los datos reales de `event.detail.data` dentro del modal; si falla, `ac-notification-basic` inline con el mensaje de error y la transición se queda abierta. El botón "Cerrar" del modal llama a `reset()`, que debe devolver cada property privada a su valor inicial, incluidos los TRES `ac-expandable-step` con referencia (`completed`/`active` reseteados a mano por `ref()`) -- el paso 3 también necesita la suya: el multistep lo activa con una property directa (no vía tu template) al completarse el paso 2, así que sin resetearlo explícitamente se queda `active` después de un `reset()` y el resumen vacío se ve a la vez que el paso 1 recién reactivado (bug real encontrado probando el flujo dos veces seguidas en el navegador).',
        steps: [
          'Verifica primero que `<ac-api-users>` y `<ac-modal-basic>` sean hermanos directos de `<ac-transition-container>` en tu `render()` -- NUNCA anidados dentro de su slot por defecto. Un `<dialog>` nativo cerrado recibe `display: none` del navegador, y un elemento de la capa superior (como el `<dialog>` propio del modal, abierto con `showModal()`) deja de pintarse si cualquier ancestro en el árbol plano tiene `display: none`, aunque su propio `open` siga en `true` -- si el modal quedara anidado dentro de la transición, se volvería invisible justo al cerrarse esta tras un guardado exitoso (otro bug real: el primer intento lo anidaba y el modal "no aparecía" pese a que su estado interno era correcto).',
          'En el botón "Confirmar" del paso 3, valida `_terminos` (si no está aceptado, usa `_errorMessage` + `ac-notification-basic` para avisarlo sin llamar a la API) y, si pasa, pon `_loading = true` y llama `this._apiUsersRef.value.registrarUsuario({ nombre: this._nombre, email: this._email, rol: this._rol })`.',
          'Mientras `_loading` es `true`, muestra `<ac-spinner-basic>` en vez del botón "Confirmar".',
          'Escucha `@ac-api-users-register-success` en el `<ac-api-users>` del template: guarda `event.detail.data` en `_registeredUser`, pon `_loading = false`, `_open = false` y `_modalOpen = true`.',
          'Escucha `@ac-api-users-register-error`: pon `_loading = false` y `_errorMessage` con `event.detail.error.message`, sin tocar `_open` (la transición se queda abierta para que puedas reintentar).',
          'Llena el contenido del `ac-modal-basic` del paso 7 con los datos reales de `_registeredUser` (nombre, correo, rol) en vez del placeholder.',
          'Crea una tercera `createRef()` para el paso 3 (además de las del paso 9) y asígnala en su `ac-expandable-step`.',
          'Escribe el método público `reset()`: reutiliza tu `_resetState()` privado del paso 4 y además, por `ref()`, pon `completed = false`/`active = true` en el paso 1 y `completed = false`/`active = false` en los pasos 2 y 3.',
          'Cablea `_onModalPrimaryClick` (paso 7) para que llame a `reset()` además de cerrar el modal.',
          'Prueba el flujo completo DOS veces seguidas desde la demo (no solo una): una con éxito y otra forzando `simulateError` en `ac-api-users` (ej. con un botón de prueba en `demo.js` que alterne la property, ya que no es parte de la API pública del wizard). Repetir el ciclo completo es lo que expone el bug del paso 3 que no se resetea -- probarlo una sola vez no lo muestra.',
        ],
        hint: 'Si después de un error el botón "Confirmar" no vuelve a aparecer, revisa que `_loading` se ponga en `false` también en el handler de error -- no solo en el de éxito. Si el modal de éxito nunca se ve (aunque tu `console.log` confirme que `_modalOpen` sí pasó a `true`), inspecciona con las devtools si `<ac-modal-basic>` quedó anidado dentro de `<ac-transition-container>` en vez de ser su hermano.',
        selfCheck:
          'De punta a punta: completar los 3 pasos y confirmar con éxito cierra la transición y abre el modal con el nombre/correo/rol reales que escribiste; cerrando el modal, el wizard vuelve exactamente al paso 1 vacío, sin el resumen del paso 3 superpuesto. Repitiendo el ciclo completo una segunda vez (y con `simulateError` activo), el paso 3 muestra una `ac-notification-basic` con el mensaje de error y la transición nunca se cierra.',
      },
    ],
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
