import { defaultReporter } from '@web/test-runner';

export default {
  files: 'src/**/*.test.js',
  nodeResolve: true,
  reporters: [defaultReporter({ reportTestResults: true, reportTestProgress: true })],
};
