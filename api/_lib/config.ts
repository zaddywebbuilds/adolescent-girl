/**
 * Server-side configuration. Reads environment variables once and fails
 * loudly when something required is missing, rather than taking a payment
 * the site cannot honour.
 *
 * Nothing in this file may be imported from the browser bundle.
 */

export function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new ConfigError(`Missing environment variable: ${name}`);
  return value;
}

export function optional(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export class ConfigError extends Error {}

export const PRODUCT_PRICE_NGN = Number(process.env.PRODUCT_PRICE_NGN ?? '2500');
export const PRODUCT_ID = process.env.PRODUCT_ID ?? 'dear-daughter-ebook-v1';
export const PRODUCT_NAME =
  process.env.PRODUCT_NAME ?? "Dear Daughter, Let's Talk About Growing Up";
export const CURRENCY = 'NGN';

/** Amount Paystack must have collected, in kobo. */
export const PRICE_IN_KOBO = Math.round(PRODUCT_PRICE_NGN * 100);

export const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:5173').replace(
  /\/$/,
  '',
);

export const SUPPORT_EMAIL = optional('SUPPORT_EMAIL');

/** Minutes a download link stays valid. */
export const DOWNLOAD_TTL_MINUTES = Number(process.env.DOWNLOAD_TTL_MINUTES ?? '60');

/** True while a Paystack test secret key is in use. */
export function isTestMode() {
  return (process.env.PAYSTACK_SECRET_KEY ?? '').startsWith('sk_test');
}

export function json(body: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  });
}

export function errorResponse(message: string, status = 400) {
  return json({ message }, status);
}
