# Put the final ebook PDF in this folder

The file is served from this folder after payment, at:

    /downloads/dear-daughter-growing-up-guide.pdf

Set the exact filename in `src/config/site.ts` under `delivery.file`.

Two things to be clear about before you add it:

1. **This folder is public.** GitHub Pages serves every file in it to anyone
   who knows the URL. That is the accepted trade-off of automatic delivery
   without a server: buyers get the file instantly, and the link can be
   shared with people who did not pay.
2. **Do not put the draft here.** Only the final, approved manuscript.

The draft PDF in the project root is deliberately gitignored.
