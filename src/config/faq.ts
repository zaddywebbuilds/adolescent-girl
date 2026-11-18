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
    a: 'Yes. It opens on any Android or iPhone with a normal PDF reader, and on tablets and laptops. Download it once and she can read it offline, so it does not keep eating her data.',
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
    q: 'Is this written for Nigerian families?',
    a: 'Yes, it is written with Nigerian homes in mind. The girls in the stories are Amara, Nneka, Zara and Leila, their teacher is Mrs Bello, and the safety guidance draws on UNICEF Nigeria and the Nigerian Communications Commission alongside international health bodies. Nothing in it assumes a foreign way of life.',
  },
  {
    q: 'Is it a religious book?',
    a: 'No. Nigerian families are Christian, Muslim and traditional, and this guide was written to sit comfortably in any of them. It teaches no religion and takes no side. The values it encourages are respect, honesty, self-respect and safety.',
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
    a: 'Yes. Many buyers are aunties, uncles and godparents. Buy it and pass the file to her parent or guardian. Your licence covers personal use within one family, so please do not post it in a group chat.',
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
    q: 'How do I pay, and how much is it?',
    a: `${priceLabel}, paid once in naira. You can pay with your debit card, by bank transfer or with USSD, all through Paystack. There is no subscription and no repeat charge.`,
  },
];
