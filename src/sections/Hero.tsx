import { Check, ShieldCheck } from 'lucide-react';
import { BookMockup } from '../components/BookMockup';
import { useCheckout } from '../components/Checkout';
import { Eyebrow, Shell } from '../components/ui';
import { priceLabel, product } from '../config/site';

const benefits = [
  'Understand puberty and periods with less confusion.',
  'Build confidence, self-respect, and healthy boundaries.',
  'Learn about friendships, emotions, and personal safety.',
  'Explore growing up through relatable stories and activities.',
];

export function Hero() {
  const { open } = useCheckout();

  return (
    <section className="relative overflow-hidden bg-cream pt-8 pb-12 md:pt-12 md:pb-16">
      {/* soft organic background shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-24 h-[26rem] w-[26rem] rounded-full bg-rose-soft/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-[24rem] w-[24rem] rounded-full bg-sage-soft/70 blur-3xl"
      />

      <Shell className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <Eyebrow>
            For girls aged {product.ageRange} &nbsp;|&nbsp; A guide for growing up
          </Eyebrow>

          <h1 className="mt-4 text-[2.1rem] leading-[1.12] sm:text-5xl lg:text-[3.4rem]">
            Growing Up Comes With Questions.
            <br className="hidden sm:block" /> Help Your Daughter{' '}
            <span className="relative whitespace-nowrap text-cta">
              Find Answers
              <svg
                viewBox="0 0 220 12"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute -bottom-1.5 left-0 h-2.5 w-full text-gold"
              >
                <path
                  d="M2 8c40-5 86-6 134-4 28 1 54 3 82 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* On small screens the cover sits directly under the headline, so the
              message is read first and the product is still seen immediately. */}
          <BookMockup
            variant="angled"
            priority
            className="mx-auto mt-6 w-[min(15rem,56vw)] lg:hidden"
          />

          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-charcoal/80 md:text-lg">
            From her first period to friendships, confidence, personal safety, and
            understanding her changing body, growing up brings questions she may not
            always know how to ask.
          </p>
          <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-charcoal/80 md:text-lg">
            Give her a thoughtful, practical guide that helps her understand herself,
            build confidence, recognise unsafe situations, and navigate adolescence with
            greater awareness.
          </p>

          <ul className="mt-6 space-y-2.5">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-soft">
                  <Check className="h-3.5 w-3.5 text-plum" aria-hidden="true" />
                </span>
                <span className="text-[0.975rem] leading-relaxed text-charcoal/85 md:text-base">
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="font-serif text-4xl text-plum md:text-[2.75rem]">
              {priceLabel}
            </span>
            <span className="text-sm text-charcoal/65">
              One-time purchase &nbsp;|&nbsp; {product.format}
            </span>
          </div>

          <div id="hero-cta" className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => open('hero')}
              className="btn btn-primary w-full sm:w-auto"
            >
              Get the Guide for {priceLabel}
            </button>
            <a href="#inside" className="btn btn-secondary w-full sm:w-auto">
              See What&rsquo;s Inside
            </a>
          </div>

          <p className="mt-4 flex items-center gap-2 text-sm text-charcoal/60">
            <ShieldCheck className="h-4 w-4 text-sage" aria-hidden="true" />
            Secure online payment. Download after purchase.
          </p>
        </div>

        <div className="hidden lg:block">
          <BookMockup
            variant="angled"
            priority
            className="mx-auto w-full lg:max-w-[26rem]"
          />
        </div>
      </Shell>
    </section>
  );
}
