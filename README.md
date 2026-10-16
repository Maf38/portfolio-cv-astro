# portfolio-cv-astro

Version 2 of my portfolio: a full visual redesign of [portfolio-cv](https://github.com/Maf38/portfolio-cv), rebuilt with **Astro** for a near zero-JS static site.

Design concept: **"The Loop"**. The site is organised around the DevOps infinity loop (plan → code → build → test → release → deploy → operate → monitor), with Material 3–inspired tonal surfaces, orbital backgrounds and subtle motion. It has a dark/light theme and respects `prefers-reduced-motion`.

## Stack

- Astro 7 + TypeScript (strict)
- Tailwind CSS 4 + hand-written design tokens (`src/styles/global.css`)
- Self-hosted variable fonts: Space Grotesk, Inter, JetBrains Mono
- GitHub Actions → GitHub Pages

## Content

All content lives in `src/data/`:

- `site.json`: everything displayed on the site (about, experience, projects, education, setup, contact, meta)
- `cv-data.json` / `cv-full-data.json`: CV data (FR/EN), carried over from v1

Company logos are monochrome SVGs in `public/assets/images/logos/*-mono.svg`. They are recoloured through CSS masks so they follow the theme.

## Development

```bash
npm install
npm run dev      # http://<host>:4321/portfolio-cv-astro/ (listens on 0.0.0.0)
npm run check    # type-check
npm run build    # static build in dist/
```
