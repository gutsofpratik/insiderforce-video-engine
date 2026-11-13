import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/** Studio matte canvas (#F2F2F2 default) + architectural dot grid + watermark. */
export const StudioCanvas: React.FC<{
  backgroundColor?: string;
  gridType?: 'dots' | 'plus' | 'none';
  watermark?: string;
  children: React.ReactNode;
}> = ({
  backgroundColor = '#F2F2F2',
  gridType = 'dots',
  watermark = 'insiderforce.io',
  children,
}) => {
  const bgStyle: React.CSSProperties =
    gridType === 'dots'
      ? {
          backgroundColor,
          backgroundImage:
            'radial-gradient(#D4D4D8 1.45px, transparent 1.45px)',
          backgroundSize: '36px 36px',
        }
      : gridType === 'plus'
        ? {
            backgroundColor,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 20v8M20 24h8' stroke='%23D4D4D4' stroke-width='1.2'/%3E%3C/svg%3E")`,
            backgroundSize: '48px 48px',
          }
        : { backgroundColor };

  return (
    <AbsoluteFill
      style={{
        ...bgStyle,
        fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
        overflow: 'hidden',
      }}
    >
      {children}
      {watermark ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1595,
            textAlign: 'center',
            fontSize: 25,
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: '#A1A1AA',
            pointerEvents: 'none',
          }}
        >
          {watermark}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** 8-10f symmetric Gaussian blur + radial edge vignette wrapper per scene. */
export const BlurVignetteScene: React.FC<{
  durationInFrames: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  children: React.ReactNode;
}> = ({
  durationInFrames,
  fadeInFrames = 7,
  fadeOutFrames = 9,
  children,
}) => {
  const frame = useCurrentFrame();

  const inProgress =
    fadeInFrames > 0
      ? interpolate(frame, [0, fadeInFrames], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
      : 1;

  const outProgress =
    fadeOutFrames > 0
      ? interpolate(
          frame,
          [durationInFrames - fadeOutFrames, durationInFrames],
          [0, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.in(Easing.cubic),
          }
        )
      : 0;

  const blurPx = (1 - inProgress) * 14 + outProgress * 16;
  const opacity = inProgress * (1 - outProgress);
  const scale = interpolate(inProgress, [0, 1], [0.97, 1]) - outProgress * 0.02;
  const vignette = (1 - inProgress) * 0.14 + outProgress * 0.16;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity,
          filter: blurPx > 0.2 ? `blur(${blurPx.toFixed(2)}px)` : undefined,
          transform: `scale(${scale.toFixed(4)})`,
        }}
      >
        {children}
      </AbsoluteFill>
      {vignette > 0.005 ? (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: `radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 42%, rgba(0,0,0,${vignette.toFixed(3)}) 100%)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/** Elevated white/dark rounded UI bezel card with InsiderForce soft shadow + micro drift. */
export const ElevatedCard: React.FC<{
  enterFrame?: number;
  dark?: boolean;
  width?: number;
  padding?: number;
  borderRadius?: number;
  drift?: boolean;
  children: React.ReactNode;
}> = ({
  enterFrame = 0,
  dark = false,
  width = 880,
  padding = 16,
  borderRadius = 24,
  drift = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - enterFrame);
  const s = spring({
    fps,
    frame: localFrame,
    config: { damping: 18, stiffness: 210, mass: 0.78 },
  });

  const opacity = interpolate(localFrame, [0, 5], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const y = interpolate(s, [0, 1], [38, 0]);
  const scale =
    interpolate(s, [0, 1], [0.94, 1]) * (drift ? 1 + Math.min(0.018, localFrame * 0.00025) : 1);

  return (
    <div
      style={{
        width,
        padding,
        borderRadius,
        backgroundColor: dark ? '#19191B' : '#FFFFFF',
        border: dark ? '1px solid #303138' : '1px solid #E4E4E7',
        boxShadow:
          '0 24px 52px -12px rgba(18, 22, 34, 0.16), 0 8px 20px -6px rgba(18, 22, 34, 0.08)',
        opacity,
        transform: `translateY(${y.toFixed(2)}px) scale(${scale.toFixed(4)})`,
      }}
    >
      {children}
    </div>
  );
};

export interface CaptionWord {
  text: string;
  startFrame: number;
  bold?: boolean;
  italic?: boolean;
  pill?: boolean;
  underline?: boolean;
}

/** Mixed-weight editorial kinetic sentence with muted-to-bold snap + dark pills + underline. */
export const KineticSentence: React.FC<{
  words: CaptionWord[];
  fontSize?: number;
  top?: number;
}> = ({ words, fontSize = 54, top = 1090 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 100,
        right: 100,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: '10px 14px',
        lineHeight: 1.24,
        letterSpacing: '-0.025em',
        textAlign: 'center',
      }}
    >
      {words.map((w, idx) => {
        const local = frame - w.startFrame;
        const t = interpolate(local, [0, 5], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        const activeSnap = local >= 2;
        const opacity = interpolate(t, [0, 1], [0.15, 1]);
        const dy = interpolate(t, [0, 1], [10, 0]);

        const pillScale = w.pill
          ? interpolate(local, [0, 6], [0.2, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            })
          : 1;

        const underlineDraw = w.underline
          ? interpolate(local, [3, 11], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.quad),
            })
          : 0;

        if (local < -1) {
          return (
            <span
              key={idx}
              style={{
                fontSize,
                fontWeight: w.bold ? 700 : 500,
                opacity: 0,
              }}
            >
              {w.text}
            </span>
          );
        }

        return (
          <span
            key={idx}
            style={{
              position: 'relative',
              display: 'inline-block',
              fontSize,
              fontWeight: w.bold || w.pill ? 700 : 500,
              fontStyle: w.italic ? 'italic' : 'normal',
              color: w.pill
                ? '#FFFFFF'
                : activeSnap
                  ? w.bold
                    ? '#111216'
                    : '#26272B'
                  : '#949498',
              backgroundColor: w.pill ? '#070B16' : 'transparent',
              padding: w.pill ? '4px 18px 6px' : 0,
              borderRadius: w.pill ? 12 : 0,
              opacity,
              transform: `translateY(${dy.toFixed(2)}px) ${w.pill ? `scaleX(${pillScale.toFixed(3)})` : ''}`,
              transformOrigin: 'left center',
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
                  bottom: -8,
                  width: 'calc(100% + 4px)',
                  height: 14,
                  overflow: 'visible',
                }}
              >
                <path
                  d="M 2 12 Q 95 2 198 10"
                  fill="none"
                  stroke="#141416"
                  strokeWidth={5.5}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - underlineDraw}
                />
              </svg>
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

/** Rotating 8-point Claude terracotta starburst accent. */
export const CoralStarburst: React.FC<{
  size?: number;
  color?: string;
  speedDegPerFrame?: number;
}> = ({ size = 240, color = '#CF6E57', speedDegPerFrame = 0.6 }) => {
  const frame = useCurrentFrame();
  const rot = frame * speedDegPerFrame;
  const rays = Array.from({ length: 8 }, (_, i) => i * 45);

  return (
    <svg
      width={size}
      height={size}
      viewBox="-100 -100 200 200"
      style={{ transform: `rotate(${rot.toFixed(2)}deg)` }}
    >
      {rays.map((deg) => (
        <rect
          key={deg}
          x={-11}
          y={-88}
          width={22}
          height={64}
          rx={11}
          fill={color}
          transform={`rotate(${deg})`}
        />
      ))}
    </svg>
  );
};

/** Pointer cursor glide + 4f button depress ripple overlay. */
export const CursorClickOverlay: React.FC<{
  from: [number, number];
  to: [number, number];
  moveStartFrame: number;
  clickFrame: number;
}> = ({ from, to, moveStartFrame, clickFrame }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [moveStartFrame, clickFrame - 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const x = interpolate(t, [0, 1], [from[0], to[0]]);
  const y = interpolate(t, [0, 1], [from[1], to[1]]) - Math.sin(t * Math.PI) * 28;

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
    <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 50 }}>
      {rippleProgress > 0 && rippleProgress < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: -26,
            top: -26,
            width: 52,
            height: 52,
            borderRadius: 999,
            border: '3px solid #2563EB',
            opacity: 1 - rippleProgress,
            transform: `scale(${0.4 + rippleProgress * 1.4})`,
          }}
        />
      ) : null}
      <svg
        width="44"
        height="44"
        viewBox="0 0 32 32"
        style={{
          transform: `scale(${clickScale.toFixed(3)})`,
          filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.22))',
        }}
      >
        <path
          d="M6 4 L25 16 L16 18.5 L12 27 Z"
          fill="#FFFFFF"
          stroke="#111216"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
