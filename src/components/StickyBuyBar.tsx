import { useEffect, useState } from 'react';
import { priceLabel, product } from '../config/site';
import { useCheckout } from './Checkout';

/**
 * Mobile purchase bar. Appears once the visitor has scrolled past the hero
 * CTA so it never covers the first call to action, and hides itself while
 * the on-screen keyboard is likely to be open.
 */
export function StickyBuyBar() {
  const { open } = useCheckout();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const check = () => {
      frame = 0;
      const anchor = document.getElementById('hero-cta');
      if (!anchor) return;
      // Show the bar once the hero CTA has scrolled off the top of the screen,
      // so it never competes with the first call to action.
      setVisible(anchor.getBoundingClientRect().bottom < 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-white/95 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-base text-plum">
            {product.shortTitle}
          </p>
          <p className="text-sm font-semibold text-charcoal/70">
            {priceLabel} &middot; {product.format}
          </p>
        </div>
        <button
          type="button"
          onClick={() => open('sticky-bar')}
          className="btn btn-primary min-h-12 shrink-0 px-5 py-3 text-sm"
          tabIndex={visible ? 0 : -1}
        >
          Get the Guide
        </button>
      </div>
    </div>
  );
}
