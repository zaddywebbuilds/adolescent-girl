import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analytics } from '../config/site';
import { getConsent, hasTagsConfigured, setConsent } from '../lib/analytics';

/**
 * Nigeria Data Protection Act: measurement tags that are not strictly
 * necessary only load after the visitor agrees. The bar is skipped entirely
 * when no tracking IDs are configured, so the launch page stays clean.
 */
export function ConsentBar() {
  const [needed, setNeeded] = useState(false);

  useEffect(() => {
    if (!hasTagsConfigured() || !analytics.requireConsent) return;
    setNeeded(getConsent() === null);
  }, []);

  if (!needed) return null;

  const choose = (value: 'granted' | 'denied') => {
    setConsent(value);
    setNeeded(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie choices"
      className="fixed inset-x-3 bottom-3 z-[60] rounded-2xl border border-charcoal/10 bg-white p-4 shadow-lift sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-sm"
    >
      <p className="text-sm leading-relaxed text-charcoal/80">
        We would like to use measurement cookies to see which adverts bring
        visitors here. Nothing loads unless you agree.{' '}
        <Link to="/privacy-policy" className="underline hover:text-plum">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => choose('granted')}
          className="btn btn-primary min-h-11 flex-1 px-4 py-2.5 text-sm"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose('denied')}
          className="btn btn-secondary min-h-11 flex-1 px-4 py-2.5 text-sm"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
