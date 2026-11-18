/**
 * Opciones del selector de rol en el paso 1 del wizard (value interno + label visible).
 * @type {Array<{value: string, label: string}>}
 */
export const ROL_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'lector', label: 'Lector' },
];

/**
 * Etiqueta visible de cada rol, usada en el badge del resumen del paso 3 y del modal de éxito.
 * @type {Object<string, string>}
 */
export const ROL_BADGE_LABEL = {
  admin: 'Administrador',
  editor: 'Editor',
  lector: 'Lector',
};

/**
 * Rol que se asigna al confirmar el registro si el usuario no eligió ninguno.
 * @type {string}
 */
export const DEFAULT_ROL = 'lector';

/**
 * Etiqueta de respaldo que se muestra cuando un rol no está en ROL_BADGE_LABEL (ej. el resumen del paso 3 antes de elegir un rol).
 * @type {string}
 */
export const UNKNOWN_ROL_LABEL = 'Sin rol';

/**
 * Valor de la propiedad "plan" cuando se elige la opción mensual.
 * @type {string}
 */
export const PLAN_MENSUAL = 'mensual';

/**
 * Valor de la propiedad "plan" cuando se elige la opción anual.
 * @type {string}
 */
export const PLAN_ANUAL = 'anual';

/**
 * Nombre de grupo nativo (atributo `name`) que agrupa los 2 `ac-radio-basic` del plan, para que el navegador los trate como un único grupo de radios.
 * @type {string}
 */
export const PLAN_RADIO_GROUP_NAME = 'registro-wizard-plan';

/**
 * Versión simulada que se pasa a `ac-api-users` (ver su propiedad pública `version`).
 * @type {string}
 */
export const API_VERSION = 'lab-1';

/**
 * Id de usuario simulado que `init()` usa para precargar los datos de bienvenida.
 * @type {number}
 */
export const INIT_USER_ID = 1;
