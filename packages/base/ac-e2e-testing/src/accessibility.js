import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { ACCESSIBILITY_TAGS } from './config.js';

const require = createRequire(import.meta.url);

// axe-core se inyecta como script "crudo" en la página bajo prueba. No se usa
// el paquete @axe-core/webdriverio: a la fecha de este paquete su versión
// publicada (4.14.0) depende de `client.executeAsync`, un comando que
// WebdriverIO v10 eliminó a favor de `execute()` con funciones async. Inyectar
// axe-core directamente es además el camino sin intermediarios desactualizados.
let axeSource;
function getAxeSource() {
  axeSource ??= readFileSync(require.resolve('axe-core/axe.min.js'), 'utf-8');
  return axeSource;
}

/**
 * Corre axe-core contra el documento actual y devuelve el resultado completo
 * de `axe.run` (`{ violations, passes, ... }`).
 */
export async function runAccessibilityCheck({ tags = ACCESSIBILITY_TAGS, context } = {}) {
  await browser.execute(getAxeSource());
  return browser.execute(
    async (runOnlyTags, runContext) => {
      return window.axe.run(runContext ?? document, {
        runOnly: { type: 'tag', values: runOnlyTags },
      });
    },
    tags,
    context ?? null,
  );
}
