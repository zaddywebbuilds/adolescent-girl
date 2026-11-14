import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { business } from '../config/site';
import { useCheckout } from './Checkout';
import { Wordmark } from './Icons';
import { Shell } from './ui';

const navLinks = [
  { label: "What's Inside", href: '/#inside' },
  { label: 'Preview', href: '/#preview' },
  { label: 'FAQs', href: '/#faqs' },
];

export function AnnouncementBar() {
  return (
    <div className="bg-plum text-cream">
      <p className="shell py-2 text-center text-[0.62rem] leading-snug tracking-[0.1em] uppercase sm:text-xs sm:tracking-[0.12em]">
        Helping girls grow with knowledge, confidence, and care.
      </p>
    </div>
  );
}

export function Header() {
  const { open } = useCheckout();
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onLanding = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? 'border-charcoal/10 bg-cream/95 backdrop-blur'
          : 'border-transparent bg-cream'
      }`}
    >
      <Shell className="flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-serif text-xl text-plum sm:text-[1.4rem]"
        >
          <Wordmark />
          <span>{business.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={onLanding ? l.href.replace('/', '') : l.href}
              className="text-sm font-medium text-charcoal/80 transition hover:text-plum"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => open('header')}
          className="btn btn-primary min-h-11 px-5 py-2.5 text-sm"
        >
          Get the Guide
        </button>
      </Shell>
    </header>
  );
}
