import { useState } from 'react';
import { Plus } from 'lucide-react';
import { faqs } from '../config/faq';

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto mt-8 max-w-3xl divide-y divide-charcoal/10 overflow-hidden rounded-card border border-charcoal/10 bg-white">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.q}>
            <h3>
              <button
                type="button"
                id={`faq-trigger-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition hover:bg-cream sm:px-7"
              >
                <span className="font-sans text-base font-medium text-plum sm:text-[1.0625rem]">
                  {faq.q}
                </span>
                <Plus
                  aria-hidden="true"
                  className={`mt-0.5 h-5 w-5 shrink-0 text-cta transition-transform duration-200 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-trigger-${i}`}
              hidden={!isOpen}
              className="px-5 pb-6 sm:px-7"
            >
              <p className="max-w-prose text-[0.975rem] leading-relaxed text-charcoal/75">
                {faq.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
