---
name: insiderforce-motion-engine
description: Animate vertical Shorts frame-by-frame (30fps) with InsiderForce's measured spring physics, 8-10f Gaussian blur-vignette dissolves, hook compression, kinetic mixed-weight captions, hand-drawn SVG underlines, node-wire draws, cursor clicks, and anti-static micro-motion. Use whenever implementing Remotion components, keyframes, CSS/Spring easing, transitions, or animated explainers.
---

# InsiderForce Motion Engine

Reproduce the signature silky-snappy responsiveness measured across **all 87 InsiderForce Shorts** (`233,600` frames, `3,195` motion bursts, `3,301` shots).

## Empirical Motion Physics (`@ 30 fps`)

Every scene change and card entrance follows one sharp velocity curve (`avg_normalized_motion_curve_12f`):

```text
Frame offset:  +0     +1     +2     +3     +4     +5     +6     +7     +8     +9     +10    +11
Motion norm:  0.608  0.689  0.738  0.737  0.716  0.671  0.638  0.624  0.571  0.502  0.478  0.463
                              ▲ PEAK VELOCITY (67–100ms) -> exponential settle over 8–13f
```

- **CSS Cubic Bezier Equivalent**: `cubic-bezier(0.16, 1, 0.3, 1)` (`duration: 280ms – 430ms` / `8f – 13f`).
- **Remotion `spring()` Presets**:
  - **Beveled Media Card / Pill Snap**: `spring({ fps, frame, config: { damping: 18, stiffness: 205, mass: 0.78 } })`
  - **Medallion Node / Icon Bullet Pop**: `spring({ fps, frame, config: { damping: 16, stiffness: 215, mass: 0.72 } })`
  - **Kinetic Word Smooth Optical Reflow & Ink-Dry (`KineticWordFlow`)**: Avoid `return null` flex jumps that snap preceding words horizontally! Measure each `Inter` token width via Canvas (`measureWordPx`) and ease slot width `0 -> exactPx` over `4f` (`Easing.out(Easing.cubic)`) while smoothing multi-line vertical recentering as new lines appear. Keep active text razor sharp (`blurY: 3.5px -> 0` only during frames `0..3` of upward lift, then dry cleanly `#A2A2AA -> #141416` over `6f`). Optionally wrap trigger words in `highlightPill` (`#141416` inverted dark pill).
  - **Velocity Directional Motion Blur (`DirectionalMotionBlur`)**: Apply inline SVG `<feGaussianBlur stdDeviation="bx by" />` coupled to actual per-frame velocity (`|y(f) - y(f-1)|`) on springs, medallions, screenshots, video bezels, and `CursorClickOverlay` sweeps — smearing cleanly along the motion axis (`0..9px`) and landing razor crisp (`0px`) at rest.

---

## Signature Motion Mechanics (Verified Across 87/87 Audits)

1. **Hook Entry & Floating Medallion Compression (`f000 – f014`)**:
   - Start immediately on `f000` with clean studio canvas (`StudioCanvas`) + official 3D brand medallions springing into frame with velocity-coupled `DirectionalMotionBlur`, gentle sinusoidal hover drift (`Math.sin(frame * 0.08) * 6`), and word-by-word hook reveal.

2. **Visible `12f` Creamy Lens-Blur & Whip-Pan Transitions (`BlurVignetteScene`, `6f` cross overlap)**:
   - **`lens-blur` mode**: Ramp blur early (`Easing.out(quad)`, `0 -> 32px` out, `28 -> 0px` in) while holding opacity (`1.0 -> 0.82` across first 4f out), `scale 1.0 -> 0.915` out / `1.065 -> 1.0` in, and vignette `0 -> 0.38` so viewers feel a creamy camera defocus across the full `400ms` whoosh.
   - **`slide-up` whip-pan mode**: Accelerate out `-620px` / decelerate in `+580px` with velocity-coupled `DirectionalMotionBlur` (`blurY <= 16px`), alternating against `lens-blur` across tool/demo cuts.

3. **Authentic Optical Typography (`KineticWordFlow` with `Inter` + `Inter Italic`)**:
   - **Zero boxy subtitle bars.** Load `@remotion/google-fonts/Inter` (`INTER_FONT`, `INTER_ITALIC_FONT`) so Windows/headless Chromium never renders generic system fallback fonts.
   - Combine **multi-scale weight hierarchy** inside one flowing block (`42px Regular muted` lead-ins -> `68–74px Heavy/Italic` hero lines with `-0.030em` to `-0.042em` tracking and smooth `0.30em` flex spacing).
   - Sync every word's `startFrame` verbatim to `word_timings.json` generated from the voiceover track!

4. **Beveled Real Footage & Screenshot Framing (`BeveledMediaFrame`)**:
   - Frame genuine 30fps `<OffthreadVideo>` MP4 clips (`startFrom` trimmed past dead lead frames, `muted`) inside `8–11px` crisp white beveled borders with `DirectionalMotionBlur` on spring entry, gentle `+0.00028/frame` slow push-in drift, and `+18/26px` studio drop shadow.
   - If a PNG already has a baked shadow/bezel from `capture_web_screenshot.py`, render `<Img>` cleanly directly without double-wrapping it in a second border.

5. **Calligraphic SVG Underline (`41/87` videos)**:
   - Draw `strokeWidth: 4.5` asymmetric quadratic SVG curve (`M 2 12 Q 95 2 198 10`) beneath hero phrases via animated `strokeDashoffset` over `7 frames` (`3f–10f` after word arrival).

6. **Orthogonal Circuit Node-Wire Draw & Cursor Click (`CursorClickOverlay`)**:
   - Animate clean orthogonal `<path>` elbows (`stroke="#9EA2AE"`, `strokeWidth: 2.6`) via `strokeDashoffset` in exact sync with spoken tool names, lighting destination medallions on impact.
   - Glide the crisp white-outlined `#111216` vector cursor along a slight vertical arc (`-Math.sin(t * Math.PI) * 26`) with velocity-driven `DirectionalMotionBlur` into a `4f` scale depress + `#2563EB` expanding click ring.

7. **Pure Kinetic Typography Breathers (`36.56%` mean / `47.4%` raw frame share)**:
   - Never pack fake boxes on every shot. Alternate real footage / screenshot beats with pure open-canvas kinetic typography breathers (`Now instead of switching twenty tabs by hand`).

---

## Reusable Code & Reference Material

- Frame-by-frame burst timing tables & blur-deconvolve code: [frame-by-frame-easings.md](references/frame-by-frame-easings.md)
- Production Remotion TSX primitives (`INTER_FONT`, `INTER_ITALIC_FONT`, `DirectionalMotionBlur`, `StudioCanvas`, `BlurVignetteScene`, `BeveledMediaFrame`, `KineticWord`, `KineticWordFlow`, `RealIconBulletRow`, `CursorClickOverlay`): [InsiderForcePrimitives.tsx](examples/InsiderForcePrimitives.tsx)
