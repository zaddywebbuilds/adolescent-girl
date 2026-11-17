/**
 * Builds a URL for a file in /public.
 *
 * The site is served from a GitHub Pages project sub-path, so a bare
 * "/images/cover.webp" would resolve to the domain root and 404. Vite puts
 * the configured base in BASE_URL at build time, for both the browser bundle
 * and the prerender step, so this works in dev, in the static HTML, and after
 * client-side navigation.
 */
const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export function asset(path: string): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
