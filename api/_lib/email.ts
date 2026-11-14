import { PRODUCT_NAME, SITE_URL, SUPPORT_EMAIL, optional } from './config';

/**
 * Transactional email for the download link.
 *
 * Uses Resend when RESEND_API_KEY and EMAIL_FROM are set. Without them it
 * reports that nothing was sent, and the order-success page tells the buyer
 * to download the file there and then. It never pretends to have sent mail.
 */
export async function sendDownloadEmail(args: {
  to: string;
  name: string;
  reference: string;
  downloadUrl: string;
  expiresInMinutes: number;
}) {
  const key = optional('RESEND_API_KEY');
  const from = optional('EMAIL_FROM');
  if (!key || !from) return { sent: false, reason: 'not configured' };

  const firstName = args.name.split(' ')[0] || 'there';
  const supportLine = SUPPORT_EMAIL
    ? `<p style="margin:24px 0 0;color:#6b6270;font-size:14px">Need help? Reply to this email or write to ${SUPPORT_EMAIL}.</p>`
    : '';

  const html = `
<div style="font-family:ui-sans-serif,system-ui,sans-serif;background:#faf7f2;padding:32px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">
    <p style="margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#603348">Your download is ready</p>
    <h1 style="margin:12px 0 0;font-family:Georgia,serif;font-size:26px;color:#482c40">Thank you, ${escapeHtml(firstName)}.</h1>
    <p style="margin:16px 0 0;color:#29252a;line-height:1.6">
      Your payment is confirmed and your copy of ${escapeHtml(PRODUCT_NAME)} is ready to download.
    </p>
    <p style="margin:28px 0">
      <a href="${args.downloadUrl}" style="display:inline-block;background:#603348;color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:700">Download your ebook</a>
    </p>
    <p style="margin:0;color:#6b6270;font-size:14px;line-height:1.6">
      This private link expires in ${args.expiresInMinutes} minutes. Save the file to your device so you can read it any time.
      Your order reference is ${escapeHtml(args.reference)}.
    </p>
    ${supportLine}
    <p style="margin:24px 0 0;color:#9a8f9c;font-size:12px">${SITE_URL}</p>
  </div>
</div>`.trim();

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${key}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: args.to,
        subject: `Your download: ${PRODUCT_NAME}`,
        html,
        ...(SUPPORT_EMAIL ? { reply_to: SUPPORT_EMAIL } : {}),
      }),
    });
    if (!res.ok) {
      console.error('Email provider rejected the message', await res.text());
      return { sent: false, reason: 'rejected' };
    }
    return { sent: true };
  } catch (err) {
    console.error('Email request failed', err);
    return { sent: false, reason: 'request failed' };
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
