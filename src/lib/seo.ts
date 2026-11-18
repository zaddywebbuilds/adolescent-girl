import { business, product, site } from '../config/site';
import { faqs } from '../config/faq';

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  /** Transactional and private pages must stay out of the index. */
  noindex?: boolean;
  /** Extra JSON-LD blocks rendered into the page head. */
  jsonLd?: unknown[];
};

const abs = (p: string) => `${site.url.replace(/\/$/, '')}${p}`;

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function productJsonLd() {
  const offer: Record<string, unknown> = {
    '@type': 'Offer',
    url: abs('/'),
    price: String(product.priceNgn),
    priceCurrency: product.currency,
    availability: 'https://schema.org/InStock',
    category: 'Digital goods',
  };
  if (business.legalName) {
    offer.seller = { '@type': 'Organization', name: business.legalName };
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: site.description,
    image: [abs(site.ogImage)],
    sku: product.sku,
    brand: { '@type': 'Brand', name: business.name },
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 10,
      suggestedMaxAge: 17,
      audienceType: 'Girls aged 10 to 17, bought by parents and guardians',
    },
    isAccessibleForFree: false,
    offers: offer,
  };
}

/** Schema.org Book details, kept separate from the commercial offer. */
export function bookJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: product.title,
    alternateName: product.manuscriptTitle,
    bookFormat: 'https://schema.org/EBook',
    numberOfPages: product.pages,
    inLanguage: 'en',
    abstract: site.description,
  };
}

/**
 * Organisation and site identity. Helps search engines connect the brand,
 * and gives the site a chance at a sitelinks search box later.
 * Only fields that are genuinely known are emitted.
 */
export function organizationJsonLd() {
  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: business.legalName ?? business.name,
    url: site.url,
    logo: abs(site.ogImage),
    areaServed: { '@type': 'Country', name: 'Nigeria' },
  };
  if (business.supportEmail) {
    org.contactPoint = {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: business.supportEmail,
      areaServed: 'NG',
      availableLanguage: 'English',
    };
  }
  return org;
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: business.name,
    url: site.url,
    inLanguage: 'en-NG',
    description: site.description,
  };
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs
      .filter((f) => !f.pending)
      .map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
  };
}

/** Renders the full head block. Used by the prerender step and the dev shell. */
export function renderHead(meta: PageMeta): string {
  const canonical = abs(meta.path === '/' ? '/' : meta.path.replace(/\/$/, ''));
  const image = abs(site.ogImage);
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    meta.noindex
      ? '<meta name="robots" content="noindex, nofollow" />'
      : '<meta name="robots" content="index, follow, max-image-preview:large" />',
    `<meta property="og:type" content="${meta.path === '/' ? 'product' : 'website'}" />`,
    `<meta property="og:site_name" content="${esc(business.name)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:width" content="497" />',
    '<meta property="og:image:height" content="512" />',
    '<meta property="og:image:type" content="image/webp" />',
    `<meta property="og:image:alt" content="${esc(product.title)}, a digital guide for girls aged ${product.ageRange}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];
  for (const block of meta.jsonLd ?? []) {
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`,
    );
  }
  return tags.join('\n    ');
}

/** Keeps the head correct after client-side navigation. */
export function applyClientHead(meta: PageMeta) {
  if (typeof document === 'undefined') return;
  document.title = meta.title;

  const set = (selector: string, attrs: Record<string, string>) => {
    let el = document.head.querySelector(selector) as HTMLElement | null;
    if (!el) {
      el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
      document.head.appendChild(el);
    }
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  };

  set('meta[name="description"]', { name: 'description', content: meta.description });
  set('link[rel="canonical"]', {
    rel: 'canonical',
    href: abs(meta.path === '/' ? '/' : meta.path.replace(/\/$/, '')),
  });
  set('meta[name="robots"]', {
    name: 'robots',
    content: meta.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
  });
  set('meta[property="og:title"]', { property: 'og:title', content: meta.title });
  set('meta[property="og:description"]', {
    property: 'og:description',
    content: meta.description,
  });
}
