import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { AnnouncementBar, Header } from './components/Header';
import { Footer } from './components/Footer';
import { ConsentBar } from './components/ConsentBar';
import { CheckoutProvider } from './components/Checkout';
import { Shell } from './components/ui';
import { notFoundMeta, routes } from './routes';
import { applyClientHead } from './lib/seo';
import { boot, captureAttribution, trackPageView } from './lib/analytics';

function NotFound() {
  return (
    <main className="bg-cream py-24">
      <Shell className="max-w-xl text-center">
        <p className="eyebrow text-cta">404</p>
        <h1 className="mt-4 text-4xl">We could not find that page</h1>
        <p className="mt-4 text-charcoal/75">
          The link may be out of date. The guide is still right here.
        </p>
        <Link to="/" className="btn btn-primary mt-8">
          Back to the guide
        </Link>
      </Shell>
    </main>
  );
}

/** Keeps the document head, scroll position and page views in step with the router. */
function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const match = routes.find((r) => r.path === pathname);
    applyClientHead(match ?? notFoundMeta);
    trackPageView(pathname);

    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  useEffect(() => {
    captureAttribution();
    boot();
  }, []);

  return null;
}

export default function App() {
  return (
    <CheckoutProvider>
      <RouteEffects />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-plum focus:px-5 focus:py-3 focus:text-cream"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <div id="main">
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <ConsentBar />
    </CheckoutProvider>
  );
}
