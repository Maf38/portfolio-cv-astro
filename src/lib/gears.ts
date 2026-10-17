/**
 * Procedural spur gears for the "Machinerie" theme.
 *
 * All gears in a train share the same module (tooth size), so their pitch
 * radii are proportional to their tooth counts and they mesh correctly when
 * their centres are placed at (r1 + r2) apart. Angular speed is inversely
 * proportional to the tooth count; meshing gears turn in opposite directions.
 */
export interface Gear {
  /** outline + rim hole (use fill-rule="evenodd") */
  body: string;
  /** spokes connecting the rim to the hub */
  spokes: string;
  pitchR: number;
  outerR: number;
  rimR: number;
  hubR: number;
  holeR: number;
  teeth: number;
}

const f = (n: number) => n.toFixed(2);
const pt = (r: number, a: number) => `${f(r * Math.cos(a))} ${f(r * Math.sin(a))}`;

export function gear(teeth: number, module = 6, spokes = 5): Gear {
  const pitchR = (module * teeth) / 2;
  const outerR = pitchR + module;
  const rootR = pitchR - 1.25 * module;
  const step = (Math.PI * 2) / teeth;

  // Trapezoidal teeth: flank from root to tip, flat tip, flank back down.
  let d = '';
  for (let k = 0; k < teeth; k++) {
    const c = k * step;
    const a1 = c - 0.3 * step;
    const a2 = c - 0.13 * step;
    const a3 = c + 0.13 * step;
    const a4 = c + 0.3 * step;
    d += `${k === 0 ? 'M' : 'L'}${pt(rootR, a1)} L${pt(outerR, a2)} A${f(outerR)} ${f(outerR)} 0 0 1 ${pt(outerR, a3)} L${pt(rootR, a4)} A${f(rootR)} ${f(rootR)} 0 0 1 ${pt(rootR, c + 0.7 * step)} `;
  }
  d += 'Z';

  const rimR = rootR - Math.max(module * 1.6, rootR * 0.14);
  const hubR = Math.max(rootR * 0.24, module * 1.4);
  const holeR = hubR * 0.42;
  // Rim hole (cut-out) → the gear reads as a ring, spokes are drawn on top.
  const hole = `M${f(rimR)} 0 A${f(rimR)} ${f(rimR)} 0 1 0 ${f(-rimR)} 0 A${f(rimR)} ${f(rimR)} 0 1 0 ${f(rimR)} 0 Z`;

  const w = Math.max(module * 0.9, rimR * 0.13);
  let s = '';
  for (let k = 0; k < spokes; k++) {
    const a = (k / spokes) * Math.PI * 2;
    const nx = -Math.sin(a) * (w / 2);
    const ny = Math.cos(a) * (w / 2);
    const x0 = Math.cos(a) * hubR * 0.8;
    const y0 = Math.sin(a) * hubR * 0.8;
    const x1 = Math.cos(a) * (rimR + 1);
    const y1 = Math.sin(a) * (rimR + 1);
    s += `M${f(x0 + nx)} ${f(y0 + ny)} L${f(x1 + nx)} ${f(y1 + ny)} L${f(x1 - nx)} ${f(y1 - ny)} L${f(x0 - nx)} ${f(y0 - ny)} Z `;
  }

  return { body: `${d} ${hole}`, spokes: s, pitchR, outerR, rimR, hubR, holeR, teeth };
}

export interface PlacedGear extends Gear {
  x: number;
  y: number;
  /** speed ratio relative to the driver (negative = counter-rotation) */
  ratio: number;
  /** initial rotation (deg) so that teeth interlock */
  phase: number;
}

/**
 * Build a meshing train. Each gear after the first is placed next to the
 * previous one at `angle` (deg), and phased so a tooth sits in a gap.
 */
export function train(
  spec: { teeth: number; angle?: number; spokes?: number }[],
  module: number,
  origin: { x: number; y: number },
): PlacedGear[] {
  const out: PlacedGear[] = [];
  spec.forEach((g, i) => {
    const base = gear(g.teeth, module, g.spokes ?? 5);
    if (i === 0) {
      out.push({ ...base, x: origin.x, y: origin.y, ratio: 1, phase: 0 });
      return;
    }
    const prev = out[i - 1];
    const ang = ((g.angle ?? 0) * Math.PI) / 180;
    const dist = prev.pitchR + base.pitchR;
    const x = prev.x + Math.cos(ang) * dist;
    const y = prev.y + Math.sin(ang) * dist;
    const ratio = -prev.ratio * (prev.teeth / g.teeth);
    // Mesh phasing: with prev rotated so a tooth sits on the contact line, this
    // gear needs a gap there (θ + 180° − half a pitch). Any residual rotation of
    // prev (δ) rolls this gear the opposite way by δ · Nprev / N.
    const theta = g.angle ?? 0;
    const pPrev = 360 / prev.teeth;
    const delta = (((theta - prev.phase) % pPrev) + pPrev) % pPrev;
    const phase = theta + 180 - 180 / g.teeth + (delta * prev.teeth) / g.teeth;
    out.push({ ...base, x, y, ratio, phase });
  });
  return out;
}
