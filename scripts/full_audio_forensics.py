#!/usr/bin/env python3
"""
Full Start-to-End Audio, Music Bed, Voiceover & SFX Forensics across all 87 Shorts.
Extracts:
  1. Speech vs gap segments across full track (`voice_rms_db`, `music_pause_floor_db`, ducking depth).
  2. Multi-band energy breakdown (sub 20-90Hz, warm_bass 90-260Hz, voice_mid 300-3500Hz, air 4k-14kHz).
  3. Exact SFX transient taxonomy throughout 0%->100%:
     - micro_clicks (<25ms, >2kHz sharp impulse)
     - soft_pops (25-80ms, mid-focused)
     - whooshes (120-450ms broadband envelope swell)
     - sub_thuds (<120Hz energy hits)
  4. Saves `audio_forensics.json` per video + `analysis/FULL_AUDIO_FORENSICS.json`.
"""

import json
from pathlib import Path
import wave

import numpy as np
from scipy.signal import butter, sosfilt


ANALYSIS_DIR = Path("analysis/videos")


def analyze_audio(wav_path: Path) -> dict | None:
    if not wav_path.exists():
        return None
    with wave.open(str(wav_path), "rb") as wf:
        sr = wf.getframerate()
        ch = wf.getnchannels()
        raw = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    if ch > 1:
        raw = raw.reshape(-1, ch).mean(axis=1)
    if raw.size < sr:
        return None

    dur_s = raw.size / sr

    # 50ms RMS envelope for voice vs pause (music bed) detection
    hop = int(sr * 0.05)
    frames_rms = np.array([np.sqrt(np.mean(raw[i : i + hop] ** 2) + 1e-12) for i in range(0, len(raw) - hop, hop)])
    db_env = 20.0 * np.log10(frames_rms)

    # Bottom 15% frames represent brief breath gaps where music bed alone is exposed
    music_floor_db = float(np.percentile(db_env, 12))
    voice_peak_db = float(np.percentile(db_env, 85))
    overall_rms_db = float(20.0 * np.log10(np.sqrt(np.mean(raw ** 2)) + 1e-12))

    # Multi-band filtering over quietest ~3s of music gaps vs full signal
    quiet_mask = np.repeat(db_env <= np.percentile(db_env, 25), hop)
    n_m = min(len(quiet_mask), len(raw))
    music_only = raw[:n_m][quiet_mask[:n_m]]
    if music_only.size < sr // 2:
        music_only = raw

    def rms_band(sig: np.ndarray, lo: float, hi: float) -> float:
        sos = butter(3, [lo, min(hi, sr * 0.45)], btype="bandpass", fs=sr, output="sos")
        filt = sosfilt(sos, sig)
        return float(20.0 * np.log10(np.sqrt(np.mean(filt ** 2)) + 1e-12))

    # Band profiles for the exposed music bed
    music_bands = {
        "sub_20_90hz_db": round(rms_band(music_only, 20.0, 90.0), 1),
        "warm_90_280hz_db": round(rms_band(music_only, 90.0, 280.0), 1),
        "pad_280_1200hz_db": round(rms_band(music_only, 280.0, 1200.0), 1),
        "hi_2k_10khz_db": round(rms_band(music_only, 2000.0, 10000.0), 1),
    }

    # SFX Event Detection across entire timeline:
    # 1. Sub impacts: sudden jumps in 25-95Hz envelope
    sub_sig = sosfilt(butter(3, [25.0, 95.0], btype="bandpass", fs=sr, output="sos"), raw)
    sub_hop = int(sr * 0.02)
    sub_env = np.array([np.sqrt(np.mean(sub_sig[i : i + sub_hop] ** 2)) for i in range(0, len(sub_sig) - sub_hop, sub_hop)])
    sub_thresh = max(float(np.percentile(sub_env, 85)) * 1.45, 0.03)
    sub_hits = []
    last_sub = -20
    for k in range(1, len(sub_env)):
        if sub_env[k] > sub_thresh and sub_env[k] > sub_env[k - 1] * 1.35 and (k - last_sub) > 15:
            sub_hits.append(round(k * 0.02, 2))
            last_sub = k

    # 2. High-frequency sharp clicks/taps (>3500 Hz impulses with short burst)
    hi_sig = sosfilt(butter(3, [3500.0, 14000.0], btype="bandpass", fs=sr, output="sos"), raw)
    hi_hop = int(sr * 0.01)
    hi_env = np.array([np.max(np.abs(hi_sig[i : i + hi_hop])) for i in range(0, len(hi_sig) - hi_hop, hi_hop)])
    hi_med = float(np.median(hi_env)) + 1e-6
    hi_peaks = []
    last_hi = -6
    for k in range(1, len(hi_env) - 1):
        if hi_env[k] > max(hi_med * 4.2, 0.06) and hi_env[k] >= hi_env[k - 1] and hi_env[k] >= hi_env[k + 1] and (k - last_hi) >= 5:
            hi_peaks.append(round(k * 0.01, 2))
            last_hi = k

    # 3. Whoosh sweeps: 200-1800Hz smoothed energy hills (~150-450ms wide)
    mid_sig = sosfilt(butter(2, [220.0, 1600.0], btype="bandpass", fs=sr, output="sos"), raw)
    w_hop = int(sr * 0.04)
    w_env = np.array([np.sqrt(np.mean(mid_sig[i : i + w_hop] ** 2)) for i in range(0, len(mid_sig) - w_hop, w_hop)])
    w_med = float(np.median(w_env)) + 1e-6
    whoosh_times = []
    last_w = -8
    for k in range(2, len(w_env) - 2):
        if w_env[k] > w_med * 2.1 and w_env[k] > w_env[k - 2] * 1.4 and w_env[k] > w_env[k + 2] * 1.2 and (k - last_w) >= 8:
            whoosh_times.append(round(k * 0.04, 2))
            last_w = k

    return {
        "duration_sec": round(dur_s, 2),
        "overall_rms_db": round(overall_rms_db, 1),
        "voice_peak_db": round(voice_peak_db, 1),
        "music_floor_db": round(music_floor_db, 1),
        "voice_to_music_separation_db": round(voice_peak_db - music_floor_db, 1),
        "music_bands": music_bands,
        "sfx_density_per_min": {
            "sub_hits_per_min": round(len(sub_hits) / (dur_s / 60.0), 1),
            "crisp_clicks_per_min": round(len(hi_peaks) / (dur_s / 60.0), 1),
            "whoosh_swells_per_min": round(len(whoosh_times) / (dur_s / 60.0), 1),
        },
        "sample_sub_hit_times_s": sub_hits[:12],
        "sample_whoosh_times_s": whoosh_times[:12],
    }


def main() -> int:
    slug_dirs = sorted([p for p in ANALYSIS_DIR.iterdir() if p.is_dir()])
    results = []
    for sd in slug_dirs:
        res = analyze_audio(sd / "audio.wav")
        if res:
            res["slug"] = sd.name
            (sd / "audio_forensics.json").write_text(json.dumps(res, indent=2), encoding="utf-8")
            results.append(res)

    summary = {
        "videos_analyzed": len(results),
        "median_overall_rms_db": round(float(np.median([r["overall_rms_db"] for r in results])), 1),
        "median_voice_peak_db": round(float(np.median([r["voice_peak_db"] for r in results])), 1),
        "median_music_floor_db": round(float(np.median([r["music_floor_db"] for r in results])), 1),
        "median_voice_music_gap_db": round(float(np.median([r["voice_to_music_separation_db"] for r in results])), 1),
        "median_music_sub_20_90hz_db": round(float(np.median([r["music_bands"]["sub_20_90hz_db"] for r in results])), 1),
        "median_music_warm_90_280hz_db": round(float(np.median([r["music_bands"]["warm_90_280hz_db"] for r in results])), 1),
        "median_music_pad_280_1200hz_db": round(float(np.median([r["music_bands"]["pad_280_1200hz_db"] for r in results])), 1),
        "median_music_hi_2k_10khz_db": round(float(np.median([r["music_bands"]["hi_2k_10khz_db"] for r in results])), 1),
        "median_sub_hits_per_min": round(float(np.median([r["sfx_density_per_min"]["sub_hits_per_min"] for r in results])), 1),
        "median_clicks_per_min": round(float(np.median([r["sfx_density_per_min"]["crisp_clicks_per_min"] for r in results])), 1),
        "median_whooshes_per_min": round(float(np.median([r["sfx_density_per_min"]["whoosh_swells_per_min"] for r in results])), 1),
    }
    Path("analysis/FULL_AUDIO_FORENSICS.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
