import { Reveal, Section, SectionHeading, Shell, Sprig } from '../components/ui';
import { LearnIcon } from '../components/Icons';
import { asset } from '../lib/asset';

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
    body: 'Her body is changing and she has questions. If she cannot ask you, she will ask someone who may not know the answer.',
  },
  {
    icon: 'friendship' as const,
    title: 'Her Confidence and Friendships',
    body: 'Classmates, group chats and what she sees online all shape how she sees herself, and how easily she gives in to pressure.',
  },
  {
    icon: 'safety' as const,
    title: 'Her Safety and Boundaries',
    body: 'She needs to know what is not normal, that it is never her fault, and that she can tell a trusted adult without being blamed.',
  },
];

export function EmotionalConnection() {
  return (
    <Section tone="cream" className="pt-4 md:pt-8">
      <Shell>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-14">
          <Reveal className="order-2 lg:order-1 lg:h-full">
            <img
              src={asset('/images/mother-daughter-sofa-800.webp')}
              srcSet={`${asset('/images/mother-daughter-sofa-800.webp')} 800w, ${asset('/images/mother-daughter-sofa.webp')} 1400w`}
              sizes="(min-width: 1024px) 48vw, 92vw"
              alt="A mother and her teenage daughter sitting together on a sofa, talking and smiling."
              width={800}
              height={533}
              loading="lazy"
              decoding="async"
              className="h-full max-h-[34rem] w-full rounded-card object-cover shadow-soft"
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
              In many Nigerian homes, these conversations are postponed until something
              happens. Not because parents do not care, but because nobody sat us down
              either, and the right words are hard to find.
            </p>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-charcoal/80">
              So she asks her friends. She asks her phone. This guide gives her somewhere
              better to look, and gives you an easier place to start the conversation.
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
          She does not need to have it all figured out. She needs clear answers,
          reassurance, and to know she can come to you.
        </p>
      </Shell>
    </Section>
  );
}
