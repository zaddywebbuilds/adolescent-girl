import { DOWNLOAD_TTL_MINUTES, SITE_URL } from './config';
import { sendDownloadEmail } from './email';
import { sendPurchaseToMeta, type CapiUser } from './meta';
import { createDownloadToken, purchaseEventId, type PaystackTransaction } from './paystack';
import { claimOnce } from './store';

/**
 * Everything that happens once a transaction is confirmed paid.
 *
 * Called from both the verify endpoint (when the buyer returns from
 * Paystack) and the webhook (when Paystack calls us). Each side effect is
 * claimed once per reference, so whichever arrives first does the work and
 * the other skips it.
 */
export async function fulfilOrder(
  tx: PaystackTransaction,
  user: CapiUser = {},
): Promise<{ downloadUrl: string; eventId: string; emailSent: boolean }> {
  const token = createDownloadToken(tx.reference);
  const downloadUrl = `${SITE_URL}/api/download?token=${encodeURIComponent(token)}`;
  const eventId = purchaseEventId(tx.reference);

  const name =
    (tx.metadata?.customer_name as string | undefined) ?? user.name ?? '';
  const email = tx.customer?.email ?? user.email ?? '';

  let emailSent = false;
  if (email) {
    const shouldSend = await safeClaim(`email:${tx.reference}`, 60 * 60 * 24 * 30);
    if (shouldSend) {
      const result = await sendDownloadEmail({
        to: email,
        name,
        reference: tx.reference,
        downloadUrl,
        expiresInMinutes: DOWNLOAD_TTL_MINUTES,
      });
      emailSent = result.sent;
      // A send that never happened must not block a later retry.
      if (!result.sent) await releaseClaim(`email:${tx.reference}`);
    }
  }

  const shouldReport = await safeClaim(`capi:${tx.reference}`, 60 * 60 * 24 * 30);
  if (shouldReport) {
    await sendPurchaseToMeta({
      eventId,
      valueNgn: tx.amount / 100,
      reference: tx.reference,
      user: { ...user, email: email || undefined, name: name || undefined },
      sourceUrl: `${SITE_URL}/order-success`,
    });
  }

  return { downloadUrl, eventId, emailSent };
}

async function safeClaim(key: string, ttl: number) {
  try {
    return await claimOnce(key, ttl);
  } catch {
    // Without a working store we would rather act twice than not at all.
    return true;
  }
}

async function releaseClaim(key: string) {
  try {
    const { set } = await import('./store');
    await set(key, '', 1);
  } catch {
    /* ignore */
  }
}
