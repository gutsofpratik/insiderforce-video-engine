#!/usr/bin/env python3
"""
Generate studio-quality neural English voiceover (`edge-tts`) mastered to InsiderForce's
measured ~16 dB RMS presence curve + exact word-by-word 30fps timestamps (`word_timings.json`)
so Remotion kinetic typography locks cleanly to every spoken word.
"""

import argparse
import asyncio
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

import edge_tts


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


async def synth_with_boundaries(
    text: str, voice: str, rate: str, pitch: str, raw_mp3: Path
) -> list[dict]:
    comm = edge_tts.Communicate(text=text, voice=voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    boundaries = []
    with open(raw_mp3, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                # offset and duration are in 100-nanosecond ticks -> divide by 10_000 for ms
                start_ms = chunk["offset"] / 10_000.0
                dur_ms = chunk["duration"] / 10_000.0
                boundaries.append({
                    "text": chunk["text"],
                    "start_ms": round(start_ms, 1),
                    "end_ms": round(start_ms + dur_ms, 1),
                })
    return boundaries


def master_voiceover(raw_mp3: Path, out_wav: Path, fps: int) -> tuple[float, float]:
    """Apply crisp studio voice EQ/compression & trim leading dead silence, returning (trim_offset_ms, total_dur_s)."""
    ffmpeg = find_ffmpeg()
    ffprobe = shutil.which("ffprobe") or ffmpeg.replace("ffmpeg", "ffprobe")

    # Measure leading silence duration first so word_timings stay sample-accurate
    with tempfile.TemporaryDirectory() as td:
        untrimmed = Path(td) / "untrimmed.wav"
        subprocess.run(
            [
                ffmpeg, "-y", "-i", str(raw_mp3),
                "-af", "highpass=f=85,equalizer=f=185:width_type=o:width=1.2:g=2.4,equalizer=f=3600:width_type=o:width=1.4:g=3.2,acompressor=threshold=-18dB:ratio=3.0:attack=6:release=70",
                "-ar", "44100", "-ac", "1",
                str(untrimmed),
            ],
            check=True,
            capture_output=True,
        )
        # Detect start of speech via silencedetect
        det = subprocess.run(
            [ffmpeg, "-i", str(untrimmed), "-af", "silencedetect=noise=-42dB:d=0.04", "-f", "null", "-"],
            capture_output=True,
            text=True,
        )
        trim_s = 0.0
        for line in det.stderr.splitlines():
            if "silence_start: 0" in line:
                continue
            if "silence_end:" in line and trim_s == 0.0:
                try:
                    val = float(line.split("silence_end:")[1].split("|")[0].strip())
                    if val < 0.8:
                        trim_s = max(0.0, val - 0.03)
                except Exception:
                    pass
                break

        out_wav.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [
                ffmpeg, "-y",
                "-ss", f"{trim_s:.3f}",
                "-i", str(untrimmed),
                "-af", "loudnorm=I=-14.5:TP=-1.2:LRA=7",
                "-ar", "44100", "-ac", "2",
                str(out_wav),
            ],
            check=True,
            capture_output=True,
        )

    probe = subprocess.check_output(
        [ffprobe, "-v", "quiet", "-print_format", "json", "-show_format", str(out_wav)], text=True
    )
    dur_s = float(json.loads(probe)["format"]["duration"])
    return round(trim_s * 1000.0, 1), round(dur_s, 3)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate mastered neural voiceover + 30fps word timings.")
    parser.add_argument("--text", required=True, help="Script narration text (clean spoken sentences)")
    parser.add_argument("--out-wav", required=True, help="Output mastered WAV path")
    parser.add_argument("--out-json", required=True, help="Output word_timings.json path")
    parser.add_argument("--voice", default="en-US-AndrewMultilingualNeural", help="edge-tts neural voice")
    parser.add_argument("--rate", default="+12%", help="Speech rate offset (+10%..+14% matches ~185 WPM)")
    parser.add_argument("--pitch", default="-2Hz", help="Subtle pitch tweak")
    parser.add_argument("--fps", type=int, default=30)
    args = parser.parse_args()

    out_wav = Path(args.out_wav)
    out_json = Path(args.out_json)

    with tempfile.TemporaryDirectory() as td:
        raw_mp3 = Path(td) / "raw_tts.mp3"
        boundaries = asyncio.run(synth_with_boundaries(args.text, args.voice, args.rate, args.pitch, raw_mp3))
        trim_ms, dur_s = master_voiceover(raw_mp3, out_wav, args.fps)

    words = []
    for b in boundaries:
        adj_start = max(0.0, b["start_ms"] - trim_ms)
        adj_end = max(adj_start + 33.0, b["end_ms"] - trim_ms)
        words.append({
            "text": b["text"],
            "start_ms": round(adj_start, 1),
            "end_ms": round(adj_end, 1),
            "startFrame": int(round((adj_start / 1000.0) * args.fps)),
            "endFrame": int(round((adj_end / 1000.0) * args.fps)),
        })

    wpm = round((len(words) / max(0.1, dur_s)) * 60.0, 1)
    payload = {
        "voice": args.voice,
        "rate": args.rate,
        "fps": args.fps,
        "duration_sec": dur_s,
        "total_frames": int(round(dur_s * args.fps)),
        "word_count": len(words),
        "actual_wpm": wpm,
        "words": words,
    }
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Generated mastered voiceover ({dur_s}s, {len(words)} words @ {wpm} WPM) -> {out_wav}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
