import type { ReactElement } from 'react';
import Landing from './pages/Landing';
import OrderSuccess from './pages/OrderSuccess';
import PaymentFailed from './pages/PaymentFailed';
import {
  DeliveryPolicy,
  PrivacyPolicy,
  RefundPolicy,
  TermsAndConditions,
} from './pages/Legal';
import {
  bookJsonLd,
  faqJsonLd,
  organizationJsonLd,
  productJsonLd,
  websiteJsonLd,
  type PageMeta,
} from './lib/seo';
import { product, site } from './config/site';

export type AppRoute = PageMeta & {
  element: ReactElement;
  /** Included in sitemap.xml. Transactional pages are left out. */
  sitemap?: { priority: number; changefreq: string };
};

export const routes: AppRoute[] = [
  {
    path: '/',
    element: <Landing />,
    title: site.title,
    description: site.description,
    jsonLd: [
      productJsonLd(),
      bookJsonLd(),
      faqJsonLd(),
      organizationJsonLd(),
      websiteJsonLd(),
    ],
    sitemap: { priority: 1.0, changefreq: 'weekly' },
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
    title: `Privacy Policy | ${product.shortTitle}`,
    description:
      'How we handle your name, email address and payment confirmation when you buy the guide, and the choices you have over measurement cookies.',
    sitemap: { priority: 0.3, changefreq: 'yearly' },
  },
  {
    path: '/terms-and-conditions',
    element: <TermsAndConditions />,
    title: `Terms and Conditions | ${product.shortTitle}`,
    description:
      'The terms that apply when you buy the digital guide, including your personal use licence and what the guide is not intended to replace.',
    sitemap: { priority: 0.3, changefreq: 'yearly' },
  },
  {
    path: '/refund-policy',
    element: <RefundPolicy />,
    title: `Refund Policy | ${product.shortTitle}`,
    description:
      'When a refund is given for this digital ebook, when it may be declined, and how to request one.',
    sitemap: { priority: 0.3, changefreq: 'yearly' },
  },
  {
    path: '/delivery-policy',
    element: <DeliveryPolicy />,
    title: `Delivery Policy | ${product.shortTitle}`,
    description:
      'How your download link is issued after payment is verified, how long it lasts, and what to do if something goes wrong.',
    sitemap: { priority: 0.3, changefreq: 'yearly' },
  },
  {
    path: '/order-success',
    element: <OrderSuccess />,
    title: `Your download | ${product.shortTitle}`,
    description: 'Your verified purchase and download link.',
    noindex: true,
  },
  {
    path: '/payment-failed',
    element: <PaymentFailed />,
    title: `Payment not completed | ${product.shortTitle}`,
    description: 'Your payment did not go through. You can try again safely.',
    noindex: true,
  },
];

export const notFoundMeta: PageMeta = {
  path: '/404',
  title: `Page not found | ${product.shortTitle}`,
  description: 'That page does not exist.',
  noindex: true,
};
