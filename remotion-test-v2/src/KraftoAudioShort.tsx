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
  KRAFTO_AUDIO_DEFAULT_PROPS,
  KraftoAudioShortProps,
} from './kraftoAudioTextLayer';

/**
 * 24-Band Reactive Audio Spectrum Visualizer
 */
const ReactiveAudioSpectrum: React.FC<{
  bars?: number;
  width?: number;
  height?: number;
  intensity?: number;
}> = ({ bars = 24, width = 640, height = 70, intensity = 1.0 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 6,
        width,
        height,
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        // Multi-frequency wave simulation: bass (left), mid (center), high (right)
        const freq = (i + 1) * 0.42;
        const wave1 = Math.sin(frame * 0.28 + freq) * 0.5 + 0.5;
        const wave2 = Math.cos(frame * 0.18 + i * 0.8) * 0.3 + 0.3;
        const bellCurve = Math.sin((i / (bars - 1)) * Math.PI); // Peak in the middle
        const rawH = (wave1 * 0.7 + wave2 * 0.3) * (0.35 + bellCurve * 0.65) * height * intensity;
        const barH = Math.max(8, rawH);

        // Color gradient from cyan to electric blue
        const hue = interpolate(i, [0, bars - 1], [185, 225]);

        return (
          <div
            key={i}
            style={{
              width: Math.floor(width / bars) - 6,
              height: barH,
              borderRadius: 999,
              background: `linear-gradient(180deg, hsl(${hue}, 90%, 55%) 0%, hsl(${hue + 20}, 95%, 45%) 100%)`,
              boxShadow: `0 0 10px hsla(${hue}, 90%, 55%, 0.45)`,
              transformOrigin: 'bottom center',
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Acoustic Ripple Rings (Sub-bass acoustic waves expanding outward)
 */
const AcousticRippleField: React.FC<{
  size?: number;
  startFrame?: number;
}> = ({ size = 180, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const rel = Math.max(0, frame - startFrame);

  const rings = [0, 18, 36];

  return (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      {rings.map((offset, idx) => {
        const loopFrame = (rel + offset) % 54;
        const progress = loopFrame / 54;
        const scale = 1.0 + progress * 2.2;
        const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.7, 0.3, 0]);

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: 999,
              border: '2px solid #0EA5E9',
              boxShadow: '0 0 16px rgba(14, 165, 233, 0.35)',
              transform: `scale(${scale})`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Specimen pill badge for Krafto Audio tracks.
 */
const KraftoAudioBadge: React.FC<{
  indexLabel: string;
  soundName: string;
  tagline?: string;
  startFrame: number;
}> = ({ indexLabel, soundName, tagline, startFrame }) => {
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
        border: '1.5px solid #E2E5EB',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
        transform: `translateY(${(1 - pop) * 18}px) scale(${0.92 + pop * 0.08})`,
        opacity: interpolate(frame - startFrame, [0, 5], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      }}
    >
      <div
        style={{
          width: 58,
          height: 58,
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
          style={{ width: 44, height: 44, objectFit: 'contain' }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span
          style={{
            fontFamily: INTER_FONT,
            fontSize: 26,
            fontWeight: 800,
            color: '#0284C7',
            letterSpacing: '-0.02em',
          }}
        >
          {indexLabel}
        </span>
        <span
          style={{
            fontFamily: INTER_FONT,
            fontSize: 32,
            fontWeight: 700,
            color: '#141416',
            letterSpacing: '-0.03em',
          }}
        >
          {soundName}
        </span>
      </div>
    </div>
  );
};

/**
 * Scene 1 (0..138f): Brand New Creative Hook
 * Features: "Bloated Stock Sites" Slash/Shatter + 3D Holographic Sonic Core + Reactive Spectrum + Acoustic Shockwaves
 */
const HookScene: React.FC<{
  textProps: KraftoAudioShortProps['scene1Hook'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const corePop = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 15, stiffness: 180, mass: 0.8 },
  });

  const floatY = Math.sin(frame * 0.08) * 6;
  const floatTilt = Math.sin(frame * 0.05) * 2.2;

  // Stock audio folder glitch out at frame 42
  const folderShatter = interpolate(frame, [42, 58], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });

  return (
    <BlurVignetteScene
      durationInFrames={138}
      fadeInFrames={6}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Safe-bounded Kinetic Hook Narration */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Hook" layout="none">
            <KineticWordFlow
              top={180}
              baseSize={48}
              maxWidth={820}
              words={textProps.words}
            />
          </Sequence>
        ) : null}

        {/* Dynamic Holographic Sonic Core Centerpiece */}
        <div
          style={{
            position: 'absolute',
            top: 560,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            transform: `translateY(${(1 - corePop) * 44 + floatY}px) scale(${0.9 + corePop * 0.1}) rotate(${floatTilt}deg)`,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          {/* Central 3D Krafto Sonic Core with Acoustic Ripples */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outward Acoustic Sub-Bass Shockwaves */}
            <AcousticRippleField size={190} startFrame={18} />

            {/* 3D Beveled Krafto Puck */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                filter: 'drop-shadow(0 20px 36px rgba(15,23,42,0.18))',
              }}
            >
              <Img
                src={staticFile('krafto/puck_krafto.png')}
                style={{ width: 170, height: 170, objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Real-time 24-Band Reactive Audio Equalizer Spectrum */}
          <div style={{ zIndex: 5, marginTop: 10 }}>
            <ReactiveAudioSpectrum width={580} height={75} intensity={frame > 40 ? 1.0 : 0.6} />
          </div>

          {/* 3 Floating Holographic Audio Spec Capsules */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              marginTop: 10,
              opacity: interpolate(frame, [30, 48], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            {/* Pill 1 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 999,
                padding: '8px 18px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 8px 18px rgba(15,23,42,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: '#0EA5E9' }} />
              <span style={{ fontFamily: INTER_FONT, fontSize: 18, fontWeight: 700, color: '#334155' }}>
                32-Bit Float WAV
              </span>
            </div>

            {/* Pill 2 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 999,
                padding: '8px 18px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 8px 18px rgba(15,23,42,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: '#10B981' }} />
              <span style={{ fontFamily: INTER_FONT, fontSize: 18, fontWeight: 700, color: '#334155' }}>
                Lossless Stereo
              </span>
            </div>

            {/* Pill 3 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 999,
                padding: '8px 18px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 8px 18px rgba(15,23,42,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: '#8B5CF6' }} />
              <span style={{ fontFamily: INTER_FONT, fontSize: 18, fontWeight: 700, color: '#334155' }}>
                Royalty-Free
              </span>
            </div>
          </div>
        </div>

        {/* "Bloated Stock Sites" Warning Card getting crossed out in opening seconds */}
        {folderShatter > 0.05 ? (
          <div
            style={{
              position: 'absolute',
              top: 470,
              backgroundColor: '#FEF2F2',
              border: '2px solid #F87171',
              borderRadius: 20,
              padding: '16px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: '0 16px 36px rgba(239, 68, 68, 0.20)',
              transform: `scale(${folderShatter}) rotate(${interpolate(folderShatter, [0, 1], [-12, 0])}deg)`,
              opacity: folderShatter,
              zIndex: 30,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: INTER_FONT,
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              ✕
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: INTER_FONT, fontSize: 22, fontWeight: 800, color: '#991B1B' }}>
                BLOATED STOCK AUDIO
              </span>
              <span style={{ fontFamily: INTER_FONT, fontSize: 16, fontWeight: 600, color: '#DC2626' }}>
                Messy licenses · Slow search · Cluttered folders
              </span>
            </div>
          </div>
        ) : null}
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 2 (138..496f): Reveal & Live Catalog Smooth Scroll Footage
 */
const RevealDashboardScene: React.FC<{
  textProps: KraftoAudioShortProps['scene2Reveal'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isPhase2 = frame >= 160;
  const dashPop = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.8 },
  });

  const zoomScale = interpolate(frame, [0, 358], [1.0, 1.04], {
    easing: Easing.out(Easing.quad),
  });

  return (
    <BlurVignetteScene
      durationInFrames={358}
      fadeInFrames={10}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="slide-up"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Header Tag */}
        <div
          style={{
            position: 'absolute',
            top: 85,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: '#FFFFFF',
            borderRadius: 999,
            padding: '8px 22px 8px 14px',
            border: '1.5px solid #E2E5EB',
            boxShadow: '0 8px 18px rgba(15,23,42,0.06)',
            opacity: interpolate(frame, [0, 8, 70, 85], [0, 1, 1, 0], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: '#0EA5E9',
              boxShadow: '0 0 10px #0EA5E9',
            }}
          />
          <span
            style={{
              fontFamily: INTER_FONT,
              fontSize: 22,
              fontWeight: 700,
              color: '#334155',
              letterSpacing: '-0.02em',
            }}
          >
            OFFICIAL KRAFTO AUDIO LIBRARY
          </span>
        </div>

        {/* Safe-bounded Kinetic Captions */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Reveal" layout="none">
            {!isPhase2 ? (
              <KineticWordFlow
                top={165}
                baseSize={46}
                maxWidth={820}
                words={textProps.phase1Words}
              />
            ) : (
              <KineticWordFlow
                top={165}
                baseSize={46}
                maxWidth={820}
                words={textProps.phase2Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Real Live Krafto Audio Catalog Smooth Scroll Footage */}
        <div
          style={{
            position: 'absolute',
            top: 520,
            transform: `translateY(${(1 - dashPop) * 38}px) scale(${zoomScale})`,
            opacity: interpolate(frame, [6, 18], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={8} width={880} borderWidth={10} borderRadius={24}>
            <OffthreadVideo
              src={staticFile('krafto/krafto_audio_scroll.mp4')}
              style={{
                width: 860,
                height: 720,
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />
          </BeveledMediaFrame>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 3 (496..816f): Sound 1 — Zephyr Ambience
 */
const SoundZephyrScene: React.FC<{
  textProps: KraftoAudioShortProps['scene3Zephyr'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: 0..67f | Phase 2: 67..200f | Phase 3: 200..320f
  const phase = frame < 67 ? 1 : frame < 200 ? 2 : 3;

  const framePop = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.78 },
  });

  const drift = Math.sin(frame * 0.04) * 4;

  return (
    <BlurVignetteScene
      durationInFrames={320}
      fadeInFrames={10}
      fadeOutFrames={10}
      enterMode="slide-up"
      exitMode="slide-up"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Top Sound Badge */}
        <div style={{ position: 'absolute', top: 105 }}>
          <KraftoAudioBadge
            indexLabel={textProps.badge.num}
            soundName={textProps.badge.name}
            tagline={textProps.badge.tagline}
            startFrame={2}
          />
        </div>

        {/* Safe-bounded Kinetic Word Flow (2-line max cadence) */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Zephyr" layout="none">
            {phase === 1 && (
              <KineticWordFlow
                top={195}
                baseSize={48}
                maxWidth={840}
                words={textProps.phase1Words}
              />
            )}
            {phase === 2 && (
              <KineticWordFlow
                top={195}
                baseSize={48}
                maxWidth={840}
                words={textProps.phase2Words}
              />
            )}
            {phase === 3 && (
              <KineticWordFlow
                top={195}
                baseSize={48}
                maxWidth={840}
                words={textProps.phase3Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Real Specimen Capture: Zephyr Ambience */}
        <div
          style={{
            position: 'absolute',
            top: 505,
            transform: `translateY(${(1 - framePop) * 42 + drift}px) scale(${0.92 + framePop * 0.08})`,
            opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={10} width={880} borderWidth={10} borderRadius={24}>
            <Img
              src={staticFile('krafto/audio_zephyr.png')}
              style={{
                width: 860,
                height: 680,
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </BeveledMediaFrame>
        </div>

        {/* High-Frequency Air Waveform Spectrum Visualizer */}
        <div
          style={{
            position: 'absolute',
            top: 1225,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <ReactiveAudioSpectrum bars={28} width={720} height={50} intensity={1.2} />
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#FFFFFF',
              borderRadius: 999,
              padding: '6px 18px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: '#0EA5E9', boxShadow: '0 0 8px #0EA5E9' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#334155' }}>
              48kHz · 32-bit Float · High-Air Texture
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 4 (816..1123f): Sound 2 — Echo Ambience
 */
const SoundEchoScene: React.FC<{
  textProps: KraftoAudioShortProps['scene4Echo'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: 0..68f | Phase 2: 68..185f | Phase 3: 185..307f
  const phase = frame < 68 ? 1 : frame < 185 ? 2 : 3;

  const framePop = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.78 },
  });

  const drift = Math.sin(frame * 0.04) * 4;

  // 3 Tactile Feature Badges pop in during Phase 3 (f185+)
  const badge1Pop = spring({ frame: Math.max(0, frame - 190), fps, config: { damping: 15, stiffness: 210, mass: 0.7 } });
  const badge2Pop = spring({ frame: Math.max(0, frame - 215), fps, config: { damping: 15, stiffness: 210, mass: 0.7 } });
  const badge3Pop = spring({ frame: Math.max(0, frame - 240), fps, config: { damping: 15, stiffness: 210, mass: 0.7 } });

  return (
    <BlurVignetteScene
      durationInFrames={307}
      fadeInFrames={10}
      fadeOutFrames={10}
      enterMode="slide-up"
      exitMode="slide-up"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Top Sound Badge */}
        <div style={{ position: 'absolute', top: 105 }}>
          <KraftoAudioBadge
            indexLabel={textProps.badge.num}
            soundName={textProps.badge.name}
            tagline={textProps.badge.tagline}
            startFrame={2}
          />
        </div>

        {/* Safe-bounded Kinetic Word Flow (2-line max cadence) */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Echo" layout="none">
            {phase === 1 && (
              <KineticWordFlow
                top={195}
                baseSize={48}
                maxWidth={840}
                words={textProps.phase1Words}
              />
            )}
            {phase === 2 && (
              <KineticWordFlow
                top={195}
                baseSize={48}
                maxWidth={840}
                words={textProps.phase2Words}
              />
            )}
            {phase === 3 && (
              <KineticWordFlow
                top={195}
                baseSize={48}
                maxWidth={840}
                words={textProps.phase3Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Real Specimen Capture: Echo Ambience */}
        <div
          style={{
            position: 'absolute',
            top: 505,
            transform: `translateY(${(1 - framePop) * 42 + drift}px) scale(${0.92 + framePop * 0.08})`,
            opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={10} width={880} borderWidth={10} borderRadius={24}>
            <Img
              src={staticFile('krafto/audio_echo.png')}
              style={{
                width: 860,
                height: 680,
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </BeveledMediaFrame>
        </div>

        {/* Phase 3 Action Badges: Scene Transitions · UI Reveals · Card Snaps */}
        {phase === 3 ? (
          <div
            style={{
              position: 'absolute',
              top: 1220,
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: '12px 22px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 8px 20px rgba(15,23,42,0.10)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transform: `scale(${badge1Pop})`,
                opacity: badge1Pop,
              }}
            >
              <span style={{ fontSize: 24 }}>🎬</span>
              <span style={{ fontFamily: INTER_FONT, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>
                Transitions
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: '12px 22px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 8px 20px rgba(15,23,42,0.10)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transform: `scale(${badge2Pop})`,
                opacity: badge2Pop,
              }}
            >
              <span style={{ fontSize: 24 }}>✨</span>
              <span style={{ fontFamily: INTER_FONT, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>
                UI Reveals
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: '12px 22px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 8px 20px rgba(15,23,42,0.10)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transform: `scale(${badge3Pop})`,
                opacity: badge3Pop,
              }}
            >
              <span style={{ fontSize: 24 }}>⚡</span>
              <span style={{ fontFamily: INTER_FONT, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>
                Card Snaps
              </span>
            </div>
          </div>
        ) : (
          /* Stereo Spatial Pulse Visualizer */
          <div
            style={{
              position: 'absolute',
              top: 1225,
              opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <ReactiveAudioSpectrum bars={28} width={720} height={45} intensity={1.1} />
          </div>
        )}
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 5 (1123..1370f): Sound 3 — Tide Ambience [0:40+ Motion Graphics Upgrade]
 */
const SoundTideScene: React.FC<{
  textProps: KraftoAudioShortProps['scene5Tide'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: 0..67f | Phase 2: 67..247f
  const phase = frame < 67 ? 1 : 2;

  const framePop = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.78 },
  });

  const drift = Math.sin(frame * 0.04) * 4;

  // Active Playhead Scrubber across the Tide specimen card (0:40+)
  const playheadProgress = interpolate(frame, [40, 240], [0.12, 0.88], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  });

  // Dynamic low-end badges popping in during Phase 2
  const badgeSwell = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 16, stiffness: 210, mass: 0.7 } });
  const badgeImpact = spring({ frame: Math.max(0, frame - 120), fps, config: { damping: 16, stiffness: 210, mass: 0.7 } });
  const badgeCuts = spring({ frame: Math.max(0, frame - 155), fps, config: { damping: 16, stiffness: 210, mass: 0.7 } });

  return (
    <BlurVignetteScene
      durationInFrames={247}
      fadeInFrames={10}
      fadeOutFrames={10}
      enterMode="slide-up"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Top Sound Badge */}
        <div style={{ position: 'absolute', top: 105 }}>
          <KraftoAudioBadge
            indexLabel={textProps.badge.num}
            soundName={textProps.badge.name}
            tagline={textProps.badge.tagline}
            startFrame={2}
          />
        </div>

        {/* Safe-bounded Kinetic Word Flow */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Tide" layout="none">
            {phase === 1 && (
              <KineticWordFlow
                top={195}
                baseSize={48}
                maxWidth={840}
                words={textProps.phase1Words}
              />
            )}
            {phase === 2 && (
              <KineticWordFlow
                top={195}
                baseSize={48}
                maxWidth={840}
                words={textProps.phase2Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Real Specimen Capture: Tide Ambience with Live Playhead Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 505,
            transform: `translateY(${(1 - framePop) * 42 + drift}px) scale(${0.92 + framePop * 0.08})`,
            opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={10} width={880} borderWidth={10} borderRadius={24}>
            <div style={{ position: 'relative', width: 860, height: 680, overflow: 'hidden' }}>
              <Img
                src={staticFile('krafto/audio_tide.png')}
                style={{
                  width: 860,
                  height: 680,
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
              />

              {/* Dynamic Ocean Wave Scrubbing Playhead Line (0:40+) */}
              {frame >= 35 ? (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${playheadProgress * 100}%`,
                    width: 3,
                    backgroundColor: '#38BDF8',
                    boxShadow: '0 0 16px #38BDF8, 0 0 32px #0284C7',
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 40,
                      left: -20,
                      backgroundColor: '#0284C7',
                      color: '#FFFFFF',
                      fontFamily: 'monospace',
                      fontSize: 14,
                      fontWeight: 700,
                      borderRadius: 6,
                      padding: '2px 6px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    }}
                  >
                    0:0{Math.floor(playheadProgress * 8)} / 0:14
                  </div>
                </div>
              ) : null}
            </div>
          </BeveledMediaFrame>
        </div>

        {/* Dynamic Low-End Sub-Bass Equalizer Wave + Acoustic Badges (0:40+) */}
        {phase === 2 ? (
          <div
            style={{
              position: 'absolute',
              top: 1220,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {/* Live Sub-Bass Organic Equalizer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {Array.from({ length: 32 }).map((_, i) => {
                const waveHeight =
                  Math.sin(frame * 0.15 + i * 0.3) * 16 +
                  Math.cos(frame * 0.08 + i * 0.5) * 12 +
                  24;
                return (
                  <div
                    key={i}
                    style={{
                      width: 14,
                      height: Math.max(6, waveHeight),
                      borderRadius: 4,
                      background: 'linear-gradient(180deg, #38BDF8 0%, #0284C7 100%)',
                      boxShadow: '0 0 8px rgba(56,189,248,0.4)',
                    }}
                  />
                );
              })}
            </div>

            {/* 3 Spoken Capability Badges */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  padding: '10px 18px',
                  border: '1.5px solid #CBD5E1',
                  boxShadow: '0 6px 16px rgba(15,23,42,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transform: `scale(${badgeSwell})`,
                  opacity: badgeSwell,
                }}
              >
                <span style={{ fontSize: 20 }}>🌊</span>
                <span style={{ fontFamily: INTER_FONT, fontSize: 16, fontWeight: 700, color: '#1E293B' }}>
                  Organic Swell
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  padding: '10px 18px',
                  border: '1.5px solid #CBD5E1',
                  boxShadow: '0 6px 16px rgba(15,23,42,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transform: `scale(${badgeImpact})`,
                  opacity: badgeImpact,
                }}
              >
                <span style={{ fontSize: 20 }}>💥</span>
                <span style={{ fontFamily: INTER_FONT, fontSize: 16, fontWeight: 700, color: '#1E293B' }}>
                  Visual Impacts
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  padding: '10px 18px',
                  border: '1.5px solid #CBD5E1',
                  boxShadow: '0 6px 16px rgba(15,23,42,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transform: `scale(${badgeCuts})`,
                  opacity: badgeCuts,
                }}
              >
                <span style={{ fontSize: 20 }}>✂</span>
                <span style={{ fontFamily: INTER_FONT, fontSize: 16, fontWeight: 700, color: '#1E293B' }}>
                  Timeline Cuts
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ position: 'absolute', top: 1225 }}>
            <ReactiveAudioSpectrum bars={28} width={720} height={45} intensity={1.1} />
          </div>
        )}
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 6 (1370..1819f): Claude MCP Audio Integration & Dual Workflows [0:45..1:00 MAJOR MOTION GRAPHICS UPGRADE]
 */
const SetupScene: React.FC<{
  textProps: KraftoAudioShortProps['scene6Setup'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: 0..58f ("And here is the cheat code")
  // Phase 2: 58..205f ("With Krafto's official MCP server, you can connect directly to Claude")
  // Phase 3: 205..330f ("Claude can search, audition, & pull sound effects into website code") [0:53]
  // Phase 4: 330..449f ("or video timeline without leaving your workspace")
  const phase = frame < 58 ? 1 : frame < 205 ? 2 : frame < 330 ? 3 : 4;

  const cardPop = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.8 },
  });

  const pulse = (Math.sin(frame * 0.15) + 1) * 0.5;

  // Orthogonal Circuit Wire Draw Progress (Phase 2: 58..205)
  const wireProgress = interpolate(frame, [65, 115], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Website SFX Workflow (Phase 3: 205..330)
  const localP3 = frame - 205;
  const webPop = spring({
    frame: Math.max(0, localP3 - 4),
    fps,
    config: { damping: 16, stiffness: 195, mass: 0.75 },
  });
  // Cursor clicks button at localP3 = 36 (frame 241)
  const isWebButtonClicked = localP3 >= 36;
  const webRipple = isWebButtonClicked
    ? interpolate(localP3, [36, 52], [0, 1], { extrapolateRight: 'clamp' })
    : 0;

  // Video Timeline NLE Workflow (Phase 4: 330..449)
  const localP4 = frame - 330;
  const timelinePop = spring({
    frame: Math.max(0, localP4 - 4),
    fps,
    config: { damping: 16, stiffness: 195, mass: 0.75 },
  });
  // Audio block flies into timeline at localP4 = 35 (frame 365)
  const dropProgress = spring({
    frame: Math.max(0, localP4 - 32),
    fps,
    config: { damping: 17, stiffness: 220, mass: 0.7 },
  });

  return (
    <BlurVignetteScene
      durationInFrames={449}
      fadeInFrames={10}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Kinetic Word Flow synced to each phase */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Setup" layout="none">
            {phase === 1 && (
              <KineticWordFlow
                top={165}
                baseSize={50}
                maxWidth={840}
                words={textProps.phase1Words}
              />
            )}
            {phase === 2 && (
              <KineticWordFlow
                top={165}
                baseSize={46}
                maxWidth={840}
                words={textProps.phase2Words}
              />
            )}
            {phase === 3 && (
              <KineticWordFlow
                top={165}
                baseSize={46}
                maxWidth={840}
                words={textProps.phase3Words}
              />
            )}
            {phase === 4 && (
              <KineticWordFlow
                top={165}
                baseSize={48}
                maxWidth={840}
                words={textProps.phase4Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* -------------------------------------------------------------
            PHASE 1 & 2: MCP Hub Architecture + Terminal Window (0..205f)
           ------------------------------------------------------------- */}
        {phase <= 2 ? (
          <div
            style={{
              position: 'absolute',
              top: 480,
              width: 880,
              transform: `translateY(${(1 - cardPop) * 36}px) scale(${0.92 + cardPop * 0.08})`,
              opacity: interpolate(frame, [6, 18], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            {/* Terminal Window with Traffic Light Chrome */}
            <div
              style={{
                backgroundColor: '#0F172A',
                borderRadius: 24,
                border: '1.5px solid #334155',
                boxShadow: '0 24px 50px rgba(15, 23, 42, 0.35)',
                overflow: 'hidden',
                padding: '30px 34px',
              }}
            >
              {/* Terminal Top Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 18,
                  borderBottom: '1px solid #1E293B',
                }}
              >
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#EF4444' }} />
                  <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#F59E0B' }} />
                  <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#10B981' }} />
                </div>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#94A3B8',
                    letterSpacing: '0.04em',
                  }}
                >
                  claude_desktop_config.json
                </span>
              </div>

              {/* Orthogonal Node-Wire Graph: Claude -> MCP Energy Beam -> Krafto Audio */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '32px 20px 24px',
                  position: 'relative',
                }}
              >
                {/* Claude Node */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 5 }}>
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 999,
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 24px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Img src={staticFile('assets/puck_claude.png')} style={{ width: 76, height: 76 }} />
                  </div>
                  <span style={{ fontFamily: INTER_FONT, fontSize: 20, fontWeight: 700, color: '#F1F5F9' }}>
                    Claude
                  </span>
                </div>

                {/* Animated Orthogonal Bus Lines & Flow Beam */}
                <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <svg width="340" height="40" viewBox="0 0 340 40" style={{ overflow: 'visible' }}>
                    {/* Background circuit track */}
                    <path
                      d="M 10 20 L 330 20"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    {/* Glowing active packet flow */}
                    <path
                      d="M 10 20 L 330 20"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="5"
                      strokeLinecap="round"
                      pathLength="1"
                      strokeDasharray="0.3 0.7"
                      strokeDashoffset={-(frame * 0.04) % 1}
                      style={{ filter: 'drop-shadow(0 0 8px #38BDF8)' }}
                    />
                  </svg>
                  <span style={{ fontFamily: 'monospace', fontSize: 16, color: '#38BDF8', fontWeight: 700, letterSpacing: '0.04em' }}>
                    OFFICIAL MCP STREAM
                  </span>
                </div>

                {/* Krafto Audio Hub Node */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 5 }}>
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 999,
                      backgroundColor: '#000000',
                      border: '2.5px solid #38BDF8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 24px rgba(56,189,248,0.35)',
                    }}
                  >
                    <Img src={staticFile('krafto/logo_krafto.png')} style={{ width: 62, height: 62 }} />
                  </div>
                  <span style={{ fontFamily: INTER_FONT, fontSize: 20, fontWeight: 700, color: '#F1F5F9' }}>
                    Krafto Audio
                  </span>
                </div>
              </div>

              {/* Glowing Server Endpoint Badge */}
              <div
                style={{
                  backgroundColor: '#030712',
                  borderRadius: 16,
                  padding: '18px 24px',
                  border: '1.5px solid #1E293B',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 17, color: '#64748B' }}>
                    Claude MCP Server Config:
                  </span>
                  <span
                    style={{
                      fontFamily: INTER_FONT,
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: 999,
                        backgroundColor: '#10B981',
                        boxShadow: `0 0 ${8 + pulse * 8}px #10B981`,
                      }}
                    />
                    CONNECTED
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 26,
                    fontWeight: 700,
                    color: '#38BDF8',
                    letterSpacing: '0.02em',
                  }}
                >
                  {textProps.urlPill}
                </div>
              </div>
            </div>

            {/* Terminal Live Command Execution Proof */}
            <div
              style={{
                marginTop: 20,
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '18px 26px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: interpolate(frame, [25, 40], [0, 1], { extrapolateRight: 'clamp' }),
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563EB',
                  fontFamily: 'monospace',
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                &gt;_
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: '#1E293B' }}>
                  claude mcp add krafto-audio https://mcp.trykrafto.xyz/mcp
                </span>
                <span style={{ fontFamily: INTER_FONT, fontSize: 15, fontWeight: 600, color: '#10B981' }}>
                  ✔ 140+ Professional SFX Stems Loaded Instantly
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* -----------------------------------------------------------------------------------
            PHASE 3 (205..330f, 0:52.5 - 0:56.5): WORKFLOW 1 — WEBSITE CODE SFX WITH CURSOR CLICK
           ----------------------------------------------------------------------------------- */}
        {phase === 3 ? (
          <div
            style={{
              position: 'absolute',
              top: 480,
              width: 880,
              transform: `translateY(${(1 - webPop) * 36}px) scale(${0.92 + webPop * 0.08})`,
            }}
          >
            {/* Website Mockup Browser Window */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                border: '1.5px solid #D9DCE3',
                boxShadow: '0 24px 50px rgba(15,23,42,0.14)',
                overflow: 'hidden',
              }}
            >
              {/* Chrome Top Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 24px',
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1.5px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#EF4444' }} />
                  <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#F59E0B' }} />
                  <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#10B981' }} />
                </div>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 999,
                    padding: '4px 20px',
                    border: '1px solid #E2E8F0',
                    fontFamily: 'monospace',
                    fontSize: 15,
                    color: '#64748B',
                  }}
                >
                  localhost:3000/app · Interactive Web Audio
                </div>
                <div style={{ width: 40 }} />
              </div>

              {/* Web UI Body with Interactive Button */}
              <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
                <span style={{ fontFamily: INTER_FONT, fontSize: 26, fontWeight: 700, color: '#0F172A' }}>
                  Interactive Web Sound Effect Demo
                </span>

                {/* The Button that gets clicked by cursor */}
                <div
                  style={{
                    position: 'relative',
                    backgroundColor: isWebButtonClicked ? '#1D4ED8' : '#2563EB',
                    borderRadius: 16,
                    padding: '18px 36px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    boxShadow: isWebButtonClicked
                      ? '0 4px 12px rgba(37,99,235,0.4)'
                      : '0 12px 28px rgba(37,99,235,0.35)',
                    transform: isWebButtonClicked ? 'scale(0.96)' : 'scale(1.0)',
                    transition: 'all 0.1s ease',
                  }}
                >
                  {/* Expanding Click Ripple */}
                  {webRipple > 0 && webRipple < 1 ? (
                    <div
                      style={{
                        position: 'absolute',
                        inset: -10,
                        borderRadius: 22,
                        border: '3px solid #38BDF8',
                        opacity: 1 - webRipple,
                        transform: `scale(${1 + webRipple * 0.3})`,
                      }}
                    />
                  ) : null}
                  <span style={{ fontSize: 26 }}>🔊</span>
                  <span style={{ fontFamily: INTER_FONT, fontSize: 22, fontWeight: 700, color: '#FFFFFF' }}>
                    {isWebButtonClicked ? 'Playing Zephyr Ambience...' : 'Play Interactive SFX'}
                  </span>
                </div>

                {/* Status Trigger Banner */}
                {isWebButtonClicked ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      backgroundColor: '#F0FDF4',
                      borderRadius: 999,
                      padding: '8px 24px',
                      border: '1.5px solid #86EFAC',
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#22C55E', boxShadow: '0 0 10px #22C55E' }} />
                    <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#166534' }}>
                      ▶ AUDIO PLAYBACK ACTIVE · 48kHz Stereo Triggered
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Code Snippet Box */}
              <div
                style={{
                  backgroundColor: '#0F172A',
                  padding: '22px 28px',
                  borderTop: '1.5px solid #1E293B',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <span style={{ fontFamily: 'monospace', fontSize: 15, color: '#64748B' }}>
                  // Code automatically generated by Claude MCP:
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 17, color: '#38BDF8', fontWeight: 600 }}>
                  import &#123; playSound &#125; from &apos;@trykrafto/audio&apos;;
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 17, color: '#F1F5F9', fontWeight: 600 }}>
                  await playSound(&apos;zephyr-ambience&apos;, &#123; volume: 0.85 &#125;);
                </span>
              </div>
            </div>

            {/* InsiderForce Vector Pointer Cursor Gliding & Clicking dead-center on Play SFX button */}
            <CursorClickOverlay
              from={[680, 340]}
              to={[440, 145]}
              moveStartFrame={210}
              clickFrame={241}
            />
          </div>
        ) : null}

        {/* -----------------------------------------------------------------------------------
            PHASE 4 (330..449f, 0:56.5 - 1:00.6): WORKFLOW 2 — VIDEO TIMELINE AUTO-INSERTION
           ----------------------------------------------------------------------------------- */}
        {phase === 4 ? (
          <div
            style={{
              position: 'absolute',
              top: 480,
              width: 880,
              transform: `translateY(${(1 - timelinePop) * 36}px) scale(${0.92 + timelinePop * 0.08})`,
            }}
          >
            {/* Video Editor NLE Timeline Window */}
            <div
              style={{
                backgroundColor: '#1E293B',
                borderRadius: 24,
                border: '1.5px solid #334155',
                boxShadow: '0 24px 50px rgba(15,23,42,0.35)',
                overflow: 'hidden',
              }}
            >
              {/* Timeline Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 24px',
                  backgroundColor: '#0F172A',
                  borderBottom: '1.5px solid #334155',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#EF4444' }} />
                  <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#F59E0B' }} />
                  <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#10B981' }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 16, color: '#94A3B8', marginLeft: 8 }}>
                    Video_Timeline_Editor.nle
                  </span>
                </div>
                <div
                  style={{
                    backgroundColor: '#0284C7',
                    borderRadius: 999,
                    padding: '4px 16px',
                    fontFamily: 'monospace',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#FFFFFF',
                  }}
                >
                  LIVE TIMELINE
                </div>
              </div>

              {/* Multi-Track Timeline Body */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Track V1: Video Sequence */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#94A3B8' }}>
                    V1
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 52,
                      backgroundColor: '#6366F1',
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 18px',
                      color: '#FFFFFF',
                      fontFamily: INTER_FONT,
                      fontSize: 16,
                      fontWeight: 700,
                      boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                    }}
                  >
                    🎬 Tech_Explainer_Short_Hero.mp4
                  </div>
                </div>

                {/* Track A1: Spoken Voiceover */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#94A3B8' }}>
                    A1
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 52,
                      backgroundColor: '#059669',
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 18px',
                      color: '#FFFFFF',
                      fontFamily: 'monospace',
                      fontSize: 16,
                      fontWeight: 700,
                      boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                    }}
                  >
                    🎙 Voiceover_Narration_Master.wav
                  </div>
                </div>

                {/* Track A2: Krafto SFX Track (Target for Claude MCP Insertion) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#38BDF8' }}>
                    A2
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 56,
                      backgroundColor: '#0B132B',
                      borderRadius: 12,
                      border: '2px dashed #0284C7',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                    }}
                  >
                    {/* The Snapped Audio Block from Claude MCP */}
                    {dropProgress > 0.05 ? (
                      <div
                        style={{
                          position: 'absolute',
                          left: `${interpolate(dropProgress, [0, 1], [300, 40])}px`,
                          width: 480,
                          height: 44,
                          backgroundColor: '#0284C7',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 16px',
                          gap: 10,
                          color: '#FFFFFF',
                          fontFamily: 'monospace',
                          fontSize: 16,
                          fontWeight: 700,
                          boxShadow: '0 0 20px rgba(56,189,248,0.6)',
                          transform: `scale(${interpolate(dropProgress, [0, 1], [0.8, 1])})`,
                          opacity: dropProgress,
                        }}
                      >
                        <span>🎵</span>
                        <span>Tide Ambience · Krafto SFX (48kHz)</span>
                      </div>
                    ) : (
                      <span style={{ fontFamily: 'monospace', fontSize: 15, color: '#475569' }}>
                        Waiting for Claude MCP Audio Cue...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Claude MCP Chat Prompt Bubble */}
              <div
                style={{
                  backgroundColor: '#0F172A',
                  padding: '20px 26px',
                  borderTop: '1.5px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Img src={staticFile('assets/puck_claude.png')} style={{ width: 34, height: 34 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontFamily: INTER_FONT, fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>
                    &quot;Claude, place Tide Ambience under the visual impact at 00:04&quot;
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 600, color: '#10B981' }}>
                    ✔ 1.2s Asset Injection Complete · Direct from Krafto MCP
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 7 (1819..2034f): Outro CTA — Comment Krafto & Follow Krafto
 */
const OutroCtaScene: React.FC<{
  textProps: KraftoAudioShortProps['scene7Outro'];
  branding: KraftoAudioShortProps['branding'];
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
      durationInFrames={215}
      fadeInFrames={10}
      fadeOutFrames={0}
      enterMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Kinetic CTA Narration: Comment Krafto */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Outro CTA" layout="none">
            <KineticWordFlow
              top={165}
              baseSize={50}
              maxWidth={840}
              words={textProps.words}
            />
          </Sequence>
        ) : null}

        {/* 3D Stack / Fan of the 3 Featured Audio Products */}
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
          {/* Card 1: Zephyr (tilted left) */}
          <div
            style={{
              position: 'absolute',
              width: 500,
              height: 330,
              borderRadius: 20,
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E4EC',
              boxShadow: '0 16px 36px rgba(15,23,42,0.14)',
              transform: 'translateX(-115px) rotate(-6deg)',
              overflow: 'hidden',
              padding: 10,
            }}
          >
            <Img
              src={staticFile('krafto/audio_zephyr.png')}
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#0B0D13', borderRadius: 12 }}
            />
          </div>

          {/* Card 2: Echo (tilted right) */}
          <div
            style={{
              position: 'absolute',
              width: 500,
              height: 330,
              borderRadius: 20,
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E4EC',
              boxShadow: '0 18px 40px rgba(15,23,42,0.16)',
              transform: 'translateX(115px) rotate(6deg)',
              overflow: 'hidden',
              padding: 10,
            }}
          >
            <Img
              src={staticFile('krafto/audio_echo.png')}
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#0B0D13', borderRadius: 12 }}
            />
          </div>

          {/* Card 3: Tide (centered front) */}
          <div
            style={{
              position: 'absolute',
              width: 530,
              height: 350,
              borderRadius: 22,
              backgroundColor: '#FFFFFF',
              border: '2.5px solid #CBD5E1',
              boxShadow: '0 24px 52px rgba(15,23,42,0.22)',
              transform: 'translateY(-10px) rotate(0deg)',
              overflow: 'hidden',
              padding: 12,
              zIndex: 5,
            }}
          >
            <Img
              src={staticFile('krafto/audio_tide.png')}
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#0B0D13', borderRadius: 14 }}
            />
          </div>
        </div>

        {/* Bottom "Follow Krafto" Pill Lockup with official circular Krafto logo */}
        {frame >= 60 ? (
          <div
            style={{
              position: 'absolute',
              top: 1200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              transform: `translateY(${(1 - followPop) * 24}px) scale(${0.92 + followPop * 0.08})`,
              opacity: interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 20,
                backgroundColor: '#FFFFFF',
                borderRadius: 999,
                padding: '14px 40px 14px 18px',
                border: '1.5px solid #D9DCE3',
                boxShadow: '0 16px 38px rgba(15, 23, 42, 0.14)',
              }}
            >
              {/* Circular Krafto Logo */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 999,
                  backgroundColor: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Img src={staticFile('krafto/logo_krafto.png')} style={{ width: 46, height: 46 }} />
              </div>

              {/* Follow Krafto Text */}
              <span
                style={{
                  fontFamily: INTER_FONT,
                  fontSize: 38,
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  color: '#141416',
                }}
              >
                Follow {branding.channelName}
              </span>

              {/* Blue Follow Action Button */}
              <div
                style={{
                  backgroundColor: '#2563EB',
                  borderRadius: 999,
                  padding: '10px 24px',
                  color: '#FFFFFF',
                  fontFamily: INTER_FONT,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  boxShadow: '0 6px 14px rgba(37, 99, 235, 0.35)',
                }}
              >
                {branding.followButtonText}
              </div>
            </div>

            {/* Subtext */}
            <span
              style={{
                fontFamily: INTER_FONT,
                fontSize: 26,
                fontWeight: 500,
                color: '#64748B',
                letterSpacing: '-0.02em',
              }}
            >
              {branding.followSubtext}
            </span>
          </div>
        ) : null}

        {/* Realistic Pointer Cursor Glide & Click on "Follow" button */}
        {frame >= 78 ? (
          <CursorClickOverlay
            from={[840, 1480]}
            to={[700, 1245]}
            moveStartFrame={80}
            clickFrame={100}
          />
        ) : null}
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Main Short Composition: Krafto Sound Effects (1080×1920 @ 30fps · 2034 frames · 67.8s)
 */
export const KraftoAudioShort: React.FC<KraftoAudioShortProps> = (rawProps) => {
  const props = { ...KRAFTO_AUDIO_DEFAULT_PROPS, ...rawProps };
  const frame = useCurrentFrame();

  // BGM Ducking curve: 0.15 during speech, swells to 0.22 at transitions, fades at outro
  const bgmVolume = (f: number) => {
    if (f < 10) return interpolate(f, [0, 10], [0, 0.15]);
    if (f >= 1970) return interpolate(f, [1970, 2034], [0.15, 0], { extrapolateRight: 'clamp' });
    const cuts = [138, 496, 816, 1123, 1370, 1819];
    for (const cut of cuts) {
      if (Math.abs(f - cut) <= 8) return 0.22;
    }
    return 0.15;
  };

  return (
    <StudioCanvas
      backgroundColor="#F1F3F6"
      gridType="arch-dots"
      watermark={props.branding.watermark} // Clean: empty string hides watermark
    >
      {/* 1. Master Audio Stems: Pristine Untouched ElevenLabs Voiceover + Music Bed + SFX Stem */}
      <Audio
        src={staticFile('audio/krafto_audio_voiceover.wav')}
        volume={1.0}
      />
      <Audio
        src={staticFile('audio/channel_music_bed.wav')}
        volume={bgmVolume(frame)}
      />
      <Audio
        src={staticFile('audio/krafto_audio_sfx_stem.wav')}
        volume={0.92}
      />

      {/* 2. Visual Narrative Scenes */}
      {/* Scene 1: Brand New Creative Hook (0..138f) */}
      <Sequence from={0} durationInFrames={138} name="Scene 1 · Sonic Core Hook">
        <HookScene textProps={props.scene1Hook} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 2: Reveal & Live Catalog Scroll (138..496f) */}
      <Sequence from={138} durationInFrames={358} name="Scene 2 · Reveal Catalog">
        <RevealDashboardScene textProps={props.scene2Reveal} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 3: Sound 1 — Zephyr Ambience (496..816f) */}
      <Sequence from={496} durationInFrames={320} name="Scene 3 · Sound 1 Zephyr">
        <SoundZephyrScene textProps={props.scene3Zephyr} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 4: Sound 2 — Echo Ambience (816..1123f) */}
      <Sequence from={816} durationInFrames={307} name="Scene 4 · Sound 2 Echo">
        <SoundEchoScene textProps={props.scene4Echo} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 5: Sound 3 — Tide Ambience (1123..1370f) */}
      <Sequence from={1123} durationInFrames={247} name="Scene 5 · Sound 3 Tide">
        <SoundTideScene textProps={props.scene5Tide} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 6: Claude MCP Setup & Workflows (1370..1819f) */}
      <Sequence from={1370} durationInFrames={449} name="Scene 6 · Setup MCP">
        <SetupScene textProps={props.scene6Setup} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 7: Outro CTA (1819..2034f) */}
      <Sequence from={1819} durationInFrames={215} name="Scene 7 · Outro CTA">
        <OutroCtaScene textProps={props.scene7Outro} branding={props.branding} showTextLayer={props.showTextLayer} />
      </Sequence>
    </StudioCanvas>
  );
};
