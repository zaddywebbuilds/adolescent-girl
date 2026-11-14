import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { renderHead } from './lib/seo';
import { notFoundMeta, routes } from './routes';

/** Used by scripts/prerender.mjs to produce static HTML for each route. */
export function render(path: string) {
  const meta = routes.find((r) => r.path === path) ?? notFoundMeta;
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, head: renderHead(meta) };
}

export { routes } from './routes';
