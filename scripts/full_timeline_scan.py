#!/usr/bin/env python3
"""
Full Start-to-End (frame 0 -> end) per-frame scanner across all 87 InsiderForce Shorts.
For every video:
  1. Scans 100% of frames at 30fps for pixel delta curves, real-footage vs UI-card vs typography
     heuristics, blur breath dips, and static vs active segments from 0% to 100%.
  2. Saves 2-3 dense chronological contact sheets covering the ENTIRE runtime (~every 0.5s, 0%->100%)
     plus a consecutive 30fps mid-video kinetic-text burst strip and late-video strip.
  3. Outputs per-video `full_scan.json` and global `analysis/FULL_TIMELINE_STATS.json`.
"""

import json
import sys
from pathlib import Path

import cv2
import numpy as np


VIDEOS_DIR = Path("data/videos")
ANALYSIS_DIR = Path("analysis/videos")


def annotate(frame: np.ndarray, label: str, w: int = 216, h: int = 384) -> np.ndarray:
    thumb = cv2.resize(frame, (w, h), interpolation=cv2.INTER_AREA)
    cv2.rectangle(thumb, (0, 0), (w, 22), (16, 16, 20), -1)
    cv2.putText(thumb, label, (5, 16), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (255, 255, 255), 1, cv2.LINE_AA)
    return thumb


def classify_frame(frame_bgr: np.ndarray) -> dict:
    """Estimate light-canvas vs embedded dark UI vs photographic/video richness."""
    small = cv2.resize(frame_bgr, (180, 320))
    gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
    # Light canvas share (bright >225, low saturation <20)
    light_bg = float(np.mean((gray > 220) & (hsv[:, :, 1] < 22)))
    # Saturated / colorful / photographic share
    vivid = float(np.mean(hsv[:, :, 1] > 45))
    # Dark embedded card/terminal share
    dark = float(np.mean(gray < 48))
    # Edge density
    edges = cv2.Canny(gray, 50, 150)
    edge_density = float(np.mean(edges > 0))
    return {
        "light_bg": round(light_bg, 3),
        "vivid": round(vivid, 3),
        "dark": round(dark, 3),
        "edge": round(edge_density, 3),
    }


def process_video(slug_dir: Path) -> dict | None:
    slug = slug_dir.name
    mp4s = list((VIDEOS_DIR / slug).glob("*.mp4"))
    if not mp4s:
        return None
    mp4 = mp4s[0]

    cap = cv2.VideoCapture(str(mp4))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    deltas = []
    prev_small = None
    frame_stats = []
    sampled_05s = []  # every ~0.5s across entire video (0% -> 100%)
    step_05s = max(1, int(round(fps * 0.5)))

    # First pass reads every single frame from 0 to N-1 cleanly
    idx = 0
    mid_text_candidates = []
    late_text_candidates = []

    while True:
        ok, frame = cap.read()
        if not ok:
            break
        small = cv2.resize(frame, (135, 240))
        gray_s = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
        if prev_small is not None:
            diff = float(np.mean(np.abs(gray_s.astype(np.int16) - prev_small.astype(np.int16))) / 255.0)
        else:
            diff = 0.0
        deltas.append(diff)
        prev_small = gray_s

        if idx % step_05s == 0:
            st = classify_frame(frame)
            st["f"] = idx
            st["t"] = round(idx / fps, 2)
            frame_stats.append(st)
            sampled_05s.append((idx, frame.copy()))
            # Identify good kinetic typography or mid-motion bursts (moderate motion on light canvas)
            pct = idx / max(1, total_frames)
            if 0.28 <= pct <= 0.65 and diff > 0.008 and diff < 0.14:
                mid_text_candidates.append(idx)
            elif 0.68 <= pct <= 0.96 and diff > 0.008 and diff < 0.14:
                late_text_candidates.append(idx)

        idx += 1

    cap.release()
    n_frames = idx
    if n_frames == 0:
        return None

    out_dir = ANALYSIS_DIR / slug / "full_scan"
    out_dir.mkdir(parents=True, exist_ok=True)

    # Save 2 or 3 chronological sheets covering 0% -> 100% at ~0.5s intervals (6 columns x N rows)
    cols = 8
    rows_per_sheet = 6  # 48 tiles per sheet = ~24 seconds per sheet
    per_sheet = cols * rows_per_sheet
    num_sheets = (len(sampled_05s) + per_sheet - 1) // per_sheet
    sheet_paths = []
    for s_idx in range(num_sheets):
        chunk = sampled_05s[s_idx * per_sheet : (s_idx + 1) * per_sheet]
        tiles = [annotate(fr, f"f{fi} {fi/fps:.1f}s") for fi, fr in chunk]
        while len(tiles) < per_sheet:
            tiles.append(np.zeros((384, 216, 3), dtype=np.uint8))
        grid_rows = [np.hstack(tiles[r * cols : (r + 1) * cols]) for r in range(rows_per_sheet)]
        sheet_img = np.vstack(grid_rows)
        sp = out_dir / f"timeline_sheet_{s_idx + 1:02d}.jpg"
        cv2.imwrite(str(sp), sheet_img, [cv2.IMWRITE_JPEG_QUALITY, 86])
        sheet_paths.append(sp.name)

    # Extract 2 consecutive-frame (1f @ 30fps) strips: 1 mid-video kinetic strip + 1 late/outro strip
    mid_anchor = mid_text_candidates[len(mid_text_candidates) // 2] if mid_text_candidates else int(n_frames * 0.45)
    late_anchor = late_text_candidates[len(late_text_candidates) // 2] if late_text_candidates else int(n_frames * 0.82)

    cap = cv2.VideoCapture(str(mp4))
    for label_name, start_f in [("mid_30fps_strip.jpg", max(0, mid_anchor - 2)), ("late_30fps_strip.jpg", max(0, late_anchor - 2))]:
        cap.set(cv2.CAP_PROP_POS_FRAMES, start_f)
        seq = []
        for k in range(16):
            ok, fr = cap.read()
            if not ok:
                break
            seq.append(annotate(fr, f"f{start_f+k} +{(k/fps)*1000:.0f}ms", w=270, h=480))
        if seq:
            while len(seq) < 16:
                seq.append(np.zeros((480, 270, 3), dtype=np.uint8))
            r1 = np.hstack(seq[:8])
            r2 = np.hstack(seq[8:16])
            cv2.imwrite(str(out_dir / label_name), np.vstack([r1, r2]), [cv2.IMWRITE_JPEG_QUALITY, 90])
    cap.release()

    # Classify video segments across 0%->100%
    mean_light = float(np.mean([s["light_bg"] for s in frame_stats])) if frame_stats else 0.0
    vivid_frames = sum(1 for s in frame_stats if s["vivid"] > 0.25)
    dark_card_frames = sum(1 for s in frame_stats if s["dark"] > 0.18)
    pure_typo_frames = sum(1 for s in frame_stats if s["light_bg"] > 0.85 and s["vivid"] < 0.08 and s["dark"] < 0.08)

    # Blur breath / full-canvas wipe peaks (high motion spikes > 0.16)
    heavy_transitions = [i for i, d in enumerate(deltas) if d > 0.16]

    summary = {
        "slug": slug,
        "total_frames": n_frames,
        "fps": round(fps, 3),
        "duration_sec": round(n_frames / fps, 3),
        "sampled_05s_count": len(sampled_05s),
        "timeline_sheets": sheet_paths,
        "composition_share": {
            "pure_kinetic_typo_pct": round(100.0 * pure_typo_frames / max(1, len(frame_stats)), 1),
            "embedded_dark_ui_or_terminal_pct": round(100.0 * dark_card_frames / max(1, len(frame_stats)), 1),
            "rich_footage_or_colorful_ui_pct": round(100.0 * vivid_frames / max(1, len(frame_stats)), 1),
            "mean_light_canvas_pct": round(100.0 * mean_light, 1),
        },
        "mid_30fps_anchor_frame": mid_anchor,
        "late_30fps_anchor_frame": late_anchor,
        "heavy_transition_frame_count": len(heavy_transitions),
    }
    (out_dir / "full_scan.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    return summary


def main() -> int:
    slug_dirs = sorted([p for p in VIDEOS_DIR.iterdir() if p.is_dir()])
    results = []
    for idx, sd in enumerate(slug_dirs, 1):
        res = process_video(sd)
        if res:
            results.append(res)
        if idx % 10 == 0 or idx == len(slug_dirs):
            print(f"Processed {idx}/{len(slug_dirs)} full timelines...", flush=True)

    agg = {
        "videos_scanned": len(results),
        "total_frames_scanned": sum(r["total_frames"] for r in results),
        "avg_pure_kinetic_typo_pct": round(float(np.mean([r["composition_share"]["pure_kinetic_typo_pct"] for r in results])), 1),
        "avg_embedded_dark_ui_pct": round(float(np.mean([r["composition_share"]["embedded_dark_ui_or_terminal_pct"] for r in results])), 1),
        "avg_rich_footage_or_colorful_ui_pct": round(float(np.mean([r["composition_share"]["rich_footage_or_colorful_ui_pct"] for r in results])), 1),
        "avg_light_canvas_pct": round(float(np.mean([r["composition_share"]["mean_light_canvas_pct"] for r in results])), 1),
        "per_video": results,
    }
    Path("analysis/FULL_TIMELINE_STATS.json").write_text(json.dumps(agg, indent=2), encoding="utf-8")
    print(f"COMPLETE: Scanned {agg['videos_scanned']} videos ({agg['total_frames_scanned']} total frames).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
