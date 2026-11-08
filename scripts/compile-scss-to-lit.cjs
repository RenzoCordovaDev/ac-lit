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

const rawArgs = process.argv.slice(2);
const watch = rawArgs.includes('--watch');
const [scss, out, exportName] = rawArgs.filter(arg => arg !== '--watch');

if (!scss || !out) {
  console.error(
    'Usage: node scripts/compile-scss-to-lit.cjs <in.scss> <out.styles.js> [exportName] [--watch]',
  );
  process.exit(1);
}

// Resolve relative to the current working directory so packages can call this
// script with paths relative to their own folder.
const inPath = path.isAbsolute(scss) ? scss : path.resolve(process.cwd(), scss);
const outPath = path.isAbsolute(out) ? out : path.resolve(process.cwd(), out);
const finalExportName = exportName || defaultExportNameFromPath(inPath);

compileToLit(inPath, outPath, finalExportName);

if (watch) {
  console.log(`Watching ${inPath} for changes (Ctrl+C to stop)...`);
  let timer = null;
  fs.watch(inPath, () => {
    clearTimeout(timer);
    // Debounce: algunos editores disparan varios eventos de "change" por
    // cada guardado (ej. escritura seguida de un rename interno).
    timer = setTimeout(() => {
      try {
        compileToLit(inPath, outPath, finalExportName);
      } catch (error) {
        // Un error de sintaxis SCSS a mitad de edición no debe tumbar el
        // watcher — se reporta y se sigue escuchando el próximo guardado.
        console.error(`Error compilando ${inPath}:\n${error.message}`);
      }
    }, 150);
  });
}
