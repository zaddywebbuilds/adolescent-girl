import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { previewPages } from '../config/content';
import { asset } from '../lib/asset';

/**
 * Horizontal page preview. Swipes on touch, arrow buttons on desktop,
 * and opens a larger view in a lightbox. Images are lazy loaded and sized
 * so the layout does not shift while they arrive.
 */
export function PreviewCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight')
        setLightbox((i) => (i === null ? null : Math.min(i + 1, previewPages.length - 1)));
      if (e.key === 'ArrowLeft')
        setLightbox((i) => (i === null ? null : Math.max(i - 1, 0)));
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [lightbox]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('li');
    const step = card ? card.clientWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="relative mt-9">
      <ul
        ref={trackRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {previewPages.map((page, i) => (
          <li
            key={page.page}
            className="w-[70vw] shrink-0 snap-center sm:w-[46vw] md:w-[300px]"
          >
            <button
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative block w-full overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-soft transition hover:shadow-lift"
              aria-label={`Open a larger view of ${page.label}, page ${page.page}`}
            >
              <img
                src={asset(`/images/preview/page-${String(page.page).padStart(3, '0')}.webp`)}
                alt={page.alt}
                width={900}
                height={1350}
                loading="lazy"
                decoding="async"
                className="aspect-[2/3] w-full object-cover object-top"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-plum-dark/85 to-transparent px-4 pt-10 pb-3 text-left">
                <span className="text-sm font-medium text-cream">{page.label}</span>
                <ZoomIn
                  className="h-4 w-4 text-cream/80 transition group-hover:text-cream"
                  aria-hidden="true"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-2 hidden justify-center gap-3 md:flex">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          aria-label="Show previous pages"
          className="rounded-full border border-charcoal/20 p-3 text-plum transition hover:border-plum disabled:opacity-35"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          aria-label="Show more pages"
          className="rounded-full border border-charcoal/20 p-3 text-plum transition hover:border-plum disabled:opacity-35"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-charcoal/55 md:hidden">
        Swipe to see more pages
      </p>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-plum-dark/85 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setLightbox(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Page preview, ${previewPages[lightbox].label}`}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close preview"
            className="absolute top-4 right-4 rounded-full bg-cream/15 p-3 text-cream transition hover:bg-cream/25"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <img
            src={asset(`/images/preview/page-${String(previewPages[lightbox].page).padStart(3, '0')}.webp`)}
            alt={previewPages[lightbox].alt}
            width={900}
            height={1350}
            className="max-h-[86vh] w-auto rounded-lg bg-white shadow-2xl"
          />
          <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setLightbox(Math.max(lightbox - 1, 0))}
              disabled={lightbox === 0}
              aria-label="Previous page"
              className="rounded-full bg-cream/15 p-3 text-cream transition hover:bg-cream/25 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="text-sm text-cream/80">
              {lightbox + 1} of {previewPages.length}
            </span>
            <button
              type="button"
              onClick={() =>
                setLightbox(Math.min(lightbox + 1, previewPages.length - 1))
              }
              disabled={lightbox === previewPages.length - 1}
              aria-label="Next page"
              className="rounded-full bg-cream/15 p-3 text-cream transition hover:bg-cream/25 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
