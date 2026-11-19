import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Download, Users } from 'lucide-react';
import { Shell } from '../components/ui';
import { business, community, delivery, product } from '../config/site';
import { asset } from '../lib/asset';
import { trackPurchase } from '../lib/analytics';

/**
 * Thank-you page.
 *
 * Reached only from the Paystack success callback, which fires after a
 * charge succeeds. There is no server, so the payment is not re-checked
 * here: the page trusts the callback and hands over a file that is public
 * anyway. The wording stays accurate about that.
 */
export default function OrderSuccess() {
  const [params] = useSearchParams();
  const urlReference = params.get('reference') ?? params.get('trxref');

  // Paystack normally returns the reference in the URL. If it did not, fall
  // back to the order recorded just before the popup opened, so a buyer is
  // never stranded without their download. Read after mount, so the
  // prerendered HTML and the first client render agree.
  const [pending, setPending] = useState<{ reference?: string; name?: string } | null>(
    null,
  );
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    if (!urlReference) {
      try {
        const raw = sessionStorage.getItem('dd_pending_order');
        if (raw) setPending(JSON.parse(raw));
      } catch {
        /* private mode */
      }
    }
    setCheckedStorage(true);
  }, [urlReference]);

  const reference = urlReference ?? pending?.reference ?? null;
  const firstName = (params.get('name') ?? pending?.name ?? '').trim().split(' ')[0];

  useEffect(() => {
    // Only report a sale when Paystack handed the reference back in the URL.
    // The stored fallback can belong to a checkout that was abandoned, and
    // counting those would teach Meta to chase the wrong people.
    if (!urlReference) return;
    trackPurchase({
      reference: urlReference,
      eventId: `purchase_${urlReference}`,
      value: product.priceNgn,
      currency: product.currency,
    });
  }, [urlReference]);

  if (!reference) {
    if (!checkedStorage) return <main className="bg-cream py-24" />;
    return (
      <main className="bg-cream py-16 md:py-24">
        <Shell className="max-w-2xl">
          <div className="card p-10 text-center">
            <AlertCircle
              className="mx-auto h-10 w-10 text-cta"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <h1 className="mt-6 text-2xl">No order to show</h1>
            <p className="mt-3 text-charcoal/70">
              This page appears after a completed payment. If money has left your
              account but you never saw a download, contact{' '}
              {business.supportEmail ?? 'support'} with your payment reference.
            </p>
            <Link to="/" className="btn btn-primary mt-8">
              Back to the guide
            </Link>
          </div>
        </Shell>
      </main>
    );
  }

  return (
    <main className="bg-cream py-16 md:py-24">
      <Shell className="max-w-2xl">
        <div className="card p-8 text-center md:p-12">
          <CheckCircle2
            className="mx-auto h-12 w-12 text-sage"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <h1 className="mt-6 text-[1.9rem] sm:text-4xl">
            Thank you{firstName ? `, ${firstName}` : ''}.
          </h1>
          <p className="mt-4 text-charcoal/75">
            Your payment went through and your copy of {product.title} is ready.
          </p>

          <a
            href={asset(delivery.file)}
            download={delivery.saveAs}
            className="btn btn-primary mt-8 w-full"
          >
            <Download className="h-5 w-5" aria-hidden="true" />
            Download your ebook
          </a>

          <p className="mt-3 text-sm text-charcoal/60">
            Save the file to your device now so you can read it any time. Paystack
            has also emailed you a receipt.
          </p>

          {community.url && (
            <div className="mt-8 rounded-2xl border border-sage/50 bg-sage-soft/60 p-6 text-left">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-cta shadow-soft">
                <Users className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-serif text-xl text-plum">
                Join other parents raising daughters
              </h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-charcoal/75">
                You are invited to our private {community.platform} group, where
                parents and guardians share what is working, ask the awkward
                questions, and support each other through these years.
              </p>
              <a
                href={community.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary mt-5 w-full border-plum/40 bg-white sm:w-auto"
              >
                Join the {community.platform} group
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-cream p-5 text-left text-sm text-charcoal/75">
            <p>
              <strong className="text-plum">Order reference:</strong> {reference}
            </p>
            <p className="mt-2">
              Keep this reference. It is how we find your payment if you need help.
            </p>
          </div>

          <p className="mt-6 text-sm text-charcoal/60">
            Trouble downloading?{' '}
            {business.supportEmail ? (
              <a
                href={`mailto:${business.supportEmail}?subject=Download%20help%20${reference}`}
                className="underline hover:text-plum"
              >
                Contact support
              </a>
            ) : (
              'Support contact details will be published before launch.'
            )}
          </p>
        </div>
      </Shell>
    </main>
  );
}
