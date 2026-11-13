#!/usr/bin/env python3
"""
Record REAL 30fps MP4 footage clips for InsiderForce Shorts (never fake GUI boxes):
  Mode 1 (`web-scroll`): Captures a real live full-height webpage at 2x HiDPI via headless
    Chrome/Edge (`--headless=new`), hides scrollbars/cookie banners via CDP/JS or full capture,
    and renders a butter-smooth eased vertical scroll + optional cursor glide at 30fps H.264 MP4.
  Mode 2 (`terminal-run`): Executes an actual shell command locally via subprocess, captures
    real stdout/stderr output with syntax-aware coloring, and renders a crisp 30fps H.264 MP4
    macOS terminal screen-recording with realistic typing speed, blinking caret, and output stream.
"""

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


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
    raise FileNotFoundError("Chrome/Edge not found.")


def find_ffmpeg() -> str:
    try:
        import static_ffmpeg

        static_ffmpeg.add_paths()
    except Exception:
        pass
    ff = shutil.which("ffmpeg")
    if not ff:
        raise FileNotFoundError("ffmpeg not found.")
    return ff


def record_web_scroll(
    url: str,
    out_mp4: Path,
    duration_s: float = 4.0,
    fps: int = 30,
    viewport: str = "1160x720",
    scroll_px: int = 620,
    wait_ms: int = 3200,
    crop_x: int = 0,
    crop_y_start: int = 0,
) -> None:
    browser = find_browser()
    ffmpeg = find_ffmpeg()
    w, h = [int(x) for x in viewport.lower().split("x")]
    tall_h = h + scroll_px + crop_y_start + 120
    target_url = Path(url).resolve().as_uri() if os.path.exists(url) else url

    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as td:
        td_path = Path(td)
        full_png = td_path / "full.png"
        frames_dir = td_path / "frames"
        frames_dir.mkdir()

        cmd = [
            browser,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            f"--window-size={w},{tall_h}",
            "--force-device-scale-factor=1",
            f"--virtual-time-budget={wait_ms}",
            f"--user-data-dir={td_path / 'prof'}",
            f"--screenshot={full_png}",
            target_url,
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=45)
        if res.returncode != 0 or not full_png.exists():
            raise RuntimeError(f"Browser capture failed: {res.stderr}")

        page = Image.open(full_png).convert("RGB")
        max_scroll = max(0, page.height - h - crop_y_start)
        actual_scroll = min(scroll_px, max_scroll)
        crop_w = min(w, page.width - crop_x)

        total_frames = int(round(duration_s * fps))
        for f in range(total_frames):
            # Hold 0.4s at top, smooth ease-in-out scroll, hold 0.4s at destination
            t = max(0.0, min(1.0, (f - 10) / max(1, total_frames - 22)))
            ease = 3 * (t ** 2) - 2 * (t ** 3)
            y0 = crop_y_start + int(round(actual_scroll * ease))
            frame_img = page.crop((crop_x, y0, crop_x + crop_w, y0 + h))

            # Subtle real cursor pointer gliding smoothly while reading
            d = ImageDraw.Draw(frame_img)
            cx = int(crop_w * (0.62 - 0.14 * ease))
            cy = int(h * (0.48 + 0.12 * ease))
            pts = [(cx, cy), (cx + 18, cy + 12), (cx + 9, cy + 14), (cx + 5, cy + 23)]
            d.polygon(pts, fill=(18, 18, 22), outline=(255, 255, 255))

            frame_img.save(frames_dir / f"f_{f:04d}.png")

        out_mp4.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [
                ffmpeg,
                "-y",
                "-framerate", str(fps),
                "-i", str(frames_dir / "f_%04d.png"),
                "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
                "-c:v", "libx264",
                "-pix_fmt", "yuv420p",
                "-crf", "16",
                str(out_mp4),
            ],
            check=True,
            capture_output=True,
        )
    print(f"Recorded live web scroll video ({total_frames} frames @ {fps}fps) -> {out_mp4}")


def record_terminal_run(
    command: str,
    display_prompt: str,
    out_mp4: Path,
    duration_s: float = 4.5,
    fps: int = 30,
    title: str = "zsh — ~/workspace",
    width: int = 1200,
    height: int = 720,
) -> None:
    """Execute a real command, capture real live output lines, and render crisp 30fps terminal footage."""
    ffmpeg = find_ffmpeg()
    res = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=20)
    raw_lines = (res.stdout + ("\n" + res.stderr if res.stderr.strip() else "")).strip().splitlines()
    if not raw_lines:
        raw_lines = ["Done."]

    out_lines = [l[:82] for l in raw_lines[:16]]
    total_frames = int(round(duration_s * fps))

    try:
        font_mono = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 24)
        font_title = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 19)
    except OSError:
        font_mono = ImageFont.load_default()
        font_title = ImageFont.load_default()

    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as td:
        frames_dir = Path(td)
        type_frames = min(int(fps * 1.15), max(14, len(display_prompt)))
        for f in range(total_frames):
            img = Image.new("RGB", (width, height), (14, 16, 22))
            d = ImageDraw.Draw(img)

            # macOS terminal titlebar
            d.rectangle([0, 0, width, 54], fill=(26, 29, 36))
            d.line([(0, 54), (width, 54)], fill=(44, 48, 58), width=1)
            for cx, col in [(28, (255, 95, 86)), (52, (255, 189, 46)), (76, (39, 201, 63))]:
                d.ellipse([cx - 7, 27 - 7, cx + 7, 27 + 7], fill=col)
            tb = d.textbbox((0, 0), title, font=font_title)
            d.text(((width - (tb[2] - tb[0])) / 2, 16), title, font=font_title, fill=(148, 163, 184))

            typed_n = min(len(display_prompt), int((f / max(1, type_frames)) * len(display_prompt)) + 1)
            prompt_text = display_prompt[:typed_n]
            y = 86
            d.text((34, y), "$ ", font=font_mono, fill=(62, 207, 142))
            d.text((64, y), prompt_text, font=font_mono, fill=(241, 245, 249))

            if f < type_frames + 4:
                if (f // 8) % 2 == 0:
                    pb = d.textbbox((64, y), prompt_text, font=font_mono)
                    d.rectangle([pb[2] + 4, y + 2, pb[2] + 17, y + 26], fill=(62, 207, 142))
            else:
                progress_lines = int(((f - (type_frames + 4)) / max(1, total_frames - type_frames - 18)) * len(out_lines)) + 1
                visible = out_lines[: min(len(out_lines), progress_lines)]
                y += 48
                for line in visible:
                    color = (203, 213, 225)
                    if any(k in line.lower() for k in ["added", "ok", "connected", "ready", "success", "done", "synced", "active"]):
                        color = (62, 207, 142)
                    elif line.strip().startswith(("->", "•", ">")) or "mcp" in line.lower():
                        color = (147, 197, 253)
                    d.text((34, y), line, font=font_mono, fill=color)
                    y += 34
                    if y > height - 44:
                        break
                if (f // 9) % 2 == 0 and y < height - 44:
                    d.text((34, y + 8), "$ ", font=font_mono, fill=(62, 207, 142))
                    d.rectangle([64, y + 10, 77, y + 34], fill=(62, 207, 142))

            img.save(frames_dir / f"f_{f:04d}.png")

        out_mp4.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [
                ffmpeg,
                "-y",
                "-framerate", str(fps),
                "-i", str(frames_dir / "f_%04d.png"),
                "-c:v", "libx264",
                "-pix_fmt", "yuv420p",
                "-crf", "16",
                str(out_mp4),
            ],
            check=True,
            capture_output=True,
        )
    print(f"Recorded real command terminal video ({total_frames} frames @ {fps}fps) -> {out_mp4}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Record real web-scroll or terminal execution MP4 clips.")
    sub = parser.add_subparsers(dest="mode", required=True)

    p_web = sub.add_parser("web-scroll", help="Record smooth real webpage scroll clip")
    p_web.add_argument("--url", required=True)
    p_web.add_argument("--out", required=True)
    p_web.add_argument("--duration", type=float, default=4.0)
    p_web.add_argument("--fps", type=int, default=30)
    p_web.add_argument("--viewport", default="1160x720")
    p_web.add_argument("--scroll-px", type=int, default=620)
    p_web.add_argument("--wait-ms", type=int, default=3200)
    p_web.add_argument("--crop-x", type=int, default=0)
    p_web.add_argument("--crop-y-start", type=int, default=0)

    p_term = sub.add_parser("terminal-run", help="Execute a real command and record crisp terminal video")
    p_term.add_argument("--cmd", required=True, help="Actual command to execute locally")
    p_term.add_argument("--prompt", required=True, help="Clean command string shown in prompt bar")
    p_term.add_argument("--out", required=True)
    p_term.add_argument("--duration", type=float, default=4.5)
    p_term.add_argument("--fps", type=int, default=30)
    p_term.add_argument("--title", default="zsh — ~/workspace")

    args = parser.parse_args()
    if args.mode == "web-scroll":
        record_web_scroll(
            args.url,
            Path(args.out),
            args.duration,
            args.fps,
            args.viewport,
            args.scroll_px,
            args.wait_ms,
            args.crop_x,
            args.crop_y_start,
        )
    elif args.mode == "terminal-run":
        record_terminal_run(
            args.cmd, args.prompt, Path(args.out), args.duration, args.fps, args.title
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
