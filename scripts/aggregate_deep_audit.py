#!/usr/bin/env python3
"""
Aggregate all 87 start-to-end `deep_audit.json` files + `FULL_TIMELINE_STATS.json`
+ `FULL_AUDIO_FORENSICS.json` into `analysis/DEEP_AUDIT_87_SUMMARY.json`.
"""

import json
import pathlib
import statistics
from collections import Counter


def main() -> None:
    root = pathlib.Path(".")
    audit_files = sorted(root.glob("analysis/videos/*/deep_audit.json"))
    all_vids = sorted([p for p in root.glob("analysis/videos/*") if p.is_dir()])

    ratios = {
        "real_video_or_screen_recording_pct": [],
        "framed_real_screenshots_pct": [],
        "real_brand_icons_and_pucks_pct": [],
        "pure_kinetic_typography_pct": [],
    }
    videos_with_real_video = 0
    videos_with_screenshots = 0
    videos_with_icons_pucks = 0
    marker_counter = Counter()
    closing_themes = Counter()
    asset_keywords = Counter()

    voice_peaks = []
    music_floors = []
    gaps = []
    per_video_brief = []

    for af in audit_files:
        data = json.loads(af.read_text(encoding="utf-8"))
        slug = data.get("slug", af.parent.name)
        cr = data.get("composition_ratio", {})

        rv = float(cr.get("real_video_or_screen_recording_pct", 0) or 0)
        rs = float(cr.get("framed_real_screenshots_pct", 0) or 0)
        rb = float(cr.get("real_brand_icons_and_pucks_pct", 0) or 0)
        pk = float(cr.get("pure_kinetic_typography_pct", 0) or 0)

        ratios["real_video_or_screen_recording_pct"].append(rv)
        ratios["framed_real_screenshots_pct"].append(rs)
        ratios["real_brand_icons_and_pucks_pct"].append(rb)
        ratios["pure_kinetic_typography_pct"].append(pk)

        if rv > 0:
            videos_with_real_video += 1
        if rs > 0:
            videos_with_screenshots += 1
        if rb > 0:
            videos_with_icons_pucks += 1

        assets = data.get("real_footage_and_assets_start_to_end", [])
        joined_assets = " ".join(assets).lower()
        for kw in [
            "terminal", "claude", "github", "cursor", "webcam", "talking head",
            "book", "screen recording", "iphone", "browser", "cursor arrow",
            "silhouette", "crown", "3d", "supabase", "vercel", "notion", "n8n",
        ]:
            if kw in joined_assets:
                asset_keywords[kw] += 1

        kinetics = data.get("mid_and_late_text_kinetics", {})
        for m in kinetics.get("list_and_emphasis_markers", []):
            marker_counter[str(m).lower().strip()] += 1

        closing = str(data.get("closing_and_loop_design", "")).lower()
        if "book" in closing or "playbook" in closing or "guide" in closing:
            closing_themes["3d_book_or_guide_cta"] += 1
        if "crown" in closing or "insiderforce" in closing:
            closing_themes["insiderforce_crown_or_brand_lockup"] += 1
        if "comment" in closing:
            closing_themes["comment_keyword_prompt"] += 1
        if "follow" in closing:
            closing_themes["follow_gate_reminder"] += 1
        if "loop" in closing or "cut" in closing:
            closing_themes["seamless_loop_or_hard_cut"] += 1

        aud = data.get("audio_sfx_and_music_balance", {})
        if isinstance(aud.get("voice_peak_db"), (int, float)):
            voice_peaks.append(float(aud["voice_peak_db"]))
        if isinstance(aud.get("music_floor_db"), (int, float)):
            music_floors.append(float(aud["music_floor_db"]))
        if isinstance(aud.get("gap_db"), (int, float)):
            gaps.append(float(aud["gap_db"]))

        per_video_brief.append({
            "slug": slug,
            "real_video_pct": rv,
            "screenshots_pct": rs,
            "icons_pucks_pct": rb,
            "pure_typo_pct": pk,
            "asset_count": len(assets),
        })

    def stats(vals):
        if not vals:
            return {"mean": 0.0, "median": 0.0, "min": 0.0, "max": 0.0}
        return {
            "mean": round(statistics.mean(vals), 2),
            "median": round(statistics.median(vals), 2),
            "min": round(min(vals), 2),
            "max": round(max(vals), 2),
        }

    summary = {
        "audited_videos": len(audit_files),
        "total_videos_in_workspace": len(all_vids),
        "composition_ratio_across_all_videos": {k: stats(v) for k, v in ratios.items()},
        "modality_adoption_counts": {
            "videos_using_real_video_or_screen_recording": videos_with_real_video,
            "videos_using_framed_real_screenshots": videos_with_screenshots,
            "videos_using_real_brand_icons_or_pucks": videos_with_icons_pucks,
        },
        "top_asset_and_footage_motifs": asset_keywords.most_common(20),
        "top_text_and_list_markers": marker_counter.most_common(15),
        "closing_and_loop_patterns": dict(closing_themes),
        "audio_balance_from_deep_audits": {
            "voice_peak_db": stats(voice_peaks),
            "music_floor_db": stats(music_floors),
            "voice_to_music_gap_db": stats(gaps),
        },
        "top_real_footage_heavy_videos": sorted(
            per_video_brief, key=lambda x: x["real_video_pct"] + x["screenshots_pct"], reverse=True
        )[:12],
    }

    out_path = root / "analysis/DEEP_AUDIT_87_SUMMARY.json"
    out_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(f"Wrote {out_path} covering {len(audit_files)}/{len(all_vids)} videos.")


if __name__ == "__main__":
    main()
