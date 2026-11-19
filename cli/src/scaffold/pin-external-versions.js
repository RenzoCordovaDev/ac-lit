import fs from 'node:fs';
import path from 'node:path';
import { EXTERNAL_PACKAGE_RANGES } from './external-package-versions.js';

/**
 * Fuera del workspace de `ac-lit`, `workspace:^` no resuelve — se reemplaza
 * por el rango real publicado en npm de cada paquete del `package.json` ya
 * generado en `destDir`.
 */
export function pinExternalPackageVersions(destDir) {
  const pkgPath = path.join(destDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  for (const section of ['dependencies', 'devDependencies']) {
    for (const [name, range] of Object.entries(pkg[section] ?? {})) {
      if (range !== 'workspace:^') continue;

      const realRange = EXTERNAL_PACKAGE_RANGES[name];
      if (!realRange) {
        throw new Error(
          `No hay una versión real publicada registrada para "${name}" en ` +
            'cli/src/scaffold/external-package-versions.js.',
        );
      }
      pkg[section][name] = realRange;
    }
  }

  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}
