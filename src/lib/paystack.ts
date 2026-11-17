/**
 * Paystack Inline, loaded on demand.
 *
 * A static site has no server, so this uses the PUBLIC key only. That key
 * cannot move money or read transactions: it can only open a payment for an
 * amount the page states. Paystack itself collects the card details, on its
 * own iframe, and tells us when the charge succeeded.
 *
 * What this cannot do, and what the page must therefore never claim:
 * the amount is set in the browser, and the success callback is the only
 * confirmation we get. Both are good enough to deliver a file that is
 * already public, and neither is good enough to gate anything valuable.
 * Reconcile real revenue in the Paystack dashboard, not from this site.
 */
import { payments, product } from '../config/site';

type PaystackHandler = { openIframe: () => void };

type SetupOptions = {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  channels?: string[];
  metadata?: Record<string, unknown>;
  onClose: () => void;
  callback: (response: { reference: string; status?: string }) => void;
};

declare global {
  interface Window {
    PaystackPop?: { setup: (options: SetupOptions) => PaystackHandler };
  }
}

const SCRIPT_SRC = 'https://js.paystack.co/v1/inline.js';

let loading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.PaystackPop) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    const script = existing ?? document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => {
      loading = null;
      reject(new Error('Could not reach Paystack.'));
    });
    if (!existing) document.head.appendChild(script);
  });

  return loading;
}

/** A readable, unique reference so an order can be found in the dashboard. */
export function makeReference() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `DD-${stamp}-${rand}`;
}

export async function openPaystack(args: {
  name: string;
  email: string;
  source: string;
  attribution: Record<string, string | undefined>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}): Promise<void> {
  if (!payments.publicKey) {
    throw new Error(
      'Payments are not switched on for this site yet. Please try again later.',
    );
  }

  await loadScript();
  if (!window.PaystackPop) throw new Error('Could not reach Paystack.');

  const reference = makeReference();

  const handler = window.PaystackPop.setup({
    key: payments.publicKey,
    email: args.email,
    amount: product.priceNgn * 100, // Paystack counts in kobo
    currency: product.currency,
    ref: reference,
    channels: payments.channels,
    metadata: {
      customer_name: args.name,
      product_id: product.sku,
      product_name: product.title,
      cta_source: args.source,
      attribution: args.attribution,
      custom_fields: [
        {
          display_name: 'Customer name',
          variable_name: 'customer_name',
          value: args.name,
        },
        {
          display_name: 'Product',
          variable_name: 'product',
          value: product.title,
        },
      ],
    },
    onClose: args.onClose,
    callback: (response) => {
      args.onSuccess(response.reference ?? reference);
    },
  });

  handler.openIframe();
}
