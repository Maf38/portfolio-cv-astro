/**
 * Geometry helpers for the DevOps "infinity loop" (lemniscate of Bernoulli).
 * Shared by the hero visual and the navbar progress mark.
 */
export interface Point {
  x: number;
  y: number;
}

export function lemniscatePoint(t: number, a: number, squash = 1): Point {
  const s = Math.sin(t);
  const c = Math.cos(t);
  const d = 1 + s * s;
  return { x: (a * c) / d, y: ((a * s * c) / d) * squash };
}

/** Closed SVG path of the loop, starting at the left tip and travelling the left lobe first. */
export function lemniscatePath(a: number, squash = 1, steps = 240): string {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = Math.PI + (i / steps) * Math.PI * 2;
    const p = lemniscatePoint(t, a, squash);
    pts.push(`${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
  }
  return pts.join(' ') + 'Z';
}

export interface Stage {
  key: string;
  side: 'dev' | 'ops';
  t: number;
}

/** The eight classic DevOps stages: Dev on the left lobe, Ops on the right. */
export const STAGES: Stage[] = [
  { key: 'plan', side: 'dev', t: Math.PI * 0.7 },
  { key: 'code', side: 'dev', t: Math.PI * 0.9 },
  { key: 'build', side: 'dev', t: Math.PI * 1.1 },
  { key: 'test', side: 'dev', t: Math.PI * 1.3 },
  { key: 'release', side: 'ops', t: Math.PI * 1.7 },
  { key: 'deploy', side: 'ops', t: Math.PI * 1.9 },
  { key: 'operate', side: 'ops', t: Math.PI * 0.1 },
  { key: 'monitor', side: 'ops', t: Math.PI * 0.3 },
];

/** Point pushed outwards from its lobe centre, used to place labels around the curve. */
export function outward(p: Point, a: number, distance: number): Point {
  const cx = p.x < 0 ? -a * 0.56 : a * 0.56;
  const dx = p.x - cx;
  const dy = p.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: p.x + (dx / len) * distance, y: p.y + (dy / len) * distance };
}
