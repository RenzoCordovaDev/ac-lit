import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildWdioConfig } from '@ac-base/ac-e2e-testing';

const here = path.dirname(fileURLToPath(import.meta.url));

export const config = buildWdioConfig({
  baseUrl: process.env.AC_E2E_BASE_URL ?? 'http://localhost:4173',
  specs: [path.join(here, 'features/**/*.feature')],
  tags: 'not @accessibility',
  cucumberOpts: {
    import: [path.join(here, 'step-definitions/**/*.js')],
  },
});
