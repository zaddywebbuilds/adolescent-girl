import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { Shell } from '../components/ui';
import { business, formatNaira, product } from '../config/site';
import { getMetaCookies, trackPurchase } from '../lib/analytics';

type VerifyResponse = {
  status: 'success' | 'pending' | 'failed';
  reference?: string;
  amount?: number;
  currency?: string;
  customerName?: string;
  email?: string;
  downloadUrl?: string;
  expiresInMinutes?: number;
  eventId?: string;
  emailSent?: boolean;
  message?: string;
};

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const reference = params.get('reference') ?? params.get('trxref');
  const [state, setState] = useState<'loading' | 'done' | 'error'>('loading');
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const verified = useRef(false);

  useEffect(() => {
    if (verified.current) return;
    verified.current = true;

    if (!reference) {
      setState('error');
      setError('No payment reference was supplied, so there is nothing to confirm.');
      return;
    }

    const cookies = getMetaCookies();
    const query = new URLSearchParams({ reference });
    if (cookies.fbp) query.set('fbp', cookies.fbp);
    if (cookies.fbc) query.set('fbc', cookies.fbc);

    fetch(`/api/paystack/verify?${query.toString()}`)
      .then(async (res) => {
        let body: VerifyResponse;
        try {
          body = (await res.json()) as VerifyResponse;
        } catch {
          throw new Error(
            'We could not reach the payment service. Please refresh in a moment, and keep your reference.',
          );
        }
        if (!res.ok) throw new Error(body.message ?? 'We could not confirm the payment.');
        return body;
      })
      .then((body) => {
        setData(body);
        setState('done');
        // Purchase fires only here, after the server has verified the transaction.
        if (body.status === 'success' && body.reference && body.eventId) {
          trackPurchase({
            reference: body.reference,
            eventId: body.eventId,
            value: (body.amount ?? product.priceNgn * 100) / 100,
            currency: body.currency ?? product.currency,
          });
        }
      })
      .catch((err: unknown) => {
        setState('error');
        setError(
          err instanceof Error ? err.message : 'We could not confirm the payment.',
        );
      });
  }, [reference]);

  return (
    <main className="bg-cream py-16 md:py-24">
      <Shell className="max-w-2xl">
        {state === 'loading' && (
          <div className="card p-10 text-center">
            <Loader2
              className="mx-auto h-9 w-9 animate-spin text-cta"
              aria-hidden="true"
            />
            <h1 className="mt-6 text-2xl">Confirming your payment</h1>
            <p className="mt-3 text-charcoal/70">
              This takes a moment. Please do not close this page.
            </p>
          </div>
        )}

        {state === 'done' && data?.status === 'success' && (
          <div className="card p-8 text-center md:p-12">
            <CheckCircle2
              className="mx-auto h-12 w-12 text-sage"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <h1 className="mt-6 text-[1.9rem] sm:text-4xl">Thank you{data.customerName ? `, ${data.customerName.split(' ')[0]}` : ''}.</h1>
            <p className="mt-4 text-charcoal/75">
              Your payment of{' '}
              {formatNaira((data.amount ?? product.priceNgn * 100) / 100)} is confirmed.
              Your copy of {product.title} is ready.
            </p>

            {data.downloadUrl && (
              <>
                <a href={data.downloadUrl} className="btn btn-primary mt-8 w-full">
                  <Download className="h-5 w-5" aria-hidden="true" />
                  Download your ebook
                </a>
                <p className="mt-3 text-sm text-charcoal/60">
                  This private link expires in {data.expiresInMinutes ?? 60} minutes.
                  Save the file to your device rather than relying on the link.
                </p>
              </>
            )}

            <div className="mt-8 rounded-2xl bg-cream p-5 text-left text-sm text-charcoal/75">
              <p>
                <strong className="text-plum">Order reference:</strong>{' '}
                {data.reference}
              </p>
              {data.email && (
                <p className="mt-2">
                  <strong className="text-plum">Receipt email:</strong> {data.email}
                </p>
              )}
              <p className="mt-2">
                {data.emailSent
                  ? 'We have also emailed this download link to you.'
                  : 'Email delivery is not connected yet, so please download the file now and keep your reference.'}
              </p>
            </div>

            <p className="mt-6 text-sm text-charcoal/60">
              Trouble downloading?{' '}
              {business.supportEmail ? (
                <a
                  href={`mailto:${business.supportEmail}?subject=Download%20help%20${data.reference}`}
                  className="underline hover:text-plum"
                >
                  Contact support
                </a>
              ) : (
                'Support contact details will be published before launch.'
              )}
            </p>
          </div>
        )}

        {state === 'done' && data?.status === 'pending' && (
          <div className="card p-10 text-center">
            <Loader2 className="mx-auto h-9 w-9 text-gold" aria-hidden="true" />
            <h1 className="mt-6 text-2xl">Your payment is still processing</h1>
            <p className="mt-3 text-charcoal/70">
              Paystack has not confirmed this transaction yet. Do not pay again. Refresh
              this page in a minute, and keep your reference {data.reference}.
            </p>
          </div>
        )}

        {(state === 'error' || (state === 'done' && data?.status === 'failed')) && (
          <div className="card p-10 text-center">
            <AlertCircle
              className="mx-auto h-10 w-10 text-cta"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <h1 className="mt-6 text-2xl">We could not confirm this payment</h1>
            <p className="mt-3 text-charcoal/70">
              {error ?? data?.message ?? 'The transaction was not successful.'}
            </p>
            <p className="mt-3 text-sm text-charcoal/60">
              If money has left your account, do not pay again. Keep your reference
              {reference ? ` (${reference})` : ''} and contact support.
            </p>
            <Link to="/" className="btn btn-primary mt-8">
              Back to the guide
            </Link>
          </div>
        )}
      </Shell>
    </main>
  );
}
