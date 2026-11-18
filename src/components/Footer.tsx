import { Link } from 'react-router-dom';
import { business, product } from '../config/site';
import { Wordmark } from './Icons';
import { Shell } from './ui';

const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms and Conditions', to: '/terms-and-conditions' },
  { label: 'Refund Policy', to: '/refund-policy' },
  { label: 'Delivery Policy', to: '/delivery-policy' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-plum-dark text-cream/80">
      <Shell className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2 font-serif text-2xl text-cream">
              <Wordmark />
              {business.name}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              A practical digital guide helping girls aged {product.ageRange} understand
              puberty, periods, confidence, personal safety and growing up.
            </p>
          </div>

          <nav aria-label="Legal">
            <h2 className="text-sm font-semibold tracking-wide text-cream uppercase">
              Policies
            </h2>
            <ul className="mt-3 text-sm">
              {legalLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="block py-1.5 transition hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-cream uppercase">
              Contact
            </h2>
            <ul className="mt-3 text-sm">
              {business.supportEmail ? (
                <li>
                  <a
                    href={`mailto:${business.supportEmail}`}
                    className="block py-1.5 transition hover:text-cream"
                  >
                    {business.supportEmail}
                  </a>
                </li>
              ) : (
                <li className="text-cream/50">Support contact to be added</li>
              )}
              {business.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                    className="transition hover:text-cream"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {business.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    className="transition hover:text-cream"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-9 border-t border-cream/15 pt-6 text-xs text-cream/60">
          <p>
            &copy; {year} {business.legalName ?? business.name}. All rights reserved.
          </p>
          <p className="mt-2 max-w-3xl">
            This guide provides general education. It does not replace parental
            supervision, safeguarding support, or advice from a qualified health
            professional.
          </p>
        </div>
      </Shell>
    </footer>
  );
}
