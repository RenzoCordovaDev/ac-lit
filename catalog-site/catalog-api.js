// API pública de cada componente (propiedades y eventos), para los dos
// expandables que se muestran debajo del código en la pestaña "Código" del
// catálogo. Los datos se transcriben a mano desde el README de cada
// componente (`packages/components/<id>/README.md`, secciones "Propiedades"
// y "Eventos") -- no hay parseo automático en build time. Al agregar un
// componente nuevo al catálogo, agrega su entrada acá leyendo su README.
//
// Si un componente no tiene propiedades configurables o no dispara eventos
// propios, su arreglo correspondiente queda vacío (`[]`) -- el expandible lo
// muestra igual, con un texto de estado vacío.

export const COMPONENT_API = {
  'ac-avatar-basic': {
    properties: [
      {
        name: 'src',
        attribute: 'src',
        type: 'String',
        default: "''",
        description:
          'URL de la imagen. Vacío, o si la imagen falla al cargar (error), muestra el fallback de iniciales.',
      },
      {
        name: 'name',
        attribute: 'name',
        type: 'String',
        default: "''",
        description:
          'Nombre de la persona. Se usa para el alt de la imagen, para calcular las iniciales del fallback y como su aria-label.',
      },
      {
        name: 'size',
        attribute: 'size',
        type: 'String',
        default: "'md'",
        description: "Lista blanca: 'sm', 'md' o 'lg'. Cualquier otro valor cae a 'md'.",
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description:
          "Heredado de ComponentMixin: 'primary' o 'secondary' — color de fondo del fallback de iniciales (fondo sólido + texto fijo, igual criterio que ac-badge-basic; no cambia entre temas claro/oscuro).",
      },
    ],
    events: [],
  },
  'ac-badge-basic': {
    properties: [
      {
        name: 'text',
        attribute: 'text',
        type: 'String',
        default: "''",
        description:
          'Si se define, se usa como clave de traducción (this.t(text)) en vez del slot.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'neutral'",
        description:
          'neutral | success | warning | danger (heredada de @ac-base/ac-component-mixin).',
      },
    ],
    events: [],
  },
  'ac-button-basic': {
    properties: [
      {
        name: 'text',
        attribute: 'text',
        type: 'String',
        default: "''",
        description:
          'Si se define, se usa como clave de traducción (this.t(text)) en vez del slot.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description:
          'primary | primary-alt | secondary | secondary-alt (propiedad heredada de @ac-base/ac-component-mixin).',
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Deshabilita el botón nativo y bloquea ac-button-basic-click.',
      },
      {
        name: 'fullWidth',
        attribute: 'full-width',
        type: 'Boolean',
        default: 'false',
        description: 'Ocupa el 100% del contenedor.',
      },
      {
        name: 'loading',
        attribute: 'loading',
        type: 'Boolean',
        default: 'false',
        description: 'Muestra un skeleton animado en vez del contenido y deshabilita el click.',
      },
    ],
    events: [
      {
        name: 'ac-button-basic-click',
        detail: '{ bubbles: true, composed: true, detail: true }',
        description: 'No se dispara si disabled o loading son true.',
      },
    ],
  },
  'ac-card-basic': {
    properties: [
      {
        name: 'headerText',
        attribute: 'header-text',
        type: 'String',
        default: "''",
        description:
          'Título opcional. Pasa por this.t() (acepta clave de locales.json o literal). Sin esta propiedad, no se renderiza ningún header.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'surface'",
        description:
          "Lista blanca: 'surface' (fondo sólido + elevación) o 'outlined' (fondo transparente, solo borde). Cualquier otro valor cae a 'surface'.",
      },
    ],
    events: [],
  },
  'ac-checkbox-basic': {
    properties: [
      {
        name: 'text',
        attribute: 'text',
        type: 'String',
        default: "''",
        description:
          'Si se define, se usa como clave de traducción (this.t(text)) en vez del slot.',
      },
      {
        name: 'name',
        attribute: 'name',
        type: 'String',
        default: "''",
        description: 'Nombre del campo.',
      },
      {
        name: 'value',
        attribute: 'value',
        type: 'String',
        default: "''",
        description: 'Valor del campo; viaja en el detalle del evento.',
      },
      {
        name: 'checked',
        attribute: 'checked',
        type: 'Boolean',
        default: 'false',
        description: 'Estado marcado (reflejado como atributo).',
      },
      {
        name: 'indeterminate',
        attribute: 'indeterminate',
        type: 'Boolean',
        default: 'false',
        description:
          'Muestra un guion en vez del check. Se limpia solo cuando el usuario hace click.',
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Deshabilita la casilla.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description: 'primary o secondary. Heredado de ComponentMixin.',
      },
    ],
    events: [
      {
        name: 'ac-checkbox-basic-change',
        detail: '{ checked: boolean, value: string }',
        description:
          'El usuario marca o desmarca la casilla. No se dispara si la casilla está deshabilitada.',
      },
    ],
  },
  'ac-divider-basic': {
    properties: [
      {
        name: 'orientation',
        attribute: 'orientation',
        type: 'String',
        default: "'horizontal'",
        description:
          "'horizontal' | 'vertical'. Un valor que no matchea cae al default ('horizontal'), mismo patrón de whitelist por Set que ac-spinner-basic/ac-card-basic.",
      },
    ],
    events: [],
  },
  'ac-expandable-basic': {
    properties: [
      {
        name: 'header',
        attribute: 'header',
        type: 'String',
        default: "''",
        description:
          'Texto de la cabecera (pasa por this.t(): una clave de locales.json se traduce, cualquier otro texto se muestra tal cual).',
      },
      {
        name: 'open',
        attribute: 'open',
        type: 'Boolean',
        default: 'false',
        description: 'Panel abierto (reflejado como atributo).',
      },
      {
        name: 'group',
        attribute: 'group',
        type: 'String',
        default: "''",
        description: 'Clave de grupo: al abrirse un panel, se cierran los demás del mismo group.',
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Bloquea la cabecera: el usuario no puede abrir ni cerrar el panel.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description:
          'Color de la franja de acento y del foco: primary o secondary. Heredado de ComponentMixin.',
      },
    ],
    events: [
      {
        name: 'ac-expandable-basic-toggle',
        detail: '{ open: boolean }',
        description:
          'El panel se abre o se cierra (por el usuario, por show()/hide() o por grupo). No se dispara por el estado inicial (open en el HTML).',
      },
    ],
  },
  'ac-expandable-multistep': {
    properties: [
      {
        name: 'completed',
        attribute: 'completed',
        type: 'Boolean',
        default: 'false',
        description:
          'true cuando TODOS los ac-expandable-step hijos están completados (revela el slot confirmation). Vuelve a false si se edita un step anterior después de haber llegado a este estado. Reflejado como atributo.',
      },
    ],
    events: [
      {
        name: 'ac-expandable-multistep-active-step-change',
        detail: '{ stepNumber, totalSteps }',
        description:
          'Cambia el step activo: al completar uno intermedio (avanza al siguiente), al editar uno (vuelve a él) y en la auto-activación inicial del primer step. El detail corresponde al step ahora activo.',
      },
      {
        name: 'ac-expandable-multistep-all-complete',
        detail: '{}',
        description: 'Se completa el último step de la secuencia.',
      },
    ],
  },
  'ac-expandable-step': {
    properties: [
      {
        name: 'header',
        attribute: 'header',
        type: 'String',
        default: "''",
        description: 'Título del paso. Pasa por this.t() (acepta clave de locales.json o literal).',
      },
      {
        name: 'active',
        attribute: 'active',
        type: 'Boolean',
        default: 'false',
        description:
          'Expandido, mostrando el contenido real (slot por defecto). Reflejado como atributo.',
      },
      {
        name: 'completed',
        attribute: 'completed',
        type: 'Boolean',
        default: 'false',
        description: 'Colapsado en la barra resumen. Reflejado como atributo.',
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Oculta el link "Modificar" de la barra colapsada. Reflejado como atributo.',
      },
      {
        name: 'editLabel',
        attribute: 'edit-label',
        type: 'String',
        default: "''",
        description:
          'Texto del link "Modificar". Vacío usa this.t(\'expandable-step-edit-label\'); con valor, pasa igual por this.t() (clave o literal).',
      },
      {
        name: 'stepNumber',
        attribute: 'step-number',
        type: 'Number',
        default: '0',
        description:
          'Número de paso, usado en el contador del estado activo. Lo asigna normalmente el padre multistep.',
      },
      {
        name: 'totalSteps',
        attribute: 'total-steps',
        type: 'Number',
        default: '0',
        description:
          'Total de pasos, usado en el contador del estado activo. Lo asigna normalmente el padre multistep.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description:
          'Heredado de ComponentMixin. primary (fondo --color-primary-700) o secondary (fondo --color-accent-700) de la barra colapsada.',
      },
    ],
    events: [
      {
        name: 'ac-expandable-step-edit',
        detail: '{}',
        description:
          'Click en el link "Modificar" (solo si !disabled). Solo informa intención — no cambia active/completed por sí solo.',
      },
      {
        name: 'ac-expandable-step-complete',
        detail: '{}',
        description:
          'La propiedad completed pasa a true (no se dispara por el estado inicial completed del HTML).',
      },
    ],
  },
  'ac-icon-basic': {
    properties: [
      {
        name: 'name',
        attribute: 'name',
        type: 'String',
        default: "''",
        description:
          'Nombre del ícono (ver whitelist en el README). Un name que no matchea ninguno cae a un fallback genérico (un círculo simple) — nunca rompe.',
      },
      {
        name: 'size',
        attribute: 'size',
        type: 'String',
        default: "'md'",
        description:
          "sm (16px) | md (20px) | lg (24px), con validación por whitelist y fallback a 'md' si no matchea — mismo patrón que ac-spinner-basic.",
      },
      {
        name: 'a11yLabel',
        attribute: 'a11y-label',
        type: 'String',
        default: "''",
        description:
          'Si se define (texto o clave de traducción, pasa por this.t()), el ícono deja de ser decorativo: role="img" + aria-label. Vacío (default) ⇒ aria-hidden="true".',
      },
    ],
    events: [],
  },
  'ac-icon-button-basic': {
    properties: [
      {
        name: 'name',
        attribute: 'name',
        type: 'String',
        default: "''",
        description:
          'Nombre del ícono — se pasa directo a <ac-icon-basic> interno. Mismo whitelist/fallback que ese componente (ver su README para la lista completa).',
      },
      {
        name: 'a11yLabel',
        attribute: 'a11y-label',
        type: 'String',
        default: "''",
        description:
          'Etiqueta accesible del botón. Si no se define, el aria-label cae al propio name — pero siempre debería pasarse explícito.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description:
          "primary | secondary | danger, con whitelist y fallback a 'primary' si no matchea.",
      },
      {
        name: 'size',
        attribute: 'size',
        type: 'String',
        default: "'md'",
        description:
          "sm | md | lg, con whitelist y fallback a 'md' si no matchea. Se propaga también al <ac-icon-basic> interno, para que el ícono escale junto con el botón.",
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Deshabilita el <button> nativo interno.',
      },
    ],
    events: [],
  },
  'ac-input-basic': {
    properties: [
      {
        name: 'label',
        attribute: 'label',
        type: 'String',
        default: "''",
        description:
          'Etiqueta visible. Se pasa por this.t(): si es una clave de locales.json se traduce, si no se muestra tal cual.',
      },
      {
        name: 'a11yLabel',
        attribute: 'a11y-label',
        type: 'String',
        default: "''",
        description:
          'Nombre accesible cuando no hay etiqueta visible (ej. un buscador). Se ignora si hay label.',
      },
      {
        name: 'value',
        attribute: 'value',
        type: 'String',
        default: "''",
        description: 'Valor del campo.',
      },
      {
        name: 'type',
        attribute: 'type',
        type: 'String',
        default: "'text'",
        description:
          'text, email, password, search, tel, url o number. Cualquier otro valor cae a text (lista blanca).',
      },
      {
        name: 'name',
        attribute: 'name',
        type: 'String',
        default: "''",
        description: 'Nombre del campo.',
      },
      {
        name: 'placeholder',
        attribute: 'placeholder',
        type: 'String',
        default: "''",
        description: 'Texto de ejemplo (también pasa por this.t()).',
      },
      {
        name: 'hint',
        attribute: 'hint',
        type: 'String',
        default: "''",
        description: 'Texto de ayuda bajo el campo (también pasa por this.t()).',
      },
      {
        name: 'error',
        attribute: 'error',
        type: 'String',
        default: "''",
        description:
          "Mensaje de error. Reemplaza a hint, marca el campo con aria-invalid='true' y se anuncia con role='alert'.",
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Deshabilita el campo.',
      },
      {
        name: 'readonly',
        attribute: 'readonly',
        type: 'Boolean',
        default: 'false',
        description: 'Campo de solo lectura (borde punteado).',
      },
      {
        name: 'required',
        attribute: 'required',
        type: 'Boolean',
        default: 'false',
        description: 'Campo obligatorio; muestra un asterisco decorativo junto a la etiqueta.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description: 'Color del foco: primary o secondary. Heredado de ComponentMixin.',
      },
    ],
    events: [
      {
        name: 'ac-input-basic-input',
        detail: '{ value: string }',
        description: 'En cada cambio mientras el usuario escribe.',
      },
      {
        name: 'ac-input-basic-change',
        detail: '{ value: string }',
        description: 'Al confirmar el cambio (al perder el foco / Enter).',
      },
    ],
  },
  'ac-link-basic': {
    properties: [
      {
        name: 'text',
        attribute: 'text',
        type: 'String',
        default: "''",
        description:
          'Si se define, se usa como clave de traducción (this.t(text)) en vez del <slot>.',
      },
      {
        name: 'href',
        attribute: 'href',
        type: 'String',
        default: "''",
        description: 'URL destino. Se omite del <a> renderizado cuando disabled es true.',
      },
      {
        name: 'target',
        attribute: 'target',
        type: 'String',
        default: "'_self'",
        description: '_self | _blank | _parent | _top. Cualquier otro valor cae a _self.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description:
          'primary | primary-alt | secondary | secondary-alt (heredada de @ac-base/ac-component-mixin).',
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description: "Quita href, pone aria-disabled='true' y tabindex='-1', y bloquea el click.",
      },
    ],
    events: [
      {
        name: 'ac-link-basic-click',
        detail: '{ bubbles: true, composed: true, detail: true }',
        description:
          'No se dispara si disabled es true (y la navegación nativa también se previene).',
      },
    ],
  },
  'ac-modal-basic': {
    properties: [
      {
        name: 'open',
        attribute: 'open',
        type: 'Boolean',
        default: 'false',
        description:
          'Modal abierto (reflejado como atributo). Al pasar a false se anima la salida y luego se cierra el <dialog>.',
      },
      {
        name: 'header',
        attribute: 'header',
        type: 'String',
        default: "''",
        description:
          'Título. Pasa por this.t(). Sin header se muestra un título por defecto traducido (modal-basic-title).',
      },
      {
        name: 'size',
        attribute: 'size',
        type: 'String',
        default: "'offset'",
        description:
          'offset deja un hueco arriba (por defecto), half ocupa hasta la mitad de la pantalla y full cubre toda la altura.',
      },
      {
        name: 'persistent',
        attribute: 'persistent',
        type: 'Boolean',
        default: 'false',
        description:
          'No se cierra con Escape ni al pulsar fuera; solo con su botón de cerrar o desde el código.',
      },
      {
        name: 'hideClose',
        attribute: 'hide-close',
        type: 'Boolean',
        default: 'false',
        description: 'Oculta el botón de cerrar de la cabecera.',
      },
      {
        name: 'primaryText',
        attribute: 'primary-text',
        type: 'String',
        default: "''",
        description:
          'Texto del botón principal (pasa por this.t()). Sin texto, el botón no se muestra.',
      },
      {
        name: 'primaryDisabled',
        attribute: 'primary-disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Deshabilita el botón principal.',
      },
      {
        name: 'secondaryText',
        attribute: 'secondary-text',
        type: 'String',
        default: "''",
        description: 'Texto del botón secundario.',
      },
      {
        name: 'secondaryDisabled',
        attribute: 'secondary-disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Deshabilita el botón secundario.',
      },
      {
        name: 'linkText',
        attribute: 'link-text',
        type: 'String',
        default: "''",
        description: 'Texto del enlace del pie.',
      },
      {
        name: 'linkHref',
        attribute: 'link-href',
        type: 'String',
        default: "''",
        description: 'Destino del enlace.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description:
          'Ambient del botón principal (primary o secondary). Heredado de ComponentMixin.',
      },
    ],
    events: [
      {
        name: 'ac-modal-basic-open',
        detail: 'true',
        description: 'El modal se abre (no se dispara por el estado inicial open del HTML).',
      },
      {
        name: 'ac-modal-basic-close',
        detail: "{ reason: 'close-button' | 'escape' | 'backdrop' | 'api' | 'native' }",
        description: 'El modal empieza a cerrarse.',
      },
      {
        name: 'ac-modal-basic-close-click',
        detail: 'true',
        description: 'Click en el botón de cerrar de la cabecera.',
      },
      {
        name: 'ac-modal-basic-primary-click',
        detail: 'true',
        description: 'Click en el botón principal.',
      },
      {
        name: 'ac-modal-basic-secondary-click',
        detail: 'true',
        description: 'Click en el botón secundario.',
      },
      {
        name: 'ac-modal-basic-link-click',
        detail: '{ href: string }',
        description: 'Click en el enlace del pie.',
      },
    ],
  },
  'ac-notification-basic': {
    properties: [
      {
        name: 'message',
        attribute: 'message',
        type: 'String',
        default: "''",
        description:
          'Mensaje (pasa por this.t(): una clave de locales.json se traduce, cualquier otro texto se muestra tal cual).',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'neutral'",
        description:
          'neutral / success / warning / danger — cualquier otro valor cae a neutral. Controla el color de fondo y el ícono mostrado.',
      },
    ],
    events: [
      {
        name: 'ac-notification-basic-dismiss-click',
        detail: 'true',
        description: 'Click en el botón de cerrar.',
      },
    ],
  },
  'ac-profile-card-basic': {
    properties: [
      {
        name: 'name',
        attribute: 'name',
        type: 'String',
        default: "''",
        description:
          'Nombre de la persona. Pasa por this.t(), así que acepta tanto una clave de locales.json como un literal. Se muestra vía ac-text-basic y también como name de ac-avatar-basic (iniciales si no hay avatarSrc).',
      },
      {
        name: 'avatarSrc',
        attribute: 'avatar-src',
        type: 'String',
        default: "''",
        description:
          'URL de la imagen de perfil, pasada a ac-avatar-basic. Sin ella (o si falla al cargar), se muestran las iniciales.',
      },
      {
        name: 'statusText',
        attribute: 'status-text',
        type: 'String',
        default: "''",
        description: 'Texto del badge de estado. Sin statusText no se renderiza ningún badge.',
      },
      {
        name: 'statusAmbient',
        attribute: 'status-ambient',
        type: 'String',
        default: "'neutral'",
        description:
          'Ambient del badge (neutral/success/warning/danger, mismos valores que ac-badge-basic).',
      },
      {
        name: 'actionText',
        attribute: 'action-text',
        type: 'String',
        default: "''",
        description:
          'Texto del botón de acción. Pasa por this.t(). Sin actionText no se renderiza ningún botón.',
      },
    ],
    events: [
      {
        name: 'ac-profile-card-basic-action-click',
        detail: 'true',
        description: 'Click en el botón de acción (si está presente).',
      },
    ],
  },
  'ac-progress-basic': {
    properties: [
      {
        name: 'value',
        attribute: 'value',
        type: 'Number',
        default: '0',
        description:
          'De 0 a 100. Si llega fuera de rango se clampea (Math.min(100, Math.max(0, value))) internamente, sin mutar la propiedad pública que pasó el consumidor.',
      },
      {
        name: 'indeterminate',
        attribute: 'indeterminate',
        type: 'Boolean',
        default: 'false',
        description:
          'Si es true, ignora value visualmente y muestra una animación de franja deslizante en vez de un relleno fijo.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description:
          'primary | success | warning | danger (heredada de @ac-base/ac-component-mixin). Whitelist con fallback a primary ante un valor inválido.',
      },
      {
        name: 'label',
        attribute: 'label',
        type: 'String',
        default: "''",
        description:
          'Texto opcional arriba de la barra. Pasa por this.t() — acepta tanto una clave de locales.json como un literal.',
      },
      {
        name: 'showValue',
        attribute: 'show-value',
        type: 'Boolean',
        default: 'false',
        description:
          'Si es true (y no está en indeterminate), muestra el porcentaje numérico junto al label.',
      },
    ],
    events: [],
  },
  'ac-radio-basic': {
    properties: [
      {
        name: 'text',
        attribute: 'text',
        type: 'String',
        default: "''",
        description:
          'Si se define, se usa como clave de traducción (this.t(text)) en vez del slot.',
      },
      {
        name: 'name',
        attribute: 'name',
        type: 'String',
        default: "''",
        description: 'Nombre del grupo — radios con el mismo name se excluyen mutuamente.',
      },
      {
        name: 'value',
        attribute: 'value',
        type: 'String',
        default: "''",
        description: 'Valor asociado a esta opción.',
      },
      {
        name: 'checked',
        attribute: 'checked',
        type: 'Boolean',
        default: 'false',
        description: 'Si está marcado.',
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Deshabilita el input nativo y bloquea ac-radio-basic-change.',
      },
    ],
    events: [
      {
        name: 'ac-radio-basic-change',
        detail: '{ bubbles: true, composed: true, detail: { checked, value } }',
        description:
          'Se dispara al marcar (click/teclado) el radio. No se dispara si disabled es true.',
      },
    ],
  },
  'ac-select-basic': {
    properties: [
      {
        name: 'options',
        attribute: 'options',
        type: 'Array',
        default: '[]',
        description:
          'Lista de { value, label, disabled? } o de strings (el string es valor y texto). Como atributo, JSON. Gana sobre los <option> por slot.',
      },
      {
        name: 'value',
        attribute: 'value',
        type: 'String',
        default: "''",
        description: 'Valor seleccionado.',
      },
      {
        name: 'label',
        attribute: 'label',
        type: 'String',
        default: "''",
        description: 'Etiqueta visible (pasa por this.t()).',
      },
      {
        name: 'a11yLabel',
        attribute: 'a11y-label',
        type: 'String',
        default: "''",
        description: 'Nombre accesible cuando no hay etiqueta visible. Se ignora si hay label.',
      },
      {
        name: 'placeholder',
        attribute: 'placeholder',
        type: 'String',
        default: "''",
        description:
          'Texto mostrado mientras no hay valor (opción deshabilitada y oculta de la lista).',
      },
      {
        name: 'name',
        attribute: 'name',
        type: 'String',
        default: "''",
        description: 'Nombre del campo.',
      },
      {
        name: 'hint',
        attribute: 'hint',
        type: 'String',
        default: "''",
        description: 'Texto de ayuda bajo el campo.',
      },
      {
        name: 'error',
        attribute: 'error',
        type: 'String',
        default: "''",
        description:
          "Mensaje de error. Reemplaza a hint, marca el campo con aria-invalid='true' y se anuncia con role='alert'.",
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Deshabilita el select.',
      },
      {
        name: 'required',
        attribute: 'required',
        type: 'Boolean',
        default: 'false',
        description: 'Obligatorio; muestra un asterisco decorativo junto a la etiqueta.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description:
          'Color del foco y de la opción seleccionada: primary o secondary. Heredado de ComponentMixin.',
      },
    ],
    events: [
      {
        name: 'ac-select-basic-change',
        detail: '{ value: string, label: string }',
        description: 'El usuario elige una opción.',
      },
    ],
  },
  'ac-slider-basic': {
    properties: [
      {
        name: 'value',
        attribute: 'value',
        type: 'Number',
        default: '0',
        description: 'Valor actual. Se ajusta al rango [min, max]; un valor no numérico cae a min.',
      },
      { name: 'min', attribute: 'min', type: 'Number', default: '0', description: 'Valor mínimo.' },
      {
        name: 'max',
        attribute: 'max',
        type: 'Number',
        default: '100',
        description: 'Valor máximo (si no es mayor que min, se usa min + 1).',
      },
      { name: 'step', attribute: 'step', type: 'Number', default: '1', description: 'Incremento.' },
      {
        name: 'label',
        attribute: 'label',
        type: 'String',
        default: "''",
        description: 'Etiqueta visible (pasa por this.t()).',
      },
      {
        name: 'a11yLabel',
        attribute: 'a11y-label',
        type: 'String',
        default: "''",
        description: 'Nombre accesible cuando no hay etiqueta visible. Se ignora si hay label.',
      },
      {
        name: 'showValue',
        attribute: 'show-value',
        type: 'Boolean',
        default: 'false',
        description: 'Muestra el valor actual junto a la etiqueta.',
      },
      {
        name: 'suffix',
        attribute: 'suffix',
        type: 'String',
        default: "''",
        description: 'Texto tras el valor (%, °C…); también se expone en aria-valuetext.',
      },
      {
        name: 'hint',
        attribute: 'hint',
        type: 'String',
        default: "''",
        description: 'Texto de ayuda bajo el control.',
      },
      {
        name: 'name',
        attribute: 'name',
        type: 'String',
        default: "''",
        description: 'Nombre del campo.',
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Deshabilita el control.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description:
          'Color del relleno y del foco: primary o secondary. Heredado de ComponentMixin.',
      },
    ],
    events: [
      {
        name: 'ac-slider-basic-input',
        detail: '{ value: number }',
        description: 'Mientras el usuario arrastra o usa el teclado.',
      },
      {
        name: 'ac-slider-basic-change',
        detail: '{ value: number }',
        description: 'Al soltar o confirmar el nuevo valor.',
      },
    ],
  },
  'ac-spinner-basic': {
    properties: [
      {
        name: 'size',
        attribute: 'size',
        type: 'String',
        default: "'md'",
        description: "Lista blanca: 'sm', 'md' o 'lg'. Cualquier otro valor cae a 'md'.",
      },
      {
        name: 'a11yLabel',
        attribute: 'a11y-label',
        type: 'String',
        default: "'spinner-basic-loading'",
        description:
          'Texto anunciado a lectores de pantalla (oculto visualmente). Pasa por this.t() — acepta una clave de locales.json o un literal.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description:
          "Heredado de ComponentMixin: 'primary' o 'secondary' — color del arco activo. Mismo criterio de color que ac-input-basic/ac-select-basic.",
      },
    ],
    events: [],
  },
  'ac-switch-basic': {
    properties: [
      {
        name: 'text',
        attribute: 'text',
        type: 'String',
        default: "''",
        description:
          'Si se define, se usa como clave de traducción (this.t(text)) en vez del slot.',
      },
      {
        name: 'name',
        attribute: 'name',
        type: 'String',
        default: "''",
        description: 'Nombre del campo.',
      },
      {
        name: 'value',
        attribute: 'value',
        type: 'String',
        default: "''",
        description: 'Valor del campo; viaja en el detalle del evento.',
      },
      {
        name: 'checked',
        attribute: 'checked',
        type: 'Boolean',
        default: 'false',
        description: 'Interruptor encendido (reflejado como atributo).',
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Deshabilita el interruptor.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description: 'primary o secondary. Heredado de ComponentMixin.',
      },
    ],
    events: [
      {
        name: 'ac-switch-basic-change',
        detail: '{ checked: boolean, value: string }',
        description: 'El usuario enciende o apaga el interruptor.',
      },
    ],
  },
  'ac-tabs-basic': {
    properties: [
      {
        name: 'tabs',
        attribute: 'tabs',
        type: 'Array',
        default: '[]',
        description:
          'Lista de { id, label, disabled? } o de strings (el string es id y texto). Como atributo, JSON. El label pasa por this.t().',
      },
      {
        name: 'selected',
        attribute: 'selected',
        type: 'String',
        default: "''",
        description:
          'id de la pestaña activa. Si no existe o está deshabilitada, se usa la primera habilitada. Reflejado como atributo.',
      },
      {
        name: 'a11yLabel',
        attribute: 'a11y-label',
        type: 'String',
        default: "''",
        description:
          'Nombre accesible de la lista de pestañas (recomendado, sobre todo si hay más de un grupo en la página).',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description:
          'Color del indicador de la pestaña activa: primary o secondary. Heredado de ComponentMixin.',
      },
    ],
    events: [
      {
        name: 'ac-tabs-basic-change',
        detail: '{ id: string }',
        description: 'El usuario cambia de pestaña (click o teclado).',
      },
    ],
  },
  'ac-text-basic': {
    properties: [
      {
        name: 'text',
        attribute: 'text',
        type: 'String',
        default: "''",
        description:
          'Clave de traducción (o literal). Si se define, se traduce con this.t(); si no, se muestra el slot.',
      },
      {
        name: 'params',
        attribute: 'params',
        type: 'Object',
        default: '{}',
        description: 'Valores para los marcadores {nombre} de la traducción. Como atributo, JSON.',
      },
      {
        name: 'translations',
        attribute: 'translations',
        type: 'Object',
        default: '{}',
        description:
          "Traducciones solo para esta instancia, con la forma de locales.json ({ 'es-PE': { clave: 'texto' } }). Tiene prioridad sobre las de la aplicación.",
      },
      {
        name: 'tag',
        attribute: 'tag',
        type: 'String',
        default: "'span'",
        description:
          'Etiqueta renderizada: span, p, div, strong, em, small, label o h1–h6. Cualquier otro valor cae a span (lista blanca).',
      },
      {
        name: 'size',
        attribute: 'size',
        type: 'String',
        default: "'md'",
        description: 'sm, md o lg.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'default'",
        description: 'default (color de texto del tema) o primary. Heredado de ComponentMixin.',
      },
    ],
    events: [],
  },
  'ac-textarea-basic': {
    properties: [
      {
        name: 'label',
        attribute: 'label',
        type: 'String',
        default: "''",
        description:
          'Etiqueta visible. Pasa por this.t(), así que acepta tanto una clave de locales.json como un literal.',
      },
      {
        name: 'a11yLabel',
        attribute: 'a11y-label',
        type: 'String',
        default: "''",
        description:
          'aria-label para cuando no hay label visible. Se ignora si label está presente.',
      },
      {
        name: 'value',
        attribute: 'value',
        type: 'String',
        default: "''",
        description: 'Valor del campo.',
      },
      {
        name: 'name',
        attribute: 'name',
        type: 'String',
        default: "''",
        description: 'Atributo name del textarea interno.',
      },
      {
        name: 'placeholder',
        attribute: 'placeholder',
        type: 'String',
        default: "''",
        description: 'Texto de ayuda dentro del campo vacío. Pasa por this.t().',
      },
      {
        name: 'hint',
        attribute: 'hint',
        type: 'String',
        default: "''",
        description:
          'Mensaje de ayuda debajo del campo. Pasa por this.t(). Se reemplaza por error si ambos están presentes.',
      },
      {
        name: 'error',
        attribute: 'error',
        type: 'String',
        default: "''",
        description:
          'Mensaje de error debajo del campo (role=alert, marca aria-invalid=true). Pasa por this.t().',
      },
      {
        name: 'rows',
        attribute: 'rows',
        type: 'Number',
        default: '4',
        description:
          'Alto visible del campo, en líneas — pasa directo al atributo rows del textarea.',
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description: 'Deshabilita el campo (reflejado).',
      },
      {
        name: 'readonly',
        attribute: 'readonly',
        type: 'Boolean',
        default: 'false',
        description: 'Solo lectura (reflejado).',
      },
      {
        name: 'required',
        attribute: 'required',
        type: 'Boolean',
        default: 'false',
        description:
          'Marca el campo como obligatorio (reflejado) — agrega un * visual junto a la etiqueta (aria-hidden, no se anuncia dos veces).',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description: "Heredado de ComponentMixin. 'primary'/'secondary' cambian el color de foco.",
      },
    ],
    events: [
      {
        name: 'ac-textarea-basic-input',
        detail: '{ value: string }',
        description: 'En cada tecla (evento input nativo).',
      },
      {
        name: 'ac-textarea-basic-change',
        detail: '{ value: string }',
        description: 'Al perder el foco con cambios (change nativo).',
      },
    ],
  },
  'ac-toast-basic': {
    properties: [
      {
        name: 'open',
        attribute: 'open',
        type: 'Boolean',
        default: 'false',
        description:
          'Toast visible (reflejado como atributo). Al pasar a false se anima la salida y luego se oculta.',
      },
      {
        name: 'message',
        attribute: 'message',
        type: 'String',
        default: "''",
        description:
          'Mensaje (pasa por this.t(): una clave de locales.json se traduce, cualquier otro texto se muestra tal cual). Sin message se usa el slot.',
      },
      {
        name: 'duration',
        attribute: 'duration',
        type: 'Number',
        default: '4000',
        description: 'Milisegundos hasta el cierre automático. 0 = no se cierra solo.',
      },
      {
        name: 'position',
        attribute: 'position',
        type: 'String',
        default: "'bottom'",
        description: 'bottom o top. Cualquier otro valor cae a bottom.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'neutral'",
        description:
          'neutral, success, warning o danger (fondos sólidos con texto fijo, igual que ac-badge-basic). Otro valor cae a neutral.',
      },
      {
        name: 'hideClose',
        attribute: 'hide-close',
        type: 'Boolean',
        default: 'false',
        description: 'Oculta el botón de cerrar.',
      },
      {
        name: 'actionText',
        attribute: 'action-text',
        type: 'String',
        default: "''",
        description: 'Texto del botón de acción (pasa por this.t()). Sin texto, no se muestra.',
      },
    ],
    events: [
      {
        name: 'ac-toast-basic-show',
        detail: 'true',
        description: 'El toast se muestra (no se dispara por el estado inicial open del HTML).',
      },
      {
        name: 'ac-toast-basic-close',
        detail: "{ reason: 'timeout' | 'close-button' | 'api' }",
        description: 'El toast empieza a cerrarse.',
      },
      {
        name: 'ac-toast-basic-close-click',
        detail: 'true',
        description: 'Click en el botón de cerrar.',
      },
      {
        name: 'ac-toast-basic-action-click',
        detail: 'true',
        description: 'Click en el botón de acción.',
      },
    ],
  },
  'ac-tooltip-basic': {
    properties: [
      {
        name: 'text',
        attribute: 'text',
        type: 'String',
        default: "''",
        description:
          'Contenido del globo — pasa por this.t() (texto literal o clave de traducción, igual criterio que text en ac-badge-basic).',
      },
      {
        name: 'position',
        attribute: 'position',
        type: 'String',
        default: "'top'",
        description: "'top' | 'bottom' | 'left' | 'right', whitelist con fallback a 'top'.",
      },
      {
        name: 'disabled',
        attribute: 'disabled',
        type: 'Boolean',
        default: 'false',
        description:
          'Si es true, el globo nunca se muestra — el trigger sigue funcionando normal, solo no hay tooltip.',
      },
    ],
    events: [],
  },
  'ac-transition-container': {
    properties: [
      {
        name: 'visible',
        attribute: 'visible',
        type: 'Boolean',
        default: 'false',
        description:
          'Contenedor visible (reflejado como atributo). Al pasar a false se anima la salida y luego se cierra el dialog.',
      },
      {
        name: 'headerText',
        attribute: 'header-text',
        type: 'String',
        default: "''",
        description:
          'Título. Pasa por this.t(), así que acepta tanto una clave de locales.json como un literal. Sin header-text se muestra un título por defecto traducido (transition-container-title).',
      },
      {
        name: 'headerType',
        attribute: 'header-type',
        type: 'String',
        default: "'first-level-initial'",
        description:
          "Lista blanca: 'first-level-initial' o 'first-level-sequential' (cualquier otro valor cae a 'first-level-initial'). Reservada para uso futuro.",
      },
      {
        name: 'hideMenuIcon',
        attribute: 'hide-menu-icon',
        type: 'Boolean',
        default: 'false',
        description: 'Oculta el ícono de menú (hamburguesa) del lado derecho de la cabecera.',
      },
      {
        name: 'persistent',
        attribute: 'persistent',
        type: 'Boolean',
        default: 'false',
        description:
          'Si es false, Escape cierra el contenedor. Si es true, Escape no hace nada — solo se cierra con la flecha de volver (si la demo la cablea) o desde el código.',
      },
      {
        name: 'contained',
        attribute: 'contained',
        type: 'Boolean',
        default: 'false',
        description:
          'En vez del viewport real, se dibuja sobre el área que mide getBoundary() — pensado para que ac-demo-content lo simule dentro del marco de dispositivo.',
      },
      {
        name: 'ambient',
        attribute: 'ambient',
        type: 'String',
        default: "'primary'",
        description: 'Heredado de ComponentMixin.',
      },
      {
        name: 'getBoundary',
        attribute: '',
        type: 'Function',
        default: 'null',
        description:
          'Función que devuelve el elemento a medir cuando contained está activo (nunca un rect cacheado).',
      },
    ],
    events: [
      {
        name: 'ac-transition-container-open',
        detail: 'true',
        description:
          'El contenedor se vuelve visible (no se dispara por el estado inicial visible del HTML).',
      },
      {
        name: 'ac-transition-container-close',
        detail: "{ reason: 'escape' | 'api' | 'native' }",
        description: 'El contenedor empieza a cerrarse.',
      },
      {
        name: 'ac-transition-container-header-back-icon-click',
        detail: 'true',
        description:
          'Click en la flecha de volver de la cabecera (siempre visible, no se puede ocultar).',
      },
      {
        name: 'ac-transition-container-header-menu-icon-click',
        detail: 'true',
        description:
          'Click en el ícono de menú (hamburguesa) de la cabecera (visible por defecto salvo hide-menu-icon).',
      },
    ],
  },
};
