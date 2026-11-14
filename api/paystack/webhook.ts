import { errorResponse, json } from '../_lib/config';
import { fulfilOrder } from '../_lib/fulfil';
import {
  fetchTransaction,
  isPaidInFull,
  verifyWebhookSignature,
  type PaystackTransaction,
} from '../_lib/paystack';
import { claimOnce } from '../_lib/store';

/**
 * Paystack webhook.
 *
 * Set the endpoint to https://your-domain/api/paystack/webhook in the
 * Paystack dashboard. Every request is checked against the signature header
 * before anything is believed, and each reference is only fulfilled once.
 *
 * This is the safety net: if the buyer closes the tab before returning to
 * the site, the webhook still delivers their ebook by email.
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

  // The raw body is required: re-serialising parsed JSON would break the hash.
  const raw = await req.text();

  if (!verifyWebhookSignature(raw, req.headers.get('x-paystack-signature'))) {
    console.warn('Rejected a webhook with an invalid signature');
    return errorResponse('Invalid signature', 401);
  }

  let event: { event?: string; data?: PaystackTransaction };
  try {
    event = JSON.parse(raw);
  } catch {
    return errorResponse('Invalid payload', 400);
  }

  if (event.event !== 'charge.success' || !event.data?.reference) {
    // Acknowledge events we do not act on, so Paystack stops retrying.
    return json({ received: true });
  }

  const reference = event.data.reference;

  try {
    const first = await claimOnce(`webhook:${reference}`, 60 * 60 * 24 * 30);
    if (!first) return json({ received: true, duplicate: true });

    // Trust the API, not the payload, for the amount and status.
    const tx = await fetchTransaction(reference);
    if (!isPaidInFull(tx)) {
      console.warn(`Webhook for ${reference} did not verify as paid in full`);
      return json({ received: true, fulfilled: false });
    }

    await fulfilOrder(tx);
    return json({ received: true, fulfilled: true });
  } catch (err) {
    console.error('Webhook processing failed', err);
    // A 500 makes Paystack retry, which is what we want here.
    return errorResponse('Could not process the event', 500);
  }
}
