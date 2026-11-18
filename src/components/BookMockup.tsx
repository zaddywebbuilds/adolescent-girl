import { product } from '../config/site';
import { asset } from '../lib/asset';

const coverAlt = `Cover of ${product.title}, a guide for girls aged ${product.ageRange}`;

/**
 * Product imagery. The cover art is supplied by the client; these components
 * only frame it. Replace /images/cover-3d.webp and /images/cover-flat.webp
 * with full resolution exports of the approved cover when they are available.
 */
export function BookMockup({
  variant = 'angled',
  className,
  priority = false,
}: {
  variant?: 'angled' | 'flat';
  className?: string;
  priority?: boolean;
}) {
  const src = variant === 'angled' ? '/images/cover-3d.webp' : '/images/cover-flat.webp';
  // Rendered from page one of the finished PDF, so it is always the cover
  // the buyer actually receives.
  const width = 1200;
  const height = 1800;

  return (
    <div className={className}>
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-rose-soft via-cream to-sage-soft blur-[2px]"
        />
        <img
          src={asset(src)}
          alt={coverAlt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          // React 18 passes unknown props through only in lower case
          {...{ fetchpriority: priority ? 'high' : 'auto' }}
          decoding="async"
          className="w-full rounded-xl drop-shadow-[0_26px_40px_rgba(72,44,64,0.28)]"
        />
      </div>
    </div>
  );
}

/** Cover plus two real interior pages, for the product introduction. */
export function BookShowcase({ className }: { className?: string }) {
  const page = (n: number) =>
    `/images/preview/page-${String(n).padStart(3, '0')}.webp`;

  return (
    <div className={className}>
      <div className="grid h-full grid-cols-3 items-center gap-3 sm:gap-4">
        <img
          src={asset('/images/cover-flat.webp')}
          alt={coverAlt}
          width={1200}
          height={1800}
          loading="lazy"
          decoding="async"
          className="col-span-1 w-full rounded-lg shadow-lift"
        />
        <img
          src={asset(page(40))}
          alt="Page 40 of the guide, opening the chapter on periods."
          width={900}
          height={1350}
          loading="lazy"
          decoding="async"
          className="w-full rounded-lg shadow-soft"
        />
        <img
          src={asset(page(22))}
          alt="Page 22 of the guide, opening the chapter on trust, boundaries and staying safe."
          width={900}
          height={1350}
          loading="lazy"
          decoding="async"
          className="w-full rounded-lg shadow-soft"
        />
      </div>
    </div>
  );
}

/** Phone and tablet mockup, used to show the guide reads on any device. */
export function DeviceMockup({ className }: { className?: string }) {
  return (
    <img
      src={asset('/images/devices.webp')}
      alt={`${product.title} shown on a tablet and a phone`}
      width={472}
      height={428}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
