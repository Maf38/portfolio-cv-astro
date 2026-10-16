import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const cache = new Map<string, number>();

/** Width / height ratio of a public SVG, read from its viewBox at build time. */
export function svgRatio(publicPath: string): number {
  const hit = cache.get(publicPath);
  if (hit) return hit;
  let ratio = 1;
  try {
    const src = readFileSync(join(process.cwd(), 'public', publicPath), 'utf8');
    const vb = /viewBox="([^"]+)"/
      .exec(src)?.[1]
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (vb && vb[2] > 0 && vb[3] > 0) ratio = vb[2] / vb[3];
  } catch {
    /* missing file: keep square */
  }
  cache.set(publicPath, ratio);
  return ratio;
}

/**
 * Box for a logo with a consistent optical size: wide wordmarks get a lower
 * height than square emblems so they read at a similar visual weight.
 */
export function logoBox(publicPath: string, base = 1.7): { w: string; h: string } {
  const r = svgRatio(publicPath);
  const h = r >= 3 ? base * 0.72 : r >= 2 ? base * 0.9 : base * 1.15;
  return { w: `${(h * r).toFixed(3)}rem`, h: `${h.toFixed(3)}rem` };
}
