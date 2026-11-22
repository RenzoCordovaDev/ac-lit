// Metadatos de presentación del catálogo, mantenidos a mano: a qué grupo de
// la sidebar pertenece cada componente, su ícono referencial y sus textos en
// español. Nada de esto es obligatorio -- un componente nuevo que todavía no
// figure acá aparece igual: cae en el grupo "Otros", con un ícono genérico y
// la `description` de su package.json.

export const FALLBACK_GROUP_ID = 'otros';

export const FALLBACK_ICON = '<circle cx="12" cy="12" r="9"/>';

// El orden de `members` es el orden en que se listan dentro del grupo.
export const GROUPS = [
  {
    id: 'general',
    label: 'General',
    icon: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    members: [
      'ac-amount-basic',
      'ac-button-basic',
      'ac-icon-button-basic',
      'ac-icon-basic',
      'ac-link-basic',
      'ac-text-basic',
    ],
  },
  {
    id: 'formularios',
    label: 'Formularios',
    icon: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    members: [
      'ac-checkbox-basic',
      'ac-input-basic',
      'ac-radio-basic',
      'ac-select-basic',
      'ac-slider-basic',
      'ac-switch-basic',
      'ac-textarea-basic',
    ],
  },
  {
    id: 'navegacion',
    label: 'Navegación',
    icon: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    members: [
      'ac-tabs-basic',
      'ac-expandable-basic',
      'ac-expandable-step',
      'ac-expandable-multistep',
      'ac-transition-container',
    ],
  },
  {
    id: 'informacion',
    label: 'Información',
    icon: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',
    members: [
      'ac-avatar-basic',
      'ac-badge-basic',
      'ac-card-basic',
      'ac-date-basic',
      'ac-profile-card-basic',
      'ac-divider-basic',
      'ac-tooltip-basic',
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: '<path d="M5 5h14a1 1 0 011 1v9a1 1 0 01-1 1h-8l-4 3.5V16H5a1 1 0 01-1-1V6a1 1 0 011-1z"/>',
    members: [
      'ac-notification-basic',
      'ac-toast-basic',
      'ac-progress-basic',
      'ac-spinner-basic',
      'ac-modal-basic',
    ],
  },
  {
    id: 'apis',
    label: 'APIs',
    icon: '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><circle cx="7" cy="7" r="1"/><circle cx="7" cy="17" r="1"/>',
    members: [
      'ac-api-auth',
      'ac-api-users',
      'ac-api-productos',
      'ac-api-carrito',
      'ac-api-pedidos',
      'ac-api-operaciones',
      'ac-api-pagos',
      'ac-api-direcciones',
      'ac-api-notificaciones',
      'ac-api-archivos',
    ],
  },
  {
    id: FALLBACK_GROUP_ID,
    label: 'Otros',
    icon: '<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>',
    // Vacío a propósito: catch-all para cualquier componente nuevo que
    // todavía no se haya agregado al grupo que le corresponde más arriba.
    members: [],
  },
];

// `summary` va en la sidebar (corto); `description` en la cabecera del
// componente (una oración).
export const COMPONENT_META = {
  'ac-amount-basic': {
    icon: '<path d="M12 3v18M8 7.5c0-1.9 1.8-3.5 4-3.5s4 1.3 4 3.2c0 2.1-1.9 2.8-4 3.3-2.1.5-4 1.2-4 3.3 0 1.9 1.8 3.2 4 3.2s4-1.6 4-3.5"/>',
    summary: 'Monto monetario',
    description: 'Monto formateado como moneda, según el idioma activo.',
  },
  'ac-avatar-basic': {
    icon: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7"/>',
    summary: 'Avatar de usuario',
    description: 'Avatar para representar a una persona o cuenta.',
  },
  'ac-badge-basic': {
    icon: '<path d="M12 2l2.5 5 5.5.5-4 4 1 5.5L12 14.5 7 17l1-5.5-4-4L9.5 7z"/>',
    summary: 'Indicadores y estados',
    description: 'Etiqueta compacta para indicar un estado, sin interacción.',
  },
  'ac-button-basic': {
    icon: '<rect x="3" y="8" width="18" height="8" rx="4"/>',
    summary: 'Botón básico',
    description: 'Botón para disparar acciones, con variantes por ambiente.',
  },
  'ac-card-basic': {
    icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
    summary: 'Tarjeta de contenido',
    description: 'Superficie para agrupar contenido relacionado.',
  },
  'ac-checkbox-basic': {
    icon: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
    summary: 'Casilla de verificación',
    description: 'Casilla para marcar o desmarcar una opción.',
  },
  'ac-date-basic': {
    icon: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    summary: 'Fecha formateada',
    description: 'Formatea y muestra una fecha, corta, larga o con un patrón personalizado.',
  },
  'ac-divider-basic': {
    icon: '<path d="M4 12h16"/><path d="M8 6h8M8 18h8"/>',
    summary: 'Separador',
    description: 'Divisor de contenido horizontal o vertical.',
  },
  'ac-expandable-basic': {
    icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 10l4 4 4-4"/>',
    summary: 'Panel desplegable',
    description: 'Panel que muestra u oculta su contenido.',
  },
  'ac-expandable-multistep': {
    icon: '<circle cx="6" cy="6" r="1.6"/><circle cx="6" cy="12" r="1.6"/><circle cx="6" cy="18" r="1.6"/><path d="M11 6h10M11 12h10M11 18h10"/>',
    summary: 'Pasos en secuencia',
    description: 'Secuencia de pasos desplegables, uno abierto a la vez.',
  },
  'ac-expandable-step': {
    icon: '<circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>',
    summary: 'Paso desplegable',
    description: 'Paso individual desplegable de un flujo por etapas.',
  },
  'ac-icon-basic': {
    icon: '<circle cx="7.5" cy="7.5" r="3.5"/><rect x="13.5" y="4" width="7" height="7" rx="1.5"/><path d="M12 20l-4.5-6.5h9z"/>',
    summary: 'Set de íconos',
    description: 'Set propio de íconos SVG, decorativos o con etiqueta accesible.',
  },
  'ac-icon-button-basic': {
    icon: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9.5 9.5l5 5M14.5 9.5l-5 5"/>',
    summary: 'Botón con ícono',
    description: 'Botón solo-ícono para acciones rápidas, siempre con nombre accesible.',
  },
  'ac-input-basic': {
    icon: '<rect x="3" y="9" width="18" height="6" rx="1"/><path d="M8 9v6"/>',
    summary: 'Campo de texto',
    description: 'Campo de texto de una sola línea.',
  },
  'ac-link-basic': {
    icon: '<path d="M8 12L5.5 14.5a3 3 0 104.2 4.2L12 16"/><path d="M16 12l2.5-2.5a3 3 0 10-4.2-4.2L12 8"/><path d="M9.5 14.5l5-5"/>',
    summary: 'Enlace',
    description: 'Enlace de navegación con variantes por ambiente.',
  },
  'ac-modal-basic': {
    icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16"/>',
    summary: 'Diálogo modal',
    description: 'Diálogo que se superpone a la página hasta que se cierra.',
  },
  'ac-notification-basic': {
    icon: '<path d="M12 4a5 5 0 00-5 5v4l-2 3h14l-2-3V9a5 5 0 00-5-5z"/><path d="M10 19a2 2 0 004 0"/>',
    summary: 'Aviso persistente',
    description: 'Aviso en línea que permanece visible hasta que se cierra.',
  },
  'ac-profile-card-basic': {
    icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5"/><path d="M14 10h5M14 14h5"/>',
    summary: 'Tarjeta de perfil',
    description: 'Tarjeta con los datos principales de una persona.',
  },
  'ac-progress-basic': {
    icon: '<rect x="3" y="10" width="18" height="4" rx="2"/><path d="M5.5 12h6"/>',
    summary: 'Barra de progreso',
    description: 'Barra de progreso determinada o indeterminada.',
  },
  'ac-radio-basic': {
    icon: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
    summary: 'Botón de opción',
    description: 'Opción excluyente dentro de un grupo.',
  },
  'ac-select-basic': {
    icon: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M15 11l2 2 2-2"/>',
    summary: 'Lista desplegable',
    description: 'Lista desplegable para elegir una opción.',
  },
  'ac-slider-basic': {
    icon: '<path d="M4 12h16"/><circle cx="14" cy="12" r="3"/>',
    summary: 'Control deslizante',
    description: 'Control deslizante para elegir un valor dentro de un rango.',
  },
  'ac-spinner-basic': {
    icon: '<path d="M12 3a9 9 0 110 18"/>',
    summary: 'Indicador de carga',
    description: 'Indicador de carga para esperas sin duración conocida.',
  },
  'ac-switch-basic': {
    icon: '<rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="15" cy="12" r="3"/>',
    summary: 'Interruptor',
    description: 'Interruptor para activar o desactivar una opción.',
  },
  'ac-tabs-basic': {
    icon: '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 7l4-3h4l2 3"/>',
    summary: 'Pestañas',
    description: 'Pestañas para alternar entre secciones de contenido.',
  },
  'ac-text-basic': {
    icon: '<path d="M5 5h14M12 5v14"/>',
    summary: 'Texto traducible',
    description: 'Texto que se traduce según el idioma activo.',
  },
  'ac-textarea-basic': {
    icon: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M7 9h10M7 13h7"/>',
    summary: 'Área de texto',
    description: 'Campo de texto de varias líneas.',
  },
  'ac-toast-basic': {
    icon: '<rect x="5" y="6" width="16" height="7" rx="2"/><path d="M5 17h10"/>',
    summary: 'Notificación temporal',
    description: 'Notificación temporal que aparece sobre la página y se cierra sola.',
  },
  'ac-tooltip-basic': {
    icon: '<path d="M5 5h14a1 1 0 011 1v8a1 1 0 01-1 1h-5l-2 3-2-3H5a1 1 0 01-1-1V6a1 1 0 011-1z"/>',
    summary: 'Texto de ayuda flotante',
    description: 'Texto de ayuda breve que aparece junto a un elemento.',
  },
  'ac-transition-container': {
    icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M10 8l4 4-4 4"/>',
    summary: 'Transición a pantalla completa',
    description: 'Contenedor que entra deslizándose a pantalla completa.',
  },
  'ac-api-auth': {
    icon: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 118 0v4"/>',
    summary: 'Simulador de sesión (sin UI)',
    description: 'Simula login, registro, logout, validación y refresco de token.',
  },
  'ac-api-users': {
    icon: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7"/>',
    summary: 'Simulador de API de usuarios (sin UI)',
    description:
      'Simula el consumo de una API de usuarios: obtener, listar, buscar, crear, editar y eliminar.',
  },
  'ac-api-productos': {
    icon: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    summary: 'Simulador de API de productos (sin UI)',
    description: 'Simula el consumo de una API de productos, con catálogo y detalle extendido.',
  },
  'ac-api-carrito': {
    icon: '<circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2l2.4 11.5a2 2 0 002 1.6H17a2 2 0 002-1.6L20.5 8H6"/>',
    summary: 'Simulador de carrito de compras (sin UI)',
    description:
      'Simula un carrito de compras: agregar, quitar, actualizar cantidad y ver el resumen.',
  },
  'ac-api-pedidos': {
    icon: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 2h6v3H9z"/><path d="M8 11h8M8 15h5"/>',
    summary: 'Simulador de API de pedidos (sin UI)',
    description:
      'Simula el consumo de una API de pedidos: crear, consultar, listar, seguimiento y cancelación.',
  },
  'ac-api-operaciones': {
    icon: '<path d="M4 7h12M16 7l-3-3M16 7l-3 3"/><path d="M20 17H8M8 17l3 3M8 17l3-3"/>',
    summary: 'Simulador de operaciones financieras (sin UI)',
    description: 'Simula saldo, historial, compras, transferencias, depósitos y retiros.',
  },
  'ac-api-pagos': {
    icon: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/>',
    summary: 'Simulador de métodos de pago (sin UI)',
    description:
      'Simula el consumo de una API de métodos de pago: listar, agregar, eliminar y procesar un pago.',
  },
  'ac-api-direcciones': {
    icon: '<path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    summary: 'Simulador de direcciones de envío (sin UI)',
    description:
      'Simula el consumo de una API de direcciones de envío, con dirección predeterminada.',
  },
  'ac-api-notificaciones': {
    icon: '<path d="M12 4a5 5 0 00-5 5v4l-2 3h14l-2-3V9a5 5 0 00-5-5z"/><path d="M10 19a2 2 0 004 0"/>',
    summary: 'Simulador de API de notificaciones (sin UI)',
    description: 'Simula el consumo de una API de notificaciones: enviar, listar, leer y eliminar.',
  },
  'ac-api-archivos': {
    icon: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M12 16.5v-5M9.5 13.5L12 11l2.5 2.5"/>',
    summary: 'Simulador de API de archivos (sin UI)',
    description:
      'Simula el consumo de una API de archivos: listar, subir (con progreso), descargar y eliminar.',
  },
};
