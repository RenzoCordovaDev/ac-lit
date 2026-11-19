import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deriveAppNames } from '../scaffold/naming.js';
import { copyTemplateDir } from '../scaffold/copy-template-dir.js';
import { isInsideAcLitWorkspace } from '../scaffold/workspace-context.js';
import { pinExternalPackageVersions } from '../scaffold/pin-external-versions.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(here, '..', '..', 'templates', 'app');

export function appCreate(rawName) {
  const names = deriveAppNames(rawName);
  const destDir = path.join(process.cwd(), names.folder);

  if (fs.existsSync(destDir)) {
    throw new Error(`La carpeta "${names.folder}" ya existe en ${process.cwd()}.`);
  }

  copyTemplateDir(TEMPLATE_DIR, destDir, {
    package_name: names.packageName,
    title: names.title,
  });

  if (!isInsideAcLitWorkspace(process.cwd())) {
    pinExternalPackageVersions(destDir);
  }

  return destDir;
}
