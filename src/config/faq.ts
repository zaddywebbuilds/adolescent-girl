import { business, product, priceLabel } from './site';

export type Faq = {
  q: string;
  /** Plain-text answer. Also used for FAQPage structured data. */
  a: string;
  /** True when the answer still depends on a business decision. */
  pending?: boolean;
};

const supportLine = business.supportEmail
  ? `Email ${business.supportEmail}${
      business.whatsapp ? ` or send a WhatsApp message to ${business.whatsapp}` : ''
    } and we will help you.`
  : 'A support email address and WhatsApp number will be shown here before launch.';

export const faqs: Faq[] = [
  {
    q: 'Is this a physical book or an ebook?',
    a: `It is a digital PDF ebook of ${product.pages} pages, not a printed book. Nothing is posted to you.`,
  },
  {
    q: 'What age group is it suitable for?',
    a: `The guide is written for girls aged ${product.ageRange}. Parents and caregivers should review the age-sensitive chapters and help younger readers choose suitable sections.`,
  },
  {
    q: 'Can my daughter read it on her phone?',
    a: 'Yes. The PDF opens on most phones, tablets and computers using a standard PDF reader.',
  },
  {
    q: 'Does it discuss menstruation and puberty?',
    a: 'Yes. Chapter 2 explains the changes of puberty and Chapter 5 covers periods, including what to expect, how to prepare, and when to seek medical advice. Chapter 6 covers everyday hygiene and menstrual care.',
  },
  {
    q: 'Does it cover personal safety?',
    a: 'Yes. Chapter 3 covers trust, boundaries and staying safe, Chapter 10 covers boundaries and consent, and Chapter 12 covers staying safe online and offline, including how to tell a trusted adult.',
  },
  {
    q: 'Is it a religious book?',
    a: 'No. It is written to be useful to girls from different faiths, cultures and family backgrounds, and it does not teach any particular religion.',
  },
  {
    q: 'Where does the health information come from?',
    a: `The health and safety sections carry numbered references to ${product.referenceCount} public sources, including the NHS, the World Health Organization, ACOG, the American Academy of Pediatrics, UNICEF Nigeria, the NSPCC and the Nigerian Communications Commission. The full list is printed at the back of the book.`,
  },
  {
    q: 'How will I receive the ebook?',
    a: 'As soon as your payment goes through, you are returned to a thank-you page with the download button. Save the file to your device there and then. Paystack also emails you a receipt for the payment.',
  },
  {
    q: 'Can I buy it for the daughter of a friend or relative?',
    a: 'Yes. You can buy it as a gift and pass the PDF on to her parent or guardian. Your licence covers personal use within one family.',
  },
  {
    q: 'Can I request a refund?',
    a: 'The refund policy for this digital product is being finalised and will be published here before launch.',
    pending: true,
  },
  {
    q: 'What if I have trouble downloading it?',
    a: supportLine,
    pending: !business.supportEmail,
  },
  {
    q: 'How much does it cost?',
    a: `${priceLabel}, paid once. There is no subscription and no repeat charge.`,
  },
];
