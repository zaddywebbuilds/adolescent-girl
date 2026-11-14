import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Loader2, Lock, X } from 'lucide-react';
import { product, priceLabel, formatNaira } from '../config/site';
import { getAttribution, trackCtaClick, trackInitiateCheckout } from '../lib/analytics';
import { Button } from './ui';

type CheckoutContextValue = {
  /** Opens the checkout dialog. `source` identifies which CTA was used. */
  open: (source: string) => void;
};

const CheckoutContext = createContext<CheckoutContextValue>({ open: () => {} });

export function useCheckout() {
  return useContext(CheckoutContext);
}

type Status = 'idle' | 'submitting' | 'error';

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState('unknown');

  const open = useCallback((from: string) => {
    setSource(from);
    setIsOpen(true);
    trackCtaClick(from);
    trackInitiateCheckout(from);
  }, []);

  return (
    <CheckoutContext.Provider value={{ open }}>
      {children}
      {isOpen && <CheckoutDialog source={source} onClose={() => setIsOpen(false)} />}
    </CheckoutContext.Provider>
  );
}

function CheckoutDialog({
  source,
  onClose,
}: {
  source: string;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, input, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (cleanName.length < 2) {
      setError('Please enter your name so we know who the order belongs to.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setError('Please enter a valid email address. Your download link is sent there.');
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          source,
          attribution: getAttribution(),
        }),
      });

      // A non-JSON reply means the API is missing or erroring. The buyer
      // should never see a parser message, so fall back to plain words.
      let data: { authorization_url?: string; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok || !data.authorization_url) {
        throw new Error(
          data.message ??
            'We could not start the payment right now. Please try again in a moment.',
        );
      }

      // Paystack takes over from here. Verification happens server side
      // when the visitor returns to /order-success.
      window.location.href = data.authorization_url;
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error
          ? err.message
          : 'We could not start the payment. Please try again.',
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-plum-dark/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-cta">Secure checkout</p>
            <h2 id="checkout-title" className="mt-2 text-2xl">
              {product.shortTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="-mr-2 -mt-2 rounded-full p-2 text-charcoal/50 transition hover:bg-cream hover:text-plum"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 flex items-baseline justify-between rounded-2xl bg-cream px-4 py-3">
          <span className="text-sm text-charcoal/70">
            {product.format}, one-time payment
          </span>
          <span className="font-serif text-2xl text-plum">{priceLabel}</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="checkout-name" className="block text-sm font-medium">
              Your name
            </label>
            <input
              id="checkout-name"
              ref={firstFieldRef}
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-base outline-none transition focus:border-cta"
              required
            />
          </div>

          <div>
            <label htmlFor="checkout-email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="checkout-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="checkout-email-help"
              className="mt-1.5 w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-base outline-none transition focus:border-cta"
              required
            />
            <p id="checkout-email-help" className="mt-1.5 text-sm text-charcoal/60">
              Your download link is sent to this address.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-rose-soft px-4 py-3 text-sm text-plum"
            >
              {error}
            </p>
          )}

          <Button type="submit" full disabled={status === 'submitting'}>
            {status === 'submitting' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Taking you to Paystack
              </>
            ) : (
              `Pay ${formatNaira(product.priceNgn)} securely`
            )}
          </Button>

          <p className="flex items-center justify-center gap-2 text-center text-sm text-charcoal/60">
            <Lock className="h-4 w-4" aria-hidden="true" />
            Payment is handled by Paystack. We never see your card details.
          </p>
        </form>
      </div>
    </div>
  );
}
