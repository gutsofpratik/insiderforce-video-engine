"""Fetch metadata and download all Shorts from @InsiderForce."""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

import static_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
CHANNEL_DIR = DATA_DIR / "channel"
VIDEOS_DIR = DATA_DIR / "videos"

CHANNEL_SHORTS_URL = "https://www.youtube.com/@InsiderForce/shorts"


def ensure_ffmpeg() -> str:
    """Register static-ffmpeg binaries and return directory containing ffmpeg/ffprobe."""
    static_ffmpeg.add_paths()
    for p in os.environ.get("PATH", "").split(os.pathsep):
        if p and (Path(p) / "ffmpeg.exe").exists():
            return p
    return ""


def fetch_playlist_metadata() -> dict:
    """Query yt-dlp flat playlist for all Shorts on the channel."""
    CHANNEL_DIR.mkdir(parents=True, exist_ok=True)
    out_json = CHANNEL_DIR / "shorts_playlist.json"
    cmd = [
        sys.executable,
        "-m",
        "yt_dlp",
        "--flat-playlist",
        "--dump-single-json",
        "--no-warnings",
        CHANNEL_SHORTS_URL,
    ]
    print(f"Running: {' '.join(cmd)}")
    res = subprocess.run(cmd, capture_output=True, text=True, check=True, encoding="utf-8")
    data = json.loads(res.stdout)
    out_json.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    return data


def build_index(playlist: dict) -> list[dict]:
    """Build normalized index list of all Shorts."""
    entries = playlist.get("entries") or []
    items: list[dict] = []
    for idx, entry in enumerate(entries, start=1):
        vid = entry.get("id")
        if not vid:
            continue
        url = entry.get("url") or f"https://www.youtube.com/shorts/{vid}"
        if not url.startswith("http"):
            url = f"https://www.youtube.com/shorts/{vid}"
        items.append(
            {
                "index": idx,
                "slug": f"{idx:03d}_{vid}",
                "id": vid,
                "title": entry.get("title") or "",
                "duration": entry.get("duration"),
                "view_count": entry.get("view_count"),
                "url": url,
            }
        )
    index_path = CHANNEL_DIR / "index.json"
    index_path.write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Indexed {len(items)} Shorts -> {index_path}")
    return items


def download_one(item: dict, ffmpeg_dir: str) -> tuple[str, bool, str]:
    """Download one Short (mp4 + info.json + subs + thumbnail)."""
    slug = item["slug"]
    vid_dir = VIDEOS_DIR / slug
    vid_dir.mkdir(parents=True, exist_ok=True)
    mp4_path = vid_dir / f"{slug}.mp4"
    info_path = vid_dir / f"{slug}.info.json"

    if mp4_path.exists() and mp4_path.stat().st_size > 10_000 and info_path.exists():
        return slug, True, "cached"

    out_tmpl = str(vid_dir / f"{slug}.%(ext)s")
    cmd = [
        sys.executable,
        "-m",
        "yt_dlp",
        "--no-warnings",
        "--ignore-errors",
        "--retries",
        "5",
        "--fragment-retries",
        "5",
        "-f",
        "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/bv*+ba/b",
        "--merge-output-format",
        "mp4",
        "--write-info-json",
        "--write-auto-subs",
        "--write-subs",
        "--sub-langs",
        "en.*,en",
        "--sub-format",
        "json3/vtt/best",
        "--write-thumbnail",
        "--convert-thumbnails",
        "png",
        "-o",
        out_tmpl,
        item["url"],
    ]
    if ffmpeg_dir:
        cmd.extend(["--ffmpeg-location", ffmpeg_dir])

    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    ok = mp4_path.exists() and mp4_path.stat().st_size > 10_000
    msg = "ok" if ok else f"rc={proc.returncode}: {(proc.stderr or proc.stdout)[-400:]}"
    return slug, ok, msg


def main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    ffmpeg_dir = ensure_ffmpeg()
    print(f"FFmpeg dir: {ffmpeg_dir or '(PATH)'}")

    playlist_path = CHANNEL_DIR / "shorts_playlist.json"
    if mode == "list" or not playlist_path.exists():
        playlist = fetch_playlist_metadata()
        items = build_index(playlist)
    else:
        playlist = json.loads(playlist_path.read_text(encoding="utf-8"))
        items = build_index(playlist)

    if mode == "list":
        return

    VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
    workers = int(os.environ.get("DL_WORKERS", "4"))
    print(f"Downloading {len(items)} Shorts with {workers} workers...")
    failures: list[tuple[str, str]] = []
    done = 0
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futs = {pool.submit(download_one, item, ffmpeg_dir): item for item in items}
        for fut in as_completed(futs):
            slug, ok, msg = fut.result()
            done += 1
            if not ok:
                failures.append((slug, msg))
                print(f"[{done}/{len(items)}] FAIL {slug}: {msg}")
            elif msg != "cached":
                print(f"[{done}/{len(items)}] OK   {slug}")
            elif done % 20 == 0 or done == len(items):
                print(f"[{done}/{len(items)}] ... (cached {slug})")

    if failures:
        fail_path = CHANNEL_DIR / "download_failures.json"
        fail_path.write_text(json.dumps(failures, indent=2), encoding="utf-8")
        print(f"Completed with {len(failures)} failures -> {fail_path}")
        sys.exit(1)
    print(f"All {len(items)} Shorts downloaded successfully!")


if __name__ == "__main__":
    main()
