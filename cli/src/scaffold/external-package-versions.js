/**
 * Versión real publicada en npm de cada paquete `@ac-base/*` que el template
 * de `aclit component:create` trae como dependencia. Se usa para reemplazar
 * `workspace:^` cuando el scaffolding corre fuera del workspace de `ac-lit`
 * (ahí ese protocolo no resuelve — ver `docs/CONVENTIONS.md`).
 *
 * Mantener a mano: si alguno de estos paquetes publica una versión nueva vía
 * `pnpm changeset`, actualizar el rango correspondiente acá también.
 */
export const EXTERNAL_BASE_PACKAGE_RANGES = {
  '@ac-base/ac-component-mixin': '^0.1.0',
  '@ac-base/ac-intl-mixin': '^0.1.0',
  '@ac-base/ac-core': '^0.1.0',
  '@ac-base/ac-demo-content': '^0.1.0',
  '@ac-base/ac-e2e-testing': '^0.1.0',
  '@ac-base/cli': '^0.1.0',
};
