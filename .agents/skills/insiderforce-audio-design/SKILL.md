---
name: insiderforce-audio-design
description: Engineer the exact audio mix, procedural SFX palette (whooshes, mechanical clicks, word pops, sub-bass thuds, chimes), restrained 93 BPM ambient tech music bed, and frame-accurate pre-lap sync measured across all 87 InsiderForce Shorts. Use whenever scoring, generating sound effects, ducking background music, or placing <Audio> tracks in Remotion.
---

# InsiderForce Audio Design

Match the full-spectrum, punchy, studio-grade audio landscape measured across all **87 InsiderForce Shorts** (`FULL_AUDIO_FORENSICS.json` & `DEEP_AUDIT_87_SUMMARY.json`). Voice sits clearly forward with rich high-frequency clarity, balanced full-range ambient electronic music underneath (`~11.6 dB` separation — **never** dull low-pass muffled loops!), and organic stereo SFX timed `-2 frames` ahead of cuts.

## Empirical Full-Channel Mix & Density Profile (`87/87` WAVs)

| Track Layer | Measured Channel Median | Mix Target Rule | Function |
|---|---|---|---|
| **Overall Mix RMS** | **`-15.4 dB`** | `-15.0 dB` to `-16.8 dB` (`-1.0 dBFS` max peak) | Loudness-matched Shorts master |
| **Voiceover Lead** | **`-12.6 dB` peak RMS** (`-13.71 dB` mean) | `172–194 WPM` crisp neural/studio narration | Warm `185 Hz` body + `3.6 kHz` intelligibility presence |
| **Music Bed Floor** | **`-25.0 dB` RMS** (`11.6 dB` voice-to-music gap) | **Full-spectrum flat (`20Hz–10kHz` within ±3 dB)** played at `musicVol = 0.46–0.62` (filtered sawtooth Juno pad + sparkling Rhodes + brushed rim/shaker @ **`93 BPM`**) | Dynamic ducking beneath voice (`0.48`), breathing up on transitions/outro (`0.58–0.62`) |
| **Whoosh Sweeps** | **`80.1 / min`** (~`1.3 / sec`) | `whoosh_air.wav` (`0.52–0.74`) & `whoosh_wipe.wav` (`0.72–0.82`) | Stereo mid-side sweeps on blur dissolves & card reveals |
| **Crisp Clicks & Ticks** | **`39.8 / min`** | `click_tactile.wav` (`0.68–0.82`), `text_tick.wav` (`0.40–0.48`), `pop_woody.wav` (`0.58–0.68`) | Cursor clicks, stressed word ticks, real medallion/bullet pops |
| **Sub-Bass Impacts & Chimes** | **`32.8 / min`** | `sub_impact.wav` (`0.64–0.78`) & `chime_warm.wav` (`0.44–0.62`) | `95->33 Hz` slam + felt transient on hook/CTA + major-9th stereo bloom on unlocks |

---

## Step 1: Generate Real Voiceover + Word-Level 30fps Timings (`generate_voiceover.py`)

Never build silent text-only Shorts or manual guessed timings. Generate mastered neural narration (Edge TTS `en-US-AndrewMultilingualNeural` + FFmpeg `85 Hz` high-pass, `185 Hz / 3.6 kHz` EQ, `3:1` compression, `loudnorm I=-14.5`) AND exact word timestamps:

```powershell
.\.venv\Scripts\python.exe .\.agents\skills\insiderforce-audio-design\scripts\generate_voiceover.py `
  --text "Most developers still copy and paste code into Claude Code..." `
  --out-wav "public/audio/voiceover.wav" `
  --out-json "public/audio/word_timings.json" `
  --rate "+12%" --pitch="-2Hz" --fps 30
```

Every spoken word in `KineticWordFlow` reads its exact `startFrame` from `word_timings.json` (`{ text, start_ms, end_ms, startFrame, endFrame }`).

---

## Step 2: Generate V2 Stereo SFX Pack + Balanced `93 BPM` Music Bed (`generate_sfx_pack.py`)

Produces 8 full-range `44.1 kHz / 16-bit Stereo` WAV assets (replacing boxy mono sines with organic leather/mechanical wood clicks, stereo pink-noise sweeps, woody/marimba node pops, and a 4-band balanced Juno pad + shaker bed):

```powershell
.\.venv\Scripts\python.exe .\.agents\skills\insiderforce-audio-design\scripts\generate_sfx_pack.py `
  --out-dir "public/audio" --bed-seconds 31.0
```

Exact output files:
- `whoosh_air.wav` — stereo `320ms` silky air sweep for light entrances
- `whoosh_wipe.wav` — deeper `420ms` stereo Gaussian blur-vignette dissolve sweep
- `click_tactile.wav` — crisp leather-thumb + mechanical switch click for cursor hits (`CursorClickOverlay`)
- `text_tick.wav` — subtle paper-soft tactile micro-tick (`0.22` volume) for emphasized keywords
- `pop_woody.wav` — warm woody pitched pop (`280->460 Hz`) for 3D medallion nodes & icon bullet rows
- `sub_impact.wav` — tight `86->36 Hz` studio sub drop (`280ms`) for hooks, real footage drops, and `"Comment <WORD>"`
- `chime_warm.wav` — stereo major-9th Rhodes/celesta bloom (`650ms`) for 3D Playbook CTA & InsiderForce outro
- `music_bed_modern.wav` — `93 BPM` balanced 4-band ambient bed (`Dm9 -> Bbmaj7 -> Fmaj9 -> Cmaj7`)

---

## Step 3: The `-2f` Pre-Lap Sync Rule in Remotion

Visual velocity peaks at **frames `+2` to `+3` (`67–100 ms`)**, so trigger transitions `2 frames` (`-67 ms`) ahead of visual cuts:

```tsx
import { Audio } from '@remotion/media';
import { Sequence, staticFile } from 'remotion';

// Voiceover + balanced ducked music bed
<Audio src={staticFile('audio/voiceover.wav')} volume={1.12} />
<Audio src={staticFile('audio/music_bed_modern.wav')} volume={musicVol} />

// Pre-lap -2f SFX cue
<Sequence from={Math.max(0, cutFrame - 2)} durationInFrames={45} layout="none">
  <Audio src={staticFile('audio/whoosh_wipe.wav')} volume={0.36} />
</Sequence>
```

## Companion Reference
- Full 4-band spectral levels, cue table, and loop rules: [sfx-and-music-mix.md](references/sfx-and-music-mix.md)
