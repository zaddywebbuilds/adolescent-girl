import { createHash } from 'node:crypto';
import { CURRENCY, PRODUCT_ID, PRODUCT_NAME, optional } from './config';

/**
 * Meta Conversions API. Sends the Purchase event from the server so that
 * sales are still attributed when the browser pixel is blocked.
 *
 * The event ID matches the one the browser sends, so Meta counts one sale,
 * not two. Personal details are hashed before they leave this server, as
 * Meta requires.
 */

function sha256(value: string) {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export type CapiUser = {
  email?: string;
  name?: string;
  fbp?: string;
  fbc?: string;
  ip?: string;
  userAgent?: string;
};

export async function sendPurchaseToMeta(args: {
  eventId: string;
  valueNgn: number;
  reference: string;
  user: CapiUser;
  sourceUrl: string;
}) {
  const pixelId = optional('META_PIXEL_ID');
  const token = optional('META_CAPI_ACCESS_TOKEN');
  if (!pixelId || !token) return { sent: false, reason: 'not configured' };

  const [firstName, ...rest] = (args.user.name ?? '').split(' ').filter(Boolean);

  const userData: Record<string, unknown> = {};
  if (args.user.email) userData.em = [sha256(args.user.email)];
  if (firstName) userData.fn = [sha256(firstName)];
  if (rest.length) userData.ln = [sha256(rest.join(' '))];
  if (args.user.fbp) userData.fbp = args.user.fbp;
  if (args.user.fbc) userData.fbc = args.user.fbc;
  if (args.user.ip) userData.client_ip_address = args.user.ip;
  if (args.user.userAgent) userData.client_user_agent = args.user.userAgent;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: args.eventId,
        event_source_url: args.sourceUrl,
        action_source: 'website',
        user_data: userData,
        custom_data: {
          currency: CURRENCY,
          value: args.valueNgn,
          content_ids: [PRODUCT_ID],
          content_name: PRODUCT_NAME,
          content_type: 'product',
          num_items: 1,
          order_id: args.reference,
        },
      },
    ],
  };

  const testCode = optional('META_TEST_EVENT_CODE');
  if (testCode) payload.test_event_code = testCode;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      console.error('Meta CAPI rejected the event', await res.text());
      return { sent: false, reason: 'rejected' };
    }
    return { sent: true };
  } catch (err) {
    // Never let a tracking failure break a sale.
    console.error('Meta CAPI request failed', err);
    return { sent: false, reason: 'request failed' };
  }
}
