import {
  ConfigError,
  DOWNLOAD_TTL_MINUTES,
  errorResponse,
  json,
} from '../_lib/config';
import { fulfilOrder } from '../_lib/fulfil';
import { fetchTransaction, isPaidInFull } from '../_lib/paystack';

const PENDING = new Set(['ongoing', 'pending', 'processing', 'queued']);

/**
 * Confirms a transaction with Paystack and, when it is genuinely paid,
 * returns the private download link.
 *
 * The browser never decides whether a payment succeeded. Returning to
 * /order-success proves nothing on its own: this endpoint asks Paystack.
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') return errorResponse('Method not allowed', 405);

  const url = new URL(req.url);
  const reference = url.searchParams.get('reference')?.trim();
  if (!reference) return errorResponse('No payment reference was supplied.');

  try {
    const tx = await fetchTransaction(reference);

    if (!isPaidInFull(tx)) {
      if (PENDING.has(tx.status)) {
        return json({ status: 'pending', reference: tx.reference });
      }
      return json({
        status: 'failed',
        reference: tx.reference,
        message:
          tx.status === 'abandoned'
            ? 'This payment was not completed.'
            : 'This transaction was not successful.',
      });
    }

    const { downloadUrl, eventId, emailSent } = await fulfilOrder(tx, {
      fbp: url.searchParams.get('fbp') ?? undefined,
      fbc: url.searchParams.get('fbc') ?? undefined,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
      userAgent: req.headers.get('user-agent') ?? undefined,
    });

    return json({
      status: 'success',
      reference: tx.reference,
      amount: tx.amount,
      currency: tx.currency,
      email: tx.customer?.email,
      customerName: (tx.metadata?.customer_name as string | undefined) ?? null,
      downloadUrl,
      expiresInMinutes: DOWNLOAD_TTL_MINUTES,
      eventId,
      emailSent,
    });
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error(err.message);
      return errorResponse('This site is not fully configured yet.', 503);
    }
    console.error('Verification failed', err);
    return errorResponse(
      'We could not confirm this payment. Please contact support with your reference.',
      502,
    );
  }
}
