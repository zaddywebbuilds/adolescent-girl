/**
 * Small key/value store used for webhook idempotency and download counting.
 *
 * Uses Upstash Redis over its REST API when UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN are set. Without them it falls back to memory,
 * which is per-instance and disappears on redeploy: good enough for local
 * testing, not good enough to rely on in production.
 *
 * Nothing here is required to deliver a file. Delivery is proved by the
 * signed token plus a live Paystack check, so an unconfigured store only
 * means webhooks may be processed more than once and download counts are
 * not enforced.
 */

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const storeConfigured = Boolean(url && token);

const memory = new Map<string, { value: string; expiresAt: number }>();

async function redis(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(url!, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Store request failed (${res.status})`);
  const body = (await res.json()) as { result: unknown };
  return body.result;
}

export async function get(key: string): Promise<string | null> {
  if (storeConfigured) {
    const result = await redis(['GET', key]);
    return typeof result === 'string' ? result : null;
  }
  const hit = memory.get(key);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    memory.delete(key);
    return null;
  }
  return hit.value;
}

export async function set(key: string, value: string, ttlSeconds: number) {
  if (storeConfigured) {
    await redis(['SET', key, value, 'EX', ttlSeconds]);
    return;
  }
  memory.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

/** Returns true the first time a key is claimed, false afterwards. */
export async function claimOnce(key: string, ttlSeconds: number): Promise<boolean> {
  if (storeConfigured) {
    const result = await redis(['SET', key, '1', 'NX', 'EX', ttlSeconds]);
    return result === 'OK';
  }
  if (await get(key)) return false;
  await set(key, '1', ttlSeconds);
  return true;
}

export async function increment(key: string, ttlSeconds: number): Promise<number> {
  if (storeConfigured) {
    const value = (await redis(['INCR', key])) as number;
    if (value === 1) await redis(['EXPIRE', key, ttlSeconds]);
    return value;
  }
  const current = Number((await get(key)) ?? '0') + 1;
  await set(key, String(current), ttlSeconds);
  return current;
}
