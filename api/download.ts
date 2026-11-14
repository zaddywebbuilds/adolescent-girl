import { readFile } from 'node:fs/promises';
import { ConfigError, errorResponse, optional } from './_lib/config';
import { fetchTransaction, isPaidInFull, readDownloadToken } from './_lib/paystack';
import { increment } from './_lib/store';

const MAX_DOWNLOADS = Number(process.env.MAX_DOWNLOADS_PER_ORDER ?? '8');
const FILENAME = process.env.EBOOK_FILENAME ?? 'Dear-Daughter-Growing-Up-Guide.pdf';

/**
 * Serves the paid PDF.
 *
 * The file is never exposed at a public static URL. Access requires a
 * signed token that only this server can produce, and the transaction is
 * re-checked with Paystack on every request, so a token that leaks cannot
 * be used against an unpaid or refunded order.
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') return errorResponse('Method not allowed', 405);

  const token = new URL(req.url).searchParams.get('token');
  if (!token) return errorResponse('This download link is incomplete.', 400);

  let parsed: ReturnType<typeof readDownloadToken>;
  try {
    parsed = readDownloadToken(token);
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error(err.message);
      return errorResponse('This site is not fully configured yet.', 503);
    }
    throw err;
  }

  if (!parsed) return errorResponse('This download link is not valid.', 403);
  if (parsed.expired) {
    return errorResponse(
      'This download link has expired. Request a new one using your order reference.',
      410,
    );
  }

  try {
    const tx = await fetchTransaction(parsed.reference);
    if (!isPaidInFull(tx)) {
      return errorResponse('No completed payment is attached to this link.', 403);
    }
  } catch (err) {
    console.error('Could not re-check the transaction', err);
    return errorResponse('We could not verify this download. Please try again.', 502);
  }

  try {
    const count = await increment(`downloads:${parsed.reference}`, 60 * 60 * 24 * 30);
    if (count > MAX_DOWNLOADS) {
      return errorResponse(
        'This link has been used too many times. Contact support and we will restore your access.',
        429,
      );
    }
  } catch {
    // Counting is a nicety, not a gate.
  }

  const file = await loadEbook();
  if (!file) {
    console.error(
      'No ebook source configured. Set EBOOK_BLOB_URL or EBOOK_FILE_PATH.',
    );
    return errorResponse(
      'The file is not available right now. Please contact support with your reference.',
      503,
    );
  }

  return new Response(file, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="${FILENAME}"`,
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

/**
 * Reads the PDF from private storage.
 *
 * EBOOK_BLOB_URL should point at a private Vercel Blob (or any storage that
 * needs a credential). EBOOK_FILE_PATH is for local development only: the
 * file must stay out of the public folder and out of version control.
 */
async function loadEbook(): Promise<ArrayBuffer | Buffer | null> {
  const blobUrl = optional('EBOOK_BLOB_URL');
  if (blobUrl) {
    const blobToken = optional('BLOB_READ_WRITE_TOKEN');
    const res = await fetch(blobUrl, {
      headers: blobToken ? { authorization: `Bearer ${blobToken}` } : {},
    });
    if (!res.ok) {
      console.error(`Blob fetch failed (${res.status})`);
      return null;
    }
    return await res.arrayBuffer();
  }

  const path = optional('EBOOK_FILE_PATH');
  if (path) {
    try {
      return await readFile(path);
    } catch (err) {
      console.error('Could not read the local ebook file', err);
      return null;
    }
  }

  return null;
}
