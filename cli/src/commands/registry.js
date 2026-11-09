import { componentCreate } from './component-create.js';
import { appCreate } from './app-create.js';

/**
 * Comandos propios del CLI. Cualquier otro primer argumento es un passthrough a
 * `pnpm run <script>`, y estos nombres tienen prioridad sobre un script homónimo.
 * `bin/ac.js` los registra en Commander y `help.js` los lista desde acá, así que
 * agregar uno nuevo es una sola entrada.
 */
export const COMMANDS = [
  {
    name: 'component:create',
    args: '<name>',
    options: [['--no-e2e', 'No incluir la suite test_e2e/ (funcional + accesibilidad)']],
    description: 'Scaffoldea un componente nuevo en el directorio actual',
    run(name, options) {
      const destDir = componentCreate(name, { e2e: options.e2e });
      console.log(`Componente creado en ${destDir}`);
    },
  },
  {
    name: 'app:create',
    args: '<name>',
    options: [],
    description: 'Scaffoldea un proyecto ac-lit nuevo en el directorio actual (pendiente)',
    run(name) {
      appCreate(name);
    },
  },
];

export function findCommand(name) {
  return COMMANDS.find(command => command.name === name);
}
