import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { Shell } from '../components/ui';
import { business, delivery, product } from '../config/site';
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
  const reference = params.get('reference') ?? params.get('trxref');
  const firstName = params.get('name')?.trim();

  useEffect(() => {
    if (!reference) return;
    trackPurchase({
      reference,
      eventId: `purchase_${reference}`,
      value: product.priceNgn,
      currency: product.currency,
    });
  }, [reference]);

  if (!reference) {
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

          <div className="mt-8 rounded-2xl bg-cream p-5 text-left text-sm text-charcoal/75">
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
