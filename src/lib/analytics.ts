/**
 * Tracking layer for Meta Pixel and GA4.
 *
 * Rules enforced here:
 *  - Nothing loads until the visitor consents (analytics.requireConsent).
 *  - Nothing loads when the IDs are not configured.
 *  - Purchase fires only from the thank-you page, once per reference. That
 *    page is reached from Paystack's success callback, which runs after a
 *    charge succeeds. There is no server, so the charge is not independently
 *    re-checked: reconcile real revenue in the Paystack dashboard, not here.
 */
import { analytics, product } from '../config/site';

type Props = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = 'dd_consent_v1';
const PURCHASE_KEY = 'dd_purchase_fired_v1';

export function getConsent(): 'granted' | 'denied' | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: 'granted' | 'denied') {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage unavailable: consent applies to this page view only */
  }
  if (value === 'granted') boot();
}

/** True when any tag is configured, so the consent bar has a reason to appear. */
export function hasTagsConfigured() {
  return Boolean(analytics.metaPixelId || analytics.ga4Id || analytics.gtmId);
}

function trackingAllowed() {
  if (typeof window === 'undefined') return false;
  if (!hasTagsConfigured()) return false;
  if (!analytics.requireConsent) return true;
  return getConsent() === 'granted';
}

let booted = false;

/** Injects the configured tags. Safe to call repeatedly. */
export function boot() {
  if (booted || !trackingAllowed()) return;
  booted = true;

  if (analytics.metaPixelId) {
    const w = window as unknown as Record<string, unknown>;
    if (!w.fbq) {
      const n = function (...args: unknown[]) {
        const self = n as unknown as { callMethod?: Function; queue: unknown[] };
        if (self.callMethod) self.callMethod.apply(n, args);
        else self.queue.push(args);
      } as unknown as Record<string, unknown>;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      w.fbq = n;
      if (!w._fbq) w._fbq = n;
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
    }
    window.fbq?.('init', analytics.metaPixelId);
    window.fbq?.('track', 'PageView');
  }

  if (analytics.ga4Id) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.ga4Id}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', analytics.ga4Id, { send_page_view: true });
  }

  if (analytics.gtmId) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${analytics.gtmId}`;
    document.head.appendChild(s);
  }
}

function meta(event: string, props: Props = {}, eventId?: string) {
  if (!trackingAllowed() || !analytics.metaPixelId) return;
  boot();
  if (eventId) window.fbq?.('track', event, props, { eventID: eventId });
  else window.fbq?.('track', event, props);
}

function ga(event: string, props: Props = {}) {
  if (!trackingAllowed() || !analytics.ga4Id) return;
  window.gtag?.('event', event, props);
}

export function trackPageView(path: string) {
  if (!trackingAllowed()) return;
  boot();
  if (analytics.metaPixelId) window.fbq?.('track', 'PageView');
  if (analytics.ga4Id) window.gtag?.('event', 'page_view', { page_path: path });
}

export function trackViewContent() {
  meta('ViewContent', {
    content_ids: [product.sku],
    content_name: product.title,
    content_type: 'product',
    value: product.priceNgn,
    currency: product.currency,
  });
  ga('view_item', {
    currency: product.currency,
    value: product.priceNgn,
    items: [{ item_id: product.sku, item_name: product.title }],
  });
}

/** Fired when the checkout form opens, not when payment completes. */
export function trackInitiateCheckout(source: string) {
  meta('InitiateCheckout', {
    content_ids: [product.sku],
    content_name: product.title,
    value: product.priceNgn,
    currency: product.currency,
    source,
  });
  ga('begin_checkout', {
    currency: product.currency,
    value: product.priceNgn,
    items: [{ item_id: product.sku, item_name: product.title }],
  });
}

/** A CTA press. Useful for comparing creatives, never counted as a sale. */
export function trackCtaClick(location: string) {
  meta('ClickCTA', { location });
  ga('select_promotion', { promotion_name: location });
}

/**
 * Purchase. Called from the thank-you page after Paystack's success callback.
 * Deduplicated per reference so a page refresh cannot double count.
 */
export function trackPurchase(args: {
  reference: string;
  eventId: string;
  value: number;
  currency: string;
}) {
  if (!trackingAllowed()) return;
  try {
    const fired: string[] = JSON.parse(window.localStorage.getItem(PURCHASE_KEY) ?? '[]');
    if (fired.includes(args.reference)) return;
    fired.push(args.reference);
    window.localStorage.setItem(PURCHASE_KEY, JSON.stringify(fired.slice(-20)));
  } catch {
    /* storage unavailable: fire once for this page view */
  }
  meta(
    'Purchase',
    {
      content_ids: [product.sku],
      content_name: product.title,
      content_type: 'product',
      value: args.value,
      currency: args.currency,
      num_items: 1,
    },
    args.eventId,
  );
  ga('purchase', {
    transaction_id: args.reference,
    value: args.value,
    currency: args.currency,
    items: [{ item_id: product.sku, item_name: product.title, price: args.value }],
  });
}

const UTM_KEY = 'dd_attribution_v1';
const UTM_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
] as const;

export type Attribution = Partial<Record<(typeof UTM_FIELDS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
};

/** Captures campaign parameters on first landing so they survive the checkout hop. */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  let stored: Attribution = {};
  try {
    stored = JSON.parse(window.sessionStorage.getItem(UTM_KEY) ?? '{}');
  } catch {
    stored = {};
  }
  const params = new URLSearchParams(window.location.search);
  let changed = false;
  for (const f of UTM_FIELDS) {
    const v = params.get(f);
    if (v && stored[f] !== v) {
      stored[f] = v;
      changed = true;
    }
  }
  if (!stored.landing_page) {
    stored.landing_page = window.location.pathname;
    stored.referrer = document.referrer || undefined;
    changed = true;
  }
  if (changed) {
    try {
      window.sessionStorage.setItem(UTM_KEY, JSON.stringify(stored));
    } catch {
      /* ignore */
    }
  }
  return stored;
}

export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(UTM_KEY) ?? '{}');
  } catch {
    return {};
  }
}

/** Meta browser cookies, needed by the Conversions API for matching. */
export function getMetaCookies() {
  if (typeof document === 'undefined') return {};
  const read = (name: string) =>
    document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${name}=`))
      ?.split('=')[1];
  return { fbp: read('_fbp'), fbc: read('_fbc') };
}
