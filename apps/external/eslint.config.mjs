import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores(['.next/**', '.open-next/**', 'next-env.d.ts']),
  {
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      // Keep newly introduced React Compiler checks visible during this upgrade.
      // The app does not enable React Compiler; existing hooks correctness rules
      // retain their original severity.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
]);
