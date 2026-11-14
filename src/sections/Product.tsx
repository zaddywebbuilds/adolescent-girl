import { BookOpen, ListChecks, Sparkles } from 'lucide-react';
import { BookShowcase } from '../components/BookMockup';
import { useCheckout } from '../components/Checkout';
import { LearnIcon } from '../components/Icons';
import { PreviewCarousel } from '../components/PreviewCarousel';
import { Eyebrow, Reveal, Section, SectionHeading, Shell } from '../components/ui';
import { chapters, learnItems, quotes } from '../config/content';
import { product } from '../config/site';

export function IntroducingBook() {
  const { open } = useCheckout();

  const includes = [
    `${product.chapters} practical chapters`,
    `${product.pages} pages in the current PDF`,
    'Relatable fictional stories',
    'Reflection activities in every chapter',
    'Guidance on puberty, hygiene, relationships, and safety',
  ];

  return (
    <Section id="inside" tone="plum" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-cta/40 blur-3xl"
      />
      <Shell className="relative">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <Eyebrow tone="light">Meet the guide</Eyebrow>
            <h2 className="mt-4 text-[1.9rem] text-cream sm:text-4xl md:text-[2.75rem]">
              {product.title}
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-cream/80 md:text-lg">
              A practical growing-up guide designed to help girls understand their
              bodies, emotions, friendships, boundaries, and future.
            </p>

            <ul className="mt-8 space-y-3">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-cream/90">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                  />
                  <span className="text-[0.975rem] md:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-7 max-w-md text-sm leading-relaxed text-cream/60">
              Health and safety information carries numbered references to{' '}
              {product.referenceCount} public sources, including the NHS, the World
              Health Organization, UNICEF Nigeria and the NSPCC.
            </p>

            <button
              type="button"
              onClick={() => open('introducing')}
              className="btn btn-onplum mt-8 w-full sm:w-auto"
            >
              Get Your Copy Today
            </button>
          </div>

          <Reveal>
            <BookShowcase />
          </Reveal>
        </div>
      </Shell>
    </Section>
  );
}

export function WhatSheWillLearn() {
  return (
    <Section tone="cream">
      <Shell>
        <SectionHeading
          eyebrow="Inside the guide"
          title="Important Lessons for Every Stage of Growing Up"
          intro={`${product.chapters} chapters, grouped into the six areas parents ask about most.`}
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {learnItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <article className="card group h-full p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-soft text-plum transition group-hover:bg-rose-soft">
                  <LearnIcon name={item.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl">{item.title}</h3>
                <p className="mt-3 text-[0.975rem] leading-relaxed text-charcoal/75">
                  {item.body}
                </p>
                <p className="mt-5 text-xs tracking-wide text-charcoal/45 uppercase">
                  {item.chapters.length > 1 ? 'Chapters' : 'Chapter'}{' '}
                  {item.chapters.join(', ')}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <details className="mx-auto mt-8 max-w-3xl rounded-card border border-charcoal/10 bg-white px-6 py-5">
          <summary className="cursor-pointer font-medium text-plum">
            See the full list of {product.chapters} chapters
          </summary>
          <ol className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {chapters.map((c) => (
              <li key={c.n} className="flex gap-3 text-[0.95rem] text-charcoal/80">
                <span className="font-serif text-gold">
                  {String(c.n).padStart(2, '0')}
                </span>
                <span>{c.title}</span>
              </li>
            ))}
          </ol>
        </details>
      </Shell>
    </Section>
  );
}

export function BookPreview() {
  const { open } = useCheckout();

  return (
    <Section id="preview" tone="deep">
      <Shell>
        <SectionHeading
          eyebrow="Take a look inside"
          title="Real Pages From the Guide"
          intro="Explore the thoughtful stories, practical explanations, and activities that make this guide useful."
        />
        <PreviewCarousel />
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => open('preview')}
            className="btn btn-primary w-full sm:w-auto"
          >
            Get the Complete Guide
          </button>
          <p className="mt-3 text-sm text-charcoal/55">
            A selection of pages is shown here. The full guide has{' '}
            {product.pages} pages.
          </p>
        </div>
      </Shell>
    </Section>
  );
}

const features = [
  {
    icon: BookOpen,
    image: '/images/spread-safety.webp',
    imageAlt:
      'An open spread showing a story from school alongside a Reflect and Write activity.',
    title: 'Real-Life Stories',
    body: 'Relatable fictional experiences help readers understand everyday situations and choices.',
    example:
      'In Chapter 5, Leila notices a stain during the school break and does not have a pad. A friend helps her ask a teacher, who finds supplies and explains what to do next.',
  },
  {
    icon: Sparkles,
    image: '/images/kitchen-conversation-800.webp',
    imageAlt:
      'A teenage girl talking with her mother at a table, both relaxed and listening.',
    title: 'Clear Explanations',
    body: 'Important topics are explained in straightforward, respectful language.',
    example:
      'Chapter 2 explains the difference between the vulva and the vagina, and notes that these are ordinary body words a girl can use when speaking to a doctor or nurse.',
  },
  {
    icon: ListChecks,
    image: '/images/goals-notebook.webp',
    imageAlt:
      'A notebook page headed My Growing Up Goals with ticked items such as build my confidence.',
    title: 'Practical Activities',
    body: 'Reflection prompts, useful sentences, and simple exercises help girls think through what they are learning.',
    example:
      'Every chapter ends with a Try This activity, such as Make Your Period Plan, Practise One Boundary, and A Letter to Your Future Self.',
  },
];

export function HowItWorks() {
  return (
    <Section tone="white">
      <Shell>
        <SectionHeading
          eyebrow="How the guide works"
          title="More Than Just Information. A Guide She Can Return To."
        />

        <div className="mt-7 space-y-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <article className="grid items-center gap-5 rounded-card bg-cream p-6 sm:grid-cols-[auto_1fr_11rem] sm:gap-7 md:p-7 lg:grid-cols-[auto_1fr_15rem]">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-cta shadow-soft sm:h-14 sm:w-14">
                  <f.icon className="h-6 w-6" aria-hidden="true" strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl">{f.title}</h3>
                  <p className="mt-2 text-[0.975rem] leading-relaxed text-charcoal/80 md:text-base">
                    {f.body}
                  </p>
                  <p className="mt-3 border-l-2 border-rose pl-4 text-[0.95rem] leading-relaxed text-charcoal/65 italic">
                    {f.example}
                  </p>
                </div>
                <img
                  src={f.image}
                  alt={f.imageAlt}
                  width={440}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  className="hidden h-full max-h-32 w-full rounded-xl object-cover object-top shadow-soft sm:block"
                />
              </article>
            </Reveal>
          ))}
        </div>

        <figure className="mx-auto mt-10 max-w-2xl text-center">
          <blockquote className="font-serif text-xl leading-relaxed text-plum md:text-2xl">
            &ldquo;{quotes[0].text}&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm text-charcoal/55">
            From Chapter {quotes[0].chapter} of the guide
          </figcaption>
        </figure>
      </Shell>
    </Section>
  );
}
