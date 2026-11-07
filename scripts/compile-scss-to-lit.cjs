const fs = require('fs');
const path = require('path');
const sass = require('sass');

function compileToLit(scssPath, outJsPath, exportName = 'styles') {
  const result = sass.compile(scssPath, { style: 'expanded' });
  const css = result.css;
  const safe = css.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  const js = `import { css } from 'lit';\n\nexport const ${exportName} = css\`\n${safe}\n\`;\n`;
  // Write to a temporary file first, then rename, to avoid a partially written module
  // being picked up by a watcher mid-write.
  const tmpPath = `${outJsPath}.tmp`;
  fs.writeFileSync(tmpPath, js, 'utf8');
  fs.renameSync(tmpPath, outJsPath);
  console.log(`Wrote ${outJsPath}`);
}

function defaultExportNameFromPath(filePath) {
  const base = path.basename(filePath).replace('.styles.scss', '');
  const pascal = base
    .split('-')
    .map(p => p[0].toUpperCase() + p.slice(1))
    .join('');
  return `${pascal}Styles`;
}

const [, , scss, out, exportName] = process.argv;
if (!scss || !out) {
  console.error(
    'Usage: node scripts/compile-scss-to-lit.cjs <in.scss> <out.styles.js> [exportName]',
  );
  process.exit(1);
}

// Resolve relative to the current working directory so packages can call this
// script with paths relative to their own folder.
const inPath = path.isAbsolute(scss) ? scss : path.resolve(process.cwd(), scss);
const outPath = path.isAbsolute(out) ? out : path.resolve(process.cwd(), out);
const finalExportName = exportName || defaultExportNameFromPath(inPath);

compileToLit(inPath, outPath, finalExportName);
