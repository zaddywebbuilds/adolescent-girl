/**
 * Single source of truth for product, business and integration details.
 * Change values here, not inside components.
 *
 * Values marked NEEDS CONFIRMATION are placeholders. They must be replaced
 * with the real business details before the site goes live. Anything still
 * set to null is hidden by the UI rather than faked.
 */

export type PendingString = string | null;

export const product = {
  /** Marketing title used across the site. */
  title: "Dear Daughter, Let's Talk About Growing Up",
  shortTitle: 'Dear Daughter',
  subtitle:
    "A Girl's Guide to Puberty, Periods, Confidence, Personal Safety, and Growing Up",
  /** Title as printed inside the current PDF. */
  manuscriptTitle: 'A Growing Up Guide for Teen Girls',
  ageRange: '10 to 17',
  chapters: 16,
  /** Page count of the PDF that is actually delivered. Update on each revision. */
  pages: 160,
  /** Number of referenced public-health and child-protection sources. */
  referenceCount: 56,
  format: 'Digital PDF',
  /** The finished book ends with a bonus section written for parents. */
  hasParentGuide: true,
  /** Launch price in naira. The server reads PRODUCT_PRICE_NGN and must match. */
  priceNgn: 3500,
  currency: 'NGN',
  /**
   * Set only once a higher price has genuinely been charged for a period.
   * While null, no crossed-out price or savings claim is rendered anywhere.
   */
  previousPriceNgn: null as number | null,
  sku: 'dear-daughter-ebook-v1',
} as const;

export const business = {
  /** NEEDS CONFIRMATION: registered or trading name of the seller. */
  name: 'Dear Daughter',
  legalName: null as PendingString, // NEEDS CONFIRMATION
  /** NEEDS CONFIRMATION: a monitored support inbox. */
  supportEmail: null as PendingString,
  /** NEEDS CONFIRMATION: WhatsApp number in international format, e.g. +2348012345678 */
  whatsapp: null as PendingString,
  address: null as PendingString, // NEEDS CONFIRMATION
  /** NEEDS CONFIRMATION: add only handles that genuinely exist. */
  socials: [] as { label: string; href: string }[],
  country: 'Nigeria',
} as const;

/**
 * Private group buyers are invited into after downloading.
 *
 * The invite link sits on the thank-you page, which anyone can reach, so
 * treat it as public. If it ever needs to be buyers-only, that needs a
 * server. Set url to null to hide the invitation entirely.
 */
export const community = {
  url: 'https://t.me/+KY5vReLDKUk3MzRk' as PendingString,
  platform: 'Telegram',
  name: 'Dear Daughter Guide',
} as const;

export const site = {
  /**
   * Production URL, no trailing slash. Must stay in step with BASE in
   * vite.config.ts and with public/CNAME.
   */
  url: 'https://deardaughterguide.shop',
  locale: 'en_NG',
  title: 'Dear Daughter | Growing Up & Puberty Guide for Girls in Nigeria',
  description:
    'Help your daughter understand puberty, periods, confidence, personal safety and growing up. Explore this practical digital guide for girls aged 10 to 17.',
  /**
   * Landscape sharing card built by scripts/make-og.py. JPEG, because
   * WhatsApp link previews are unreliable with WebP.
   */
  ogImage: '/images/og-image.jpg',
} as const;

export const analytics = {
  /** Meta Pixel ID. Tracking stays off while this is null. */
  metaPixelId: null as PendingString,
  /** GA4 measurement ID, e.g. G-XXXXXXX. */
  ga4Id: null as PendingString,
  /** GTM container ID, e.g. GTM-XXXXXX. Optional alternative to the two above. */
  gtmId: null as PendingString,
  /**
   * Nigeria Data Protection Act: non-essential tracking only loads after the
   * visitor accepts. Set to false only on legal advice.
   */
  requireConsent: true,
} as const;

export const payments = {
  provider: 'paystack' as const,
  /**
   * Paystack PUBLIC key (pk_live_... or pk_test_...).
   *
   * This key is designed to be visible in the page: it can only start a
   * payment, never move money or read transactions. It is the only Paystack
   * key this site uses, because a static site has no server to keep a secret
   * key in. NEEDS CONFIRMATION before launch.
   */
  publicKey:
    (import.meta.env?.VITE_PAYSTACK_PUBLIC_KEY as string | undefined) ?? null,
  /** Channels offered in the Paystack popup. */
  channels: ['card', 'bank', 'ussd', 'bank_transfer'] as string[],
  /** Plain labels, shown instead of logos until live channels are confirmed. */
  methods: ['Card', 'Bank transfer', 'USSD'],
} as const;

export const delivery = {
  /**
   * The ebook is served straight from /public on GitHub Pages.
   *
   * Without a server there is no way to check that a visitor paid before
   * handing over the file, so this URL is public to anyone who has it. That
   * is the accepted trade-off for instant delivery. Drop the final PDF into
   * public/downloads/ and keep this filename in step.
   */
  file: '/downloads/dear-daughter-growing-up-guide.pdf',
  /** Filename the buyer's browser saves it as. */
  saveAs: 'Dear-Daughter-Growing-Up-Guide.pdf',
} as const;

/** Formats naira without decimals: ₦3,500 */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export const priceLabel = formatNaira(product.priceNgn);

export const cta = {
  primary: `Get the Guide for ${priceLabel}`,
  secondary: "See What's Inside",
} as const;
