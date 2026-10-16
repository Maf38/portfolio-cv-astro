/** Prefix a public asset path with the configured base (GitHub Pages sub-path). */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Minimal inline markdown: [text](url) and **bold**. Input is our own trusted content. */
export function inlineMd(s: string): string {
  return escapeHtml(s)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a class="prose-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
