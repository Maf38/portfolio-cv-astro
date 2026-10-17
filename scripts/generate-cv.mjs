/**
 * Render the /cv/{lang}/ pages of the built site to A4 PDFs with Chromium.
 * Output: dist/cv/mafal-gai-cv-{lang}.pdf (and public/cv/ with --public, for the dev server).
 *
 * Locally, CHROME_PATH can point to an existing Chromium binary.
 */
import { createServer } from 'node:http';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const BASE = (process.env.BASE_PATH ?? '/portfolio-cv-astro').replace(/\/+$/, '');
const DIST = join(process.cwd(), 'dist');
const LANGS = ['fr', 'en'];
const toPublic = process.argv.includes('--public');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

// Minimal static server mirroring the GitHub Pages base path
const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (!path.startsWith(BASE)) return res.writeHead(404).end();
  path = normalize(path.slice(BASE.length) || '/');
  if (path.endsWith('/')) path += 'index.html';
  try {
    const body = await readFile(join(DIST, path));
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
try {
  const page = await browser.newPage();
  await mkdir(join(DIST, 'cv'), { recursive: true });
  if (toPublic) await mkdir(join(process.cwd(), 'public', 'cv'), { recursive: true });

  for (const lang of LANGS) {
    await page.goto(`http://127.0.0.1:${port}${BASE}/cv/${lang}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const out = join(DIST, 'cv', `mafal-gai-cv-${lang}.pdf`);
    await page.pdf({
      path: out,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });
    if (toPublic) await copyFile(out, join(process.cwd(), 'public', 'cv', `mafal-gai-cv-${lang}.pdf`));
    console.log(`✓ ${out}`);
  }
} finally {
  await browser.close();
  server.close();
}
