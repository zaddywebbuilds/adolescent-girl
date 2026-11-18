import { Heart, MessageCircle, Repeat } from 'lucide-react';
import { useCheckout } from '../components/Checkout';
import { Eyebrow, Reveal, Section, SectionHeading, Shell } from '../components/ui';
import { ageBands } from '../config/content';
import { asset } from '../lib/asset';

const benefits = [
  {
    icon: MessageCircle,
    text: 'Start the talks that are hard to begin, without the awkwardness.',
  },
  {
    icon: Heart,
    text: 'Support age-appropriate understanding of growing-up challenges.',
  },
  {
    icon: Repeat,
    text: 'Let her read it privately, as many times as she needs.',
  },
];

export function BenefitsForParents() {
  const { open } = useCheckout();

  return (
    <Section tone="cream">
      <Shell>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-14">
          <Reveal className="lg:h-full">
            <img
              src={asset('/images/reading-together-800.webp')}
              srcSet={`${asset('/images/reading-together-800.webp')} 800w, ${asset('/images/reading-together.webp')} 1400w`}
              sizes="(min-width: 1024px) 48vw, 92vw"
              alt="A mother and her teenage daughter reading a book together at a table."
              width={800}
              height={533}
              loading="lazy"
              decoding="async"
              className="h-full max-h-[34rem] w-full rounded-card object-cover shadow-soft"
            />
          </Reveal>

          <div>
            <Eyebrow>For parents and guardians</Eyebrow>
            <h2 className="mt-4 text-[1.75rem] sm:text-4xl md:text-[2.6rem]">
              Give Her Guidance She Can Grow With.
            </h2>

            <p className="mt-6 text-[1.0625rem] leading-relaxed text-charcoal/80">
              You cannot be there at school, at the lesson teacher's house, at a
              family gathering, or inside her group chat. That is the honest truth every
              Nigerian parent lives with.
            </p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-charcoal/80">
              What you can do is make sure she is not facing those moments uninformed.
              This guide gives her the words and the knowledge, and gives you a natural
              way to open the conversation at home.
            </p>

            <ul className="mt-8 space-y-4">
              {benefits.map((b) => (
                <li key={b.text} className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-cta shadow-soft">
                    <b.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="pt-2 text-[0.975rem] leading-relaxed text-charcoal/85">
                    {b.text}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => open('parents')}
              className="btn btn-primary mt-9 w-full sm:w-auto"
            >
              Give Her the Guide
            </button>
          </div>
        </div>
      </Shell>
    </Section>
  );
}

export function AgeAppropriateness() {
  return (
    <Section tone="sage">
      <Shell>
        <SectionHeading
          eyebrow="A note about age"
          title="Different Ages. Different Questions."
          intro="Every girl grows at her own pace. Some chapters will matter to her this term, others will matter in a year or two."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {ageBands.map((band, i) => (
            <Reveal key={band.range} delay={i * 80}>
              <article className="card h-full overflow-hidden">
                <img
                  src={asset(band.image)}
                  alt={band.alt}
                  width={800}
                  height={420}
                  loading="lazy"
                  decoding="async"
                  className="h-36 w-full object-cover sm:h-32"
                />
                <div className="p-6">
                  <p className="font-serif text-2xl text-plum">{band.range}</p>
                  <p className="mt-1 text-sm text-charcoal/55">{band.school}</p>
                  <div className="rule mt-3 h-px w-16" aria-hidden="true" />
                  <p className="mt-3 text-[0.975rem] leading-relaxed text-charcoal/75">
                    {band.focus}
                  </p>
                  <p className="mt-4 text-xs tracking-wide text-charcoal/45 uppercase">
                    {band.chapters}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-[0.975rem] leading-relaxed text-charcoal/75">
            Parents and caregivers can review the contents, guide younger readers toward
            suitable sections, and make space for questions as they arise. These are
            suggested reading pathways, not restrictions.
          </p>
          <p className="mt-4 text-[0.975rem] leading-relaxed text-charcoal/75">
            Where a younger reader needs accurate safety or health information, she
            should be able to get it.
          </p>
        </div>
      </Shell>
    </Section>
  );
}
