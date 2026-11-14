import {
  ConfigError,
  PRODUCT_ID,
  PRODUCT_NAME,
  PRODUCT_PRICE_NGN,
  SITE_URL,
  errorResponse,
  isTestMode,
  json,
} from '../_lib/config';
import { initializeTransaction } from '../_lib/paystack';
import { increment } from '../_lib/store';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Starts a Paystack transaction.
 *
 * The amount is taken from the server environment, never from the request,
 * so the price cannot be altered by editing the page.
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

  let body: {
    name?: string;
    email?: string;
    source?: string;
    attribution?: Record<string, string>;
  };

  try {
    body = (await req.json()) as typeof body;
  } catch {
    return errorResponse('We could not read your details. Please try again.');
  }

  const name = (body.name ?? '').trim().slice(0, 120);
  const email = (body.email ?? '').trim().toLowerCase().slice(0, 254);

  if (name.length < 2) return errorResponse('Please enter your name.');
  if (!EMAIL_RE.test(email)) return errorResponse('Please enter a valid email address.');

  // Light rate limit so the endpoint cannot be used to spam Paystack.
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  try {
    const attempts = await increment(`init:${ip}`, 3600);
    if (attempts > 15) {
      return errorResponse(
        'Too many attempts from this connection. Please wait a few minutes and try again.',
        429,
      );
    }
  } catch {
    // A store outage must not block a sale.
  }

  try {
    const tx = await initializeTransaction({
      email,
      callbackUrl: `${SITE_URL}/order-success`,
      metadata: {
        customer_name: name,
        product_id: PRODUCT_ID,
        product_name: PRODUCT_NAME,
        price_ngn: PRODUCT_PRICE_NGN,
        cta_source: body.source ?? 'unknown',
        attribution: body.attribution ?? {},
        custom_fields: [
          {
            display_name: 'Customer name',
            variable_name: 'customer_name',
            value: name,
          },
          {
            display_name: 'Product',
            variable_name: 'product',
            value: PRODUCT_NAME,
          },
        ],
      },
    });

    return json({
      authorization_url: tx.authorization_url,
      reference: tx.reference,
      testMode: isTestMode(),
    });
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error(err.message);
      return errorResponse(
        'Payments are not switched on for this site yet. Please try again later.',
        503,
      );
    }
    console.error('Paystack initialise failed', err);
    return errorResponse(
      'We could not start the payment. Please try again in a moment.',
      502,
    );
  }
}
