const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---------- Scroll progress (navbar ∞) + active section ---------- */
const navLinks = new Map<string, HTMLElement>();
document.querySelectorAll<HTMLElement>('[data-nav-link]').forEach((a) => {
  navLinks.set(a.dataset.navLink!, a);
});

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = root.scrollHeight - innerHeight;
    root.style.setProperty('--scroll', String(max > 0 ? Math.min(1, scrollY / max) : 0));
    ticking = false;
  });
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach((a) => a.classList.remove('active'));
      navLinks.get(entry.target.id)?.classList.add('active');
    }
  },
  { rootMargin: '-45% 0px -50% 0px' },
);
document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

/* ---------- Pipeline rail length (for the travelling pulse) ---------- */
const rail = document.querySelector<HTMLElement>('.pipeline');
if (rail) {
  const setRail = () => rail.style.setProperty('--rail', `${rail.offsetHeight}px`);
  setRail();
  new ResizeObserver(setRail).observe(rail);
}

/* ---------- Theme toggle with circular reveal ---------- */
function applyTheme(next: string) {
  root.setAttribute('data-theme', next);
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* storage unavailable */
  }
}
document.querySelector<HTMLButtonElement>('.theme-toggle')?.addEventListener('click', (ev) => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void> };
  };
  if (!doc.startViewTransition || reduceMotion) {
    applyTheme(next);
    return;
  }
  const x = ev.clientX || innerWidth - 40;
  const y = ev.clientY || 40;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  doc
    .startViewTransition(() => applyTheme(next))
    .ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        {
          duration: 650,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
});

/* ---------- Mobile menu ---------- */
const menuBtn = document.querySelector<HTMLButtonElement>('.menu-btn');
const sheet = document.querySelector<HTMLElement>('.mobile-sheet');
function setMenu(open: boolean) {
  if (!menuBtn || !sheet) return;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  sheet.hidden = !open;
}
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
sheet?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a')) setMenu(false);
});
addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

/* ---------- Card glow follows the cursor ---------- */
if (finePointer) {
  document.querySelectorAll<HTMLElement>('[data-glow]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ---------- Material ripple ---------- */
document.querySelectorAll<HTMLElement>('[data-ripple]').forEach((el) => {
  el.addEventListener('pointerdown', (e) => {
    if (reduceMotion) return;
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = `${size}px`;
    span.style.left = `${e.clientX - r.left - size / 2}px`;
    span.style.top = `${e.clientY - r.top - size / 2}px`;
    el.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  });
});

/* ---------- Copy email ---------- */
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  const label = btn.querySelector('.copy-label');
  const original = label?.textContent ?? '';
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy ?? '');
      btn.classList.add('copied');
      if (label) label.textContent = btn.dataset.copiedLabel ?? 'Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        if (label) label.textContent = original;
      }, 1800);
    } catch {
      /* clipboard unavailable */
    }
  });
});

/* ---------- Background parallax + spotlight (desktop) ---------- */
if (finePointer && !reduceMotion && innerWidth >= 1024) {
  const bg = document.querySelector<HTMLElement>('.bg');
  let raf = 0;
  addEventListener(
    'pointermove',
    (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!bg) return;
        bg.style.setProperty('--sx', `${e.clientX}px`);
        bg.style.setProperty('--sy', `${e.clientY}px`);
        bg.style.setProperty('--px', `${(e.clientX / innerWidth - 0.5) * -30}px`);
        bg.style.setProperty('--py', `${(e.clientY / innerHeight - 0.5) * -30}px`);
      });
    },
    { passive: true },
  );
}

/* ---------- Close the CV menu on outside click / Escape ---------- */
const cvMenu = document.querySelector<HTMLDetailsElement>('.cv-menu');
if (cvMenu) {
  document.addEventListener('click', (e) => {
    if (cvMenu.open && !cvMenu.contains(e.target as Node)) cvMenu.open = false;
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cvMenu.open = false;
  });
}
