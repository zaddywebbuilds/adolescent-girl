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
  pages: 123,
  /** Number of referenced public-health and child-protection sources. */
  referenceCount: 56,
  format: 'Digital PDF',
  /** Launch price in naira. The server reads PRODUCT_PRICE_NGN and must match. */
  priceNgn: 2500,
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

export const site = {
  /** NEEDS CONFIRMATION: production domain, no trailing slash. */
  url: 'https://example.com',
  locale: 'en_NG',
  title: 'Dear Daughter | Growing Up & Puberty Guide for Girls in Nigeria',
  description:
    'Help your daughter understand puberty, periods, confidence, personal safety and growing up. Explore this practical digital guide for girls aged 10 to 17.',
  ogImage: '/images/cover-3d.webp',
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
  /** Public key is injected at build time; the secret key never reaches the browser. */
  publicKey: (import.meta.env?.VITE_PAYSTACK_PUBLIC_KEY as string | undefined) ?? null,
  /** Logos are rendered as plain text labels until the live channels are confirmed. */
  methods: ['Card', 'Bank transfer', 'USSD'],
} as const;

/** Formats naira without decimals: ₦2,500 */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export const priceLabel = formatNaira(product.priceNgn);

export const cta = {
  primary: `Get the Guide for ${priceLabel}`,
  secondary: "See What's Inside",
} as const;
