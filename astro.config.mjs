// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://maf38.github.io',
  base: '/portfolio-cv-astro',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
});
