import fs from 'node:fs';
import path from 'node:path';
import { COMMANDS } from './registry.js';

const COMMON_TASKS = [
  [
    'aclit component:serve',
    'aclit component:build',
    'aclit component:lint',
    'aclit component:preview',
  ],
  ['aclit component:test', 'aclit component:test:e2e', 'aclit component:test:e2e:a11y'],
  ['aclit component:build:styles', 'aclit component:build:styles:watch'],
];

function readScripts(cwd) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    return Object.entries(pkg.scripts ?? {});
  } catch {
    return [];
  }
}

function commandUsage(command) {
  const options = command.options.map(([flags]) => `[${flags}]`);
  return ['aclit', command.name, command.args, ...options].filter(Boolean).join(' ');
}

/** Texto de `aclit help`: comandos propios, passthrough y scripts del package.json del cwd. */
export function formatHelp(cwd = process.cwd()) {
  const usages = COMMANDS.map(commandUsage);
  const width = Math.max(...usages.map(usage => usage.length), 'aclit help'.length);
  const row = (usage, description) => `  ${usage.padEnd(width)}  ${description}`;

  const lines = [
    'aclit — CLI de ac-lit',
    '',
    'Comandos:',
    ...COMMANDS.map((command, index) => row(usages[index], command.description)),
    row('aclit help', 'Lista todos los comandos disponibles (también: aclit -h, aclit --help)'),
    '',
    'Tareas (passthrough a "pnpm run <script>" en el directorio actual):',
    ...COMMON_TASKS.map(group => `  ${group.join('    ')}`),
    '  aclit <cualquier script definido en package.json>',
  ];

  const scripts = readScripts(cwd);
  if (scripts.length > 0) {
    const scriptWidth = Math.max(...scripts.map(([name]) => name.length));
    lines.push(
      '',
      'Scripts disponibles en este directorio (package.json):',
      ...scripts.map(([name, command]) => `  aclit ${name.padEnd(scriptWidth)}  ${command}`),
    );
  }

  return `${lines.join('\n')}\n`;
}
