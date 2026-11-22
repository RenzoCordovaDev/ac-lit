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

// Deriva el .styles.js hermano de un .styles.scss: mismo directorio, mismo
// nombre base, solo cambia la extensión final.
function outJsPathFromScss(scssPath) {
  return scssPath.replace(/\.styles\.scss$/, '.styles.js');
}

// Recorre `dir` recursivamente y devuelve todos los *.styles.scss que
// encuentre. Ignora `node_modules` por si alguna vez aparece anidado.
function findScssFiles(dir) {
  const found = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      found.push(...findScssFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.styles.scss')) {
      found.push(fullPath);
    }
  }

  return found;
}

// Recorre `dir` recursivamente y devuelve todas las subcarpetas (incluyendo
// `dir` mismo). Se usa como base del fallback de watch en plataformas sin
// soporte de `fs.watch(dir, { recursive: true })`.
function findAllDirs(dir) {
  const found = [dir];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    if (entry.isDirectory()) {
      found.push(...findAllDirs(path.join(dir, entry.name)));
    }
  }

  return found;
}

function compileAllInDir(dirPath) {
  const scssFiles = findScssFiles(dirPath);

  for (const scssPath of scssFiles) {
    const outPath = outJsPathFromScss(scssPath);
    const exportName = defaultExportNameFromPath(scssPath);
    compileToLit(scssPath, outPath, exportName);
  }

  return scssFiles;
}

const rawArgs = process.argv.slice(2);
const watch = rawArgs.includes('--watch');
const positional = rawArgs.filter(arg => arg !== '--watch');
const [first] = positional;

if (!first) {
  console.error(
    'Usage: node node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs <in.scss> <out.styles.js> [exportName] [--watch]\n' +
      '   or: node node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs <folder> [--watch]',
  );
  process.exit(1);
}

// Resolve relative to the current working directory so packages can call this
// script with paths relative to their own folder.
const firstPath = path.isAbsolute(first) ? first : path.resolve(process.cwd(), first);
const isFolderMode = fs.statSync(firstPath).isDirectory();

if (isFolderMode) {
  compileAllInDir(firstPath);

  if (watch) {
    console.log(`Watching ${firstPath} for changes (Ctrl+C to stop)...`);
    const timers = new Map();

    const recompileScss = scssPath => {
      clearTimeout(timers.get(scssPath));
      // Debounce por archivo: algunos editores disparan varios eventos de
      // "change" por cada guardado (ej. escritura seguida de un rename
      // interno).
      timers.set(
        scssPath,
        setTimeout(() => {
          try {
            const outPath = outJsPathFromScss(scssPath);
            const exportName = defaultExportNameFromPath(scssPath);
            compileToLit(scssPath, outPath, exportName);
          } catch (error) {
            // Un error de sintaxis SCSS a mitad de edición no debe tumbar el
            // watcher — se reporta y se sigue escuchando el próximo guardado.
            console.error(`Error compilando ${scssPath}:\n${error.message}`);
          }
        }, 150),
      );
    };

    const onFsEvent = (eventType, filename) => {
      if (!filename || !filename.endsWith('.styles.scss')) return;
      // Ignora el propio .styles.js generado (y su .tmp intermedio) para no
      // entrar en loop; el filtro de arriba ya los descarta porque no
      // terminan en .styles.scss, esto es solo refuerzo explícito.
      recompileScss(path.resolve(firstPath, filename));
    };

    let usingRecursiveWatch = true;
    try {
      fs.watch(firstPath, { recursive: true }, onFsEvent);
    } catch (error) {
      usingRecursiveWatch = false;
      console.warn(
        `fs.watch recursive no está soportado en esta plataforma (${error.message}). ` +
          'Usando fallback: un watcher manual por subcarpeta.',
      );
    }

    if (!usingRecursiveWatch) {
      // Fallback para plataformas (ej. Linux) donde `fs.watch` con
      // `{ recursive: true }` no está soportado: un watcher no-recursivo por
      // cada subcarpeta encontrada al escanear, re-escaneando la lista de
      // subcarpetas cuando aparece una nueva (para detectar sub-elementos
      // creados después de arrancar el watch).
      const watchedDirs = new Set();

      const watchDirNonRecursive = dirToWatch => {
        if (watchedDirs.has(dirToWatch)) return;
        watchedDirs.add(dirToWatch);

        fs.watch(dirToWatch, (eventType, filename) => {
          if (filename && filename.endsWith('.styles.scss')) {
            onFsEvent(eventType, path.relative(firstPath, path.join(dirToWatch, filename)));
          }
          // Cualquier cambio (incluida la creación de una subcarpeta nueva)
          // dispara un re-escaneo para empezar a vigilar carpetas nuevas.
          for (const dir of findAllDirs(firstPath)) {
            watchDirNonRecursive(dir);
          }
        });
      };

      for (const dir of findAllDirs(firstPath)) {
        watchDirNonRecursive(dir);
      }
    }
  }
} else {
  const [scss, out, exportName] = positional;

  if (!scss || !out) {
    console.error(
      'Usage: node node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs <in.scss> <out.styles.js> [exportName] [--watch]\n' +
        '   or: node node_modules/@ac-base/cli/scripts/compile-scss-to-lit.cjs <folder> [--watch]',
    );
    process.exit(1);
  }

  const inPath = firstPath;
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
}
