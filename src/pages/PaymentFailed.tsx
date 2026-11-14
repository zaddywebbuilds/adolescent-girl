import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useCheckout } from '../components/Checkout';
import { Shell } from '../components/ui';
import { business, priceLabel } from '../config/site';

export default function PaymentFailed() {
  const { open } = useCheckout();
  const [params] = useSearchParams();
  const reference = params.get('reference');

  return (
    <main className="bg-cream py-16 md:py-24">
      <Shell className="max-w-2xl">
        <div className="card p-8 text-center md:p-12">
          <AlertCircle
            className="mx-auto h-11 w-11 text-cta"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <h1 className="mt-6 text-[1.8rem] sm:text-3xl">
            Your payment did not go through
          </h1>
          <p className="mt-4 text-charcoal/75">
            Nothing has been charged for this attempt. You can try again below, and your
            details are not kept from the previous attempt.
          </p>

          <button
            type="button"
            onClick={() => open('payment-failed-retry')}
            className="btn btn-primary mt-8 w-full sm:w-auto"
          >
            Try again for {priceLabel}
          </button>

          <div className="mt-8 rounded-2xl bg-cream p-5 text-left text-sm leading-relaxed text-charcoal/75">
            <p className="font-medium text-plum">If money has already left your account</p>
            <p className="mt-2">
              Do not pay a second time. A transaction can be confirmed a few minutes
              after it is taken. Keep your reference
              {reference ? ` (${reference})` : ''} and contact{' '}
              {business.supportEmail ?? 'support, once the contact address is published'}
              , and we will check it and send your download link.
            </p>
          </div>

          <Link to="/" className="mt-8 inline-block text-sm underline hover:text-plum">
            Back to the guide
          </Link>
        </div>
      </Shell>
    </main>
  );
}
