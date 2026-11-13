import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

const interRegular = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});
const interItalic = loadFont('italic', {
  weights: ['500', '600', '700'],
  subsets: ['latin'],
});

export const INTER_FONT = interRegular.fontFamily;
export const INTER_ITALIC_FONT = interItalic.fontFamily;

const textWidthCache = new Map<string, number>();
let measureCtx: CanvasRenderingContext2D | null = null;

function measureWordPx(
  text: string,
  fontWeight: number,
  italic: boolean,
  fontSize: number,
  letterSpacingEm: number
): number {
  const key = `${text}|${fontWeight}|${italic ? 1 : 0}|${fontSize}|${letterSpacingEm}`;
  const cached = textWidthCache.get(key);
  if (cached !== undefined) return cached;

  let width = text.length * fontSize * 0.56;
  if (typeof document !== 'undefined') {
    if (!measureCtx) {
      const c = document.createElement('canvas');
      measureCtx = c.getContext('2d');
    }
    if (measureCtx) {
      const family = italic ? INTER_ITALIC_FONT : INTER_FONT;
      measureCtx.font = `${italic ? 'italic ' : ''}${fontWeight} ${fontSize}px ${family}`;
      const raw = measureCtx.measureText(text).width;
      const trackingAdjust = Math.max(0, text.length - 1) * (letterSpacingEm * fontSize);
      width = Math.max(4, raw + trackingAdjust);
    }
  }
  textWidthCache.set(key, width);
  return width;
}

/**
 * GPU-accelerated directional (X, Y) velocity-coupled motion blur.
 * Avoids CPU-bound SVG <feGaussianBlur> filter readbacks so Chromium maintains persistent 30fps playback.
 */
export const DirectionalMotionBlur: React.FC<{
  blurX?: number;
  blurY?: number;
  children: React.ReactNode;
}> = ({ blurX = 0, blurY = 0, children }) => {
  const bx = Math.max(0, Math.min(14, blurX));
  const by = Math.max(0, Math.min(14, blurY));
  const active = bx > 0.25 || by > 0.25;
  const radius = Math.min(12, Math.max(bx, by) * 0.72);
  const scaleX = bx > by && active ? 1 + Math.min(0.028, bx * 0.0022) : 1;
  const scaleY = by >= bx && active ? 1 + Math.min(0.028, by * 0.0022) : 1;

  return (
    <div
      style={{
        filter: active ? `blur(${radius.toFixed(1)}px)` : undefined,
        transform: active ? `translate3d(0,0,0) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})` : undefined,
      }}
    >
      {children}
    </div>
  );
};

/** Studio canvas (#F2F2F2/#ECECEC) + subtle dashed-square/dot architectural grid + watermark. */
export const StudioCanvas: React.FC<{
  backgroundColor?: string;
  gridType?: 'arch-dots' | 'plus' | 'none';
  watermark?: string;
  children: React.ReactNode;
}> = ({
  backgroundColor = '#F2F2F2',
  gridType = 'arch-dots',
  watermark = 'insiderforce.io',
  children,
}) => {
  const archGridSvg = `url("data:image/svg+xml,%3Csvg width='64' height='64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M64 0H0v64' fill='none' stroke='%23E3E3E7' stroke-width='1' stroke-dasharray='3 4'/%3E%3Ccircle cx='0' cy='0' r='1.8' fill='%23CCCCD2'/%3E%3C/svg%3E")`;
  const plusGridSvg = `url("data:image/svg+xml,%3Csvg width='56' height='56' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 23v10M23 28h10' fill='none' stroke='%23D6D6DC' stroke-width='1.2'/%3E%3C/svg%3E")`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: INTER_FONT,
        overflow: 'hidden',
      }}
    >
      {gridType !== 'none' ? (
        <>
          <AbsoluteFill
            style={{
              backgroundImage: gridType === 'plus' ? plusGridSvg : archGridSvg,
              backgroundSize: gridType === 'plus' ? '56px 56px' : '64px 64px',
            }}
          />
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              background: `radial-gradient(ellipse 78% 72% at 50% 48%, rgba(242,242,242,0) 45%, ${backgroundColor} 100%)`,
            }}
          />
        </>
      ) : null}

      {children}

      {watermark ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1585,
            textAlign: 'center',
            fontSize: 27,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: '#ACACB4',
            pointerEvents: 'none',
          }}
        >
          {watermark}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * Authentic InsiderForce transition wrapper supporting both:
 * - `'lens-blur'`: 12f visible creamy defocus + radial vignette breath + subtle depth pull/push (046 f678..f687)
 * - `'slide-up'`: energetic whip-pan vertical slide with real velocity-coupled directional motion blur (046 f1321..f1335)
 */
export const BlurVignetteScene: React.FC<{
  durationInFrames: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  enterMode?: 'lens-blur' | 'slide-up';
  exitMode?: 'lens-blur' | 'slide-up';
  children: React.ReactNode;
}> = ({
  durationInFrames,
  fadeInFrames = 7,
  fadeOutFrames = 7,
  enterMode = 'lens-blur',
  exitMode = 'lens-blur',
  children,
}) => {
  const frame = useCurrentFrame();

  const stateAt = (f: number) => {
    const inT =
      fadeInFrames > 0
        ? interpolate(f, [0, fadeInFrames], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        : 1;
    const outT =
      fadeOutFrames > 0
        ? interpolate(f, [durationInFrames - fadeOutFrames, durationInFrames], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        : 0;

    let ty = 0;
    let sc = 1;
    let blur = 0;
    let op = 1;
    let vig = 0;

    if (inT < 1) {
      const eased = Easing.out(Easing.cubic)(inT);
      if (enterMode === 'slide-up') {
        ty += (1 - eased) * 580;
        sc *= interpolate(eased, [0, 1], [0.96, 1]);
        op *= interpolate(inT, [0, 0.28, 1], [0, 0.85, 1]);
        vig += (1 - inT) * 0.16;
      } else {
        blur += (1 - Easing.out(Easing.quad)(inT)) * 16;
        sc *= interpolate(eased, [0, 1], [1.06, 1]);
        op *= interpolate(inT, [0, 0.3, 1], [0, 0.72, 1]);
        vig += (1 - inT) * 0.32;
      }
    }

    if (outT > 0) {
      const easedOut = Easing.in(Easing.cubic)(outT);
      if (exitMode === 'slide-up') {
        ty -= easedOut * 620;
        sc *= interpolate(easedOut, [0, 1], [1, 0.95]);
        op *= interpolate(outT, [0, 0.65, 1], [1, 0.85, 0]);
        vig += outT * 0.16;
      } else {
        blur += Easing.out(Easing.quad)(outT) * 16;
        sc *= interpolate(outT, [0, 1], [1, 0.92]);
        op *= interpolate(outT, [0, 0.62, 1], [1, 0.82, 0]);
        vig += interpolate(outT, [0, 0.8, 1], [0, 0.32, 0.36]);
      }
    }

    return { ty, sc, blur, op, vig };
  };

  const cur = stateAt(frame);
  const prev = stateAt(frame - 1);
  const whipBlurY =
    (enterMode === 'slide-up' && frame < fadeInFrames) ||
    (exitMode === 'slide-up' && frame > durationInFrames - fadeOutFrames)
      ? Math.min(12, Math.abs(cur.ty - prev.ty) * 0.12)
      : 0;
  const totalBlur = Math.min(16, Math.max(cur.blur, whipBlurY));
  const stretchY = whipBlurY > 0.25 ? 1 + Math.min(0.028, whipBlurY * 0.0022) : 1;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: cur.op,
          filter: totalBlur > 0.25 ? `blur(${totalBlur.toFixed(1)}px)` : undefined,
          transform: `translate3d(0, ${cur.ty.toFixed(2)}px, 0) scale(${cur.sc.toFixed(4)}, ${(cur.sc * stretchY).toFixed(4)})`,
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
      >
        <div style={{ width: 1080, height: 1920, position: 'relative' }}>{children}</div>
      </AbsoluteFill>
      {cur.vig > 0.005 ? (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            opacity: Math.min(1, cur.vig),
            background:
              'radial-gradient(circle at 50% 46%, rgba(0,0,0,0) 34%, rgba(0,0,0,1) 100%)',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * Thick beveled white frame + deep directional bottom-right studio shadow + velocity-coupled
 * vertical directional motion blur during high-speed spring entry.
 */
export const BeveledMediaFrame: React.FC<{
  enterFrame?: number;
  width?: number;
  borderWidth?: number;
  borderRadius?: number;
  drift?: boolean;
  children: React.ReactNode;
}> = ({
  enterFrame = 0,
  width = 880,
  borderWidth = 10,
  borderRadius = 24,
  drift = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - enterFrame);
  const prevLocal = Math.max(0, local - 1);

  const springCfg = { damping: 17, stiffness: 225, mass: 0.76 };
  const s = spring({ fps, frame: local, config: springCfg });
  const sPrev = spring({ fps, frame: prevLocal, config: springCfg });

  const y = interpolate(s, [0, 1], [54, 0]);
  const yPrev = interpolate(sPrev, [0, 1], [54, 0]);
  const vy = Math.abs(y - yPrev);
  const blurY = local > 0 && local < 10 ? Math.min(9, vy * 0.55) : 0;

  const scale =
    interpolate(s, [0, 1], [0.925, 1]) * (drift ? 1 + Math.min(0.022, local * 0.00028) : 1);
  const opacity = interpolate(local, [0, 3], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <DirectionalMotionBlur blurY={blurY}>
      <div
        style={{
          width,
          padding: borderWidth,
          borderRadius,
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #D9DBE2',
          boxShadow:
            '18px 26px 52px -8px rgba(16, 18, 28, 0.20), 6px 10px 20px -4px rgba(16, 18, 28, 0.10)',
          opacity,
          transform: `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`,
          willChange: 'transform, opacity',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            borderRadius: Math.max(8, borderRadius - borderWidth + 2),
            overflow: 'hidden',
            backgroundColor: '#0D1017',
          }}
        >
          {children}
        </div>
      </div>
    </DirectionalMotionBlur>
  );
};

export interface KineticWord {
  text: string;
  startFrame: number;
  weight?: 'regular' | 'medium' | 'bold' | 'heavy';
  italic?: boolean;
  muted?: boolean;
  size?: number;
  underline?: boolean;
  highlightPill?: boolean;
  lineBreakAfter?: boolean;
}

/**
 * Authentic InsiderForce smooth optical-reflow kinetic typography (matched frame-by-frame to 001 & 046):
 * 1. Measured Canvas word widths interpolate `0 -> exactPx` over 4 frames so sibling words GLIDE cleanly
 *    leftward rather than teleporting in a 1-frame flex snap.
 * 2. Group smoothly recenter-lifts upward (`-lineShift`) as each new line unlocks.
 * 3. Sharp ink-drying curve (`#A6A6AE -> #141416`) with directional micro vertical motion blur only on
 *    frames 0..2 of upward impulse (`stdDeviation="0, 2.2 -> 0"`), zero blurry active words.
 */
export const KineticWordFlow: React.FC<{
  words: KineticWord[];
  top?: number;
  baseSize?: number;
  maxWidth?: number;
}> = ({ words, top = 1075, baseSize = 54, maxWidth = 880 }) => {
  const frame = useCurrentFrame();

  const lines: KineticWord[][] = [[]];
  words.forEach((w) => {
    lines[lines.length - 1].push(w);
    if (w.lineBreakAfter) lines.push([]);
  });
  const nonEmptyLines = lines.filter((l) => l.length > 0);

  const weightMap: Record<NonNullable<KineticWord['weight']>, number> = {
    regular: 400,
    medium: 500,
    bold: 700,
    heavy: 800,
  };

  // Smooth vertical centering compensation as lines 2, 3... unlock
  let verticalPull = 0;
  for (let li = 1; li < nonEmptyLines.length; li++) {
    const firstStart = Math.min(...nonEmptyLines[li].map((w) => w.startFrame));
    const lineOpen = interpolate(frame, [firstStart - 1, firstStart + 5], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
    const avgSz =
      nonEmptyLines[li].reduce((acc, w) => acc + (w.size ?? baseSize), 0) /
      nonEmptyLines[li].length;
    verticalPull += lineOpen * (avgSz * 0.42);
  }

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: (1080 - maxWidth) / 2,
        width: maxWidth,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        transform: `translate3d(0, ${(-verticalPull).toFixed(2)}px, 0)`,
      }}
    >
      {nonEmptyLines.map((line, li) => (
        <div
          key={li}
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'baseline',
          }}
        >
          {line.map((w, wi) => {
            const local = frame - w.startFrame;
            if (local < -2) return null;

            const sz = w.size ?? baseSize;
            const fw = weightMap[w.weight ?? 'medium'];
            const letterEm = sz >= 64 ? -0.042 : -0.030;
            const rawWidth = measureWordPx(w.text, fw, Boolean(w.italic), sz, letterEm);
            const pillExtra = w.highlightPill ? 28 : 0;
            const gapRight = wi < line.length - 1 ? sz * 0.30 : 0;

            // Smooth 5-frame slot expansion leads opacity by 1.5f; flex-start prevents left-edge overlap
            const slotEase = interpolate(local, [-2, 3], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });

            const enterEase = interpolate(local, [0, 5], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });
            const enterPrev = interpolate(local - 1, [0, 5], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            });

            const dy = interpolate(enterEase, [0, 1], [15, 0]);
            const dyPrev = interpolate(enterPrev, [0, 1], [15, 0]);
            const blurY = local >= 0 && local <= 3.5 ? Math.min(3.5, Math.abs(dy - dyPrev) * 0.45) : 0;

            const opacity = interpolate(local, [-0.5, 2.8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const sc = interpolate(enterEase, [0, 1], [0.94, 1]);

            // Ink dries cleanly from crisp cool-slate (#A2A2AA) to rich ink (#141416)
            const dryRatio = interpolate(local, [1, 7], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.quad),
            });
            const targetRgb = w.highlightPill
              ? [255, 255, 255]
              : w.muted
                ? [102, 102, 110]
                : [20, 20, 24];
            const startRgb = w.highlightPill ? [230, 230, 236] : [162, 162, 170];
            const r = Math.round(interpolate(dryRatio, [0, 1], [startRgb[0], targetRgb[0]]));
            const g = Math.round(interpolate(dryRatio, [0, 1], [startRgb[1], targetRgb[1]]));
            const b = Math.round(interpolate(dryRatio, [0, 1], [startRgb[2], targetRgb[2]]));

            const drawUnderline = w.underline
              ? interpolate(local, [3, 10], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.out(Easing.quad),
                })
              : 0;

            const outerWidth = (rawWidth + pillExtra + 2) * slotEase;
            const marginR = gapRight * slotEase;

            return (
              <span
                key={wi}
                style={{
                  display: 'inline-flex',
                  justifyContent: 'flex-start',
                  alignItems: 'baseline',
                  width: outerWidth,
                  marginRight: marginR,
                  overflow: 'visible',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    fontFamily: w.italic ? INTER_ITALIC_FONT : INTER_FONT,
                    fontStyle: w.italic ? 'italic' : 'normal',
                    fontWeight: fw,
                    fontSize: sz,
                    letterSpacing: `${letterEm}em`,
                    lineHeight: 1.12,
                    color: `rgb(${r}, ${g}, ${b})`,
                    backgroundColor: w.highlightPill ? '#141416' : undefined,
                    padding: w.highlightPill ? '4px 14px 6px 14px' : undefined,
                    borderRadius: w.highlightPill ? 14 : undefined,
                    boxShadow: w.highlightPill ? '0 8px 20px rgba(16,18,28,0.16)' : undefined,
                    opacity,
                    filter: blurY > 0.25 ? `blur(${blurY.toFixed(2)}px)` : undefined,
                    transform: `translate3d(0, ${dy.toFixed(2)}px, 0) scale(${sc.toFixed(4)})`,
                  }}
                >
                  {w.text}
                  {w.underline ? (
                    <svg
                      viewBox="0 0 200 18"
                      preserveAspectRatio="none"
                      style={{
                        position: 'absolute',
                        left: -2,
                        right: -2,
                        bottom: -7,
                        width: 'calc(100% + 4px)',
                        height: 13,
                        overflow: 'visible',
                      }}
                    >
                      <path
                        d="M 2 12 Q 95 2 198 10"
                        fill="none"
                        stroke="#141416"
                        strokeWidth={4.5}
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={1 - drawUnderline}
                      />
                    </svg>
                  ) : null}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Authentic bullet row paired with REAL fetched official SVG/PNG brand icons + velocity blur. */
export const RealIconBulletRow: React.FC<{
  iconSrc: string;
  label: string;
  startFrame: number;
}> = ({ iconSrc, label, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - startFrame);
  if (frame < startFrame) return null;

  const springCfg = { damping: 17, stiffness: 235, mass: 0.72 };
  const s = spring({ fps, frame: local, config: springCfg });
  const sPrev = spring({ fps, frame: Math.max(0, local - 1), config: springCfg });

  const dy = interpolate(s, [0, 1], [26, 0]);
  const dyPrev = interpolate(sPrev, [0, 1], [26, 0]);
  const blurY = local > 0 && local < 6 ? Math.min(6.5, Math.abs(dy - dyPrev) * 0.55) : 0;
  const opacity = interpolate(local, [0, 3], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <DirectionalMotionBlur blurY={blurY}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          opacity,
          transform: `translateY(${dy.toFixed(2)}px)`,
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 13,
            backgroundColor: '#FFFFFF',
            border: '1px solid #DFDFE5',
            boxShadow: '4px 6px 14px rgba(16, 18, 28, 0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Img src={iconSrc} style={{ width: 29, height: 29, objectFit: 'contain' }} />
        </div>
        <span
          style={{
            fontSize: 44,
            fontWeight: 500,
            letterSpacing: '-0.036em',
            color: '#18181B',
          }}
        >
          {label}
        </span>
      </div>
    </DirectionalMotionBlur>
  );
};

/** Pointer cursor glide with velocity directional motion blur + 4f button depress ripple overlay. */
export const CursorClickOverlay: React.FC<{
  from: [number, number];
  to: [number, number];
  moveStartFrame: number;
  clickFrame: number;
}> = ({ from, to, moveStartFrame, clickFrame }) => {
  const frame = useCurrentFrame();
  const posAt = (f: number) => {
    const u = interpolate(f, [moveStartFrame, clickFrame - 3], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
    return {
      x: interpolate(u, [0, 1], [from[0], to[0]]),
      y: interpolate(u, [0, 1], [from[1], to[1]]) - Math.sin(u * Math.PI) * 26,
    };
  };

  const cur = posAt(frame);
  const prev = posAt(frame - 1);
  const blurX = Math.min(6, Math.abs(cur.x - prev.x) * 0.25);
  const blurY = Math.min(6, Math.abs(cur.y - prev.y) * 0.25);

  const clickScale = interpolate(
    frame,
    [clickFrame, clickFrame + 2, clickFrame + 6],
    [1, 0.84, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const rippleProgress = interpolate(frame, [clickFrame, clickFrame + 11], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (frame < moveStartFrame - 2) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate3d(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px, 0)`,
        willChange: 'transform',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {rippleProgress > 0 && rippleProgress < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: -24,
            top: -24,
            width: 48,
            height: 48,
            borderRadius: 999,
            border: '3px solid #2563EB',
            opacity: 1 - rippleProgress,
            transform: `scale(${0.4 + rippleProgress * 1.4})`,
          }}
        />
      ) : null}
      <DirectionalMotionBlur blurX={blurX} blurY={blurY}>
        <svg
          width="42"
          height="42"
          viewBox="0 0 32 32"
          style={{
            transform: `scale(${clickScale.toFixed(3)})`,
            filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.22))',
          }}
        >
          <path
            d="M6 4 L25 16 L16 18.5 L12 27 Z"
            fill="#111216"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>
      </DirectionalMotionBlur>
    </div>
  );
};
