/**
 * Versión real publicada en npm de cada paquete del workspace que algún
 * template de `aclit` trae como dependencia `workspace:^`. Se usa para
 * reemplazar ese rango cuando el scaffolding corre fuera del workspace de
 * `ac-lit` (ahí ese protocolo no resuelve — ver `docs/CONVENTIONS.md`).
 *
 * Mantener a mano: si alguno de estos paquetes publica una versión nueva vía
 * `pnpm changeset`, actualizar el rango correspondiente acá también.
 */
export const EXTERNAL_PACKAGE_RANGES = {
  '@ac-base/ac-component-mixin': '^0.1.0',
  '@ac-base/ac-intl-mixin': '^0.1.0',
  '@ac-base/ac-core': '^0.1.0',
  '@ac-base/ac-demo-content': '^0.1.0',
  '@ac-base/cli': '^0.2.0',
  '@ac-base/ac-ccp': '^0.2.0',
  '@ac-components/ac-button-basic': '^0.1.2',
  '@ac-components/ac-badge-basic': '^0.1.2',
};

// @ac-base/ac-e2e-testing no está acá a propósito: es `private`, nunca se
// publicó a npm, así que no hay ningún rango real que poner. `componentCreate`
// desactiva el e2e automáticamente fuera del workspace antes de llegar a este
// mapa (ver cli/src/commands/component-create.js) -- esa dependencia nunca
// queda en el package.json generado afuera del monorepo.
