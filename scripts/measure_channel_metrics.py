"""Measure exact quantitative design-system, easing, layout, and audio-sync metrics across all 87 Shorts."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = ROOT / "data" / "channel" / "index.json"
ANALYSIS_DIR = ROOT / "analysis" / "videos"
OUT_PATH = ROOT / "analysis" / "QUANTITATIVE_METRICS.json"


def main() -> None:
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))

    fps_hist = Counter()
    res_hist = Counter()
    durations = []
    wpms = []
    bpms = []
    ducking_floors = []
    speech_pcts = []
    shot_counts = []
    shot_durs = []
    burst_durs_f = []
    burst_durs_ms = []
    static_hold_pcts = []
    bg_hex_counts = Counter()
    sync_offsets = Counter()
    transient_kinds = Counter()

    # Spatial activity heatmap (16x9 vertical bins across 1920x1080)
    # Using changed bbox centers from frame_metrics!
    y_zones = Counter()  # top (<0.25), upper_mid (0.25-0.50), lower_mid (0.50-0.75), bottom (>0.75)

    # Normalized motion curve over frames 0..11 of medium bursts (dur_f between 6 and 16)
    burst_curves: list[list[float]] = []

    processed = 0
    for item in index:
        slug = item["slug"]
        tpath = ANALYSIS_DIR / slug / "telemetry.json"
        if not tpath.exists():
            continue
        processed += 1
        t = json.loads(tpath.read_text(encoding="utf-8"))
        vm = t["video_meta"]
        fps = float(vm["fps"] or 30.0)
        fps_hist[str(round(fps))] += 1
        res_hist[f"{vm['width']}x{vm['height']}"] += 1
        durations.append(float(vm["duration_sec"]))

        sub = t["subtitles"]
        if sub.get("wpm"):
            wpms.append(float(sub["wpm"]))

        au = t["audio_summary"]
        if au.get("estimated_bpm"):
            bpms.append(float(au["estimated_bpm"]))
        if au.get("music_floor_during_pauses_db") is not None and au["music_floor_during_pauses_db"] > -79:
            ducking_floors.append(float(au["music_floor_during_pauses_db"]))
        if au.get("speech_active_pct") is not None:
            speech_pcts.append(float(au["speech_active_pct"]))
        for tr in au.get("transients", []):
            transient_kinds[tr["kind_guess"]] += 1

        for sp in t.get("audio_visual_sync_samples", []):
            sync_offsets[int(sp["visual_minus_audio_f"])] += 1

        ms = t["motion_summary"]
        shot_counts.append(int(ms["total_shots"]))
        static_hold_pcts.append(float(ms["static_hold_pct"]))
        for sh in t["shots"]:
            shot_durs.append(float(sh["duration_sec"]))
            cbg = sh.get("palette", {}).get("corner_bg_hex")
            if cbg:
                bg_hex_counts[cbg.upper()] += 1

        fm = t.get("frame_metrics", [])
        for m in fm:
            bb = m.get("bbox")
            if bb:
                yc = 0.5 * (bb[1] + bb[3])
                if yc < 0.25:
                    y_zones["top_0_25"] += 1
                elif yc < 0.50:
                    y_zones["upper_mid_25_50"] += 1
                elif yc < 0.75:
                    y_zones["lower_mid_50_75"] += 1
                else:
                    y_zones["bottom_75_100"] += 1

        for b in t.get("anim_bursts", []):
            burst_durs_f.append(int(b["dur_f"]))
            burst_durs_ms.append(float(b["dur_ms"]))
            if 6 <= b["dur_f"] <= 14 and b["start_f"] + 12 < len(fm):
                vals = [fm[b["start_f"] + k]["pct_chg"] for k in range(12)]
                mx = max(vals) or 1.0
                burst_curves.append([round(v / mx, 3) for v in vals])

    def summarize(arr: list[float]) -> dict[str, Any]:
        if not arr:
            return {}
        a = np.array(arr, dtype=float)
        return {
            "count": len(arr),
            "min": round(float(np.min(a)), 2),
            "p10": round(float(np.percentile(a, 10)), 2),
            "p25": round(float(np.percentile(a, 25)), 2),
            "median": round(float(np.median(a)), 2),
            "mean": round(float(np.mean(a)), 2),
            "p75": round(float(np.percentile(a, 75)), 2),
            "p90": round(float(np.percentile(a, 90)), 2),
            "max": round(float(np.max(a)), 2),
        }

    mean_curve = (
        [round(float(x), 3) for x in np.mean(np.array(burst_curves), axis=0)] if burst_curves else []
    )
    total_yz = sum(y_zones.values()) or 1
    y_zone_pct = {k: round(100.0 * v / total_yz, 1) for k, v in y_zones.items()}

    out = {
        "videos_measured": processed,
        "fps_distribution": dict(fps_hist),
        "resolution_distribution": dict(res_hist),
        "duration_sec": summarize(durations),
        "wpm": summarize(wpms),
        "estimated_bpm": summarize(bpms),
        "speech_active_pct": summarize(speech_pcts),
        "music_floor_during_pauses_db": summarize(ducking_floors),
        "shots_per_video": summarize([float(x) for x in shot_counts]),
        "shot_duration_sec": summarize(shot_durs),
        "anim_burst_dur_frames": summarize([float(x) for x in burst_durs_f]),
        "anim_burst_dur_ms": summarize(burst_durs_ms),
        "static_hold_pct": summarize(static_hold_pcts),
        "avg_normalized_motion_curve_12f": mean_curve,
        "motion_vertical_zone_pct": y_zone_pct,
        "top_shot_corner_bg_hex": dict(bg_hex_counts.most_common(20)),
        "audio_visual_sync_offset_frames": dict(sync_offsets.most_common(15)),
        "transient_kinds_total": dict(transient_kinds.most_common()),
    }
    OUT_PATH.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH} ({processed} videos)")


if __name__ == "__main__":
    main()
