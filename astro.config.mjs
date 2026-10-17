// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // SITE_URL / BASE_PATH let the same code ship to GitHub Pages (sub-path)
  // and to mafalgai.com on Cloudflare Pages (root).
  site: process.env.SITE_URL ?? 'https://maf38.github.io',
  // BASE_PATH lets CI publish several design variants side by side
  base: process.env.BASE_PATH ?? '/portfolio-cv-astro',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
});
