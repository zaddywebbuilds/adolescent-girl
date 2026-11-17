import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Shell } from '../components/ui';
import { business, product, priceLabel, site } from '../config/site';

const seller = business.legalName ?? business.name;
const contact = business.supportEmail ?? '[support email to be added]';

/**
 * Shared layout for the policy pages.
 *
 * While the business details are unconfirmed, every policy page carries a
 * visible draft notice. These are working drafts prepared for review, not
 * finalised legal documents: they should be checked by the merchant, and
 * where appropriate by a Nigerian legal adviser, before launch.
 */
function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  const isDraft = !business.legalName || !business.supportEmail;

  return (
    <main className="bg-cream py-14 md:py-20">
      <Shell className="max-w-3xl">
        <h1 className="text-[2rem] sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-charcoal/55">Last updated: {updated}</p>

        {isDraft && (
          <div className="mt-8 flex gap-3 rounded-2xl border border-gold/50 bg-white p-5">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-gold"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-charcoal/80">
              <strong className="text-plum">Draft for review.</strong> This policy is
              not final. The registered seller name, contact address and refund terms
              still need to be confirmed by the business owner before this site accepts
              real payments.
            </p>
          </div>
        )}

        <div className="legal mt-10 space-y-7">{children}</div>
      </Shell>
    </main>
  );
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 text-2xl">{children}</h2>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 leading-relaxed text-charcoal/80">{children}</p>;
}

function UL({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2 pl-5">
      {items.map((i) => (
        <li key={i} className="list-disc leading-relaxed text-charcoal/80">
          {i}
        </li>
      ))}
    </ul>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" updated="14 November 2026">
      <P>
        This policy explains what {seller} collects when you buy{' '}
        {product.title} on {site.url}, why it is collected, and the choices you have.
        It is written with the Nigeria Data Protection Act 2023 in mind.
      </P>

      <H2>What we collect</H2>
      <UL
        items={[
          'Your name and email address, which you enter at checkout so that we can identify your order and send your download link.',
          'Payment confirmation details returned by Paystack, such as the transaction reference, amount and status. We never see or store your card number.',
          'Basic technical information such as your device type and the pages you view, if you accept measurement cookies.',
          'Campaign parameters from advertising links, so that we can tell which advert brought you here.',
        ]}
      />

      <H2>What we do not collect</H2>
      <P>
        We do not knowingly collect personal information from children. This site is
        sold to adults. Your daughter does not need an account, an email address, or to
        submit any information in order to read the guide.
      </P>

      <H2>Cookies and measurement</H2>
      <P>
        Cookies that are not strictly necessary, including any Meta Pixel and Google
        Analytics cookies, only load after you accept them. If you decline, those tags
        are not injected at all. You can change your mind by clearing this site&rsquo;s
        data in your browser.
      </P>

      <H2>Who we share information with</H2>
      <UL
        items={[
          'Paystack, to take payment and confirm it. Paystack processes your payment details under its own privacy policy.',
          'Meta and Google, only if you accept measurement cookies, and only as event data about purchases and page views.',
        ]}
      />
      <P>We do not sell your personal information.</P>

      <H2>Where your order details are held</H2>
      <P>
        This website has no server and no database of its own. The name and email
        address you enter at checkout are passed straight to Paystack with the
        payment and are held in the seller&rsquo;s Paystack account, which keeps
        transaction records for as long as Nigerian tax and accounting rules require.
        Nothing about your order is stored on this website.
      </P>

      <H2>Your rights</H2>
      <P>
        You can ask for a copy of the information we hold about you, ask us to correct
        it, or ask us to delete it where we are not required to keep it. Write to{' '}
        {contact}. You may also complain to the Nigeria Data Protection Commission.
      </P>
    </LegalLayout>
  );
}

export function TermsAndConditions() {
  return (
    <LegalLayout title="Terms and Conditions" updated="14 November 2026">
      <P>
        These terms apply when you buy {product.title} from {seller} on {site.url}. By
        completing a purchase you agree to them.
      </P>

      <H2>What you are buying</H2>
      <P>
        A digital PDF ebook of {product.pages} pages and {product.chapters} chapters,
        priced at {priceLabel} as a one-time payment. Nothing is posted to you and there
        is no subscription or repeat charge.
      </P>

      <H2>Your licence</H2>
      <UL
        items={[
          'You may read the guide and keep your own copies of it for personal use within your household.',
          'You may show it to, and share it with, the child or children it was bought for and their parent or guardian.',
          'You may not resell it, publish it, upload it to a file sharing service, or distribute it publicly.',
          'The text, illustrations and cover remain the property of the author and may not be reproduced without permission.',
        ]}
      />

      <H2>What this guide is, and is not</H2>
      <P>
        The guide provides general education for girls aged {product.ageRange}. It does
        not replace parental supervision, safeguarding support, or advice from a
        qualified health professional. Health and safety information is referenced to
        public sources, but services and rules differ by location, and individual
        questions should be taken to an appropriate professional.
      </P>

      <H2>Payment</H2>
      <P>
        Payment is taken in Nigerian naira by Paystack, on Paystack&rsquo;s own secure
        checkout. We never see or handle your card details. Your receipt from Paystack
        is the record of your payment, and the seller can confirm any transaction from
        its reference.
      </P>

      <H2>Delivery</H2>
      <P>
        See the Delivery Policy. In short, the download appears on the thank-you page
        straight after your payment succeeds.
      </P>

      <H2>Liability</H2>
      <P>
        We provide the guide as it is. To the extent permitted by Nigerian law, our
        liability to you is limited to the amount you paid for it.
      </P>

      <H2>Governing law</H2>
      <P>These terms are governed by the laws of the Federal Republic of Nigeria.</P>
    </LegalLayout>
  );
}

export function RefundPolicy() {
  return (
    <LegalLayout title="Refund Policy" updated="14 November 2026">
      <div className="rounded-2xl border border-gold/50 bg-white p-5">
        <p className="text-sm leading-relaxed text-charcoal/80">
          <strong className="text-plum">Decision needed.</strong> The refund terms below
          are a reasonable starting draft for a digital product sold in Nigeria. The
          merchant must confirm or change them, and Paystack&rsquo;s own dispute and
          chargeback rules continue to apply regardless of what is written here.
        </p>
      </div>

      <H2>Digital products</H2>
      <P>
        Because the guide is delivered immediately as a downloadable file, it cannot be
        returned in the way a physical book can. That does not remove your rights where
        something has gone wrong.
      </P>

      <H2>When we will refund you</H2>
      <UL
        items={[
          'You were charged more than once for the same order.',
          'Your payment succeeded but you never received access to the file, and we cannot deliver it to you.',
          'The file is corrupted or will not open, and we cannot supply a working replacement.',
          'You were charged for a purchase you did not authorise.',
        ]}
      />

      <H2>When we may not refund you</H2>
      <P>
        We may decline a refund where the file has been downloaded successfully and the
        request is simply that you changed your mind about the content, which you can
        preview on this site before buying.
      </P>

      <H2>How to ask</H2>
      <P>
        Write to {contact} within 14 days of your purchase with the email address you
        used and your transaction reference. We will reply and, where a refund is due,
        return the money to the account you paid from.
      </P>
    </LegalLayout>
  );
}

export function DeliveryPolicy() {
  return (
    <LegalLayout title="Delivery Policy" updated="14 November 2026">
      <P>
        {product.title} is a digital product. Nothing is shipped and there is no
        delivery fee.
      </P>

      <H2>How you receive it</H2>
      <UL
        items={[
          'You enter your name and email address, and pay on Paystack.',
          'Paystack confirms the payment and returns you to the thank-you page on this site.',
          'The thank-you page shows a download button for the PDF.',
          'Paystack emails you a receipt for the payment.',
        ]}
      />

      <H2>Save the file when you get it</H2>
      <P>
        Download the PDF to your own device on the thank-you page rather than leaving
        it open in a browser tab, so that you keep your copy. Your purchase is covered
        by the personal use licence in the Terms and Conditions, which does not allow
        the file to be resold or shared publicly.
      </P>

      <H2>If something goes wrong</H2>
      <P>
        If payment left your account but the download did not start, do not pay again.
        Contact {contact} with the transaction reference from your Paystack receipt and
        the email address you used, and we will send you the file.
      </P>

      <H2>Reading the file</H2>
      <P>
        The guide is a standard PDF. It opens on most phones, tablets and computers. On
        a phone, saving the file rather than reading it in a browser tab makes it easier
        to return to later.
      </P>
    </LegalLayout>
  );
}
