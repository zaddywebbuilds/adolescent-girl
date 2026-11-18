"""Build the social sharing image (Open Graph / WhatsApp preview).

Run via scripts/prepare-assets.py, or directly:  python scripts/make-og.py

Why a dedicated file rather than reusing the cover:
  - Link previews are landscape. A portrait cover gets cropped to a strip
    or shown as a tiny thumbnail.
  - WhatsApp is unreliable with WebP previews, so this is a JPEG.
  - WhatsApp also skips previews over a few hundred KB, so it is kept small.
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "images", "og-image.jpg")
COVER = os.path.join(ROOT, "public", "images", "cover-flat.webp")

W, H = 1200, 630
CREAM = (250, 247, 242)
PLUM = (72, 44, 64)
CTA = (96, 51, 72)
GOLD = (196, 164, 106)
ROSE = (240, 220, 223)
SAGE = (228, 235, 224)
CHARCOAL = (41, 37, 42)

FONTS = "C:/Windows/Fonts/"


def font(name, size):
    for candidate in (name, "georgia.ttf", "arial.ttf"):
        path = os.path.join(FONTS, candidate)
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def wrap(draw, text, fnt, max_w):
    words, lines, line = text.split(), [], ""
    for w in words:
        trial = f"{line} {w}".strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            line = trial
        else:
            if line:
                lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


def main():
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)

    # Soft brand shapes, echoing the hero background
    d.ellipse((W - 250, -190, W + 170, 230), fill=ROSE)
    d.ellipse((-200, H - 190, 230, H + 190), fill=SAGE)

    pad = 64
    text_w = 660

    serif_bold = font("georgiab.ttf", 56)
    sans_bold = font("arialbd.ttf", 21)
    sans = font("arial.ttf", 25)

    y = 92
    d.text((pad, y), "FOR NIGERIAN GIRLS AGED 10-17", font=sans_bold, fill=CTA)
    y += 48

    for line in wrap(d, "Growing Up Comes With Questions.", serif_bold, text_w):
        d.text((pad, y), line, font=serif_bold, fill=PLUM)
        y += 66
    for line in wrap(d, "Help Your Daughter Find Answers", serif_bold, text_w):
        d.text((pad, y), line, font=serif_bold, fill=CTA)
        y += 66

    # Gold rule, the same accent the hero headline carries
    y += 10
    d.rounded_rectangle((pad, y, pad + 150, y + 5), radius=3, fill=GOLD)
    y += 40

    d.text(
        (pad, y),
        "Puberty  \u00b7  Periods  \u00b7  Confidence  \u00b7  Personal Safety",
        font=sans,
        fill=CHARCOAL,
    )
    y += 44
    # Georgia carries no naira glyph and would draw an empty box, so the
    # price is set in Cambria, which has it.
    lead_font = font("georgiab.ttf", 30)
    lead = "160-page digital guide  \u00b7  "
    d.text((pad, y), lead, font=lead_font, fill=PLUM)
    d.text(
        (pad + d.textlength(lead, font=lead_font), y - 1),
        "\u20a63,500",
        font=font("cambriab.ttf", 31),
        fill=PLUM,
    )

    # Cover, sized to sit inside the card with room to breathe
    if os.path.exists(COVER):
        cover = Image.open(COVER).convert("RGB")
        target_h = H - 150
        target_w = round(cover.width * target_h / cover.height)
        cover = cover.resize((target_w, target_h), Image.LANCZOS)
        x = W - target_w - 80
        y0 = (H - target_h) // 2
        shadow = Image.new("RGB", (target_w + 16, target_h + 16), (226, 216, 222))
        img.paste(shadow, (x - 4, y0 + 8))
        img.paste(cover, (x, y0))

    img.save(OUT, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"  {os.path.relpath(OUT, ROOT)}  {W}x{H}  {os.path.getsize(OUT)//1024}KB")


if __name__ == "__main__":
    main()
