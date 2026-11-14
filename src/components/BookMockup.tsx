import { product } from '../config/site';

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
  const width = variant === 'angled' ? 497 : 500;
  const height = variant === 'angled' ? 512 : 428;

  return (
    <div className={className}>
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-rose-soft via-cream to-sage-soft blur-[2px]"
        />
        <img
          src={src}
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

/** Cover plus two interior spreads, for the product introduction section. */
export function BookShowcase({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-5 sm:items-center">
        <img
          src="/images/cover-flat.webp"
          alt={coverAlt}
          width={500}
          height={428}
          loading="lazy"
          decoding="async"
          className="rounded-xl shadow-lift sm:col-span-2"
        />
        <div className="grid gap-4 sm:col-span-3">
          <img
            src="/images/spread-periods.webp"
            alt="An open spread from Chapter 5, Periods Without Fear or Shame, showing key takeaways."
            width={544}
            height={428}
            loading="lazy"
            decoding="async"
            className="rounded-xl shadow-soft"
          />
          <img
            src="/images/spread-reflection.webp"
            alt="An open spread from Chapter 2 beside a Reflection Time activity page."
            width={505}
            height={273}
            loading="lazy"
            decoding="async"
            className="rounded-xl shadow-soft"
          />
        </div>
      </div>
    </div>
  );
}

/** Phone and tablet mockup, used to show the guide reads on any device. */
export function DeviceMockup({ className }: { className?: string }) {
  return (
    <img
      src="/images/devices.webp"
      alt={`${product.title} shown on a tablet and a phone`}
      width={472}
      height={428}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
