import { Check, Lock } from 'lucide-react';
import { BookMockup } from '../components/BookMockup';
import { useCheckout } from '../components/Checkout';
import { FaqAccordion } from '../components/FaqAccordion';
import { Reveal, Section, SectionHeading, Shell, Sprig } from '../components/ui';
import { steps } from '../config/content';
import { payments, priceLabel, product } from '../config/site';
import { asset } from '../lib/asset';

const included = [
  'Complete digital ebook',
  `${product.chapters} educational chapters`,
  'Practical reflection activities',
  'Realistic fictional stories',
  'A bonus guide for parents and caregivers',
  'Readable on phones, tablets, and computers',
];

export function PurchaseBlock() {
  const { open } = useCheckout();

  return (
    <Section id="buy" tone="cream">
      <Shell>
        <div className="card overflow-hidden p-0">
          <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:p-14">
            <div className="flex h-full items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-rose-soft/55 to-sage-soft/55 px-8 py-10 sm:px-10">
              <BookMockup
                variant="angled"
                className="mx-auto w-[min(17rem,66vw)] lg:w-full lg:max-w-[20rem]"
              />
            </div>

            <div>
              <h2 className="text-[1.65rem] sm:text-3xl md:text-[2.2rem]">
                One Decision Today. Answers She Will Carry for Years.
              </h2>

              <p className="mt-4 font-serif text-lg text-cta">{product.title}</p>

              <ul className="mt-7 space-y-2.5">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-sage"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span className="text-[0.975rem] text-charcoal/85">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-serif text-4xl text-plum md:text-5xl">
                  {priceLabel}
                </span>
                <span className="text-sm text-charcoal/65">One-time payment</span>
              </div>

              <button
                type="button"
                onClick={() => open('purchase-block')}
                className="btn btn-primary mt-7 w-full"
              >
                Get the Guide for {priceLabel}
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-sm text-charcoal/60">
                <Lock className="h-4 w-4" aria-hidden="true" />
                Secure checkout &nbsp;|&nbsp; {product.format} delivery
              </p>

              <p className="mt-5 text-center text-xs tracking-wide text-charcoal/45 uppercase">
                Pay with {payments.methods.join(' · ')} via Paystack
              </p>
            </div>
          </div>
        </div>
      </Shell>
    </Section>
  );
}

export function HowToGetIt() {
  return (
    <Section tone="white">
      <Shell>
        <SectionHeading
          eyebrow="Simple to buy"
          title="Get Your Copy in Three Simple Steps"
        />

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <li className="flex gap-5 rounded-card bg-cream p-5 sm:p-6">
                  <span className="font-serif text-4xl leading-none text-rose">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl">{step.title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-charcoal/75">
                      {step.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
            <p className="pt-1 text-[0.95rem] text-charcoal/60">
              No physical delivery required.
            </p>
          </ol>

          <Reveal>
            <img
              src={asset('/images/devices.webp')}
              alt={`${product.title} shown on a tablet and a phone`}
              width={472}
              height={428}
              loading="lazy"
              decoding="async"
              className="mx-auto w-full max-w-sm rounded-card shadow-soft"
            />
          </Reveal>
        </div>
      </Shell>
    </Section>
  );
}

export function Faqs() {
  return (
    <Section id="faqs" tone="deep">
      <Shell>
        <SectionHeading eyebrow="Questions" title="Frequently Asked Questions" />
        <FaqAccordion />
      </Shell>
    </Section>
  );
}

export function FinalCta() {
  const { open } = useCheckout();

  return (
    <Section tone="plum" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
      />
      <Shell className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div className="text-center lg:text-left">
          <Sprig className="mx-auto h-9 w-9 text-gold lg:mx-0" />

          <h2 className="mt-4 text-[1.8rem] text-cream sm:text-4xl md:text-[2.6rem]">
            Her Growing-Up Journey Deserves Care, Knowledge, and Confidence.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-cream/80 lg:mx-0">
            Give her the answers you may not have been given at her age, and the
            confidence to carry them.
          </p>

          <button
            type="button"
            onClick={() => open('final-cta')}
            className="btn btn-onplum mt-7 w-full px-10 text-lg sm:w-auto"
          >
            Get the Guide for {priceLabel}
          </button>

          <p className="mt-3 text-sm text-cream/60">
            Digital ebook &nbsp;|&nbsp; One-time purchase
          </p>

          <p className="mt-6 max-w-lg font-serif text-lg text-cream/75 italic">
            Because every girl deserves clear information, respect, and support as she
            grows.
          </p>
        </div>

        <Reveal>
          <img
            src={asset('/images/girl-reading-book.webp')}
            alt="A girl lying on her bed, smiling as she reads the guide."
            width={496}
            height={512}
            loading="lazy"
            decoding="async"
            className="mx-auto w-full max-w-sm rounded-card object-cover shadow-lift"
          />
        </Reveal>
      </Shell>
    </Section>
  );
}
