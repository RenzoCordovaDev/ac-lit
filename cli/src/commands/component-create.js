import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deriveComponentNames } from '../scaffold/naming.js';
import { copyTemplateDir } from '../scaffold/copy-template-dir.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(here, '..', '..', 'templates', 'component');

export function componentCreate(rawName, { e2e = true } = {}) {
  const names = deriveComponentNames(rawName);
  const destDir = path.join(process.cwd(), names.folder);

  if (fs.existsSync(destDir)) {
    throw new Error(`La carpeta "${names.folder}" ya existe en ${process.cwd()}.`);
  }

  copyTemplateDir(TEMPLATE_DIR, destDir, {
    tag: names.tag,
    file_base: names.fileBase,
    class_name: names.className,
    styles_export: names.stylesExportName,
    package_name: names.packageName,
  });

  if (!e2e) {
    fs.rmSync(path.join(destDir, 'test_e2e'), { recursive: true, force: true });
    stripE2eFromPackageJson(destDir);
  }

  return destDir;
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
