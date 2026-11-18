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
    labs: [],
  },
  {
    id: 'construccion',
    title: 'Capítulo 1 — Construcción',
    summary:
      'Construye un componente propio de punta a punta: desde `aclit component:create` hasta un flujo completo con API pública/privada, eventos, estilos, modal, transición interna y multipasos.',
    labs: [
      {
        id: 'construccion-01-scaffold',
        title: '1. Scaffoldear el componente y levantar la demo vacía',
        objective:
          'Instalar el CLI de ac-lit y generar la estructura base de un componente nuevo, fuera del catálogo publicable, para usarlo como tu propio banco de pruebas durante todo este capítulo.',
        context:
          'El componente de referencia de este capítulo se llama `registro-wizard` y vive en `catalog-site/lab-reference/registro-wizard/` -- no en `packages/components/` (ese directorio es solo para componentes publicables del catálogo). Igual que cualquier paquete real, necesita su propio `package.json`, `src/` y `demo/`; a diferencia de uno real, no lleva `test/`, `test_e2e/` ni scripts `component:test*`/`component:lint` (no se testea ni se publica).',
        steps: [
          'Instala el CLI globalmente: `npm install -g @ac-base/cli`.',
          'Crea la carpeta `catalog-site/lab-reference/<tu-nombre>/` y, parado ahí, corre `aclit component:create <tu-nombre>` (o copia a mano el `package.json`/`vite.config.js` mínimos de otro componente del catálogo, como `packages/components/ac-badge-basic/`, y simplifícalos: sin scripts de test/lint/e2e, sin changeset).',
          'Agrega la carpeta al workspace de pnpm (`pnpm-workspace.yaml`): `catalog-site/lab-reference/*`, para que `workspace:^` resuelva contra el catálogo real.',
          'Corre `pnpm install` desde la raíz del repo.',
          'Levanta la demo con `pnpm --filter <tu-paquete> run component:serve` (o `vite demo` directo si ya compilaste los estilos) y confirma que abre en el navegador, vacía.',
        ],
        hint: 'Si `pnpm install` falla resolviendo `workspace:^`, revisa que el nombre de carpeta en `catalog-site/lab-reference/` coincida exactamente con el patrón que agregaste a `pnpm-workspace.yaml` -- un patrón de glob que no matchea deja el paquete fuera del workspace y el protocolo `workspace:^` no tiene contra qué resolver.',
        selfCheck:
          'La demo carga en `http://localhost:5173` (o el puerto que hayas configurado) sin errores en la consola del navegador, mostrando una página vacía con tu componente todavía sin contenido.',
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
          "En `src/registro-wizard.js`, importa `lit` (`LitElement`, `html`) y `import '@ac-components/ac-button-basic';` arriba del archivo.",
          'Escribe una clase mínima que extienda `LitElement`, con `static get is()` devolviendo el tag elegido (sin prefijo `ac-`, ej. `registro-wizard`) y un `render()` que devuelva un `<ac-button-basic>` de prueba.',
          'Registra el custom element en `index.js` (`customElements.define(RegistroWizard.is, RegistroWizard)`), importado desde `demo/demo.js`.',
          'Recarga la demo y confirma que el botón del catálogo se ve y reacciona al click (abre el panel de eventos del navegador o un `console.log` temporal en un listener declarativo).',
        ],
        hint: 'Si el botón no aparece, revisa que `index.js` quede importado desde `demo/demo.js` (no alcanza con que exista el archivo: Vite solo registra lo que de verdad se importa) y que el tag en el HTML/template coincida exactamente con `static get is()`.',
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
          "Llama `wizard.init()` una vez desde `demo/demo.js`, después de `customElements.whenDefined('registro-wizard')`, como lo haría cualquier app consumidora al montar el componente.",
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
          'A diferencia de otros laboratorios de este catálogo, `registro-wizard` no define ningún evento `CustomEvent` propio -- no lo necesita, porque no tiene ningún componente padre que escuche sus eventos (es la raíz del flujo). Lo importante acá es el otro lado del patrón: cada evento que SÍ te interesa (de `ac-input-basic`, `ac-select-basic`, `ac-checkbox-basic`, `ac-switch-basic`, `ac-radio-basic`, `ac-button-basic`, `ac-modal-basic`, `ac-transition-container` y `ac-api-users`) se escucha con un binding `@ac-<componente>-<evento>=${this._handler}` en el JSX/template de Lit, con el handler siempre privado.',
        steps: [
          'Repasa cada componente hijo y su README (`packages/components/<componente>/README.md`) para confirmar el nombre exacto de sus eventos.',
          'En el `render()`, agrega un binding `@evento=${this._handler}` por cada interacción que te importe (cambios de los campos, click de cada botón, click de cerrar/primary del modal, click de la flecha de volver del `ac-transition-container`, y los 4 eventos de `ac-api-users` que usas: `-get-user-success/error`, `-register-success/error`).',
          'Confirma que ningún `addEventListener` imperativo quedó en el código (ni en `connectedCallback` ni en ningún otro lado) -- si necesitas escuchar algo, el binding va en el template.',
          'Prueba cada control desde la demo y confirma en consola (con un `console.log` temporal) que el handler correcto se dispara.',
        ],
        hint: 'Un evento que bubbles desde un nieto (ej. el click de un botón dentro de un `ac-expandable-step`) sigue llegando a un `@evento` puesto en el elemento que lo declara directamente -- no necesitas "re-escucharlo" más arriba salvo que quieras delegación explícita, como hace `ac-expandable-multistep` con sus steps.',
        selfCheck:
          'Una búsqueda de `addEventListener` en `src/registro-wizard.js` no devuelve ningún resultado -- todo el cableado de eventos vive en bindings `@evento` del template.',
      },
      {
        id: 'construccion-06-styles',
        title: '6. Aplicar tus propios estilos desde `.scss`',
        objective:
          'Escribir `src/registro-wizard.styles.scss` y compilarlo al patrón `*.styles.js` que Lit consume, igual que cualquier componente real del catálogo.',
        context:
          'El pipeline de estilos es el mismo que usa todo el catálogo: se escribe un `.scss`, se compila a un módulo JS (`compile-scss-to-lit.cjs`, de `@ac-base/cli`) que exporta un `css` de Lit, y ese archivo compilado (gitignored) se importa en el componente. La diferencia acá es que el `package.json` de `registro-wizard` solo necesita su propio script `component:build:styles` -- no la batería completa de scripts de un paquete publicable.',
        steps: [
          'Crea `src/registro-wizard.styles.scss` con el layout que necesites (espaciado entre el paso activo y sus acciones, el bloque de resumen del paso 3, etc.) -- reutiliza tokens de `@ac-base/ac-core` (`--space-*`, `--radius-*`, `--color-muted`) con fallback, igual que cualquier componente del catálogo.',
          'Agrega a tu `package.json` el script `"component:build:styles": "node ./node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs src/registro-wizard.styles.scss src/registro-wizard.styles.js RegistroWizardStyles"`.',
          'Corre ese script y confirma que genera `src/registro-wizard.styles.js`.',
          'Importa `RegistroWizardStyles` en `src/registro-wizard.js` y agrégalo a `static get styles()`.',
          'Agrega también `component:build:styles:watch` y haz que `component:serve` lo corra en paralelo con `vite demo` (vía `concurrently`), para que cada guardado del `.scss` recargue sola la demo.',
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
