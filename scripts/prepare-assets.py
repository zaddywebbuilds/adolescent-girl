"""Build web-ready images from the source art in the project root.

Run:  python scripts/prepare-assets.py
Outputs optimised .webp files into public/images/.
Re-run whenever the source PNGs or the ebook PDF change.
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "images")
PREVIEW = os.path.join(OUT, "preview")
os.makedirs(PREVIEW, exist_ok=True)

SHEET_A = "Dear Daughter_ Growing Up Together-2.png"
SHEET_B = "Dear Daughter_ Growing Up Together-3.png"

# The book that buyers actually download. Covers and page previews are
# rendered from this file, so the site can never advertise a cover or an
# interior that differs from the product.
EBOOK = os.path.join("public", "downloads", "dear-daughter-growing-up-guide.pdf")

# Panels cut from the two contact sheets (both 1536x1024).
CROPS = {
    "devices":           (SHEET_A, (513, 2, 985, 430)),
    "girl-reading-book": (SHEET_B, (1040, 0, 1536, 512)),
    "schoolgirls":       (SHEET_B, (697, 795, 1150, 1024)),
    "father-daughter":   (SHEET_A, (1155, 712, 1536, 1020)),
}

# Full-frame photography kept as-is.
PHOTOS = {
    "mother-daughter-sofa":   "Warm Mother-Daughter Conversation-1.png",
    "mother-daughter-warm":   "Affectionate Mother-Daughter Moment-4.png",
    "girl-reading-bed":       "Cozy Windowlight Reading Nook-5.png",
    "girl-reading-sofa":      "Cozy Botanical Reading Moment-6.png",
    "book-tablet-mockup":     "Elegant Stationery Mockup with Botanical Accents-7.png",
    "kitchen-conversation":   "Warm Kitchen Conversation-8.png",
    "reading-together":       "Mother and Daughter Reading Together-9.png",
    "desk-mockup":            "Cozy Editorial Desk Mockup-10.png",
    "study-tablet":           "Cozy Study Session with Tablet-11.png",
    "study-pink":             "Cozy Study Session with Pink Accents-12.png",
    "confident-smile":        "Confident Smile in a Cozy Bedroom-13.png",
    "portrait-braids":        "Cozy Bedroom Portrait with Braids-14.png",
}

# Curated interior pages for the "Take a Look Inside" carousel, by the
# finished book's own page numbers.
PREVIEW_PAGES = [7, 14, 22, 40, 65, 100, 127]


def save_webp(img, name, widths, quality=80):
    img = img.convert("RGB")
    made = []
    for w in widths:
        if w >= img.width:
            out = img
            suffix = ""
        else:
            h = round(img.height * w / img.width)
            out = img.resize((w, h), Image.LANCZOS)
            suffix = f"-{w}"
        path = os.path.join(OUT, f"{name}{suffix}.webp")
        out.save(path, "WEBP", quality=quality, method=6)
        made.append((os.path.relpath(path, ROOT), out.size, os.path.getsize(path)))
    return made


def main():
    sheets = {}
    total = 0
    for name, (sheet, box) in CROPS.items():
        if sheet not in sheets:
            sheets[sheet] = Image.open(os.path.join(ROOT, sheet))
        img = sheets[sheet].crop(box)
        for p, size, b in save_webp(img, name, [img.width], quality=88):
            total += b
            print(f"  {p:<46} {size[0]}x{size[1]:<5} {b//1024}KB")

    for name, src in PHOTOS.items():
        path = os.path.join(ROOT, src)
        if not os.path.exists(path):
            print(f"  ! missing source: {src}")
            continue
        img = Image.open(path)
        for p, size, b in save_webp(img, name, [1400, 800, 480]):
            total += b
            print(f"  {p:<46} {size[0]}x{size[1]:<5} {b//1024}KB")

    # Cover, straight from page one of the book people receive.
    try:
        import fitz as _fitz
    except ImportError:
        print("  ! PyMuPDF not installed, skipping cover render")
    else:
        pdf_path = os.path.join(ROOT, EBOOK)
        if os.path.exists(pdf_path):
            doc = _fitz.open(pdf_path)
            pix = doc[0].get_pixmap(dpi=200)
            cover = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            for p, size, b in save_webp(cover, "cover-flat", [cover.width], quality=88):
                total += b
                print(f"  {p:<46} {size[0]}x{size[1]:<5} {b//1024}KB")
            for p, size, b in save_webp(cover, "cover-3d", [cover.width], quality=88):
                total += b
                print(f"  {p:<46} {size[0]}x{size[1]:<5} {b//1024}KB")
            doc.close()

    try:
        import fitz
    except ImportError:
        print("  ! PyMuPDF not installed, skipping page previews")
    else:
        pdf = os.path.join(ROOT, EBOOK)
        if os.path.exists(pdf):
            doc = fitz.open(pdf)
            for n in PREVIEW_PAGES:
                pix = doc[n - 1].get_pixmap(dpi=150)
                img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
                for w, q in ((900, 82), (320, 78)):
                    h = round(img.height * w / img.width)
                    small = img.resize((w, h), Image.LANCZOS)
                    tag = "" if w == 900 else "-thumb"
                    out = os.path.join(PREVIEW, f"page-{n:03d}{tag}.webp")
                    small.save(out, "WEBP", quality=q, method=6)
                    b = os.path.getsize(out)
                    total += b
                    print(f"  {os.path.relpath(out, ROOT):<46} {w}x{h:<5} {b//1024}KB")
        else:
            print("  ! ebook PDF not found, skipping page previews")

    print(f"\nTotal image payload: {total//1024}KB")


if __name__ == "__main__":
    main()
