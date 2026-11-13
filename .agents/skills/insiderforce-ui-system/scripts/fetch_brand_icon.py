#!/usr/bin/env python3
"""
Fetch real official brand SVG icons (Simple Icons / custom URL) and render
HiDPI transparent PNGs + optional InsiderForce 3D beveled circular medallion pucks.
Never substitute fake geometric divs or emojis for real product logos.
"""

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


OFFICIAL_SLUGS = {
    "claude": ("claude", "D97757"),
    "anthropic": ("anthropic", "141413"),
    "github": ("github", "181717"),
    "supabase": ("supabase", "3ECF8E"),
    "vercel": ("vercel", "000000"),
    "notion": ("notion", "000000"),
    "openai": ("openai", "101828"),
    "cursor": ("cursor", "000000"),
    "linear": ("linear", "5E6AD2"),
    "docker": ("docker", "2496ED"),
    "python": ("python", "3776AB"),
    "typescript": ("typescript", "3178C6"),
    "react": ("react", "61DAFB"),
    "nextjs": ("nextdotjs", "000000"),
    "stripe": ("stripe", "635BFF"),
    "figma": ("figma", "F24E1E"),
    "raycast": ("raycast", "FF6363"),
    "n8n": ("n8n", "EA4B71"),
}

BROWSER_CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "msedge",
    "google-chrome",
]


def find_browser() -> str:
    for c in BROWSER_CANDIDATES:
        if os.path.isabs(c) and os.path.exists(c):
            return c
        r = shutil.which(c)
        if r:
            return r
    raise FileNotFoundError("Chrome/Edge not found for SVG rasterization.")


def fetch_svg(name_or_slug: str, color_hex: str | None = None) -> bytes:
    key = name_or_slug.lower().strip()
    if key in OFFICIAL_SLUGS:
        slug, default_hex = OFFICIAL_SLUGS[key]
        hex_code = (color_hex or default_hex).lstrip("#")
    else:
        slug = key
        hex_code = (color_hex or "181717").lstrip("#")

    url = f"https://cdn.simpleicons.org/{slug}/{hex_code}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read()


def rasterize_svg_via_browser(svg_bytes: bytes, size_px: int) -> Image.Image:
    browser = find_browser()
    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        html_path = td_path / "icon.html"
        raw_png = td_path / "raw.png"
        svg_str = svg_bytes.decode("utf-8", errors="replace")
        html = f"""<!doctype html>
<html><body style="margin:0;padding:0;background:transparent;display:flex;align-items:center;justify-content:center;width:{size_px}px;height:{size_px}px;overflow:hidden;">
<div style="width:{int(size_px*0.86)}px;height:{int(size_px*0.86)}px;display:flex;align-items:center;justify-content:center;">
{svg_str.replace('<svg ', '<svg style="width:100%;height:100%;display:block;" ')}
</div>
</body></html>"""
        html_path.write_text(html, encoding="utf-8")
        cmd = [
            browser,
            "--headless=new",
            "--disable-gpu",
            "--default-background-color=00000000",
            f"--window-size={size_px},{size_px}",
            "--force-device-scale-factor=2",
            f"--user-data-dir={td_path / 'prof'}",
            f"--screenshot={raw_png}",
            html_path.resolve().as_uri(),
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if res.returncode != 0 or not raw_png.exists():
            raise RuntimeError(f"Browser SVG rasterization failed: {res.stderr}")
        return Image.open(raw_png).convert("RGBA").resize((size_px, size_px), Image.Resampling.LANCZOS)


def bake_medallion_puck(icon_img: Image.Image, puck_size: int = 240, shape: str = "circle") -> Image.Image:
    """Wrap official icon inside InsiderForce's 3D beveled white puck + soft bottom-right shadow."""
    pad_tl = 32
    pad_br = 72
    cw = puck_size + pad_tl + pad_br
    ch = puck_size + pad_tl + pad_br
    canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))

    radius = puck_size // 2 if shape == "circle" else int(puck_size * 0.24)

    # Multi-layer directional bottom-right soft shadow
    for off_x, off_y, alpha, blur in [(18, 26, 48, 22), (6, 10, 26, 8)]:
        sh = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        sd = ImageDraw.Draw(sh)
        x0, y0 = pad_tl + off_x, pad_tl + off_y
        sd.rounded_rectangle([x0, y0, x0 + puck_size, y0 + puck_size], radius=radius, fill=(18, 20, 28, alpha))
        sh = sh.filter(ImageFilter.GaussianBlur(radius=blur))
        canvas = Image.alpha_composite(canvas, sh)

    # Crisp 3D beveled white puck shell
    puck = Image.new("RGBA", (puck_size, puck_size), (0, 0, 0, 0))
    pd = ImageDraw.Draw(puck)
    pd.rounded_rectangle(
        [0, 0, puck_size - 1, puck_size - 1],
        radius=radius,
        fill=(248, 248, 250, 255),
        outline=(216, 218, 224, 255),
        width=2,
    )
    # Subtle inner bright bevel highlight ring
    inset = 5
    pd.rounded_rectangle(
        [inset, inset, puck_size - 1 - inset, puck_size - 1 - inset],
        radius=max(4, radius - inset),
        fill=(255, 255, 255, 255),
        outline=(255, 255, 255, 255),
        width=2,
    )

    inner_icon_size = int(puck_size * 0.56)
    icon_scaled = icon_img.resize((inner_icon_size, inner_icon_size), Image.Resampling.LANCZOS)
    ix = (puck_size - inner_icon_size) // 2
    iy = (puck_size - inner_icon_size) // 2
    puck.paste(icon_scaled, (ix, iy), icon_scaled)

    canvas.paste(puck, (pad_tl, pad_tl), puck)
    return canvas


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch real brand logo SVGs and optionally bake 3D InsiderForce pucks.")
    parser.add_argument("--brand", required=True, help="Brand key or SimpleIcons slug (e.g., claude, github, supabase, vercel)")
    parser.add_argument("--color", default=None, help="Optional hex color override without # (e.g., D97757)")
    parser.add_argument("--out", required=True, help="Output PNG (or .svg) path")
    parser.add_argument("--size", type=int, default=220, help="Icon or medallion puck diameter in pixels")
    parser.add_argument("--style", choices=["raw-png", "circle-puck", "squircle-puck", "svg"], default="circle-puck")
    args = parser.parse_args()

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    svg_bytes = fetch_svg(args.brand, args.color)

    if args.style == "svg":
        out_path.write_bytes(svg_bytes)
        print(f"Saved official SVG -> {out_path}")
        return 0

    icon_png = rasterize_svg_via_browser(svg_bytes, args.size)
    if args.style == "raw-png":
        icon_png.save(out_path, "PNG")
    elif args.style == "circle-puck":
        bake_medallion_puck(icon_png, puck_size=args.size, shape="circle").save(out_path, "PNG")
    elif args.style == "squircle-puck":
        bake_medallion_puck(icon_png, puck_size=args.size, shape="squircle").save(out_path, "PNG")

    print(f"Saved {args.style} brand asset -> {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
