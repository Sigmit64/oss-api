import { defineConfig } from 'vite';

// A relative base keeps the generated site usable at any GitHub project Pages path.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
