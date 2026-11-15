#!/usr/bin/env node
// Recorre packages/components/* y levanta el demo de cada uno, uno a la vez,
// en cascada: abre el navegador, espera Enter para pasar al siguiente y
// mata el proceso anterior antes de arrancar el próximo. Pensado para
// revisión visual rápida del catálogo sin cambiar de carpeta ni repetir
// `pnpm --filter ... run component:serve` a mano.
import { spawn, execSync, execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const componentsDir = join(root, 'packages', 'components');

const only = process.argv.slice(2);

const names = readdirSync(componentsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .filter(name => existsSync(join(componentsDir, name, 'package.json')))
  .filter(name => only.length === 0 || only.includes(name))
  .sort();

if (names.length === 0) {
  console.error('No se encontró ningún componente para levantar.');
  process.exit(1);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = question => new Promise(resolve => rl.question(question, resolve));

function openBrowser(url) {
  const cmd =
    process.platform === 'win32'
      ? `start "" "${url}"`
      : process.platform === 'darwin'
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  try {
    execSync(cmd, { shell: true });
  } catch {
    console.warn(`No se pudo abrir el navegador automáticamente. URL: ${url}`);
  }
}

// `pnpm run component:serve` arranca `concurrently`, que a su vez arranca el
// watcher de estilos y `vite demo` como procesos propios: en Windows no quedan
// anidados bajo el PID que devuelve spawn(), así que `taskkill /T` no los
// alcanza y quedan vivos (puerto ocupado) aunque el script avance al
// siguiente componente. Por eso se matan por patrón de línea de comandos
// (que contiene la ruta del paquete), no por árbol de PIDs.
function killComponentProcesses(pid, componentName) {
  if (process.platform === 'win32') {
    if (pid) {
      try {
        execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
      } catch {
        /* puede que ya no exista */
      }
    }
    const psScript = [
      '$procs = Get-CimInstance Win32_Process -Filter "Name=\'node.exe\'" |',
      `  Where-Object { $_.CommandLine -and $_.CommandLine -like '*${componentName}*' }`,
      'foreach ($p in $procs) { Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue }',
    ].join('\n');
    try {
      execFileSync('powershell', ['-NoProfile', '-Command', psScript], { stdio: 'ignore' });
    } catch {
      /* no bloquea el flujo si falla */
    }
  } else if (pid) {
    try {
      process.kill(-pid, 'SIGTERM');
    } catch {
      /* ya pudo haber terminado solo */
    }
  }
}

try {
  console.log(`Catálogo: ${names.length} componente(s) a revisar.\n`);

  for (const [index, name] of names.entries()) {
    const pkgName = `@ac-components/${name}`;
    console.log(`\n=== [${index + 1}/${names.length}] ${pkgName} ===`);

    let opened = false;
    const child = spawn('pnpm', ['--filter', pkgName, 'run', 'component:serve'], {
      stdio: ['ignore', 'pipe', 'inherit'],
      shell: true,
    });

    child.stdout.on('data', chunk => {
      const text = chunk.toString();
      process.stdout.write(text);
      if (!opened) {
        const match = text.match(/https?:\/\/localhost:\d+\S*/);
        if (match) {
          opened = true;
          openBrowser(match[0]);
        }
      }
    });

    await ask('\nPresiona Enter para pasar al siguiente componente (Ctrl+C para salir)...\n');
    killComponentProcesses(child.pid, name);
    await new Promise(resolve => setTimeout(resolve, 400));
  }

  console.log('\nListo: se recorrió todo el catálogo.');
  process.exitCode = 0;
} catch (err) {
  console.error('\nFalló el recorrido del catálogo:', err);
  process.exitCode = 1;
} finally {
  rl.close();
}
