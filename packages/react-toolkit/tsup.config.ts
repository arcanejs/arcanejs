import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/data.tsx'],
  format: ['cjs', 'esm'],
  splitting: true,
  dts: true,
  external: ['@arcanejs/toolkit', 'lodash', 'react', 'react-reconciler', 'zod'],
});
