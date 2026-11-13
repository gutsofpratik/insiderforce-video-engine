#!/usr/bin/env python3
"""
Capture real website or local HTML UI screenshots via headless Edge/Chrome
with optional exact region cropping (--crop x,y,w,h in viewport CSS px),
scrolling (--scroll-y), and InsiderForce elevated beveled card framing
(thick-white 3D bezel / white-bezel / dark macOS window + URL pill + soft studio shadow).
"""

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


BROWSER_CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "google-chrome",
    "chromium",
    "msedge",
]


def find_browser() -> str:
    for candidate in BROWSER_CANDIDATES:
        if os.path.isabs(candidate) and os.path.exists(candidate):
            return candidate
        resolved = shutil.which(candidate)
        if resolved:
            return resolved
    raise FileNotFoundError(
        "No Chrome/Edge browser found. Checked Windows default paths and PATH."
    )


def add_rounded_corners(img: Image.Image, radius: int) -> Image.Image:
    rgba = img.convert("RGBA")
    mask = Image.new("L", rgba.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), rgba.size], radius=radius, fill=255)
    out = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
    out.paste(rgba, (0, 0), mask)
    return out


def frame_insiderforce_card(
    raw_path: Path,
    out_path: Path,
    style: str = "thick-white",
    url_pill: str | None = None,
    target_width: int = 880,
    crop_box: tuple[int, int, int, int] | None = None,
    dpr: int = 2,
) -> None:
    raw = Image.open(raw_path).convert("RGBA")
    if crop_box is not None:
        cx, cy, cw, ch = crop_box
        x0 = max(0, cx * dpr)
        y0 = max(0, cy * dpr)
        x1 = min(raw.width, (cx + cw) * dpr)
        y1 = min(raw.height, (cy + ch) * dpr)
        if x1 > x0 and y1 > y0:
            raw = raw.crop((x0, y0, x1, y1))

    aspect = raw.height / max(1, raw.width)

    pad = 12 if style in ("white-bezel", "thick-white") else 0
    chrome_h = 44 if style == "macos-dark" else (58 if url_pill else 0)
    content_w = target_width - (pad * 2)
    content_h = int(round(content_w * aspect))
    resized = raw.resize((content_w, content_h), Image.Resampling.LANCZOS)
    rounded_content = add_rounded_corners(resized, radius=14 if pad else 20)

    card_w = target_width
    card_h = content_h + (pad * 2) + (44 if style == "macos-dark" else 0)

    margin_x = 64
    margin_top = (chrome_h + 26) if (url_pill and style != "macos-dark") else 36
    margin_bottom = 80
    canvas_w = card_w + margin_x * 2
    canvas_h = card_h + margin_top + margin_bottom
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))

    # Signature deep offset soft bottom-right studio shadow matching 031 / 046
    for off_x, off_y, alpha, blur in [(20, 26, 56, 26), (5, 9, 26, 9)]:
        sh = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        sd = ImageDraw.Draw(sh)
        sx0, sy0 = margin_x + off_x, margin_top + off_y
        sd.rounded_rectangle(
            [sx0, sy0, sx0 + card_w, sy0 + card_h],
            radius=24,
            fill=(16, 18, 26, alpha),
        )
        sh = sh.filter(ImageFilter.GaussianBlur(radius=blur))
        canvas = Image.alpha_composite(canvas, sh)

    card = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    kdraw = ImageDraw.Draw(card)
    if style == "macos-dark":
        kdraw.rounded_rectangle(
            [0, 0, card_w - 1, card_h - 1],
            radius=22,
            fill=(25, 25, 27, 255),
            outline=(56, 56, 62, 255),
            width=1,
        )
        dots = [(24, 22, (255, 95, 86, 255)), (44, 22, (255, 189, 46, 255)), (64, 22, (39, 201, 63, 255))]
        for dx, dy, color in dots:
            kdraw.ellipse([dx - 5, dy - 5, dx + 5, dy + 5], fill=color)
        card.paste(add_rounded_corners(resized, radius=14), (0, 44), add_rounded_corners(resized, radius=14))
    else:
        bg = (255, 255, 255, 255) if style in ("white-bezel", "thick-white") else (255, 255, 255, 0)
        outline = (222, 224, 230, 255)
        kdraw.rounded_rectangle(
            [0, 0, card_w - 1, card_h - 1],
            radius=24,
            fill=bg,
            outline=outline,
            width=2,
        )
        card.paste(rounded_content, (pad, pad), rounded_content)

    canvas.paste(card, (margin_x, margin_top), card)

    if url_pill and style != "macos-dark":
        pill_w = min(560, max(260, len(url_pill) * 12 + 78))
        pill_h = 48
        px0 = (canvas_w - pill_w) // 2
        py0 = max(8, margin_top - pill_h - 18)
        # Beveled pill shadow
        psh = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        ImageDraw.Draw(psh).rounded_rectangle(
            [px0 + 4, py0 + 8, px0 + pill_w + 4, py0 + pill_h + 8],
            radius=24,
            fill=(16, 18, 26, 36),
        )
        canvas = Image.alpha_composite(canvas, psh.filter(ImageFilter.GaussianBlur(radius=10)))
        pdraw = ImageDraw.Draw(canvas)
        pdraw.rounded_rectangle(
            [px0, py0, px0 + pill_w, py0 + pill_h],
            radius=24,
            fill=(255, 255, 255, 255),
            outline=(220, 223, 229, 255),
            width=2,
        )
        try:
            font = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 19)
        except OSError:
            font = ImageFont.load_default()
        bbox = pdraw.textbbox((0, 0), url_pill, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        pdraw.text(
            (px0 + (pill_w - tw) / 2, py0 + (pill_h - th) / 2 - 2),
            url_pill,
            font=font,
            fill=(24, 26, 34, 255),
        )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_path, "PNG")


def capture(
    url: str,
    out_path: Path,
    viewport: str = "1280x860",
    frame_style: str = "thick-white",
    url_pill: str | None = None,
    wait_ms: int = 3000,
    target_width: int = 880,
    crop: str | None = None,
) -> None:
    browser = find_browser()
    w, h = [int(x) for x in viewport.lower().split("x")]
    crop_box = None
    if crop:
        parts = [int(x.strip()) for x in crop.split(",")]
        if len(parts) != 4:
            raise ValueError("--crop must be x,y,w,h")
        crop_box = (parts[0], parts[1], parts[2], parts[3])

    target_url = Path(url).resolve().as_uri() if os.path.exists(url) else url
    dpr = 2

    with tempfile.TemporaryDirectory() as tmpdir:
        raw_png = Path(tmpdir) / "raw.png"
        user_data = Path(tmpdir) / "profile"
        cmd = [
            browser,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--window-size={w},{h}",
            f"--force-device-scale-factor={dpr}",
            f"--virtual-time-budget={wait_ms}",
            f"--user-data-dir={user_data}",
            f"--screenshot={raw_png}",
            target_url,
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=45)
        if res.returncode != 0 or not raw_png.exists():
            raise RuntimeError(f"Headless capture failed ({res.returncode}): {res.stderr}")

        if frame_style == "raw":
            out_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(raw_png, out_path)
        else:
            frame_insiderforce_card(
                raw_png,
                out_path,
                style=frame_style,
                url_pill=url_pill,
                target_width=target_width,
                crop_box=crop_box,
                dpr=dpr,
            )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Capture live web/local-HTML screenshots cropped & framed for InsiderForce Shorts."
    )
    parser.add_argument("--url", required=True, help="HTTP(S) URL or local .html file path")
    parser.add_argument("--out", required=True, help="Output PNG path")
    parser.add_argument("--viewport", default="1280x860", help="Viewport WxH before 2x DPR")
    parser.add_argument(
        "--frame-style",
        choices=["thick-white", "white-bezel", "macos-dark", "clean", "raw"],
        default="thick-white",
        help="Card framing style",
    )
    parser.add_argument("--url-pill", default=None, help="Optional domain text for top URL pill")
    parser.add_argument("--crop", default=None, help="Optional viewport crop 'x,y,w,h' in CSS pixels")
    parser.add_argument("--wait-ms", type=int, default=3000, help="Virtual time budget for JS settle")
    parser.add_argument("--width", type=int, default=880, help="Final card width in pixels (1080 canvas)")
    args = parser.parse_args()

    try:
        capture(
            url=args.url,
            out_path=Path(args.out),
            viewport=args.viewport,
            frame_style=args.frame_style,
            url_pill=args.url_pill,
            wait_ms=args.wait_ms,
            target_width=args.width,
            crop=args.crop,
        )
        print(f"Saved framed screenshot -> {args.out}")
        return 0
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
