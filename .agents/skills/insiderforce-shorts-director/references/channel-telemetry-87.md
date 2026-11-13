# InsiderForce 87-Video Quantitative Telemetry Baseline

Exact measurements computed across all **87 Shorts** (`3,301` shots, `3,195` bursts) in `QUANTITATIVE_METRICS.json`, `AUDIO_DEEP_PROFILE.json`, and `AGGREGATE_REPORT.json`.

## Video & Editing Distributions

| Dimension | Min | P25 | Median | Mean | P75 | Max |
|---|---:|---:|---:|---:|---:|---:|
| Duration (`sec`) | `45.19` | `76.66` | `87.98` | `87.27` | `99.09` | `133.47` |
| Shots / Video | `20` | `32` | `38` | `37.94` | `45` | `60` |
| Avg Shot Length (`sec`) | `1.82` | `2.17` | `2.33` | `2.32` | `2.49` | `2.88` |
| Median Anim Burst (`ms`) | `75.0` | `200.0` | `266.7` | `314.67` | `391.7` | `1133.3` |
| Static Hold (`% frames`) | `1.5%` | `6.1%` | `10.0%` | `13.34%` | `18.05%` | `43.8%` |
| Narration (`WPM`) | `135.9` | `172.75` | `185.3` | `182.84` | `193.8` | `214.6` |
| Music Tempo (`BPM`) | `65.4` | `70.3` | `93.1` | `97.38` | `94.0` | `172.3` |

## Frame Rate & Resolution Split
- **Resolution**: `1080x1920` on `87/87` (`100%`)
- **Frame rate**: `30.0 fps` (`79`), `29.97 fps` (`6`), `60.0 fps` (`2` — `056`, `060`)

## Spatial Motion Distribution (`motion_vertical_zone_pct`)
- `top_0_25` (`y: 0–480px`): **`2.8%`** — reserved top breathing space (header badges only, avoids top platform chrome)
- `upper_mid_25_50` (`y: 480–960px`): **`67.6%`** — primary visual card / UI stage
- `lower_mid_50_75` (`y: 960–1440px`): **`27.5%`** — kinetic editorial typography & CTA focal text
- `bottom_75_100` (`y: 1440–1920px`): **`2.1%`** — strictly muted lowercase `insiderforce.io` / `insiderforce.com` handle (~`y: 85–90%`), keeping clear of YouTube Shorts title/button chrome

## Style Era Evolution Observed (`001` = newest, `087` = earliest)
- **Early Era (`071–087`, Mar–Apr)**: Pure `#FFFFFF` canvas, 3D monochrome collage cutouts/silhouettes (chess pieces, stacked cash, tilted iPhones, glowing orbs), dashed cursor marquee selections, `insiderforce.com` footer.
- **Mid Era (`035–070`)**: Transition to `#F4F4F4` / `#F2F2F2` matte light gray + subtle dot/crosshair architectural grid, Claude coral `#CF6E57` + cobalt blue accents, standardized `Comment <KEYWORD>` hardcover ebook spread (`"THEY'LL NEVER KNOW AI WROTE IT"`), `insiderforce.io` footer.
- **Current Studio Era (`001–034`)**: Ultra-clean `#F2F2F2` dot-grid / vignette canvas, high-elevation rounded white UI bezels (`16–24px` shadows), dark `#19191B` CLI terminals, `8–10f` symmetric Gaussian blur-vignette dissolves, `1f` cold black start on signature reveals, 3D coral mascot variants & crisp orthogonal node diagrams.

## Start-to-End 87-Video Forensic Audit (`233,600` Frames + `87` WAV Tracks)

Full start-to-end (`f000` to final frame) visual & audio forensic scan aggregated in `analysis/DEEP_AUDIT_87_SUMMARY.json`, `analysis/FULL_TIMELINE_STATS.json`, and `analysis/FULL_AUDIO_FORENSICS.json` across `87/87` videos (`001`–`087`):

### Full-Timeline Frame & Layer Classification (`87/87`)
| Visual Layer / Composition Metric | Value (`87/87` Videos) | Notes |
|---|---:|---|
| Light studio canvas dominance (`FULL_TIMELINE_STATS.json`) | **`81.2%`** mean | Signature `#F4F4F4` / `#F2F2F2` matte grid canvas |
| Pure kinetic typography (`DEEP_AUDIT_87_SUMMARY.json`) | **`36.56%`** mean (`38.0%` median) | Present in `87/87`; color-scan avg `47.4%` in `FULL_TIMELINE_STATS.json` |
| Framed real screenshots (`DEEP_AUDIT_87_SUMMARY.json`) | **`29.13%`** mean (`32.0%` median) | Used in **`76/87`** videos (cropped browser/docs/GitHub/app UI in beveled bezels) |
| Real brand icons & pucks (`DEEP_AUDIT_87_SUMMARY.json`) | **`24.71%`** mean (`21.0%` median) | Used in **`87/87`** videos (official SVGs/PNGs on `96–128px` raised white pucks) |
| Real video / screen recordings (`DEEP_AUDIT_87_SUMMARY.json`) | **`9.6%`** mean (`66.0%` max) | Used in **`43/87`** videos (real dark CLI terminal & live browser scrolling MP4s) |
| Embedded dark UI frames (`FULL_TIMELINE_STATS.json`) | **`10.7%`** mean | Dark CLI / IDE / code-block cutouts inset on light canvas |
| Rich colorful footage / UI (`FULL_TIMELINE_STATS.json`) | **`2.9%`** mean | Highlighted live software/browser capture |

### Most Frequent Recurring Markers & Closings (`87/87` Deep Audit)
- **Top Visual Markers**: `✦` (`66` videos), `inverted pill` (`63`), `underline` (`41`), `→` (`28`), `+` (`17`), `crown logo` (`13`).
- **Closing Patterns**: `follow_gate_reminder` (`76`), `insiderforce_crown_or_brand_lockup` (`75`), `seamless_loop_or_hard_cut` (`74`), `comment_keyword_prompt` (`43`), `3d_book_or_guide_cta` (`37`).

### Full Audio Spectrum & SFX Density (`FULL_AUDIO_FORENSICS.json` & `DEEP_AUDIT_87_SUMMARY.json`)
| Audio Metric | Channel Median / Mean (`87/87`) |
|---|---:|
| Overall program loudness (`RMS`) | **`-15.4 dB`** median |
| Voiceover peak level | **`-12.6 dB`** median (`-13.71 dB` mean) |
| Background music bed floor | **`-25.0 dB`** median (`-25.94 dB` mean) |
| Voice-to-music headroom gap | **`+11.6 dB`** median (`+12.22 dB` mean) |
| Music 4-band EQ profile (`20–90Hz` / `90–280Hz` / `280–1200Hz` / `2–10kHz`) | **`-30.9 dB`** / **`-31.5 dB`** / **`-31.6 dB`** / **`-31.5 dB`** median (balanced flat bed) |
| Whoosh transitions | **`80.1 / min`** median |
| Mechanical UI clicks / text ticks | **`39.8 / min`** median |
| Sub-bass impacts / pops | **`32.8 / min`** median |
