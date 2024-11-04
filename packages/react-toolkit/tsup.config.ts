import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/data.tsx', 'src/logging.ts'],
  format: ['cjs', 'esm'],
  splitting: true,
  dts: true,
  external: [
    '@arcanejs/protocol',
    '@arcanejs/toolkit',
    'lodash',
    'react',
    'react-reconciler',
    'zod',
  ],
});
