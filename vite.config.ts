import react from '@vitejs/plugin-react';
import path from 'path';
import { ModuleFormat } from 'rollup';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { peerDependencies } from './package.json';

export default defineConfig({
  plugins: [
    nodePolyfills(),
    dts(),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          '@emotion/babel-plugin',
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-transform-class-properties', { loose: true }],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    reportCompressedSize: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      fileName: (format: ModuleFormat) => {
        switch (format) {
          case 'cjs': {
            return 'index.js';
          }
          default: {
            return `index.${format}.js`;
          }
        }
      },
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)],
    },
  },
});
