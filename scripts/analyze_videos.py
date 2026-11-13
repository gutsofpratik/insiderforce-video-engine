"""Frame-by-frame visual, layout, color, and audio-transient analyzer for all Shorts."""

from __future__ import annotations

import json
import math
import os
import re
import subprocess
import sys
import wave
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path
from typing import Any

import cv2
import numpy as np
import static_ffmpeg
from PIL import Image, ImageDraw, ImageFont
from scipy import signal

ROOT = Path(__file__).resolve().parent.parent
CHANNEL_INDEX = ROOT / "data" / "channel" / "index.json"
VIDEOS_DIR = ROOT / "data" / "videos"
ANALYSIS_DIR = ROOT / "analysis" / "videos"


def ensure_ffmpeg() -> None:
    static_ffmpeg.add_paths()


def parse_fps(rate_str: str) -> float:
    if not rate_str or rate_str == "0/0":
        return 30.0
    if "/" in rate_str:
        num, den = rate_str.split("/", 1)
        d = float(den)
        return float(num) / d if d else 30.0
    return float(rate_str)


def ffprobe_video(mp4_path: Path) -> dict[str, Any]:
    cmd = [
        "ffprobe",
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        str(mp4_path),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True, encoding="utf-8")
    raw = json.loads(res.stdout)
    vstream = next((s for s in raw.get("streams", []) if s.get("codec_type") == "video"), {})
    astream = next((s for s in raw.get("streams", []) if s.get("codec_type") == "audio"), {})
    fmt = raw.get("format", {})
    fps = parse_fps(vstream.get("avg_frame_rate") or vstream.get("r_frame_rate") or "30/1")
    duration = float(fmt.get("duration") or vstream.get("duration") or 0.0)
    nb_frames = int(vstream.get("nb_frames") or round(duration * fps))
    return {
        "width": int(vstream.get("width") or 0),
        "height": int(vstream.get("height") or 0),
        "fps": round(fps, 4),
        "fps_raw": vstream.get("avg_frame_rate") or "",
        "nb_frames": nb_frames,
        "duration_sec": round(duration, 4),
        "video_codec": vstream.get("codec_name") or "",
        "pix_fmt": vstream.get("pix_fmt") or "",
        "audio_codec": astream.get("codec_name") or "",
        "audio_sample_rate": int(astream.get("sample_rate") or 0),
        "audio_channels": int(astream.get("channels") or 0),
        "bit_rate": int(fmt.get("bit_rate") or 0),
    }


def extract_wav(mp4_path: Path, wav_path: Path) -> bool:
    if wav_path.exists() and wav_path.stat().st_size > 1000:
        return True
    cmd = [
        "ffmpeg",
        "-y",
        "-v",
        "error",
        "-i",
        str(mp4_path),
        "-ac",
        "1",
        "-ar",
        "44100",
        "-vn",
        str(wav_path),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    return res.returncode == 0 and wav_path.exists()


def load_wav_mono(wav_path: Path) -> tuple[int, np.ndarray]:
    with wave.open(str(wav_path), "rb") as wf:
        sr = wf.getframerate()
        n = wf.getnframes()
        sw = wf.getsampwidth()
        raw = wf.readframes(n)
    if sw == 2:
        data = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    elif sw == 4:
        data = np.frombuffer(raw, dtype=np.int32).astype(np.float32) / 2147483648.0
    else:
        data = np.frombuffer(raw, dtype=np.uint8).astype(np.float32) / 128.0 - 1.0
    return sr, data


def db(x: np.ndarray | float, floor: float = -80.0) -> np.ndarray | float:
    return np.maximum(20.0 * np.log10(np.maximum(x, 1e-9)), floor)


def analyze_audio(wav_path: Path, fps: float, nb_frames: int) -> dict[str, Any]:
    if not wav_path.exists():
        return {"has_audio": False}
    sr, y = load_wav_mono(wav_path)
    if len(y) == 0:
        return {"has_audio": False}

    # Short-time FFT aligned at video frame rate (or finer hop=256 for crisp transients)
    n_fft = 2048
    hop = 256  # ~5.8 ms resolution
    freqs, times, Zxx = signal.stft(y, fs=sr, nperseg=n_fft, noverlap=n_fft - hop, window="hann")
    mag = np.abs(Zxx)

    # Frequency band energies
    sub_mask = (freqs >= 25) & (freqs < 120)
    low_mid_mask = (freqs >= 120) & (freqs < 400)
    speech_mask = (freqs >= 400) & (freqs < 3500)
    hi_mask = (freqs >= 3500) & (freqs <= 14000)

    sub_e = np.sqrt(np.mean(mag[sub_mask] ** 2, axis=0))
    low_mid_e = np.sqrt(np.mean(mag[low_mid_mask] ** 2, axis=0))
    speech_e = np.sqrt(np.mean(mag[speech_mask] ** 2, axis=0))
    hi_e = np.sqrt(np.mean(mag[hi_mask] ** 2, axis=0))

    # Spectral flux (positive half-wave rectified log-magnitude diff)
    log_mag = np.log1p(mag * 50.0)
    flux = np.maximum(0.0, np.diff(log_mag, axis=1, prepend=log_mag[:, :1])).mean(axis=0)
    hi_flux = np.maximum(0.0, np.diff(log_mag[hi_mask], axis=1, prepend=log_mag[hi_mask, :1])).mean(axis=0)

    # Peak picking for transients (SFX candidates)
    flux_norm = (flux - np.median(flux)) / (np.std(flux) + 1e-6)
    min_dist = max(1, int(0.08 * sr / hop))  # min 80ms between transient peaks
    peaks, props = signal.find_peaks(flux_norm, height=1.8, prominence=1.2, distance=min_dist)

    transients: list[dict[str, Any]] = []
    for p in peaks:
        t_sec = float(times[p])
        frame_idx = int(round(t_sec * fps))
        sub_val = float(db(sub_e[p]))
        sp_val = float(db(speech_e[p]))
        hi_val = float(db(hi_e[p]))
        # Measure local decay/width around peak (+/- 120ms)
        w = max(1, int(0.12 * sr / hop))
        lo_i = max(0, p - w)
        hi_i = min(len(flux), p + w)
        local_hi_peak = float(np.max(hi_flux[lo_i:hi_i]))
        # Heuristic acoustic character
        if local_hi_peak > 0.35 and hi_val > sp_val - 6 and sub_val < hi_val + 8:
            kind = "click_tick_or_pop"
        elif sub_val > sp_val + 4 and sub_val > -32:
            kind = "sub_hit_or_drop"
        elif flux[p] > 0.25 and hi_val > -42:
            kind = "whoosh_or_swoosh"
        else:
            kind = "chime_accent_or_syllable"

        transients.append(
            {
                "time_sec": round(t_sec, 4),
                "frame": frame_idx,
                "flux_z": round(float(flux_norm[p]), 2),
                "sub_db": round(sub_val, 1),
                "speech_db": round(sp_val, 1),
                "hi_db": round(hi_val, 1),
                "kind_guess": kind,
            }
        )

    # Frame-aligned RMS & ducking stats
    samples_per_frame = max(1, int(round(sr / fps)))
    frame_rms = []
    frame_speech_db = []
    frame_low_db = []
    for fi in range(nb_frames):
        s0 = fi * samples_per_frame
        s1 = min(len(y), s0 + samples_per_frame)
        if s0 >= len(y):
            frame_rms.append(-80.0)
            frame_speech_db.append(-80.0)
            frame_low_db.append(-80.0)
            continue
        seg = y[s0:s1]
        r = float(np.sqrt(np.mean(seg ** 2)))
        frame_rms.append(round(float(db(r)), 2))
        t_mid = (fi + 0.5) / fps
        ti = int(np.argmin(np.abs(times - t_mid)))
        frame_speech_db.append(round(float(db(speech_e[ti])), 2))
        frame_low_db.append(round(float(db(low_mid_e[ti])), 2))

    rms_arr = np.array(frame_rms)
    sp_arr = np.array(frame_speech_db)
    speech_active = sp_arr > -42.0
    music_only = (~speech_active) & (rms_arr > -68.0)

    # Rough BPM from onset envelope autocorrelation (60..170 BPM)
    bpm_est = None
    if len(flux) > 200:
        env = flux - np.mean(flux)
        ac = signal.correlate(env, env, mode="full", method="fft")[len(env) - 1 :]
        min_lag = int((60.0 / 170.0) * (sr / hop))
        max_lag = int((60.0 / 65.0) * (sr / hop))
        if max_lag < len(ac) and max_lag > min_lag:
            best_lag = min_lag + int(np.argmax(ac[min_lag:max_lag]))
            bpm_est = round(60.0 / (best_lag * hop / sr), 1)

    return {
        "has_audio": True,
        "sample_rate": sr,
        "peak_dbfs": round(float(db(np.max(np.abs(y)))), 2),
        "rms_mean_db": round(float(np.mean(rms_arr[rms_arr > -75])) if np.any(rms_arr > -75) else -80.0, 2),
        "rms_p95_db": round(float(np.percentile(rms_arr, 95)), 2),
        "speech_active_pct": round(100.0 * float(np.mean(speech_active)), 1),
        "music_floor_during_pauses_db": round(
            float(np.median(rms_arr[music_only])) if np.any(music_only) else -80.0, 2
        ),
        "estimated_bpm": bpm_est,
        "transient_count": len(transients),
        "transients": transients[:120],
        "frame_rms_db": frame_rms,
    }


def parse_subtitles(vid_dir: Path, slug: str, duration_sec: float) -> dict[str, Any]:
    """Extract clean transcript, word timings, 0-3s hook text, and WPM from json3 or vtt."""
    json3_files = sorted(vid_dir.glob(f"{slug}*.json3"))
    vtt_files = sorted(vid_dir.glob(f"{slug}*.vtt"))

    words: list[dict[str, Any]] = []
    full_text = ""

    if json3_files:
        data = json.loads(json3_files[0].read_text(encoding="utf-8", errors="replace"))
        for ev in data.get("events", []):
            t_start = ev.get("tStartMs", 0) / 1000.0
            d_dur = ev.get("dDurationMs", 0) / 1000.0
            segs = ev.get("segs") or []
            for seg in segs:
                txt = (seg.get("utf8") or "").replace("\n", " ").strip()
                if not txt:
                    continue
                off = (seg.get("tOffsetMs") or 0) / 1000.0
                wt = round(t_start + off, 3)
                for w in txt.split():
                    words.append({"word": w, "t": wt})
        full_text = " ".join(w["word"] for w in words)
    elif vtt_files:
        raw_vtt = vtt_files[0].read_text(encoding="utf-8", errors="replace")
        lines = []
        cur_t = 0.0
        for line in raw_vtt.splitlines():
            m = re.match(r"(\d+):(\d+):(\d+\.\d+)\s+-->", line)
            if m:
                cur_t = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
            elif line.strip() and not line.startswith(("WEBVTT", "Kind:", "Language:")):
                clean = re.sub(r"<[^>]+>", "", line).strip()
                if clean and (not lines or lines[-1]["text"] != clean):
                    lines.append({"t": round(cur_t, 3), "text": clean})
        full_text = " ".join(x["text"] for x in lines)
        for item in lines:
            for w in item["text"].split():
                words.append({"word": w, "t": item["t"]})

    hook_words = [w["word"] for w in words if w["t"] <= 3.5]
    word_count = len(words) if words else len(full_text.split())
    wpm = round((word_count / max(duration_sec, 1.0)) * 60.0, 1) if word_count else 0.0

    return {
        "has_subtitles": bool(full_text),
        "word_count": word_count,
        "wpm": wpm,
        "hook_0_3s_text": " ".join(hook_words),
        "full_text": full_text,
        "words_sample": words[:80],
    }


def rgb_to_hex(rgb: tuple[int, int, int] | np.ndarray) -> str:
    return "#{:02X}{:02X}{:02X}".format(int(rgb[0]), int(rgb[1]), int(rgb[2]))


def extract_palette(img_bgr: np.ndarray, k: int = 5) -> dict[str, Any]:
    small = cv2.resize(img_bgr, (90, 160), interpolation=cv2.INTER_AREA)
    rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)
    # Border/corner background sample
    top = rgb[:12, :, :].reshape(-1, 3)
    bot = rgb[-12:, :, :].reshape(-1, 3)
    corners = np.vstack([top, bot])
    bg_med = np.median(corners, axis=0).astype(int)

    # K-means on quantized pixels
    pixels = rgb.reshape(-1, 3).astype(np.float32)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 12, 1.0)
    _, labels, centers = cv2.kmeans(pixels, k, None, criteria, 3, cv2.KMEANS_PP_CENTERS)
    counts = np.bincount(labels.flatten(), minlength=k)
    order = np.argsort(-counts)
    palette = [
        {"hex": rgb_to_hex(centers[i]), "pct": round(100.0 * float(counts[i]) / len(labels), 1)}
        for i in order
    ]
    return {"corner_bg_hex": rgb_to_hex(bg_med), "top_colors": palette}


def draw_label_pill(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, bg=(12, 14, 20), fg=(255, 255, 255)) -> None:
    font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.rectangle([x, y, x + tw + 10, y + th + 6], fill=bg)
    draw.text((x + 5, y + 3), text, fill=fg, font=font)


def make_contact_sheet(
    frames_info: list[tuple[np.ndarray, str]],
    out_path: Path,
    cols: int = 4,
    cell_w: int = 324,
    cell_h: int = 576,
    header_text: str = "",
) -> None:
    if not frames_info:
        return
    rows = math.ceil(len(frames_info) / cols)
    pad = 8
    header_h = 34 if header_text else 0
    canvas_w = cols * cell_w + (cols + 1) * pad
    canvas_h = header_h + rows * cell_h + (rows + 1) * pad
    canvas = Image.new("RGB", (canvas_w, canvas_h), (18, 20, 26))
    draw = ImageDraw.Draw(canvas)
    if header_text:
        draw.text((12, 10), header_text, fill=(235, 240, 250), font=ImageFont.load_default())

    for idx, (bgr, label) in enumerate(frames_info):
        r = idx // cols
        c = idx % cols
        x0 = pad + c * (cell_w + pad)
        y0 = header_h + pad + r * (cell_h + pad)
        rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
        pil_cell = Image.fromarray(rgb).resize((cell_w, cell_h), Image.Resampling.LANCZOS)
        canvas.paste(pil_cell, (x0, y0))
        draw.rectangle([x0, y0, x0 + cell_w - 1, y0 + cell_h - 1], outline=(58, 65, 82), width=1)
        draw_label_pill(draw, x0 + 4, y0 + 4, label)

    canvas.save(out_path, format="PNG", optimize=True)


def analyze_video(item: dict[str, Any]) -> dict[str, Any]:
    slug = item["slug"]
    vid_dir = VIDEOS_DIR / slug
    mp4_path = vid_dir / f"{slug}.mp4"
    out_dir = ANALYSIS_DIR / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    telemetry_path = out_dir / "telemetry.json"

    if not mp4_path.exists():
        return {"slug": slug, "error": "missing_mp4"}

    meta = ffprobe_video(mp4_path)
    fps = meta["fps"] or 30.0

    # Audio extraction + analysis
    wav_path = out_dir / "audio.wav"
    extract_wav(mp4_path, wav_path)
    # Subtitles & info.json
    info_json_path = vid_dir / f"{slug}.info.json"
    yt_meta = {}
    if info_json_path.exists():
        raw_info = json.loads(info_json_path.read_text(encoding="utf-8", errors="replace"))
        yt_meta = {
            "title": raw_info.get("title") or item.get("title"),
            "description": (raw_info.get("description") or "")[:1000],
            "upload_date": raw_info.get("upload_date"),
            "view_count": raw_info.get("view_count"),
            "like_count": raw_info.get("like_count"),
            "comment_count": raw_info.get("comment_count"),
            "tags": raw_info.get("tags") or [],
        }

    # Read ALL video frames sequentially for exact frame-by-frame telemetry
    cap = cv2.VideoCapture(str(mp4_path))
    if not cap.isOpened():
        return {"slug": slug, "error": "cv2_open_failed"}

    prev_small = None
    prev_hist = None
    frame_metrics: list[dict[str, Any]] = []
    # Cache downsampled (540x960) BGR frames in memory (~1.5MB/frame -> 500MB max? No! 540*960*3 = 1.5MB * 1000 = 1.5GB if 60fps 60s!
    # Keep 324x576 cached (~560KB/frame -> ~500MB max for 900 frames, very light!) AND re-seek only if full-res needed.
    cached_frames: list[np.ndarray] = []

    fi = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        disp = cv2.resize(frame, (324, 576), interpolation=cv2.INTER_AREA)
        cached_frames.append(disp)

        small = cv2.resize(frame, (180, 320), interpolation=cv2.INTER_AREA)
        hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
        gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
        hist = cv2.calcHist([hsv], [0, 1], None, [16, 16], [0, 180, 0, 256])
        cv2.normalize(hist, hist)

        luma_mean = float(np.mean(gray))
        sat_mean = float(np.mean(hsv[:, :, 1]))

        if prev_small is None:
            mad = 0.0
            pct_chg = 0.0
            hist_diff = 0.0
            bbox = None
        else:
            diff = cv2.absdiff(small, prev_small)
            diff_gray = np.max(diff, axis=2)
            mad = float(np.mean(diff))
            changed = diff_gray > 10
            pct_chg = 100.0 * float(np.mean(changed))
            hist_diff = float(cv2.compareHist(prev_hist, hist, cv2.HISTCMP_BHATTACHARYYA))
            ys, xs = np.where(changed)
            if len(xs) > 12:
                bbox = [
                    round(float(xs.min()) / 180.0, 3),
                    round(float(ys.min()) / 320.0, 3),
                    round(float(xs.max()) / 180.0, 3),
                    round(float(ys.max()) / 320.0, 3),
                ]
            else:
                bbox = None

        frame_metrics.append(
            {
                "f": fi,
                "t": round(fi / fps, 4),
                "mad": round(mad, 3),
                "pct_chg": round(pct_chg, 2),
                "hist_diff": round(hist_diff, 4),
                "luma": round(luma_mean, 1),
                "sat": round(sat_mean, 1),
                "bbox": bbox,
            }
        )
        prev_small = small
        prev_hist = hist
        fi += 1

    cap.release()
    nb_frames = len(frame_metrics)
    meta["nb_frames_actual"] = nb_frames

    audio_stats = analyze_audio(wav_path, fps, nb_frames)
    subs = parse_subtitles(vid_dir, slug, meta["duration_sec"])

    # Detect Hard Cuts / Visual Scene Transitions
    # Compare both frame-to-frame spikes AND difference against the current shot's settled visual state
    # so clean minimal UI motion-graphics on a constant background still segment into real scenes!
    cut_frames = [0]
    min_shot_frames = max(12, int(round(1.4 * fps)))
    ref_small = cv2.resize(cached_frames[min(5, nb_frames - 1)], (90, 160), interpolation=cv2.INTER_AREA) if nb_frames else None
    last_shot_f = 0

    for fi_idx in range(1, nb_frames):
        m = frame_metrics[fi_idx]
        cur_small = cv2.resize(cached_frames[fi_idx], (90, 160), interpolation=cv2.INTER_AREA)
        ref_diff = float(np.mean(cv2.absdiff(cur_small, ref_small))) if ref_small is not None else 0.0
        ref_pct = 100.0 * float(np.mean(np.max(cv2.absdiff(cur_small, ref_small), axis=2) > 18)) if ref_small is not None else 0.0

        is_hard_cut = (m["hist_diff"] > 0.30 and m["mad"] > 10.0) or (m["pct_chg"] > 55.0 and m["mad"] > 18.0)
        is_ui_scene_change = (ref_pct > 14.0 and m["pct_chg"] < 3.0) or (ref_diff > 10.0 and m["pct_chg"] < 3.0)
        is_long_gap = (fi_idx - last_shot_f) >= int(round(4.5 * fps)) and m["pct_chg"] < 2.5

        if (fi_idx - last_shot_f) >= min_shot_frames and (is_hard_cut or is_ui_scene_change or is_long_gap):
            cut_frames.append(fi_idx)
            last_shot_f = fi_idx
            # Set new reference frame slightly after settle
            ref_idx = min(nb_frames - 1, fi_idx + max(2, int(round(0.25 * fps))))
            ref_small = cv2.resize(cached_frames[ref_idx], (90, 160), interpolation=cv2.INTER_AREA)

    # Build shot table
    shots: list[dict[str, Any]] = []
    for si, start_f in enumerate(cut_frames):
        end_f = (cut_frames[si + 1] - 1) if si + 1 < len(cut_frames) else (nb_frames - 1)
        span = frame_metrics[start_f : end_f + 1]
        active_frames = [x["f"] for x in span if x["pct_chg"] > 0.35]
        # Pick representative settled frame in the latter 65% of the shot where visual detail peaks & motion calms
        lo_f = min(end_f, start_f + max(2, int(round(0.35 * len(span)))))
        hi_f = min(end_f, max(lo_f, end_f - 1))
        best_f = min(end_f, lo_f)
        best_score = -1.0
        for fi_c in range(lo_f, hi_f + 1):
            gray_c = cv2.cvtColor(cached_frames[fi_c], cv2.COLOR_BGR2GRAY)
            edges_c = float(np.mean(cv2.Canny(gray_c, 60, 150) > 0))
            calm_bonus = 1.0 if frame_metrics[fi_c]["pct_chg"] < 1.5 else 0.4
            sc = edges_c * calm_bonus
            if sc > best_score:
                best_score = sc
                best_f = fi_c
        settle_f = best_f
        palette = extract_palette(cached_frames[settle_f])
        shots.append(
            {
                "shot": si + 1,
                "start_f": start_f,
                "end_f": end_f,
                "duration_f": end_f - start_f + 1,
                "start_sec": round(start_f / fps, 3),
                "end_sec": round((end_f + 1) / fps, 3),
                "duration_sec": round((end_f - start_f + 1) / fps, 3),
                "settle_f": settle_f,
                "active_motion_pct": round(100.0 * len(active_frames) / max(1, len(span)), 1),
                "peak_pct_chg": round(max((x["pct_chg"] for x in span), default=0.0), 2),
                "luma_mean": round(float(np.mean([x["luma"] for x in span])), 1),
                "palette": palette,
            }
        )

    # Detect localized / global Animation Bursts (consecutive frames with pct_chg > 1.2% for real UI/motion transitions)
    bursts: list[dict[str, Any]] = []
    in_burst = False
    b_start = 0
    for m in frame_metrics[1:]:
        active = m["pct_chg"] > 1.2 or m["mad"] > 0.9
        if active and not in_burst:
            in_burst = True
            b_start = m["f"]
        elif not active and in_burst:
            in_burst = False
            b_end = m["f"] - 1
            if b_end - b_start + 1 >= 2:
                b_span = frame_metrics[b_start : b_end + 1]
                peak_x = max(b_span, key=lambda x: x["pct_chg"])
                bursts.append(
                    {
                        "start_f": b_start,
                        "end_f": b_end,
                        "dur_f": b_end - b_start + 1,
                        "dur_ms": round(1000.0 * (b_end - b_start + 1) / fps, 1),
                        "peak_f": peak_x["f"],
                        "peak_pct_chg": peak_x["pct_chg"],
                        "mean_pct_chg": round(float(np.mean([x["pct_chg"] for x in b_span])), 2),
                    }
                )
    if in_burst:
        b_end = nb_frames - 1
        if b_end - b_start + 1 >= 2:
            b_span = frame_metrics[b_start : b_end + 1]
            peak_x = max(b_span, key=lambda x: x["pct_chg"])
            bursts.append(
                {
                    "start_f": b_start,
                    "end_f": b_end,
                    "dur_f": b_end - b_start + 1,
                    "dur_ms": round(1000.0 * (b_end - b_start + 1) / fps, 1),
                    "peak_f": peak_x["f"],
                    "peak_pct_chg": peak_x["pct_chg"],
                    "mean_pct_chg": round(float(np.mean([x["pct_chg"] for x in b_span])), 2),
                }
            )

    # Measure Audio Transient -> Visual Cut / Burst alignment offsets
    visual_events = sorted(set(cut_frames + [b["start_f"] for b in bursts]))
    sync_pairs = []
    for tr in audio_stats.get("transients", []):
        af = tr["frame"]
        nearest_vf = min(visual_events, key=lambda vf: abs(vf - af)) if visual_events else af
        offset_f = nearest_vf - af
        if abs(offset_f) <= int(round(0.25 * fps)):
            sync_pairs.append(
                {
                    "audio_f": af,
                    "visual_f": nearest_vf,
                    "visual_minus_audio_f": offset_f,
                    "kind": tr["kind_guess"],
                }
            )

    # Export shots_grid.png (settle frame of up to 24 evenly-covered shots across the whole video)
    shot_cells: list[tuple[np.ndarray, str]] = []
    if len(shots) <= 24:
        selected_shots = shots
    else:
        idxs = np.linspace(0, len(shots) - 1, 24, dtype=int)
        selected_shots = [shots[i] for i in idxs]
    for sh in selected_shots:
        pf = sh["settle_f"]
        shot_cells.append(
            (cached_frames[pf], f"S{sh['shot']:02d} f{pf} ({round(pf/fps,2)}s) d={sh['duration_sec']}s")
        )

    make_contact_sheet(
        shot_cells,
        out_dir / "shots_grid.png",
        cols=4,
        header_text=f"{slug} | {yt_meta.get('title','')[:65]} | {fps}fps | {len(shots)} shots | {meta['duration_sec']}s",
    )

    # Export consecutive frame-by-frame animation strips!
    strips_dir = out_dir / "anim_strips"
    strips_dir.mkdir(exist_ok=True)
    # Clean old strips if re-running
    for old_p in strips_dir.glob("*.png"):
        old_p.unlink()

    hook_step = 2 if fps > 45 else 1
    hook_frames = [
        (cached_frames[f], f"f{f:03d} ({round(f/fps*1000)}ms) Δ{frame_metrics[f]['pct_chg']}%")
        for f in range(0, min(nb_frames, 12 * hook_step), hook_step)
    ]
    make_contact_sheet(
        hook_frames,
        strips_dir / "00_hook_sequence.png",
        cols=6,
        header_text=f"{slug} | HOOK SEQUENCE (step={hook_step}f @ {fps}fps)",
    )

    # Pick up to 6 animation bursts distributed across timeline buckets after the hook
    candidate_bursts = [b for b in bursts if b["start_f"] >= int(1.2 * fps)]
    chosen_bursts: list[dict[str, Any]] = []
    if candidate_bursts and nb_frames > int(2.0 * fps):
        num_buckets = 6
        edges = np.linspace(int(1.2 * fps), nb_frames, num_buckets + 1, dtype=int)
        for bi_idx in range(num_buckets):
            in_bucket = [b for b in candidate_bursts if edges[bi_idx] <= b["start_f"] < edges[bi_idx + 1]]
            if not in_bucket:
                continue
            best_b = max(in_bucket, key=lambda b: (b["dur_f"] >= 4, b["peak_pct_chg"]))
            chosen_bursts.append(best_b)

    for bi, b in enumerate(chosen_bursts, start=1):
        f0 = max(0, b["start_f"] - 1)
        step = 2 if b["dur_f"] > 14 or fps > 45 else 1
        f1 = min(nb_frames, f0 + 12 * step)
        strip_cells = [
            (cached_frames[f], f"f{f:03d} ({round(f/fps*1000)}ms) Δ{frame_metrics[f]['pct_chg']}%")
            for f in range(f0, f1, step)
        ]
        make_contact_sheet(
            strip_cells,
            strips_dir / f"{bi:02d}_burst_f{b['start_f']}.png",
            cols=6,
            header_text=f"{slug} | ANIM BURST #{bi}: f{b['start_f']}..f{b['end_f']} ({b['dur_f']}f / {b['dur_ms']}ms)",
        )

    # Save up to 3 full-res representative frames (hook settle, mid-video shot, late-video shot)
    if cached_frames:
        for old_f in out_dir.glob("fullres_*.png"):
            old_f.unlink()
        rep_indices = sorted(
            set(
                [
                    shots[0]["settle_f"] if shots else 0,
                    shots[len(shots) // 3]["settle_f"] if len(shots) > 2 else min(nb_frames - 1, nb_frames // 2),
                    shots[(2 * len(shots)) // 3]["settle_f"] if len(shots) > 3 else min(nb_frames - 1, (3 * nb_frames) // 4),
                ]
            )
        )
        cap2 = cv2.VideoCapture(str(mp4_path))
        for ri, rf in enumerate(rep_indices, start=1):
            cap2.set(cv2.CAP_PROP_POS_FRAMES, rf)
            ok_r, full_img = cap2.read()
            if ok_r:
                cv2.imwrite(str(out_dir / f"fullres_rep{ri:02d}_f{rf}.png"), full_img)
        cap2.release()

    # Global dominant palette from evenly sampled frames
    sample_indices = np.linspace(0, max(0, nb_frames - 1), min(8, nb_frames), dtype=int)
    stacked = np.hstack([cached_frames[i] for i in sample_indices]) if nb_frames else None
    global_palette = extract_palette(stacked, k=6) if stacked is not None else {}

    # Aggregate motion style summary
    burst_durs_ms = [b["dur_ms"] for b in bursts if 2 <= b["dur_f"] <= int(1.5 * fps)]
    telemetry = {
        "slug": slug,
        "id": item["id"],
        "url": item["url"],
        "video_meta": meta,
        "youtube": yt_meta,
        "subtitles": subs,
        "global_palette": global_palette,
        "motion_summary": {
            "total_shots": len(shots),
            "avg_shot_dur_sec": round(float(np.mean([s["duration_sec"] for s in shots])), 2) if shots else 0.0,
            "total_anim_bursts": len(bursts),
            "median_burst_dur_ms": round(float(np.median(burst_durs_ms)), 1) if burst_durs_ms else 0.0,
            "static_hold_pct": round(
                100.0 * float(np.mean([1.0 if m["pct_chg"] <= 0.35 else 0.0 for m in frame_metrics])), 1
            )
            if frame_metrics
            else 0.0,
        },
        "audio_summary": {k: v for k, v in audio_stats.items() if k != "frame_rms_db"},
        "audio_visual_sync_samples": sync_pairs[:30],
        "shots": shots,
        "anim_bursts": bursts[:40],
        "frame_metrics": frame_metrics,
    }

    telemetry_path.write_text(json.dumps(telemetry, indent=2, ensure_ascii=False), encoding="utf-8")
    return {
        "slug": slug,
        "shots": len(shots),
        "bursts": len(bursts),
        "fps": fps,
        "duration_sec": meta["duration_sec"],
        "transients": audio_stats.get("transient_count", 0),
        "has_subs": subs["has_subtitles"],
    }


def main() -> None:
    ensure_ffmpeg()
    items = json.loads(CHANNEL_INDEX.read_text(encoding="utf-8"))
    if len(sys.argv) > 1 and sys.argv[1] == "--missing":
        items = [it for it in items if not (ANALYSIS_DIR / it["slug"] / "telemetry.json").exists()]
    elif len(sys.argv) > 1:
        # Optional filter e.g. start:end or slug list
        arg = sys.argv[1]
        if ":" in arg:
            s, e = arg.split(":", 1)
            items = items[int(s or 0) : int(e) if e else None]
        else:
            items = [it for it in items if arg in it["slug"]]

    ANALYSIS_DIR.mkdir(parents=True, exist_ok=True)
    workers = int(os.environ.get("AN_WORKERS", "4"))
    print(f"Analyzing {len(items)} videos with {workers} processes...", flush=True)
    results = []
    if len(items) == 1 or workers <= 1:
        for i, it in enumerate(items, start=1):
            res = analyze_video(it)
            results.append(res)
            print(f"[{i}/{len(items)}] {it['slug']}: {res}", flush=True)
    else:
        with ProcessPoolExecutor(max_workers=workers) as pool:
            futs = {pool.submit(analyze_video, it): it["slug"] for it in items}
            for i, fut in enumerate(as_completed(futs), start=1):
                slug = futs[fut]
                try:
                    res = fut.result()
                    results.append(res)
                    print(f"[{i}/{len(items)}] {slug}: {res}", flush=True)
                except Exception as exc:
                    print(f"[{i}/{len(items)}] ERROR {slug}: {exc}", flush=True)
                    results.append({"slug": slug, "error": str(exc)})

    summary_path = ANALYSIS_DIR.parent / "telemetry_summary.json"
    summary_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"Saved summary -> {summary_path}")


if __name__ == "__main__":
    main()
