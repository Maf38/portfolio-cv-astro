// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://maf38.github.io',
  // BASE_PATH lets CI publish several design variants side by side
  base: process.env.BASE_PATH ?? '/portfolio-cv-astro',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
});
