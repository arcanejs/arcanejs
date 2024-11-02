import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/components/index.tsx',
    'src/components/core/index.ts',
    'src/styling.ts',
    'src/util/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  external: ['@arcanejs/protocol', 'react', 'react-dom', 'styled-components'],
});
