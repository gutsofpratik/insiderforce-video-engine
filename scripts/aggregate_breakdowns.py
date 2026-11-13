"""Verify 100% coverage and aggregate quantitative/qualitative patterns across all Shorts."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path
from typing import Any

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
CHANNEL_INDEX = ROOT / "data" / "channel" / "index.json"
ANALYSIS_DIR = ROOT / "analysis" / "videos"
OUT_JSON = ROOT / "analysis" / "AGGREGATE_REPORT.json"
OUT_MD = ROOT / "analysis" / "AGGREGATE_REPORT.md"


def main() -> None:
    index = json.loads(CHANNEL_INDEX.read_text(encoding="utf-8"))
    total = len(index)

    missing_telemetry: list[str] = []
    missing_breakdown: list[str] = []

    durations: list[float] = []
    fps_counts: Counter[str] = Counter()
    res_counts: Counter[str] = Counter()
    shot_counts: list[int] = []
    avg_shot_durs: list[float] = []
    burst_durs_ms: list[float] = []
    static_hold_pcts: list[float] = []
    wpms: list[float] = []
    bpms: list[float] = []
    sync_offsets: Counter[int] = Counter()

    themes: Counter[str] = Counter()
    bg_hexes: Counter[str] = Counter()
    surface_hexes: Counter[str] = Counter()
    accent_hexes: Counter[str] = Counter()
    bg_treatments: Counter[str] = Counter()
    hook_archetypes: Counter[str] = Counter()
    caption_styles: Counter[str] = Counter()
    text_anims: Counter[str] = Counter()
    ui_components: Counter[str] = Counter()
    sfx_types: Counter[str] = Counter()
    music_vibes: Counter[str] = Counter()
    loop_techniques: Counter[str] = Counter()
    style_tags: Counter[str] = Counter()
    easing_curves: Counter[str] = Counter()

    for item in index:
        slug = item["slug"]
        vdir = ANALYSIS_DIR / slug
        tpath = vdir / "telemetry.json"
        bpath = vdir / "breakdown.json"

        if not tpath.exists():
            missing_telemetry.append(slug)
        else:
            t = json.loads(tpath.read_text(encoding="utf-8"))
            vm = t.get("video_meta", {})
            if vm.get("duration_sec"):
                durations.append(float(vm["duration_sec"]))
            fps_counts[str(round(float(vm.get("fps") or 0), 2))] += 1
            res_counts[f"{vm.get('width',0)}x{vm.get('height',0)}"] += 1
            ms = t.get("motion_summary", {})
            if ms.get("total_shots") is not None:
                shot_counts.append(int(ms["total_shots"]))
            if ms.get("avg_shot_dur_sec"):
                avg_shot_durs.append(float(ms["avg_shot_dur_sec"]))
            if ms.get("median_burst_dur_ms"):
                burst_durs_ms.append(float(ms["median_burst_dur_ms"]))
            if ms.get("static_hold_pct") is not None:
                static_hold_pcts.append(float(ms["static_hold_pct"]))
            sub = t.get("subtitles", {})
            if sub.get("wpm"):
                wpms.append(float(sub["wpm"]))
            au = t.get("audio_summary", {})
            if au.get("estimated_bpm"):
                bpms.append(float(au["estimated_bpm"]))
            for sp in t.get("audio_visual_sync_samples", []):
                sync_offsets[int(sp["visual_minus_audio_f"])] += 1

        if not bpath.exists():
            missing_breakdown.append(slug)
            continue

        b = json.loads(bpath.read_text(encoding="utf-8"))
        if b.get("overall_style_tag"):
            style_tags[b["overall_style_tag"]] += 1
        hk = b.get("hook", {})
        if hk.get("hook_archetype"):
            hook_archetypes[hk["hook_archetype"]] += 1
        cs = b.get("color_system", {})
        if cs.get("theme"):
            themes[cs["theme"]] += 1
        if cs.get("bg_hex"):
            bg_hexes[cs["bg_hex"].upper()] += 1
        if cs.get("surface_card_hex"):
            surface_hexes[cs["surface_card_hex"].upper()] += 1
        if cs.get("bg_treatment"):
            bg_treatments[cs["bg_treatment"]] += 1
        for ac in cs.get("accent_colors") or []:
            accent_hexes[ac.upper()] += 1
        ty = b.get("typography", {})
        if ty.get("caption_style"):
            caption_styles[ty["caption_style"]] += 1
        for ta in ty.get("text_animations_observed") or []:
            text_anims[ta] += 1
        for uc in b.get("ui_components_and_assets") or []:
            if uc.get("component_type"):
                ui_components[uc["component_type"]] += 1
        for fb in b.get("frame_by_frame_animations") or []:
            if fb.get("easing_curve_estimate"):
                easing_curves[fb["easing_curve_estimate"]] += 1
        au = b.get("audio_and_sfx", {})
        if au.get("music_vibe"):
            music_vibes[au["music_vibe"]] += 1
        for sx in au.get("sfx_cues") or []:
            if sx.get("sfx_type"):
                sfx_types[sx["sfx_type"]] += 1
        ex = b.get("explanation_craft", {})
        if ex.get("loop_technique"):
            loop_techniques[ex["loop_technique"]] += 1

    def stats_summary(vals: list[float]) -> dict[str, float]:
        if not vals:
            return {}
        arr = np.array(vals, dtype=float)
        return {
            "min": round(float(np.min(arr)), 2),
            "p25": round(float(np.percentile(arr, 25)), 2),
            "median": round(float(np.median(arr)), 2),
            "mean": round(float(np.mean(arr)), 2),
            "p75": round(float(np.percentile(arr, 75)), 2),
            "max": round(float(np.max(arr)), 2),
        }

    report: dict[str, Any] = {
        "coverage": {
            "total_shorts": total,
            "telemetry_complete": total - len(missing_telemetry),
            "breakdowns_complete": total - len(missing_breakdown),
            "missing_telemetry": missing_telemetry,
            "missing_breakdown": missing_breakdown,
        },
        "quantitative_telemetry": {
            "duration_sec": stats_summary(durations),
            "fps_distribution": dict(fps_counts.most_common()),
            "resolution_distribution": dict(res_counts.most_common()),
            "shots_per_video": stats_summary([float(x) for x in shot_counts]),
            "avg_shot_duration_sec": stats_summary(avg_shot_durs),
            "median_anim_burst_ms": stats_summary(burst_durs_ms),
            "static_hold_pct": stats_summary(static_hold_pcts),
            "wpm": stats_summary(wpms),
            "estimated_bpm": stats_summary(bpms),
            "audio_visual_sync_offset_frames_top": dict(sync_offsets.most_common(12)),
        },
        "qualitative_distributions": {
            "overall_style_tags": dict(style_tags.most_common()),
            "hook_archetypes": dict(hook_archetypes.most_common()),
            "themes": dict(themes.most_common()),
            "bg_treatments": dict(bg_treatments.most_common()),
            "top_bg_hex": dict(bg_hexes.most_common(15)),
            "top_surface_hex": dict(surface_hexes.most_common(15)),
            "top_accent_hex": dict(accent_hexes.most_common(20)),
            "caption_styles": dict(caption_styles.most_common()),
            "text_animations": dict(text_anims.most_common()),
            "ui_components": dict(ui_components.most_common()),
            "easing_curves": dict(easing_curves.most_common()),
            "music_vibes": dict(music_vibes.most_common()),
            "sfx_types": dict(sfx_types.most_common()),
            "loop_techniques": dict(loop_techniques.most_common()),
        },
    }

    OUT_JSON.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    lines = [
        "# @InsiderForce Shorts — Aggregate Channel Analysis",
        "",
        f"- **Total Shorts Indexed**: {total}",
        f"- **Telemetry Complete**: {total - len(missing_telemetry)}/{total}",
        f"- **Vision Breakdowns Complete**: {total - len(missing_breakdown)}/{total}",
        "",
        "## Quantitative Video & Audio Telemetry",
        f"```json\n{json.dumps(report['quantitative_telemetry'], indent=2)}\n```",
        "",
        "## Style, UI, Animation, Audio & Hook Distributions",
        f"```json\n{json.dumps(report['qualitative_distributions'], indent=2)}\n```",
    ]
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT_JSON} and {OUT_MD}")


if __name__ == "__main__":
    main()
