// vite.config.ts

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,

    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
      fileName: () => 'milestone-advancement-framework.js',
    },

    rollupOptions: {
      output: {
        entryFileNames: 'milestone-advancement-framework.js',
      },
    },

    sourcemap: true,
    minify: false,
  },
});
