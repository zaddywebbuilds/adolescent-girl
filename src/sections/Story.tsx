import { Reveal, Section, SectionHeading, Shell, Sprig } from '../components/ui';
import { LearnIcon } from '../components/Icons';

const questions = [
  'Why is my body changing?',
  'Is it normal to feel this way?',
  'What should I do when someone makes me uncomfortable?',
  'How do I handle pressure from friends?',
];

const concerns = [
  {
    icon: 'body' as const,
    title: 'Her Changing Body',
    body: 'Puberty, periods, hygiene, and physical development can bring questions that deserve clear, age-appropriate answers.',
  },
  {
    icon: 'friendship' as const,
    title: 'Her Confidence and Friendships',
    body: 'Comparisons, peer pressure, bullying, and changing friendships can affect how she sees herself and relates to others.',
  },
  {
    icon: 'safety' as const,
    title: 'Her Safety and Boundaries',
    body: 'Learning to recognise manipulation, respect personal boundaries, and seek help is an important part of growing up.',
  },
];

export function EmotionalConnection() {
  return (
    <Section tone="cream" className="pt-4 md:pt-8">
      <Shell>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal className="order-2 lg:order-1">
            <img
              src="/images/mother-daughter-sofa-800.webp"
              srcSet="/images/mother-daughter-sofa-800.webp 800w, /images/mother-daughter-sofa.webp 1400w"
              sizes="(min-width: 1024px) 48vw, 92vw"
              alt="A mother and her teenage daughter sitting together on a sofa, talking and smiling."
              width={800}
              height={533}
              loading="lazy"
              decoding="async"
              className="w-full rounded-card object-cover shadow-soft"
            />
          </Reveal>

          <div className="order-1 lg:order-2">
            <Sprig className="h-9 w-9 text-gold" />
            <h2 className="mt-4 text-[1.75rem] sm:text-4xl md:text-[2.6rem]">
              Some Questions Are Hard for a Daughter to Ask.
            </h2>

            <ul className="mt-7 space-y-3 border-l-2 border-rose pl-5">
              {questions.map((q) => (
                <li
                  key={q}
                  className="font-serif text-lg text-plum italic md:text-xl"
                >
                  &ldquo;{q}&rdquo;
                </li>
              ))}
            </ul>

            <p className="mt-7 text-[1.0625rem] leading-relaxed text-charcoal/80">
              Growing up can feel exciting, confusing, and sometimes overwhelming. While
              parents want to guide their daughters, finding the right words for every
              conversation is not always easy.
            </p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-charcoal/80">
              That is why this guide was created: to make important growing-up
              conversations easier to begin and understand.
            </p>

            <a href="#inside" className="btn btn-secondary mt-8">
              Discover What&rsquo;s Inside
            </a>
          </div>
        </div>
      </Shell>
    </Section>
  );
}

export function ProblemAndSolution() {
  return (
    <Section tone="deep">
      <Shell>
        <SectionHeading
          eyebrow="What she is navigating"
          title="She Is Growing Up in a World Full of Questions."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {concerns.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <article className="card h-full p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-soft text-plum">
                  <LearnIcon name={c.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl">{c.title}</h3>
                <p className="mt-3 text-[0.975rem] leading-relaxed text-charcoal/75">
                  {c.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-9 max-w-2xl text-center font-serif text-xl leading-relaxed text-plum md:text-2xl">
          She does not need to have everything figured out. She deserves clear
          information, reassurance, and people she can turn to.
        </p>
      </Shell>
    </Section>
  );
}
