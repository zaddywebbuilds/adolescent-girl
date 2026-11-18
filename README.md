# Dear Daughter, Let's Talk About Growing Up

Sales site for a digital ebook aimed at Nigerian parents and guardians buying
for daughters aged 10 to 17. A single-product, mobile-first landing page built
for traffic arriving from Facebook and Instagram ads.

Static site: Vite, React, TypeScript and Tailwind v4, prerendered to HTML at
build time, deployed to GitHub Pages by GitHub Actions. Payment is Paystack
Inline. There is no server anywhere in this stack.

Live at **https://zaddywebbuilds.github.io/adolescent-girl**

---

## Read this before launch: what a static site cannot do

GitHub Pages serves files. It runs no code of ours. Three consequences follow,
and the site is built to be honest about all three rather than to hide them.

**1. Payments are not verified by us.** Checkout uses the Paystack *public*
key, which can only start a payment. Verifying a transaction needs the secret
key, and a secret key in a static site is not a secret. The thank-you page
trusts Paystack's success callback, which only runs after a charge succeeds.
That is reasonable, but it is not proof. **Reconcile actual revenue in the
Paystack dashboard, never from this site's analytics.**

**2. The PDF is public.** It sits at
`/downloads/dear-daughter-growing-up-guide.pdf` and anyone with that URL can
download it without paying. This was a deliberate choice for instant delivery
without a server. Expect the link to be shared eventually. If that becomes a
real problem, the fix is a small backend, at which point verified payment and
expiring links become possible again.

**3. There is no order database and no automated email.** Paystack holds the
transaction and emails the buyer a receipt. The site stores nothing.

The copy across the site, the FAQ and the four policy pages all describe this
behaviour accurately. If you move to a backend later, that copy has to change
with it.

---

## Before you can take a real payment

Nothing below is invented in the code. Where a detail is missing, the UI hides
it or shows a visible draft notice rather than faking it.

### 1. Paystack public key

Add `VITE_PAYSTACK_PUBLIC_KEY` in **Settings → Secrets and variables → Actions
→ Variables** on the repository. The workflow passes it to the build. Until it
is set, the checkout button explains that payments are not switched on rather
than failing silently.

Use `pk_test_...` first, then swap to `pk_live_...`.

### 2. The ebook itself

The PDF in the project root is a **first draft** titled *A Growing Up Guide for
Teen Girls*. The site sells it under the marketing title *Dear Daughter, Let's
Talk About Growing Up*. Do not launch until the final manuscript is approved,
then:

1. Put the final PDF at
   `public/downloads/dear-daughter-growing-up-guide.pdf`, or change
   `delivery.file` in `src/config/site.ts` to match your filename.
2. Update `product.pages` in `src/config/site.ts` if the page count changed.
3. Re-run `python scripts/prepare-assets.py` to regenerate the page previews
   from the new PDF.

Until that file exists, the download button on the thank-you page 404s.

### 3. Business details — `src/config/site.ts`

| Field | What is needed |
| --- | --- |
| `business.legalName` | Registered or trading name of the seller, used in the policies and the copyright line. |
| `business.supportEmail` | A monitored inbox. Until it is set, the FAQ and footer say the contact is still to be added. This is also the only way a buyer can reach you if a download fails. |
| `business.whatsapp` | Optional, international format (`+234...`). |
| `business.address` | Needed for the policy pages. |
| `business.socials` | Add only handles that genuinely exist. |

### 4. Legal sign-off

`/refund-policy` carries a visible "Decision needed" box. The draft terms are a
reasonable starting point for a digital product sold in Nigeria, but the
merchant must confirm them, and a Nigerian legal adviser should review all
four policies. Every policy page shows a draft banner until `legalName` and
`supportEmail` are filled in.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # client build, SSR build, then prerender
npm run lint         # TypeScript only, no emit
```

`npm run build` writes static HTML for every route into `dist/`, plus
`sitemap.xml` and `robots.txt`. Checkout works in `npm run dev` as long as
`VITE_PAYSTACK_PUBLIC_KEY` is in `.env.local`, because Paystack Inline runs
entirely in the browser.

### Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds and
publishes to Pages. Enable it once under **Settings → Pages → Source → GitHub
Actions**.

### The sub-path

The site is served from `/adolescent-girl/`, not from a domain root. That path
is set in `vite.config.ts` as `BASE`, and `src/lib/asset.ts` applies it to
every image and file URL. If you later add a custom domain, change `BASE` to
`'/'` **and** `site.url` in `src/config/site.ts` at the same time, or images
will break and canonical URLs will point at the wrong place.

### Images

`scripts/prepare-assets.py` is the asset pipeline. It cuts the cover, device
mockups and interior spreads out of the two supplied contact sheets, resizes
the photography into three widths each, renders a curated set of real pages
from the PDF, and writes everything to `public/images` as WebP. Total payload
for every variant on the site is about 3 MB; a single page view loads a small
fraction of that.

```bash
python scripts/prepare-assets.py
```

The source PNGs and the draft PDF are deliberately gitignored. They are the
licensed art and the unfinished product, and they do not belong in a public
repository.

---

## How a purchase flows

```
Buyer clicks a CTA
  → checkout dialog collects name + email        (InitiateCheckout fires)
  → Paystack Inline popup, public key, ₦3,500    (Paystack handles the card)
  → Paystack success callback
  → /order-success?reference=…                   (Purchase fires, once)
  → download button → /downloads/…pdf
```

The reference is generated client-side as `DD-<timestamp>-<random>` so an
order can be found in the Paystack dashboard, and the buyer's name, the CTA
that was clicked and their UTM parameters all travel into Paystack metadata
with the payment. That is what lets you tell which ad produced a sale.

---

## Tracking

Measurement IDs live in `src/config/site.ts` under `analytics`. While they are
`null`, no tags load and no consent bar appears.

`requireConsent` is `true`, so non-essential tags only load after the visitor
accepts, which is the defensible position under the Nigeria Data Protection
Act. Events: `PageView`, `ViewContent`, `InitiateCheckout`, `ClickCTA` (with
the CTA location, useful for comparing creatives) and `Purchase` with value
and currency. Purchase is deduplicated per reference, so a page refresh cannot
double count it.

The Conversions API is not available without a server, so Meta attribution
depends entirely on the browser pixel. Treat the Paystack dashboard as the
source of truth for revenue and use the pixel for relative comparison between
ad creatives.

---

## Testing checklist

With a Paystack **test** key:

- [ ] Checkout opens the Paystack popup and a test card completes.
- [ ] You land on `/order-success` with a reference shown.
- [ ] The download button returns the correct PDF.
- [ ] Closing the popup returns you to the form without an error.
- [ ] Refreshing the thank-you page does not fire a second Purchase event.
- [ ] A test payment appears in the Paystack dashboard with the buyer's name,
      the CTA source and the UTM parameters in its metadata.
- [ ] Swap to the live key and buy one real copy end to end before advertising.

Already verified during the build: TypeScript clean, all 7 routes prerender,
every asset path carries the `/adolescent-girl/` base, canonical URLs correct,
layouts from 320px to 1440px with no horizontal overflow, keyboard access to
the FAQ accordion, preview carousel and checkout dialog, focus trapping and
Escape in the dialog, and plain-language error text when Paystack cannot be
reached.

---

## Project layout

```
.github/workflows/   Pages build and deploy
public/
  downloads/         the final PDF goes here (public, see the warning above)
  images/            generated WebP, do not edit by hand
src/
  config/            site.ts (all business details), content.ts, faq.ts
  components/        header, footer, checkout, carousel, accordion, sticky bar
  sections/          the landing page, in order
  pages/             landing, legal, order-success, payment-failed
  lib/               paystack, analytics, SEO, asset paths
scripts/
  prepare-assets.py  image and page-preview pipeline
  prerender.mjs      static HTML, sitemap, robots
```

Business details are centralised in `src/config/site.ts`. Nothing is hardcoded
in components, so changing the price, title or contact details is a one-file
edit.
