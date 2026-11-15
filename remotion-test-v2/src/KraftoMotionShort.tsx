import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Audio } from '@remotion/media';
import {
  BeveledMediaFrame,
  BlurVignetteScene,
  CursorClickOverlay,
  INTER_FONT,
  KineticWordFlow,
  StudioCanvas,
} from './Primitives';
import {
  KRAFTO_MOTION_DEFAULT_PROPS,
  KraftoMotionShortProps,
} from './kraftoMotionTextLayer';

/**
 * Minimalist Monochrome Specimen Badge for Krafto Motion Products
 */
const KraftoMotionBadge: React.FC<{
  indexLabel: string;
  productName: string;
  formatTag?: string;
  startFrame: number;
}> = ({ indexLabel, productName, formatTag, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 16, stiffness: 210, mass: 0.72 },
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 999,
        padding: '10px 28px 10px 12px',
        border: '1.5px solid #E2E4EC',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.08)',
        transform: `translateY(${(1 - pop) * 18}px) scale(${0.92 + pop * 0.08})`,
        opacity: interpolate(frame - startFrame, [0, 5], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 999,
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile('krafto/logo_krafto.png')}
          style={{ width: 40, height: 40, objectFit: 'contain' }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span
          style={{
            fontFamily: INTER_FONT,
            fontSize: 26,
            fontWeight: 800,
            color: '#000000',
            letterSpacing: '-0.02em',
          }}
        >
          {indexLabel}
        </span>
        <span
          style={{
            fontFamily: INTER_FONT,
            fontSize: 30,
            fontWeight: 700,
            color: '#141416',
            letterSpacing: '-0.03em',
          }}
        >
          {productName}
        </span>
        {formatTag ? (
          <span
            style={{
              fontFamily: INTER_FONT,
              fontSize: 20,
              fontWeight: 600,
              color: '#71717A',
              letterSpacing: '-0.01em',
              marginLeft: 6,
            }}
          >
            · {formatTag}
          </span>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Scene 1 (0..240f): Pattern Interrupt Hook — Deconstructed Keyframe Curve
 */
const HookScene: React.FC<{
  textProps: KraftoMotionShortProps['scene1Hook'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const corePop = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 15, stiffness: 180, mass: 0.8 },
  });

  const puckFloatY = Math.sin(frame * 0.07) * 8;
  const puckTilt = Math.sin(frame * 0.04) * 3;

  // Bezier handle motion
  const handleX = interpolate(frame, [0, 80, 160], [180, 290, 240], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const handleY = interpolate(frame, [0, 80, 160], [240, 140, 190], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <BlurVignetteScene
      durationInFrames={240}
      fadeInFrames={6}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Kinetic Hook Narration */}
        {showTextLayer ? (
          <>
            {frame < 145 ? (
              <Sequence name="Text Layer · Hook Phase 1" layout="none">
                <KineticWordFlow
                  top={180}
                  baseSize={52}
                  maxWidth={840}
                  words={textProps.phase1Words}
                />
              </Sequence>
            ) : (
              <Sequence from={145} durationInFrames={95} name="Text Layer · Hook Phase 2" layout="none">
                <KineticWordFlow
                  top={180}
                  baseSize={52}
                  maxWidth={840}
                  words={textProps.phase2Words}
                />
              </Sequence>
            )}
          </>
        ) : null}

        {/* 3D Keyframe Curve & Coordinate Grid Visualizer */}
        <div
          style={{
            position: 'absolute',
            top: 480,
            width: 760,
            height: 480,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${(1 - corePop) * 30 + puckFloatY}px) rotate(${puckTilt}deg) scale(${0.9 + corePop * 0.1})`,
            opacity: interpolate(frame, [4, 16], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          {/* Card Frame */}
          <div
            style={{
              position: 'relative',
              width: 700,
              height: 420,
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              border: '2px solid #E2E4EC',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: 24,
            }}
          >
            {/* Top Toolbar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ECEFF4',
                paddingBottom: 14,
              }}
            >
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#141416' }} />
                <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#A1A1AA' }} />
                <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#E4E4E7' }} />
              </div>
              <div
                style={{
                  fontFamily: INTER_FONT,
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#71717A',
                  letterSpacing: '0.04em',
                }}
              >
                CURVE_EDITOR · CUBIC_BEZIER(0.16, 1, 0.3, 1)
              </div>
              <div
                style={{
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  fontFamily: INTER_FONT,
                  fontSize: 14,
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 999,
                }}
              >
                {frame < 145 ? 'MANUAL · 4.8h' : 'STIFF · GENERIC'}
              </div>
            </div>

            {/* SVG Graph Coordinate Grid & Animated Curve */}
            <div style={{ flex: 1, position: 'relative', marginTop: 12 }}>
              <svg width="100%" height="100%" viewBox="0 0 650 320" style={{ overflow: 'visible' }}>
                <defs>
                  <pattern id="graphGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F1F3F7" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="650" height="320" fill="url(#graphGrid)" />

                {/* Axes */}
                <line x1="50" y1="280" x2="600" y2="280" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="50" y1="40" x2="50" y2="280" stroke="#CBD5E1" strokeWidth="2" />

                {/* Animated Bezier Curve */}
                <path
                  d={`M 50 280 C ${handleX} ${handleY}, ${600 - handleX * 0.6} ${320 - handleY}, 600 40`}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* Tangent Handle 1 */}
                <line x1="50" y1="280" x2={handleX} y2={handleY} stroke="#71717A" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx={handleX} cy={handleY} r="7" fill="#000000" />

                {/* Tangent Handle 2 */}
                <line x1="600" y1="40" x2={600 - handleX * 0.6} y2={320 - handleY} stroke="#71717A" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx={600 - handleX * 0.6} cy={320 - handleY} r="7" fill="#000000" />

                {/* Keyframe Nodes (Diamonds) */}
                <polygon points="50,270 60,280 50,290 40,280" fill="#000000" />
                <polygon points="600,30 610,40 600,50 590,40" fill="#000000" />
              </svg>
            </div>
          </div>

          {/* Floating Krafto Puck in lower corner */}
          <div
            style={{
              position: 'absolute',
              bottom: -28,
              right: 12,
              width: 100,
              height: 100,
              borderRadius: 999,
              backgroundColor: '#000000',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #FFFFFF',
            }}
          >
            <Img
              src={staticFile('krafto/puck_krafto.png')}
              style={{ width: 72, height: 72, objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Minimalist Monochrome Pill Badges */}
        <div
          style={{
            position: 'absolute',
            top: 1060,
            display: 'flex',
            gap: 16,
            opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 24px',
              borderRadius: 999,
            }}
          >
            Manual Keyframing
          </div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#141416',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 24px',
              borderRadius: 999,
              border: '1.5px solid #E2E4EC',
            }}
          >
            Stiff Motion
          </div>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 2 (240..535f): Reveal & Live Catalog Scroll
 */
const RevealDashboardScene: React.FC<{
  textProps: KraftoMotionShortProps['scene2Reveal'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();

  return (
    <BlurVignetteScene
      durationInFrames={295}
      fadeInFrames={8}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Kinetic Reveal Narration */}
        {showTextLayer ? (
          <>
            {frame < 180 ? (
              <Sequence name="Text Layer · Reveal Phase 1" layout="none">
                <KineticWordFlow
                  top={175}
                  baseSize={52}
                  maxWidth={840}
                  words={textProps.phase1Words}
                />
              </Sequence>
            ) : (
              <Sequence from={180} durationInFrames={115} name="Text Layer · Reveal Phase 2" layout="none">
                <KineticWordFlow
                  top={175}
                  baseSize={52}
                  maxWidth={840}
                  words={textProps.phase2Words}
                />
              </Sequence>
            )}
          </>
        ) : null}

        {/* Live Catalog Smooth Scroll Footage inside Beveled Frame */}
        <div style={{ position: 'absolute', top: 460 }}>
          <BeveledMediaFrame enterFrame={4} width={880} borderWidth={8} borderRadius={24}>
            <div
              style={{
                width: 864,
                height: 520,
                backgroundColor: '#000000',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 16,
              }}
            >
              <OffthreadVideo
                src={staticFile('krafto/krafto_motion_scroll.mp4')}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </BeveledMediaFrame>
        </div>

        {/* Floating Minimalist Chips */}
        <div
          style={{
            position: 'absolute',
            top: 1060,
            display: 'flex',
            gap: 14,
            opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
            }}
          >
            4K Alpha Channels
          </div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#141416',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
              border: '1.5px solid #E2E4EC',
            }}
          >
            Drag & Drop
          </div>
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
            }}
          >
            MOGRT
          </div>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 3 (535..904f): Featured Product 1 — Glowing Scribbles
 */
const ScribblesScene: React.FC<{
  textProps: KraftoMotionShortProps['scene3Scribbles'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();

  // Procedural SVG electric scribble animation
  const scribbleProgress = interpolate(frame % 45, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  return (
    <BlurVignetteScene
      durationInFrames={369}
      fadeInFrames={8}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Kinetic Scribbles Narration */}
        {showTextLayer ? (
          <>
            {frame < 124 ? (
              <Sequence name="Text Layer · Scribbles Phase 1" layout="none">
                <KineticWordFlow
                  top={175}
                  baseSize={52}
                  maxWidth={840}
                  words={textProps.phase1Words}
                />
              </Sequence>
            ) : (
              <Sequence from={124} durationInFrames={245} name="Text Layer · Scribbles Phase 2" layout="none">
                <KineticWordFlow
                  top={175}
                  baseSize={52}
                  maxWidth={840}
                  words={textProps.phase2Words}
                />
              </Sequence>
            )}
          </>
        ) : null}

        {/* Specimen Header Badge */}
        <div style={{ position: 'absolute', top: 380 }}>
          <KraftoMotionBadge
            indexLabel={textProps.badge.num}
            productName={textProps.badge.name}
            formatTag={textProps.badge.format}
            startFrame={6}
          />
        </div>

        {/* Beveled Media Frame with Live Glowing Scribble Screenshot */}
        <div style={{ position: 'absolute', top: 480 }}>
          <BeveledMediaFrame enterFrame={4} width={880} borderWidth={8} borderRadius={24}>
            <div
              style={{
                width: 864,
                height: 520,
                backgroundColor: '#000000',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 16,
              }}
            >
              <Img
                src={staticFile('krafto/motion_scribble.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Dynamic Procedural Electric Scribble Overlay */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 864 520"
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
              >
                <path
                  d="M 120 420 L 160 380 L 140 350 L 190 310 L 170 270 L 220 220 L 260 250 L 310 180 L 380 210 L 460 140 L 520 180 L 600 120 L 680 150 L 760 90"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="900"
                  strokeDashoffset={900 * (1 - scribbleProgress)}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))' }}
                />
                <circle cx={760} cy={90} r={scribbleProgress > 0.95 ? 6 : 0} fill="#FFFFFF" />
              </svg>
            </div>
          </BeveledMediaFrame>
        </div>

        {/* Floating Feature Badges */}
        <div
          style={{
            position: 'absolute',
            top: 1080,
            display: 'flex',
            gap: 14,
            opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
            }}
          >
            Electric Zigzag
          </div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#141416',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
              border: '1.5px solid #E2E4EC',
            }}
          >
            Kinetic Accents
          </div>
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
            }}
          >
            Raw Energy
          </div>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 4 (904..1234f): Featured Product 2 — Neon Kinetic Typography
 */
const TypographyScene: React.FC<{
  textProps: KraftoMotionShortProps['scene4Typography'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();

  return (
    <BlurVignetteScene
      durationInFrames={330}
      fadeInFrames={8}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Kinetic Typography Narration */}
        {showTextLayer ? (
          <>
            {frame < 88 ? (
              <Sequence name="Text Layer · Typography Phase 1" layout="none">
                <KineticWordFlow
                  top={175}
                  baseSize={52}
                  maxWidth={840}
                  words={textProps.phase1Words}
                />
              </Sequence>
            ) : (
              <Sequence from={88} durationInFrames={242} name="Text Layer · Typography Phase 2" layout="none">
                <KineticWordFlow
                  top={175}
                  baseSize={52}
                  maxWidth={840}
                  words={textProps.phase2Words}
                />
              </Sequence>
            )}
          </>
        ) : null}

        {/* Specimen Header Badge */}
        <div style={{ position: 'absolute', top: 380 }}>
          <KraftoMotionBadge
            indexLabel={textProps.badge.num}
            productName={textProps.badge.name}
            formatTag={textProps.badge.format}
            startFrame={6}
          />
        </div>

        {/* Beveled Media Frame with Live Typography Screenshot */}
        <div style={{ position: 'absolute', top: 480 }}>
          <BeveledMediaFrame enterFrame={4} width={880} borderWidth={8} borderRadius={24}>
            <div
              style={{
                width: 864,
                height: 520,
                backgroundColor: '#000000',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 16,
              }}
            >
              <Img
                src={staticFile('krafto/motion_typography.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Kinetic Glow Overlay Headline */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 28,
                  left: 28,
                  backgroundColor: 'rgba(0,0,0,0.75)',
                  padding: '12px 24px',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#FFFFFF', boxShadow: '0 0 10px #FFFFFF' }} />
                <span
                  style={{
                    fontFamily: INTER_FONT,
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: '0.02em',
                  }}
                >
                  BROADCAST_MOTION · ZERO_AFTER_EFFECTS
                </span>
              </div>
            </div>
          </BeveledMediaFrame>
        </div>

        {/* Floating Feature Badges */}
        <div
          style={{
            position: 'absolute',
            top: 1080,
            display: 'flex',
            gap: 14,
            opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
            }}
          >
            Custom Glow
          </div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#141416',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
              border: '1.5px solid #E2E4EC',
            }}
          >
            Broadcast Motion
          </div>
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
            }}
          >
            No After Effects
          </div>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 5 (1234..1529f): Featured Product 3 — Hand-Drawn Accent Bursts
 */
const AccentsScene: React.FC<{
  textProps: KraftoMotionShortProps['scene5Accents'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();

  return (
    <BlurVignetteScene
      durationInFrames={295}
      fadeInFrames={8}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Kinetic Accents Narration */}
        {showTextLayer ? (
          <>
            {frame < 86 ? (
              <Sequence name="Text Layer · Accents Phase 1" layout="none">
                <KineticWordFlow
                  top={175}
                  baseSize={52}
                  maxWidth={840}
                  words={textProps.phase1Words}
                />
              </Sequence>
            ) : (
              <Sequence from={86} durationInFrames={209} name="Text Layer · Accents Phase 2" layout="none">
                <KineticWordFlow
                  top={175}
                  baseSize={52}
                  maxWidth={840}
                  words={textProps.phase2Words}
                />
              </Sequence>
            )}
          </>
        ) : null}

        {/* Specimen Header Badge */}
        <div style={{ position: 'absolute', top: 380 }}>
          <KraftoMotionBadge
            indexLabel={textProps.badge.num}
            productName={textProps.badge.name}
            formatTag={textProps.badge.format}
            startFrame={6}
          />
        </div>

        {/* Beveled Media Frame with Live Accents Screenshot */}
        <div style={{ position: 'absolute', top: 480 }}>
          <BeveledMediaFrame enterFrame={4} width={880} borderWidth={8} borderRadius={24}>
            <div
              style={{
                width: 864,
                height: 520,
                backgroundColor: '#000000',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 16,
              }}
            >
              <Img
                src={staticFile('krafto/motion_accents.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* 3 Animated SVG Vector Bursts popping sequentially */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 864 520"
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
              >
                {/* 1. Vector Spark Starburst (pops around frame 86) */}
                {frame >= 80 ? (
                  <g transform="translate(240, 260) scale(1.4)">
                    <line x1="0" y1="-20" x2="0" y2="20" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                    <line x1="-20" y1="0" x2="20" y2="0" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                    <line x1="-14" y1="-14" x2="14" y2="14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="14" y1="-14" x2="-14" y2="14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                ) : null}

                {/* 2. Geometric Diamond Pulse (pops around frame 136) */}
                {frame >= 130 ? (
                  <g transform="translate(620, 200) scale(1.3)">
                    <polygon points="0,-24 24,0 0,24 -24,0" fill="none" stroke="#FFFFFF" strokeWidth="3" />
                    <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
                  </g>
                ) : null}

                {/* 3. Pointer Sweep Trail (pops around frame 186) */}
                {frame >= 180 ? (
                  <g transform="translate(432, 380)">
                    <path
                      d="M -60 10 Q 0 -20 60 0"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <polygon points="60,0 48,-8 52,6" fill="#FFFFFF" />
                  </g>
                ) : null}
              </svg>
            </div>
          </BeveledMediaFrame>
        </div>

        {/* Floating Feature Badges */}
        <div
          style={{
            position: 'absolute',
            top: 1080,
            display: 'flex',
            gap: 14,
            opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
            }}
          >
            Vector Sparks
          </div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#141416',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
              border: '1.5px solid #E2E4EC',
            }}
          >
            Diamonds
          </div>
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
            }}
          >
            Pointer Sweeps
          </div>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 6 (1529..1828f): Workflow Drag-and-Drop & MOGRT Alpha
 */
const WorkflowScene: React.FC<{
  textProps: KraftoMotionShortProps['scene6Workflow'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Asset card drag animation from media bin into Track V2
  // Move starts at frame 30, drops at frame 96 (rel in scene 6)
  const isDropped = frame >= 96;
  const dropSnap = spring({
    frame: Math.max(0, frame - 96),
    fps,
    config: { damping: 14, stiffness: 240, mass: 0.6 },
  });

  const dragU = interpolate(frame, [30, 93], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const cardX = interpolate(dragU, [0, 1], [180, 480]);
  const cardY = interpolate(dragU, [0, 1], [540, 720]);

  // Timeline playhead sweep after drop
  const playheadX = isDropped
    ? interpolate(frame, [96, 260], [480, 800], { extrapolateRight: 'clamp' })
    : 480;

  return (
    <BlurVignetteScene
      durationInFrames={299}
      fadeInFrames={8}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Kinetic Workflow Narration */}
        {showTextLayer ? (
          <>
            {frame < 154 ? (
              <Sequence name="Text Layer · Workflow Phase 1" layout="none">
                <KineticWordFlow
                  top={175}
                  baseSize={52}
                  maxWidth={840}
                  words={textProps.phase1Words}
                />
              </Sequence>
            ) : (
              <Sequence from={154} durationInFrames={145} name="Text Layer · Workflow Phase 2" layout="none">
                <KineticWordFlow
                  top={175}
                  baseSize={52}
                  maxWidth={840}
                  words={textProps.phase2Words}
                />
              </Sequence>
            )}
          </>
        ) : null}

        {/* Minimalist NLE Video Timeline Mockup */}
        <div
          style={{
            position: 'absolute',
            top: 470,
            width: 860,
            height: 480,
            backgroundColor: '#0F1115',
            borderRadius: 24,
            border: '2px solid #232730',
            boxShadow: '0 24px 56px rgba(0, 0, 0, 0.28)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: 20,
          }}
        >
          {/* Timeline Header Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #1F242F',
              paddingBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #333',
                }}
              >
                <Img src={staticFile('krafto/logo_krafto.png')} style={{ width: 22, height: 22 }} />
              </div>
              <span style={{ fontFamily: INTER_FONT, fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>
                Timeline: Master_Reel_4K.prproj
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span
                style={{
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  fontFamily: INTER_FONT,
                  fontSize: 14,
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 6,
                  border: '1px solid #333',
                }}
              >
                Premiere Pro / DaVinci
              </span>
            </div>
          </div>

          {/* Tracks Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14, position: 'relative' }}>
            {/* Track V2 (Overlay / MOGRT) */}
            <div
              style={{
                height: 64,
                backgroundColor: '#161922',
                borderRadius: 10,
                border: '1px solid #232836',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                position: 'relative',
              }}
            >
              <span style={{ fontFamily: INTER_FONT, fontSize: 16, fontWeight: 700, color: '#71717A', width: 44 }}>
                V2
              </span>

              {/* Dropped MOGRT Clip on V2 */}
              {isDropped ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 200,
                    width: 320,
                    height: 50,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 14px',
                    gap: 10,
                    boxShadow: '0 4px 18px rgba(255,255,255,0.25)',
                    transform: `scale(${1 + (1 - dropSnap) * 0.12})`,
                  }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#000000' }} />
                  <span style={{ fontFamily: INTER_FONT, fontSize: 16, fontWeight: 700, color: '#000000' }}>
                    Scribble_Burst.mogrt (Alpha)
                  </span>
                </div>
              ) : null}
            </div>

            {/* Track V1 (Main Footage) */}
            <div
              style={{
                height: 64,
                backgroundColor: '#161922',
                borderRadius: 10,
                border: '1px solid #232836',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                position: 'relative',
              }}
            >
              <span style={{ fontFamily: INTER_FONT, fontSize: 16, fontWeight: 700, color: '#71717A', width: 44 }}>
                V1
              </span>
              <div
                style={{
                  position: 'absolute',
                  left: 100,
                  width: 580,
                  height: 50,
                  backgroundColor: '#272B36',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 14px',
                }}
              >
                <span style={{ fontFamily: INTER_FONT, fontSize: 15, fontWeight: 600, color: '#A1A1AA' }}>
                  A-Roll_TalkingHead_01.mp4
                </span>
              </div>
            </div>

            {/* Track A1 & A2 */}
            <div
              style={{
                height: 48,
                backgroundColor: '#161922',
                borderRadius: 8,
                border: '1px solid #232836',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                position: 'relative',
              }}
            >
              <span style={{ fontFamily: INTER_FONT, fontSize: 15, fontWeight: 700, color: '#71717A', width: 44 }}>
                A1
              </span>
              <div
                style={{
                  position: 'absolute',
                  left: 100,
                  width: 580,
                  height: 36,
                  backgroundColor: '#1D212A',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 14px',
                }}
              >
                <span style={{ fontFamily: INTER_FONT, fontSize: 13, fontWeight: 600, color: '#71717A' }}>
                  Voiceover_Audio_Clean.wav
                </span>
              </div>
            </div>

            {/* Sweeping Red Playhead Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: playheadX,
                width: 2,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 0 10px #FFFFFF',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -6,
                  left: -5,
                  width: 12,
                  height: 12,
                  backgroundColor: '#FFFFFF',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Dragging MOGRT Asset Card (Followed by Cursor) */}
        {!isDropped && frame >= 30 ? (
          <div
            style={{
              position: 'absolute',
              top: cardY,
              left: cardX,
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 16px 36px rgba(0,0,0,0.3)',
              border: '2px solid #000000',
              zIndex: 30,
              transform: 'scale(1.05)',
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#000000' }} />
            <span style={{ fontFamily: INTER_FONT, fontSize: 20, fontWeight: 800, color: '#000000' }}>
              Scribble_Burst.mogrt
            </span>
          </div>
        ) : null}

        {/* Pointer Cursor gliding & dropping file */}
        {frame >= 25 && frame < 120 ? (
          <CursorClickOverlay
            from={[260, 680]}
            to={[480, 720]}
            moveStartFrame={30}
            clickFrame={96}
          />
        ) : null}

        {/* Floating Feature Badges */}
        <div
          style={{
            position: 'absolute',
            top: 1080,
            display: 'flex',
            gap: 14,
            opacity: interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
            }}
          >
            Editable MOGRT
          </div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              color: '#141416',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
              border: '1.5px solid #E2E4EC',
            }}
          >
            Transparent Alpha
          </div>
          <div
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 999,
            }}
          >
            Instant Timeline Drop
          </div>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 7 (1828..2034f): Outro CTA — Comment Motion & Follow Krafto
 */
const OutroCtaScene: React.FC<{
  textProps: KraftoMotionShortProps['scene7Outro'];
  branding: KraftoMotionShortProps['branding'];
  showTextLayer: boolean;
}> = ({ textProps, branding, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fanPop = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 16, stiffness: 180, mass: 0.8 },
  });

  const followPop = spring({
    frame: Math.max(0, frame - 65),
    fps,
    config: { damping: 16, stiffness: 210, mass: 0.7 },
  });

  return (
    <BlurVignetteScene
      durationInFrames={206}
      fadeInFrames={8}
      fadeOutFrames={0}
      enterMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Kinetic CTA Narration: Comment Motion */}
        {showTextLayer ? (
          <>
            {frame < 128 ? (
              <Sequence name="Text Layer · Outro Phase 1" layout="none">
                <KineticWordFlow
                  top={165}
                  baseSize={50}
                  maxWidth={840}
                  words={textProps.phase1Words}
                />
              </Sequence>
            ) : (
              <Sequence from={128} durationInFrames={78} name="Text Layer · Outro Phase 2" layout="none">
                <KineticWordFlow
                  top={165}
                  baseSize={50}
                  maxWidth={840}
                  words={textProps.phase2Words}
                />
              </Sequence>
            )}
          </>
        ) : null}

        {/* 3D Fan Array of the 3 Featured Motion Products */}
        <div
          style={{
            position: 'absolute',
            top: 480,
            width: 860,
            height: 480,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${(1 - fanPop) * 44}px) scale(${0.88 + fanPop * 0.12})`,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          {/* Card 1: Scribble (tilted left) */}
          <div
            style={{
              position: 'absolute',
              width: 500,
              height: 330,
              borderRadius: 20,
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E4EC',
              boxShadow: '0 16px 36px rgba(0,0,0,0.14)',
              transform: 'translateX(-115px) rotate(-6deg)',
              overflow: 'hidden',
              padding: 10,
              zIndex: 1,
            }}
          >
            <Img
              src={staticFile('krafto/motion_scribble.png')}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }}
            />
          </div>

          {/* Card 3: Accents (tilted right) */}
          <div
            style={{
              position: 'absolute',
              width: 500,
              height: 330,
              borderRadius: 20,
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E4EC',
              boxShadow: '0 16px 36px rgba(0,0,0,0.14)',
              transform: 'translateX(115px) rotate(6deg)',
              overflow: 'hidden',
              padding: 10,
              zIndex: 2,
            }}
          >
            <Img
              src={staticFile('krafto/motion_accents.png')}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }}
            />
          </div>

          {/* Card 2: Typography (Hero center) */}
          <div
            style={{
              position: 'absolute',
              width: 540,
              height: 360,
              borderRadius: 24,
              backgroundColor: '#FFFFFF',
              border: '2.5px solid #000000',
              boxShadow: '0 24px 52px rgba(0,0,0,0.22)',
              transform: 'translateY(-10px) rotate(0deg)',
              overflow: 'hidden',
              padding: 12,
              zIndex: 5,
            }}
          >
            <Img
              src={staticFile('krafto/motion_typography.png')}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 }}
            />
          </div>
        </div>

        {/* Minimalist Monochrome Comment Motion Hero Pill */}
        <div
          style={{
            position: 'absolute',
            top: 1050,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            backgroundColor: '#000000',
            color: '#FFFFFF',
            borderRadius: 999,
            padding: '16px 48px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.28)',
            transform: `scale(${0.94 + fanPop * 0.06})`,
            opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#FFFFFF' }} />
          <span
            style={{
              fontFamily: INTER_FONT,
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: '-0.03em',
            }}
          >
            Comment Motion
          </span>
        </div>

        {/* Bottom "Follow Krafto" Pill Lockup with official circular Krafto logo */}
        {frame >= 50 ? (
          <div
            style={{
              position: 'absolute',
              top: 1220,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              transform: `translateY(${(1 - followPop) * 24}px) scale(${0.92 + followPop * 0.08})`,
              opacity: interpolate(frame, [50, 68], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 20,
                backgroundColor: '#FFFFFF',
                borderRadius: 999,
                padding: '12px 36px 12px 16px',
                border: '1.5px solid #D9DCE3',
                boxShadow: '0 16px 38px rgba(0, 0, 0, 0.10)',
              }}
            >
              {/* Circular Krafto Logo */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  backgroundColor: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Img src={staticFile('krafto/logo_krafto.png')} style={{ width: 42, height: 42 }} />
              </div>

              {/* Follow Krafto Text */}
              <span
                style={{
                  fontFamily: INTER_FONT,
                  fontSize: 34,
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  color: '#141416',
                }}
              >
                Follow {branding.channelName}
              </span>

              {/* Minimalist Black Follow Button */}
              <div
                style={{
                  backgroundColor: '#000000',
                  borderRadius: 999,
                  padding: '10px 24px',
                  color: '#FFFFFF',
                  fontFamily: INTER_FONT,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
                }}
              >
                {branding.followButtonText}
              </div>
            </div>

            {/* Subtext */}
            <span
              style={{
                fontFamily: INTER_FONT,
                fontSize: 24,
                fontWeight: 500,
                color: '#71717A',
                letterSpacing: '-0.02em',
              }}
            >
              {branding.followSubtext}
            </span>
          </div>
        ) : null}

        {/* Realistic Pointer Cursor Glide & Click on "Follow" button */}
        {frame >= 70 ? (
          <CursorClickOverlay
            from={[840, 1480]}
            to={[700, 1265]}
            moveStartFrame={72}
            clickFrame={92}
          />
        ) : null}
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Root Krafto Motion Short Composition (2034 frames @ 30fps)
 */
export const KraftoMotionShort: React.FC<KraftoMotionShortProps> = (props) => {
  return (
    <StudioCanvas watermark={props.branding.watermark}>
      {/* 1. Full Audio Hierarchy */}
      {/* 1a. Voiceover (UNTUTCHED EQ) */}
      <Audio
        src={staticFile('audio/krafto_motion_voiceover.wav')}
        volume={1.0}
      />

      {/* 1b. Frame-Accurate Stereo SFX Stem */}
      <Audio
        src={staticFile('audio/krafto_motion_sfx_stem.wav')}
        volume={0.95}
      />

      {/* 1c. Restrained Ambient Music Bed */}
      <Audio
        src={staticFile('audio/music_bed_modern.wav')}
        volume={(f) => {
          const fadeIn = interpolate(f, [0, 30], [0, 0.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const fadeOut = interpolate(f, [1980, 2034], [0.08, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return Math.min(fadeIn, fadeOut);
        }}
      />

      {/* 2. Visual Narrative Scenes */}
      {/* Scene 1: Pattern Interrupt Hook (0..240f) */}
      <Sequence from={0} durationInFrames={240} name="Scene 1 · Keyframe Hook">
        <HookScene textProps={props.scene1Hook} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 2: Reveal & Live Catalog Scroll (240..535f) */}
      <Sequence from={240} durationInFrames={295} name="Scene 2 · Catalog Reveal">
        <RevealDashboardScene textProps={props.scene2Reveal} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 3: Featured Product 1 — Glowing Scribbles (535..904f) */}
      <Sequence from={535} durationInFrames={369} name="Scene 3 · Product 1 Scribbles">
        <ScribblesScene textProps={props.scene3Scribbles} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 4: Featured Product 2 — Neon Typography (904..1234f) */}
      <Sequence from={904} durationInFrames={330} name="Scene 4 · Product 2 Typography">
        <TypographyScene textProps={props.scene4Typography} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 5: Featured Product 3 — Accent Bursts (1234..1529f) */}
      <Sequence from={1234} durationInFrames={295} name="Scene 5 · Product 3 Accents">
        <AccentsScene textProps={props.scene5Accents} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 6: Workflow Drag & Drop (1529..1828f) */}
      <Sequence from={1529} durationInFrames={299} name="Scene 6 · Workflow NLE">
        <WorkflowScene textProps={props.scene6Workflow} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 7: Outro CTA (1828..2034f) */}
      <Sequence from={1828} durationInFrames={206} name="Scene 7 · Outro CTA">
        <OutroCtaScene textProps={props.scene7Outro} branding={props.branding} showTextLayer={props.showTextLayer} />
      </Sequence>
    </StudioCanvas>
  );
};
