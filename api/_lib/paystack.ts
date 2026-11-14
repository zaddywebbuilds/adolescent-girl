import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  CURRENCY,
  DOWNLOAD_TTL_MINUTES,
  PRICE_IN_KOBO,
  required,
} from './config';

const API = 'https://api.paystack.co';

export type PaystackTransaction = {
  id: number;
  status: string;
  reference: string;
  amount: number;
  currency: string;
  paid_at: string | null;
  customer: { email: string };
  metadata?: Record<string, unknown> | null;
};

function secretKey() {
  return required('PAYSTACK_SECRET_KEY');
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${secretKey()}`,
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const body = (await res.json()) as { status: boolean; message: string; data: T };
  if (!res.ok || !body.status) {
    throw new Error(body.message || `Paystack request failed (${res.status})`);
  }
  return body.data;
}

export async function initializeTransaction(args: {
  email: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}) {
  return call<{ authorization_url: string; access_code: string; reference: string }>(
    '/transaction/initialize',
    {
      method: 'POST',
      body: JSON.stringify({
        email: args.email,
        amount: PRICE_IN_KOBO,
        currency: CURRENCY,
        callback_url: args.callbackUrl,
        metadata: args.metadata,
      }),
    },
  );
}

export async function fetchTransaction(reference: string) {
  return call<PaystackTransaction>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
}

/**
 * A transaction counts as paid only when Paystack says it succeeded AND the
 * amount and currency match the product. This stops an attacker paying a
 * smaller amount through a hand-made Paystack link and claiming the file.
 */
export function isPaidInFull(tx: PaystackTransaction) {
  return (
    tx.status === 'success' &&
    tx.currency === CURRENCY &&
    tx.amount >= PRICE_IN_KOBO
  );
}

/** Verifies the x-paystack-signature header against the raw request body. */
export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const expected = createHmac('sha512', secretKey()).update(rawBody).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ------------------------------------------------------------------ *
 * Download tokens
 *
 * A token is reference + expiry, signed with a server-only secret. It
 * carries no file path and cannot be guessed or edited. The download
 * endpoint still re-checks the transaction with Paystack before serving
 * the file, so a leaked token alone is not enough for long.
 * ------------------------------------------------------------------ */

function signingSecret() {
  return required('DOWNLOAD_SIGNING_SECRET');
}

function b64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function createDownloadToken(reference: string, ttlMinutes = DOWNLOAD_TTL_MINUTES) {
  const expires = Date.now() + ttlMinutes * 60_000;
  const payload = b64url(`${reference}.${expires}`);
  const sig = b64url(createHmac('sha256', signingSecret()).update(payload).digest());
  return `${payload}.${sig}`;
}

export function readDownloadToken(
  token: string,
): { reference: string; expired: boolean } | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;

  const expected = b64url(createHmac('sha256', signingSecret()).update(payload).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const decoded = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
    .toString('utf8')
    .split('.');
  if (decoded.length !== 2) return null;

  const [reference, expires] = decoded;
  return { reference, expired: Number(expires) < Date.now() };
}

/** Deterministic Meta event ID so browser and server events deduplicate. */
export function purchaseEventId(reference: string) {
  return `purchase_${reference}`;
}
