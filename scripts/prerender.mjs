/**
 * Renders every route to static HTML after the client build.
 *
 * Search engines and social crawlers get the full sales copy and metadata
 * in the first response, rather than an empty div, and the first paint does
 * not wait for JavaScript. The page is hydrated afterwards.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const { render, routes } = await import(
  pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href
);

const template = await readFile(join(dist, 'index.html'), 'utf8');

let siteUrl = 'https://example.com';
try {
  const config = await readFile(join(root, 'src', 'config', 'site.ts'), 'utf8');
  const match = config.match(/url:\s*'([^']+)'/);
  if (match) siteUrl = match[1].replace(/\/$/, '');
} catch {
  /* fall back to the placeholder */
}

async function writePage(path, html) {
  const out =
    path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1), 'index.html');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html, 'utf8');
  return out;
}

const written = [];

for (const route of routes) {
  const { html, head } = render(route.path);
  const page = template
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html);
  written.push(await writePage(route.path, page));
  console.log(`  prerendered ${route.path}`);
}

// 404 for hosts that serve a custom error page.
{
  const { html, head } = render('/404-not-found');
  await writeFile(
    join(dist, '404.html'),
    template.replace('<!--app-head-->', head).replace('<!--app-html-->', html),
    'utf8',
  );
  console.log('  prerendered 404.html');
}

// sitemap.xml: public pages only, no transactional routes.
const indexable = routes.filter((r) => !r.noindex && r.sitemap);
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map(
    (r) => `  <url>
    <loc>${siteUrl}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.sitemap.changefreq}</changefreq>
    <priority>${r.sitemap.priority.toFixed(1)}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
await writeFile(join(dist, 'sitemap.xml'), sitemap, 'utf8');

const robots = `User-agent: *
Allow: /
Disallow: /order-success
Disallow: /payment-failed
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;
await writeFile(join(dist, 'robots.txt'), robots, 'utf8');

console.log(`  wrote sitemap.xml and robots.txt for ${siteUrl}`);
console.log(`\nPrerendered ${written.length} routes.`);

if (siteUrl.includes('example.com')) {
  console.warn(
    '\n  WARNING: site.url is still the placeholder. Set the real domain in\n' +
      '  src/config/site.ts before deploying, or canonical URLs and the\n' +
      '  sitemap will point at example.com.\n',
  );
}
