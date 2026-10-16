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
    svg.style.setProperty('--ram', `${ram.toFixed(1)}px`);
    svg.style.setProperty('--needle', `${needle.toFixed(1)}deg`);
    svg.classList.toggle('lamp-lit', lit);
  }

  requestAnimationFrame(frame);
}

if (!reduceMotion) requestAnimationFrame(frame);
