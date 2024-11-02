import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/data.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  external: ['lodash'],
});
