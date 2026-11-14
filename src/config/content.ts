/**
 * Page content. Every claim here is supported by the manuscript
 * (A_Growing_Up_Guide_for_Teen_Girls.pdf). Quotations are verbatim.
 */

export const chapters: { n: number; title: string; page: number }[] = [
  { n: 1, title: 'Growing Up at Your Own Pace', page: 5 },
  { n: 2, title: 'Understanding Your Changing Body', page: 10 },
  { n: 3, title: 'Personal Safety: Trust, Boundaries, and Staying Safe', page: 16 },
  { n: 4, title: 'Be Kind Without Letting Others Take Advantage', page: 23 },
  { n: 5, title: 'Periods Without Fear or Shame', page: 31 },
  { n: 6, title: 'Personal Hygiene and Everyday Care', page: 38 },
  { n: 7, title: 'Your Feelings Matter', page: 45 },
  { n: 8, title: 'Confidence, Body Image, and Self-Respect', page: 52 },
  { n: 9, title: 'Friendships, Bullying, and Peer Pressure', page: 59 },
  { n: 10, title: 'Your Body, Your Boundaries, and Consent', page: 67 },
  { n: 11, title: 'Crushes, Relationships, and Reproductive Health', page: 75 },
  { n: 12, title: 'Staying Safe Online and Offline', page: 82 },
  { n: 13, title: 'Communicating with Family and Trusted Adults', page: 89 },
  { n: 14, title: 'Healthy Habits for Your Body and Mind', page: 97 },
  { n: 15, title: 'School, Money, Goals, and Your Future', page: 104 },
  { n: 16, title: 'Growing into the Person You Want to Be', page: 113 },
];

export type LearnItem = {
  icon: 'body' | 'confidence' | 'safety' | 'friendship' | 'hygiene' | 'future';
  title: string;
  body: string;
  chapters: number[];
};

export const learnItems: LearnItem[] = [
  {
    icon: 'body',
    title: 'Understanding Her Body',
    body: 'Puberty, physical changes, periods, and understanding what is normal.',
    chapters: [2, 5],
  },
  {
    icon: 'confidence',
    title: 'Confidence and Self-Respect',
    body: 'Self-esteem, body image, finding her voice, and appreciating who she is.',
    chapters: [1, 8],
  },
  {
    icon: 'safety',
    title: 'Personal Safety',
    body: 'Recognising manipulation, respecting boundaries, and knowing when to seek help.',
    chapters: [3, 10, 12],
  },
  {
    icon: 'friendship',
    title: 'Friendships and Emotions',
    body: 'Healthy friendships, peer pressure, bullying, and managing difficult feelings.',
    chapters: [4, 7, 9],
  },
  {
    icon: 'hygiene',
    title: 'Hygiene and Self-Care',
    body: 'Everyday personal care, menstrual hygiene, and healthy routines.',
    chapters: [6, 14],
  },
  {
    icon: 'future',
    title: 'Relationships and Her Future',
    body: 'Communication, age-appropriate relationship education, school, goals, and personal development.',
    chapters: [11, 13, 15, 16],
  },
];

/** Verbatim "A Thought to Keep" lines that close chapters in the book. */
export const quotes: { text: string; chapter: number }[] = [
  {
    text: 'You deserve to understand your body, and you are allowed to ask for help.',
    chapter: 2,
  },
  {
    text: 'You can be respectful and still say no. You can ask for help even after a decision you regret. You always deserve safety and care.',
    chapter: 3,
  },
  {
    text: 'Your period is something you can learn to manage. You deserve supplies, privacy, clear information, and help when you need it.',
    chapter: 5,
  },
  {
    text: 'You are a whole person, with qualities, relationships, abilities, and possibilities that no photograph or opinion can fully describe.',
    chapter: 8,
  },
  {
    text: 'You can take your next step without having your whole life worked out.',
    chapter: 1,
  },
];

/** Pages rendered by scripts/prepare-assets.py into /images/preview. */
export const previewPages: { page: number; label: string; alt: string }[] = [
  {
    page: 5,
    label: 'Chapter 1',
    alt: "Page 5 of the guide, opening Chapter 1, Growing Up at Your Own Pace, with Amara's story.",
  },
  {
    page: 10,
    label: 'Chapter 2',
    alt: 'Page 10 of the guide, opening Chapter 2, Understanding Your Changing Body.',
  },
  {
    page: 16,
    label: 'Chapter 3',
    alt: 'Page 16 of the guide, opening Chapter 3 on trust, boundaries and staying safe.',
  },
  {
    page: 31,
    label: 'Chapter 5',
    alt: 'Page 31 of the guide, opening Chapter 5, Periods Without Fear or Shame.',
  },
  {
    page: 45,
    label: 'Chapter 7',
    alt: 'Page 45 of the guide, opening Chapter 7, Your Feelings Matter.',
  },
  {
    page: 52,
    label: 'Chapter 8',
    alt: 'Page 52 of the guide, opening Chapter 8 on confidence, body image and self-respect.',
  },
  {
    page: 113,
    label: 'Chapter 16',
    alt: 'Page 113 of the guide, opening Chapter 16, Growing into the Person You Want to Be.',
  },
];

export const ageBands: {
  range: string;
  focus: string;
  chapters: string;
  image: string;
  alt: string;
}[] = [
  {
    range: 'Ages 10 to 12',
    focus:
      'Early puberty, hygiene, confidence, personal safety, and learning how to ask questions.',
    chapters: 'Chapters 1, 2, 3, 5, 6',
    image: '/images/girl-reading-bed-800.webp',
    alt: 'A girl lying on her bed reading a book in warm window light.',
  },
  {
    range: 'Ages 13 to 15',
    focus:
      'Changing friendships, emotions, boundaries, online safety, and growing independence.',
    chapters: 'Chapters 4, 7, 8, 9, 12',
    image: '/images/schoolgirls.webp',
    alt: 'Three school friends in uniform walking and laughing together.',
  },
  {
    range: 'Ages 16 to 17',
    focus:
      'Relationships, reproductive health, responsibilities, school, money, and future planning.',
    chapters: 'Chapters 10, 11, 13, 15, 16',
    image: '/images/study-pink-800.webp',
    alt: 'An older teenage girl studying at a desk with her notes.',
  },
];

export const steps: { title: string; body: string }[] = [
  {
    title: 'Place your order',
    body: 'Click the purchase button and enter your name and email address.',
  },
  {
    title: 'Complete secure payment',
    body: 'Pay securely in naira on Paystack using card, bank transfer or USSD.',
  },
  {
    title: 'Download your ebook',
    body: 'Once payment is confirmed, your private download link opens straight away.',
  },
];
