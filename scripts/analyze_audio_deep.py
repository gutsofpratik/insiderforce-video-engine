"""Deep acoustic & SFX/music-ducking analyzer on InsiderForce Shorts audio tracks."""

from __future__ import annotations

import json
import wave
from pathlib import Path
from typing import Any

import numpy as np
from scipy import signal

ROOT = Path(__file__).resolve().parent.parent
ANALYSIS_DIR = ROOT / "analysis" / "videos"
INDEX_PATH = ROOT / "data" / "channel" / "index.json"
OUT_PATH = ROOT / "analysis" / "AUDIO_DEEP_PROFILE.json"


def load_wav(p: Path) -> tuple[int, np.ndarray]:
    with wave.open(str(p), "rb") as wf:
        sr = wf.getframerate()
        n = wf.getnframes()
        raw = wf.readframes(n)
    return sr, np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0


def db(x: np.ndarray | float) -> np.ndarray | float:
    return 20.0 * np.log10(np.maximum(x, 1e-9))


def analyze_one_audio(slug: str) -> dict[str, Any]:
    wav = ANALYSIS_DIR / slug / "audio.wav"
    brief = json.loads((ANALYSIS_DIR / slug / "brief.json").read_text(encoding="utf-8"))
    sr, y = load_wav(wav)
    fps = float(brief["video_meta"]["fps"] or 30.0)

    # Bandpass filters
    sos_sub = signal.butter(4, [30, 120], btype="bandpass", fs=sr, output="sos")
    sos_music_low = signal.butter(4, [120, 320], btype="bandpass", fs=sr, output="sos")
    sos_voice = signal.butter(4, [350, 3200], btype="bandpass", fs=sr, output="sos")
    sos_air = signal.butter(4, [4500, 14000], btype="bandpass", fs=sr, output="sos")

    y_sub = signal.sosfilt(sos_sub, y)
    y_mlow = signal.sosfilt(sos_music_low, y)
    y_voice = signal.sosfilt(sos_voice, y)
    y_air = signal.sosfilt(sos_air, y)

    # 10ms frames
    hop = int(0.010 * sr)
    n_win = len(y) // hop
    def env_db(sig: np.ndarray) -> np.ndarray:
        reshaped = sig[: n_win * hop].reshape(n_win, hop)
        return db(np.sqrt(np.mean(reshaped ** 2, axis=1)))

    e_full = env_db(y)
    e_sub = env_db(y_sub)
    e_mlow = env_db(y_mlow)
    e_voice = env_db(y_voice)
    e_air = env_db(y_air)

    # Voice activity vs pause segments
    voice_on = e_voice > (np.percentile(e_voice, 75) - 10.0)
    pause_on = ~voice_on & (e_full > -55.0)

    voice_level = float(np.median(e_voice[voice_on])) if np.any(voice_on) else -80.0
    music_during_voice_low = float(np.median(e_mlow[voice_on])) if np.any(voice_on) else -80.0
    music_during_pause_low = float(np.median(e_mlow[pause_on])) if np.any(pause_on) else -80.0
    ducking_db = round(music_during_pause_low - music_during_voice_low, 2)

    # Detect air-band impulses (clicks, pops, ticks: sharp rise in 4.5-14kHz lasting <50ms)
    air_diff = np.diff(e_air, prepend=e_air[0])
    air_peaks, _ = signal.find_peaks(air_diff, height=7.0, distance=12)

    # Detect whoosh sweeps (broadband air+sub rise over 100-350ms)
    air_smooth = np.convolve(e_air, np.ones(8) / 8.0, mode="same")
    whoosh_peaks, _ = signal.find_peaks(air_smooth - np.median(air_smooth), height=6.5, distance=35, width=(6, 40))

    # First 3 seconds breakdown (0..300 frames at 10ms)
    hook_air_peaks = [round(p * 0.01, 2) for p in air_peaks if p <= 300]
    hook_whooshes = [round(p * 0.01, 2) for p in whoosh_peaks if p <= 300]

    # Measure cut alignment with air peaks & whooshes
    shot_starts = [s["start_f"] / fps for s in brief["shots"][1:]]
    cut_syncs = []
    all_sfx_t = sorted([p * 0.01 for p in air_peaks] + [p * 0.01 for p in whoosh_peaks])
    for st in shot_starts:
        if not all_sfx_t:
            break
        nearest = min(all_sfx_t, key=lambda x: abs(x - st))
        if abs(nearest - st) <= 0.18:
            cut_syncs.append(round((nearest - st) * 1000.0, 1))  # ms relative to cut

    return {
        "slug": slug,
        "duration_sec": brief["video_meta"]["duration_sec"],
        "voice_band_median_db": round(voice_level, 1),
        "music_low_during_voice_db": round(music_during_voice_low, 1),
        "music_low_during_pause_db": round(music_during_pause_low, 1),
        "ducking_depth_db": ducking_db,
        "air_click_pop_count": len(air_peaks),
        "air_clicks_per_min": round(len(air_peaks) / (brief["video_meta"]["duration_sec"] / 60.0), 1),
        "whoosh_sweep_count": len(whoosh_peaks),
        "whooshes_per_min": round(len(whoosh_peaks) / (brief["video_meta"]["duration_sec"] / 60.0), 1),
        "hook_0_3s_clicks_sec": hook_air_peaks,
        "hook_0_3s_whooshes_sec": hook_whooshes,
        "sfx_to_shot_cut_offsets_ms": cut_syncs[:20],
        "sub_bass_p95_db": round(float(np.percentile(e_sub, 95)), 1),
    }


def main() -> None:
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    # Analyze all 87 audio tracks!
    results = [analyze_one_audio(it["slug"]) for it in index]
    summary = {
        "count": len(results),
        "median_ducking_depth_db": round(float(np.median([r["ducking_depth_db"] for r in results])), 2),
        "median_clicks_per_min": round(float(np.median([r["air_clicks_per_min"] for r in results])), 1),
        "median_whooshes_per_min": round(float(np.median([r["whooshes_per_min"] for r in results])), 1),
        "median_voice_band_db": round(float(np.median([r["voice_band_median_db"] for r in results])), 1),
        "median_sub_bass_p95_db": round(float(np.median([r["sub_bass_p95_db"] for r in results])), 1),
        "per_video": results,
    }
    OUT_PATH.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps({k: v for k, v in summary.items() if k != "per_video"}, indent=2))


if __name__ == "__main__":
    main()
