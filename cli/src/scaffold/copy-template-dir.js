import fs from 'node:fs';
import path from 'node:path';
import { renderTemplateString } from './render-template.js';

/**
 * Copia recursivamente `srcDir` a `destDir`, reemplazando los placeholders
 * `__token__` de `tokens` tanto en el contenido de cada archivo como en los
 * nombres de archivo/carpeta.
 */
export function copyTemplateDir(srcDir, destDir, tokens) {
  fs.mkdirSync(destDir, { recursive: true });

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const destName = renderTemplateString(entry.name, tokens);
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, destName);

    if (entry.isDirectory()) {
      copyTemplateDir(srcPath, destPath, tokens);
    } else {
      const content = fs.readFileSync(srcPath, 'utf8');
      fs.writeFileSync(destPath, renderTemplateString(content, tokens));
    }
  }
}
