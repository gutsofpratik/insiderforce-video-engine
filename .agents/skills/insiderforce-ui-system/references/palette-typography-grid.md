# InsiderForce Color, Typography & Safe-Zone Grid Reference

Derived from empirical palette measurements across all 87 analyzed videos (`AGGREGATE_REPORT.json`, `FULL_TIMELINE_STATS.json`, and `DEEP_AUDIT_87_SUMMARY.json`).

## 1. Canvas & Surface Colors

### Primary Background Frequency (87 Videos)
- `81.2%` average light canvas coverage across all `233,600` frames (`FULL_TIMELINE_STATS.json`).
- `#F2F2F2` — **30 videos** (standard studio off-white)
- `#F4F4F4` — **18 videos**
- `#FFFFFF` — **16 videos**
- `#F6F6F6` — **9 videos**
- `#E6E6E6` / `#ECECEC` — **8 videos** (frequently used on closing CTA / 3D book lockups)

### Background Grid / Texture Recipes (CSS / SVG)
1. **Architectural Dashed-Square + Intersection Dot Matrix** (signature modern look observed in `046`, `062`, `031`):
   ```tsx
   const archGridSvg = `url("data:image/svg+xml,%3Csvg width='64' height='64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M64 0H0v64' fill='none' stroke='%23E3E3E7' stroke-width='1' stroke-dasharray='3 4'/%3E%3Ccircle cx='0' cy='0' r='1.8' fill='%23CCCCD2'/%3E%3C/svg%3E")`;
   // Pair with radial maskImage so texture breathes gently out toward corners:
   // radial-gradient(ellipse 78% 72% at 50% 48%, rgba(0,0,0,0.95) 45%, rgba(0,0,0,0.12) 100%)
   ```
2. **`+` Crosshair Grid**: Repeat `56x56` `+` SVG path (`stroke="#D6D6DC" stroke-width="1.2"`).
3. **Gaussian Vignette Breath**: Radial dark gradient `rgba(0,0,0,0.0)` center -> `rgba(0,0,0,0.16)` edges sweeping smoothly during `8–10f` blur transitions.

### Dark UI Contrast Surfaces
- Deep Obsidian: `#0D1017`, `#0D1019`, `#0F1115`
- Charcoal Terminal / Card: `#131419`, `#19191B`, `#1C1D21`
- Highlight Pill Black: `#070B16`, `#181818` (paired with `#FFFFFF` crisp bold copy)

### Brand & Semantic Accents
- Claude Terracotta Coral: `#D97757` / `#CF6E57` (official logo accents & starbursts)
- Electric Cobalt Blue: `#2563EB` / `#3B82F6` (CTA ripples, active borders, link pills)
- Emerald / Success Green: `#10B981` / `#3ECF8E` (`[connected]` terminal output, live dots)
- Alert Red: `#EF4444` / `#DC2626` (`×` / `⊗` negations, old-way pain points)

---

## 2. Typography Scale (for `1080x1920`)

Load **`Inter` (`400, 500, 600, 700, 800`) + `Inter Italic` (`500, 600, 700`)** explicitly via `@remotion/google-fonts/Inter`. Never let Chromium fall back to system `Segoe UI` or Arial.

| Role | Font & Weight | Size (`1080w`) | Line Height | Tracking | Color |
|---|---|---:|---:|---:|---|
| Heavy Stack / Hero Statement | `Inter` Bold/Extrabold (`700–800`) | `64px – 76px` | `1.12` | `-0.042em` | `#141416` |
| Editorial Italic Emphasis | `Inter Italic` (`700`) | `64px – 74px` | `1.12` | `-0.042em` | `#141416` |
| Kinetic Caption Word (Unspoken / Incoming) | `Inter` Medium (`400–500`) | `48px – 58px` | `1.14` | `-0.030em` | `#AEAEB4` (dries over `6f`) |
| Kinetic Caption Word (Spoken / Lead-in Muted) | `Inter` Regular (`400`) | `42px – 54px` | `1.14` | `-0.030em` | `#5C5C64` |
| Kinetic Caption Word (Active Emphasis) | `Inter` Bold/Heavy (`700–800`) | `54px – 64px` | `1.14` | `-0.036em` | `#141416` |
| Word Flex `columnGap` | — | `0.32em` | — | — | Prevents glyph collision at `-0.04em` tracking |
| `✦` / Icon Bullet Row | `Inter` Medium (`500`) | `44px` | `1.2` | `-0.036em` | `#18181B` |
| Persistent Footer Handle | `Inter` Medium (`500`) | `27px` | `1.0` | `-0.02em` | `#ACACB4` (`insiderforce.io`, `top: 1585px`) |

---

## 3. Spatial Grid & Safe Zones (`1080x1920`)

```
y = 0 ──────────────────────────────────────────────
  Top Breathing Margin (0–255px)
y = 255 ────────────────────────────────────────────
  Medallion Hubs / Context Pills (y: 255–440px)
y = 448 ────────────────────────────────────────────
  PRIMARY VISUAL STAGE (BeveledMediaFrame <OffthreadVideo> / real screenshot, y: 448–1060px)
  Always leave >= 40px below drop shadow before captions start!
y = 1135 ───────────────────────────────────────────
  KINETIC CAPTION STAGE (KineticWordFlow, y: 1135–1450px, max-width 860px)
y = 1585 ───────────────────────────────────────────
  Muted Watermark: "insiderforce.io" (y: 1585px)
y = 1660 ───────────────────────────────────────────
  Bottom Shorts Safe Exclusion (y: 1660–1920px)
```
