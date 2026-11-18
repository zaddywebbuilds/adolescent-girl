import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { renderHead } from './lib/seo';
import { notFoundMeta, routes } from './routes';

/** Used by scripts/prerender.mjs to produce static HTML for each route. */
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '');

export function render(path: string) {
  const meta = routes.find((r) => r.path === path) ?? notFoundMeta;
  // StaticRouter matches the location against the basename, so the location
  // has to carry it. Passing a bare "/" here silently renders nothing.
  const html = renderToString(
    <StrictMode>
      <StaticRouter basename={BASENAME} location={`${BASENAME}${path}`}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, head: renderHead(meta) };
}

export { routes } from './routes';
