# InsiderForce SFX & Music Mix Engineering Spec

Measured start-to-end across all **87 WAV tracks** in `FULL_AUDIO_FORENSICS.json` and `DEEP_AUDIT_87_SUMMARY.json`.

## 1. Acoustic Frequency & Level Budgets (`87/87` Channel Medians)

- **Overall Master Loudness**: **`-15.4 dB`** median RMS (leave at least `1.0 dB` true-peak headroom, e.g., `max_volume <= -1.0 dB`).
- **Voiceover Lead**:
  - Median peak RMS: **`-12.6 dB`** (`-13.71 dB` mean across 87 tracks).
  - Processing (`generate_voiceover.py`): `highpass=f=85`, warm body shelf `185 Hz (+2.4 dB)`, vocal presence `3.6 kHz (+3.2 dB)`, `3:1` gentle glue compression (`threshold=-18 dB`), normalized via `loudnorm=I=-14.5:TP=-1.2:LRA=7`.
- **Music Bed Floor & 4-Band Balance**:
  - Median music floor: **`-25.0 dB`** (**`11.6 dB`** voice-to-music separation median; `12.22 dB` mean).
  - **CRITICAL — Avoid Muffled Low-Pass Cuts**: Across all 87 real tracks, the music bed maintains **virtually flat spectral balance** across every frequency band:
    - Sub (`20–90 Hz`): **`-30.9 dB`**
    - Warm Low-Mid (`90–280 Hz`): **`-31.5 dB`**
    - Pad Mid (`280–1200 Hz`): **`-31.6 dB`**
    - Hi Air / Texture (`2k–10 kHz`): **`-31.5 dB`**
  - Keep soft stereo hats/shakers and upper chord harmonics intact (`music_bed_modern.wav` @ `93 BPM`) while keeping vocal range (`1.5–4 kHz`) lightly recessed (~`0.34–0.38` volume during speech, blooming slightly during pauses).

## 2. V2 SFX Cue Sheet Per Beat

| Visual Event | V2 Stereo WAV Asset | Offset (`30fps`) | Remotion `volume` |
|---|---|---|---|
| Hook Arrival / Major Reveal | `sub_impact.wav` + `whoosh_air.wav` | `0f` / `+10f` | `0.40` / `0.32` |
| `7–10f` Blur-Vignette Scene Switch | `whoosh_wipe.wav` | `cutFrame - 2` | `0.34 – 0.36` |
| Real Footage / Beveled Card Entry | `whoosh_wipe.wav` + `sub_impact.wav` | `enter - 2` / `enter + 2` | `0.36` / `0.40` |
| Official 3D Medallion / Icon Bullet Pop | `pop_woody.wav` | `itemFrame - 2` | `0.32 – 0.34` |
| Stressed Keyword Arrival | `text_tick.wav` | `wordFrame - 2` | `0.22 – 0.24` |
| Cursor Click on Live Footage | `click_tactile.wav` | `clickFrame - 2` | `0.44` |
| 3D Book CTA / InsiderForce End Lockup | `chime_warm.wav` | `ctaFrame - 2` | `0.28 – 0.30` |

## 3. Loop Continuity Strategy

Observed across `74/87` videos in `DEEP_AUDIT_87_SUMMARY.json`:
1. **Clean Voice-to-Loop Handoff**: Fade music smoothly over the final `15–20` frames (`0.46 -> 0.22 -> 0.0`) after the closing follower line finishes so loop restart back into `f000` is crisp without click/pop artifacts.
2. **Pre-Lap Safety Clamp**: Always wrap `<Sequence from={Math.max(0, frame - 2)} ...>` so frame-0 openers never generate negative frame indices in Remotion.
