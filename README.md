# Dear Daughter, Let's Talk About Growing Up

Sales site for a digital ebook aimed at Nigerian parents and guardians buying
for daughters aged 10 to 17. Built as a single-product, mobile-first landing
page for traffic arriving from Facebook and Instagram ads.

React 19 era tooling: Vite, React 18, TypeScript, Tailwind v4, Vercel functions
for payment and delivery. Every route is prerendered to static HTML at build
time, so crawlers and slow phones get the full sales copy in the first response.

---

## Before you can take a real payment

The site is complete and builds clean, but it cannot sell anything until these
are supplied. Nothing below is invented in the code: where a detail is missing,
the UI hides it or shows a visible draft notice rather than faking it.

### 1. Business details — `src/config/site.ts`

| Field | What is needed |
| --- | --- |
| `site.url` | The real domain, no trailing slash. Until this is set, canonical URLs and `sitemap.xml` point at `example.com` and the build prints a warning. |
| `business.legalName` | Registered or trading name of the seller, used in the policies and the copyright line. |
| `business.supportEmail` | A monitored inbox. Until it is set, the FAQ and footer say the contact is still to be added. |
| `business.whatsapp` | Optional, international format (`+234...`). |
| `business.address` | Needed for the policy pages. |
| `business.socials` | Add only handles that genuinely exist. |

### 2. Legal sign-off

`/refund-policy` carries a visible "Decision needed" box. The draft terms are a
reasonable starting point for a digital product sold in Nigeria, but the
merchant must confirm them, and a Nigerian legal adviser should review all four
policies. Every policy page shows a draft banner until `legalName` and
`supportEmail` are filled in.

### 3. Environment variables

Copy `.env.example` to `.env.local` for local work and set the same values in
the Vercel project. The required ones are:

- `PAYSTACK_SECRET_KEY` — server only, never exposed to the browser.
- `DOWNLOAD_SIGNING_SECRET` — generate with
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
  Changing it invalidates every download link already issued.
- `SITE_URL` — must match the deployed domain or the Paystack callback breaks.
- `PRODUCT_PRICE_NGN` — the server charges this, not the number in the page.
- `EBOOK_BLOB_URL` (+ `BLOB_READ_WRITE_TOKEN`) — the final PDF in private
  storage.

### 4. The product itself

The PDF in this folder is a **first draft** titled *A Growing Up Guide for Teen
Girls*. The site sells it under the marketing title *Dear Daughter, Let's Talk
About Growing Up*. Do not launch until the final manuscript is approved, then:

1. Put the final PDF in private storage and point `EBOOK_BLOB_URL` at it.
2. Update `product.pages` in `src/config/site.ts` if the page count changed.
3. Re-run `python scripts/prepare-assets.py` to regenerate the page previews
   from the new PDF.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # client build, SSR build, then prerender
npm run lint         # TypeScript only, no emit
```

`npm run build` writes static HTML for every route into `dist/`, plus
`sitemap.xml` and `robots.txt`.

The API routes are Vercel functions and do **not** run under `vite dev` or
`vite preview`. To exercise checkout locally, install the Vercel CLI
(`npm i -g vercel`) and run `vercel dev`.

### Images

`scripts/prepare-assets.py` is the asset pipeline. It cuts the cover, device
mockups and interior spreads out of the two supplied contact sheets, resizes the
photography into three widths each, renders a curated set of real pages from the
PDF, and writes everything to `public/images` as WebP. Total payload for every
variant on the site is about 3 MB; a single page view loads a small fraction of
that. Re-run it whenever the source art or the PDF changes:

```bash
python scripts/prepare-assets.py
```

The source PNGs and the PDF are deliberately gitignored. They are the paid
product and the licensed art, and they do not belong in a public repository.

---

## How payment and delivery work

```
Buyer clicks a CTA
  → checkout dialog collects name + email        (InitiateCheckout fires)
  → POST /api/paystack/initialize                (amount read from the server env)
  → Paystack hosted checkout
  → buyer returns to /order-success?reference=…
  → GET /api/paystack/verify                     (server asks Paystack directly)
  → verified? issue a signed, time-limited link  (Purchase fires, once)
  → GET /api/download?token=…                    (token checked, then Paystack re-checked)
```

The deliberate choices here:

- **Returning to the success page proves nothing.** The server asks Paystack,
  and checks the status, the currency and that the amount is at least the full
  price, so a hand-made Paystack link for a smaller amount cannot unlock the file.
- **The PDF is never at a public URL.** Access needs a token only this server
  can sign, and the transaction is re-checked on every download request.
- **The webhook is the safety net.** If the buyer closes the tab before
  returning, `charge.success` still delivers the ebook by email. Signatures are
  verified against the raw body, and each reference is fulfilled once.
- **Purchase is counted once.** The browser and the Conversions API send the
  same deterministic event ID (`purchase_<reference>`), and the browser also
  refuses to re-fire for a reference it has already reported.

Set the webhook in the Paystack dashboard to
`https://your-domain/api/paystack/webhook`.

---

## Tracking

Measurement IDs live in `src/config/site.ts` under `analytics`. While they are
`null`, no tags load and no consent bar appears.

`requireConsent` is `true`, so non-essential tags only load after the visitor
accepts, which is the defensible position under the Nigeria Data Protection Act.
Events: `PageView`, `ViewContent`, `InitiateCheckout`, `ClickCTA` (with the CTA
location, useful for comparing creatives) and `Purchase` with value and currency.
UTM parameters, `fbclid` and `gclid` are captured on landing and travel with the
order into Paystack metadata, so a sale can be traced back to a campaign.

For server-side Meta events, set `META_PIXEL_ID` and `META_CAPI_ACCESS_TOKEN`.

---

## Testing checklist

Logic already covered by the script in `scratch/` during the build (15 checks,
all passing): download token round-trip, expiry, tampered payload, tampered
signature, webhook signature valid / invalid / missing / modified body,
underpayment, wrong currency, failed status, and deterministic event IDs.

Before launch, with Paystack test keys:

- [ ] Checkout with a Paystack test card completes and lands on `/order-success`.
- [ ] The download link works and returns the correct PDF.
- [ ] The link stops working after `DOWNLOAD_TTL_MINUTES`.
- [ ] Editing a character of the token gives a 403.
- [ ] A failed or abandoned payment shows `/payment-failed` with no charge.
- [ ] Replaying the webhook twice delivers one email, not two.
- [ ] A webhook with a wrong signature is rejected with 401.
- [ ] Events Manager shows one Purchase per sale, not two.
- [ ] Switch to live keys and buy one real copy end to end before advertising.

Checked during the build: layouts from 320px to 1440px with no horizontal
overflow, keyboard access to the FAQ accordion, carousel and checkout dialog,
focus trapping and Escape in the dialog, and friendly error text when the API
cannot be reached.

---

## Project layout

```
api/                 Vercel functions
  _lib/              config, Paystack, Meta CAPI, email, store, fulfilment
  paystack/          initialize, verify, webhook
  download.ts        signed, re-verified PDF delivery
src/
  config/            site.ts (all business details), content.ts, faq.ts
  components/        header, footer, checkout, carousel, accordion, sticky bar
  sections/          the landing page, in order
  pages/             landing, legal, order-success, payment-failed
  lib/               analytics, SEO and structured data
scripts/
  prepare-assets.py  image and page-preview pipeline
  prerender.mjs      static HTML, sitemap, robots
```

Business details are centralised in `src/config/site.ts`. Nothing is hardcoded
in components, so changing the price, title or contact details is a one-file edit.
