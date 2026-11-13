"""Create compact brief.json per video for fast subagent reading + verify 87/87 telemetry coverage."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX_PATH = ROOT / "data" / "channel" / "index.json"
ANALYSIS_DIR = ROOT / "analysis" / "videos"


def main() -> None:
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    ok_count = 0
    missing = []
    no_subs = []

    for item in index:
        slug = item["slug"]
        tpath = ANALYSIS_DIR / slug / "telemetry.json"
        if not tpath.exists():
            missing.append(slug)
            continue
        ok_count += 1
        t = json.loads(tpath.read_text(encoding="utf-8"))
        sub = t.get("subtitles", {})
        if not sub.get("has_subtitles"):
            no_subs.append(slug)

        brief = {
            "slug": t["slug"],
            "id": t["id"],
            "url": t["url"],
            "video_meta": t["video_meta"],
            "youtube": t["youtube"],
            "subtitles": {
                "has_subtitles": sub.get("has_subtitles"),
                "word_count": sub.get("word_count"),
                "wpm": sub.get("wpm"),
                "hook_0_3s_text": sub.get("hook_0_3s_text"),
                "full_text": sub.get("full_text"),
            },
            "global_palette": t.get("global_palette"),
            "motion_summary": t.get("motion_summary"),
            "audio_summary": {
                k: v for k, v in (t.get("audio_summary") or {}).items() if k != "transients"
            } | {"transients_sample": (t.get("audio_summary") or {}).get("transients", [])[:25]},
            "audio_visual_sync_samples": t.get("audio_visual_sync_samples", [])[:20],
            "shots": [
                {
                    "shot": s["shot"],
                    "start_f": s["start_f"],
                    "end_f": s["end_f"],
                    "duration_sec": s["duration_sec"],
                    "settle_f": s["settle_f"],
                    "corner_bg_hex": s.get("palette", {}).get("corner_bg_hex"),
                    "top_colors": s.get("palette", {}).get("top_colors", [])[:3],
                }
                for s in t.get("shots", [])
            ],
            "anim_bursts": t.get("anim_bursts", [])[:25],
            "strips": sorted(p.name for p in (ANALYSIS_DIR / slug / "anim_strips").glob("*.png")),
            "fullres": sorted(p.name for p in (ANALYSIS_DIR / slug).glob("fullres_*.png")),
        }
        (ANALYSIS_DIR / slug / "brief.json").write_text(
            json.dumps(brief, indent=2, ensure_ascii=False), encoding="utf-8"
        )

    print(f"Verified {ok_count}/{len(index)} telemetry.json files.")
    if missing:
        print("MISSING:", missing)
    if no_subs:
        print(f"No YouTube subtitles ({len(no_subs)}):", no_subs)


if __name__ == "__main__":
    main()
