/**
 * One engine drives every mechanical part on the page.
 *
 * `spin` (degrees) is the angle of the driver gear. It advances slowly on its
 * own and faster while the page scrolls, as if scrolling cranked the machine.
 * Gears read it through the --spin CSS variable (each with its own ratio);
 * the hero conveyor, press, gauge and crates are derived from the same value,
 * so everything stays mechanically consistent.
 */
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const IDLE_DEG_PER_S = 14;
const SCROLL_GAIN = 0.35; // degrees per scrolled pixel
const BELT_PER_DEG = 0.9; // px of belt travel per degree of driver rotation

let spin = 0;
let boost = 0;
let lastY = scrollY;
let last = performance.now();

addEventListener(
  'scroll',
  () => {
    boost += Math.abs(scrollY - lastY) * SCROLL_GAIN;
    lastY = scrollY;
  },
  { passive: true },
);

// ---- hero machine wiring ----
const svg = document.querySelector<SVGSVGElement>('[data-machine]');
const crates = svg ? Array.from(svg.querySelectorAll<SVGGElement>('[data-crate]')) : [];
const x0 = Number(svg?.dataset.x0 ?? 0);
const x1 = Number(svg?.dataset.x1 ?? 0);
const buildX = Number(svg?.dataset.build ?? 0);
const testX = Number(svg?.dataset.test ?? 0);
const span = x1 - x0;
const crateY = svg ? (crates[0]?.transform.baseVal.consolidate()?.matrix.f ?? 0) : 0;

// ① SPEC station: each crate starts as a spec written on the drafting board,
// then the sheet flies into the ② CODE hopper just before the crate appears.
const specLines = svg ? Array.from(svg.querySelectorAll<SVGPathElement>('[data-spec-line]')) : [];
const pencil = svg?.querySelector<SVGGElement>('[data-pencil]');
const sheet = svg?.querySelector<SVGGElement>('[data-sheet]');
const sheetPath = svg?.querySelector<SVGPathElement>('[data-sheet-path]');
const sheetLen = sheetPath?.getTotalLength() ?? 0;
const lineGeom = specLines.map((l) => {
  const b = l.getBBox();
  return { x: b.x, y: b.y, w: b.width };
});
const WRITE_END = 0.42; // fraction of a crate period spent writing
const FLY_END = 0.96; // sheet lands in the hopper right before the crate spawns

function updateSpec(q: number) {
  const writing = q < WRITE_END;
  const w = writing ? q / WRITE_END : 0;
  let px = lineGeom[0]?.x ?? 0;
  let py = lineGeom[0]?.y ?? 0;
  specLines.forEach((l, k) => {
    const p = writing ? Math.min(1, Math.max(0, w * specLines.length - k)) : 0;
    l.style.strokeDashoffset = String(1 - p);
    if (writing && p > 0 && p <= 1 && lineGeom[k]) {
      px = lineGeom[k].x + lineGeom[k].w * p;
      py = lineGeom[k].y;
    }
  });
  if (pencil) pencil.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)})`);

  if (sheet && sheetPath) {
    if (q >= WRITE_END && q < FLY_END) {
      const t = (q - WRITE_END) / (FLY_END - WRITE_END);
      const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; // ease in-out
      const pt = sheetPath.getPointAtLength(e * sheetLen);
      const rot = -12 + e * 40;
      const scale = 1 - Math.max(0, e - 0.75) * 1.6;
      sheet.setAttribute(
        'transform',
        `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${scale.toFixed(2)})`,
      );
      sheet.style.opacity = String(Math.min(1, t * 6, (1 - t) * 8));
    } else {
      sheet.style.opacity = '0';
    }
  }
}

let heroVisible = true;
if (svg) {
  new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe(svg);
}

function frame(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const extra = boost * Math.min(1, dt * 8);
  boost -= extra;
  spin += IDLE_DEG_PER_S * dt + extra;
  root.style.setProperty('--spin', spin.toFixed(2));

  if (svg && heroVisible) {
    const travel = spin * BELT_PER_DEG;
    svg.style.setProperty('--tread', String(-travel));
    svg.style.setProperty('--chain', String(-travel));

    let ram = 0;
    let needle = -120;
    let lit = false;
    crates.forEach((c, i) => {
      const x = x0 + ((((travel + (i * span) / crates.length) % span) + span) % span);
      c.setAttribute('transform', `translate(${x.toFixed(1)} ${crateY})`);
      c.classList.toggle('built', x > buildX);
      c.classList.toggle('ok', x > testX + 4);
      c.style.opacity = String(
        x > x1 - 30 ? Math.max(0, (x1 - x) / 30) : x < x0 + 20 ? (x - x0) / 20 : 1,
      );
      // press comes down when a crate is right under it
      const dBuild = Math.abs(x - buildX);
      if (dBuild < 26) ram = Math.max(ram, (1 - dBuild / 26) * 40);
      // gauge reads the crate under test
      const dTest = Math.abs(x - testX);
      if (dTest < 30) {
        needle = Math.max(needle, -120 + (1 - dTest / 30) * 170);
        lit = lit || dTest < 12;
      }
    });
    const spacing = span / crates.length;
    updateSpec((((travel % spacing) + spacing) % spacing) / spacing);
    svg.style.setProperty('--ram', `${ram.toFixed(1)}px`);
    svg.style.setProperty('--needle', `${needle.toFixed(1)}deg`);
    svg.classList.toggle('lamp-lit', lit);
  }

  requestAnimationFrame(frame);
}

if (!reduceMotion) requestAnimationFrame(frame);
