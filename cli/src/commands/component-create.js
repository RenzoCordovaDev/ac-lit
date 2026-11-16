import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deriveComponentNames } from '../scaffold/naming.js';
import { copyTemplateDir } from '../scaffold/copy-template-dir.js';
import { isInsideAcLitWorkspace } from '../scaffold/workspace-context.js';
import { EXTERNAL_BASE_PACKAGE_RANGES } from '../scaffold/external-package-versions.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(here, '..', '..', 'templates', 'component');

export function componentCreate(rawName, { e2e = true } = {}) {
  const names = deriveComponentNames(rawName);
  const destDir = path.join(process.cwd(), names.folder);

  if (fs.existsSync(destDir)) {
    throw new Error(`La carpeta "${names.folder}" ya existe en ${process.cwd()}.`);
  }

  const insideWorkspace = isInsideAcLitWorkspace(process.cwd());
  // @ac-base/ac-e2e-testing es `private` a propósito, nunca se publicó a npm
  // -- fuera del workspace esa dependencia no se puede instalar nunca, así
  // que el e2e se desactiva solo, sin que haga falta pasar --no-e2e a mano.
  const effectiveE2e = e2e && insideWorkspace;

  copyTemplateDir(TEMPLATE_DIR, destDir, {
    tag: names.tag,
    file_base: names.fileBase,
    class_name: names.className,
    styles_export: names.stylesExportName,
    package_name: names.packageName,
  });

  if (!effectiveE2e) {
    fs.rmSync(path.join(destDir, 'test_e2e'), { recursive: true, force: true });
    stripE2eFromPackageJson(destDir);
  }

  if (!insideWorkspace) {
    pinExternalPackageVersions(destDir);
  }

  return destDir;
}

/**
 * Fuera del workspace de `ac-lit`, `workspace:^` no resuelve — se reemplaza
 * por el rango real publicado en npm de cada paquete `@ac-base/*`.
 */
function pinExternalPackageVersions(destDir) {
  const pkgPath = path.join(destDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  for (const section of ['dependencies', 'devDependencies']) {
    for (const [name, range] of Object.entries(pkg[section] ?? {})) {
      if (range !== 'workspace:^') continue;

      const realRange = EXTERNAL_BASE_PACKAGE_RANGES[name];
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

function stripE2eFromPackageJson(destDir) {
  const pkgPath = path.join(destDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  for (const script of [
    'component:test:e2e',
    'component:test:e2e:run',
    'component:test:e2e:a11y',
    'component:test:e2e:a11y:run',
  ]) {
    delete pkg.scripts[script];
  }
  delete pkg.devDependencies['@ac-base/ac-e2e-testing'];

  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}
