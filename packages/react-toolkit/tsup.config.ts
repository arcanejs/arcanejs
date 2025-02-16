import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.tsx',
    'src/colors.tsx',
    'src/connections.tsx',
    'src/custom.ts',
    'src/data.tsx',
    'src/logging.ts',
  ],
  format: ['cjs', 'esm'],
  splitting: true,
  dts: true,
});
