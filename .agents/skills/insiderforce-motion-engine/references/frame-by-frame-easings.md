# Frame-by-Frame Easing Curves & Burst Timings (`30 fps`)

Measured across `3,195` motion bursts and `3,301` shots in `QUANTITATIVE_METRICS.json` and audited start-to-end across all `87/87` videos (`DEEP_AUDIT_87_SUMMARY.json`).

## 1. Empirical 12-Frame Burst Shape

When an animation starts at `f0`, average inter-frame pixel motion energy follows:

| Frame | Time (`ms`) | Normalized Velocity | Phase |
|---|---:|---:|---|
| `f + 0` | `0 ms` | `0.608` | Crisp initial impulse (zero mushy anticipation) |
| `f + 1` | `33 ms` | `0.689` | Rapid acceleration |
| `f + 2` | `67 ms` | **`0.738`** | **Peak velocity** |
| `f + 3` | `100 ms` | **`0.737`** | **Peak sustained velocity** (pair whoosh apex here!) |
| `f + 4` | `133 ms` | `0.716` | Early deceleration |
| `f + 5` | `167 ms` | `0.671` | P25 burst completion (`5f`) |
| `f + 6` | `200 ms` | `0.638` | Glide tail begins |
| `f + 7` | `233 ms` | `0.624` | Soft magnetic settle |
| `f + 8` | `267 ms` | `0.571` | Typical blur transition / underline complete (`8f`) |
| `f + 9` | `300 ms` | `0.502` | Near rest |
| `f + 10` | `333 ms` | `0.478` | Full Gaussian blur transition complete (`10f`) |
| `f + 11` | `367 ms` | `0.463` | Residual micro-drift only |

---

## 2. Remotion Animation Recipes

### Recipe A: Beveled Footage & UI Card Snap (`BeveledMediaFrame`)
```tsx
const enter = spring({
  fps,
  frame: local,
  config: { damping: 18, stiffness: 205, mass: 0.78 },
});
const translateY = interpolate(enter, [0, 1], [36, 0]);
const scale = interpolate(enter, [0, 1], [0.94, 1]) * (1 + Math.min(0.022, local * 0.00028));
const opacity = interpolate(local, [0, 4], [0, 1], { extrapolateRight: 'clamp' });
```

### Recipe B: Visible `12f` Creamy Lens-Blur & Whip-Pan Transition (`BlurVignetteScene`, `6f` cross overlap)
Avoid `Easing.in(cubic)` for fade-out blur (which keeps `blur < 4px` until the final 1–2 frames and reads like a 1-frame glitch). Instead ramp blur early with `Easing.out(Easing.quad)` while keeping opacity high (`1.0 -> 0.82`) through the first 4 outgoing frames, paired with `slide-up` (`+580/-620px` + velocity `DirectionalMotionBlur`) on alternating UI cuts:
```tsx
// lens-blur out (7f):
const blur = Easing.out(Easing.quad)(outT) * 32;
const sc = interpolate(outT, [0, 1], [1, 0.915]);
const op = interpolate(outT, [0, 0.62, 1], [1, 0.82, 0]);
const vig = interpolate(outT, [0, 0.8, 1], [0, 0.34, 0.38]);
// Alternate 'lens-blur' and 'slide-up' whip-pans across <Sequence> boundaries with ~6f cross overlap.
```

### Recipe C: Smooth Optical-Reflow & Ink-Dry Word Sequence (`KineticWordFlow`)
Observed cleanly in `001`, `011`, `031`, `046`, `062`, `071`–`087`: words open their measured slot width (`0 -> exactPx`) smoothly over `5f` (`justifyContent: 'flex-start'`) so sibling words glide cleanly without snapping or overlapping, stay razor-sharp (`blurY` only `3.5px -> 0` on frames `0..3`), and dry from muted slate (`#A2A2AA`) into deep ink (`#141416`):
```tsx
const slotEase = interpolate(local, [-2, 3], [0, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
});
const enterEase = interpolate(local, [0, 5], [0, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
});
const dy = interpolate(enterEase, [0, 1], [15, 0]);
const sc = interpolate(enterEase, [0, 1], [0.94, 1]);
// Vertical impulse blurY <= 3.5px ONLY on frames 0..3; color dries [162, 162, 170] -> [20, 20, 24] over frames [1..7]
```

### Recipe D: Calligraphic Underline SVG Draw (`8f`, `41/87` videos)
```tsx
const drawUnderline = interpolate(local, [3, 11], [0, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
});
// <path d="M 2 12 Q 95 2 198 10" stroke="#141416" strokeWidth={4.5}
//   strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawUnderline} />
```
