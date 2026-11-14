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

  const isPhase2 = frame >= 67;
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
        <div style={{ position: 'absolute', top: 110 }}>
          <KraftoAudioBadge
            indexLabel={textProps.badge.num}
            soundName={textProps.badge.name}
            tagline={textProps.badge.tagline}
            startFrame={2}
          />
        </div>

        {/* Safe-bounded Kinetic Word Flow */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Zephyr" layout="none">
            {!isPhase2 ? (
              <KineticWordFlow
                top={210}
                baseSize={48}
                maxWidth={820}
                words={textProps.phase1Words}
              />
            ) : (
              <KineticWordFlow
                top={210}
                baseSize={46}
                maxWidth={820}
                words={textProps.phase2Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Real Specimen Capture: Zephyr Ambience */}
        <div
          style={{
            position: 'absolute',
            top: 540,
            transform: `translateY(${(1 - framePop) * 42 + drift}px) scale(${0.92 + framePop * 0.08})`,
            opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={10} width={880} borderWidth={10} borderRadius={24}>
            <Img
              src={staticFile('krafto/audio_zephyr.png')}
              style={{
                width: 860,
                height: 700,
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </BeveledMediaFrame>
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

  const isPhase2 = frame >= 69;
  const framePop = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.78 },
  });

  const drift = Math.sin(frame * 0.04) * 4;

  return (
    <BlurVignetteScene
      durationInFrames={307}
      fadeInFrames={10}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="slide-up"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Top Sound Badge */}
        <div style={{ position: 'absolute', top: 110 }}>
          <KraftoAudioBadge
            indexLabel={textProps.badge.num}
            soundName={textProps.badge.name}
            tagline={textProps.badge.tagline}
            startFrame={2}
          />
        </div>

        {/* Safe-bounded Kinetic Word Flow */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Echo" layout="none">
            {!isPhase2 ? (
              <KineticWordFlow
                top={210}
                baseSize={48}
                maxWidth={820}
                words={textProps.phase1Words}
              />
            ) : (
              <KineticWordFlow
                top={210}
                baseSize={46}
                maxWidth={820}
                words={textProps.phase2Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Real Specimen Capture: Echo Ambience */}
        <div
          style={{
            position: 'absolute',
            top: 540,
            transform: `translateY(${(1 - framePop) * 42 + drift}px) scale(${0.92 + framePop * 0.08})`,
            opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={10} width={880} borderWidth={10} borderRadius={24}>
            <Img
              src={staticFile('krafto/audio_echo.png')}
              style={{
                width: 860,
                height: 700,
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </BeveledMediaFrame>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 5 (1123..1370f): Sound 3 — Tide Ambience
 */
const SoundTideScene: React.FC<{
  textProps: KraftoAudioShortProps['scene5Tide'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isPhase2 = frame >= 67;
  const framePop = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.78 },
  });

  const drift = Math.sin(frame * 0.04) * 4;

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
        <div style={{ position: 'absolute', top: 110 }}>
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
            {!isPhase2 ? (
              <KineticWordFlow
                top={210}
                baseSize={48}
                maxWidth={820}
                words={textProps.phase1Words}
              />
            ) : (
              <KineticWordFlow
                top={210}
                baseSize={46}
                maxWidth={820}
                words={textProps.phase2Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Real Specimen Capture: Tide Ambience */}
        <div
          style={{
            position: 'absolute',
            top: 540,
            transform: `translateY(${(1 - framePop) * 42 + drift}px) scale(${0.92 + framePop * 0.08})`,
            opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={10} width={880} borderWidth={10} borderRadius={24}>
            <Img
              src={staticFile('krafto/audio_tide.png')}
              style={{
                width: 860,
                height: 700,
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </BeveledMediaFrame>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 6 (1370..1819f): Claude MCP Audio Integration
 */
const SetupScene: React.FC<{
  textProps: KraftoAudioShortProps['scene6Setup'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isPhase2 = frame >= 206;
  const cardPop = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.8 },
  });

  const pulse = (Math.sin(frame * 0.15) + 1) * 0.5;

  return (
    <BlurVignetteScene
      durationInFrames={449}
      fadeInFrames={10}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Safe-bounded Kinetic Word Flow */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Setup" layout="none">
            {!isPhase2 ? (
              <KineticWordFlow
                top={170}
                baseSize={46}
                maxWidth={820}
                words={textProps.phase1Words}
              />
            ) : (
              <KineticWordFlow
                top={170}
                baseSize={46}
                maxWidth={820}
                words={textProps.phase2Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* MCP Connection Terminal Card */}
        <div
          style={{
            position: 'absolute',
            top: 500,
            width: 860,
            transform: `translateY(${(1 - cardPop) * 40}px) scale(${0.92 + cardPop * 0.08})`,
            opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
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

            {/* Hub Flow Node Illustration: Claude -> URL -> Krafto Audio */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '32px 16px 24px',
              }}
            >
              {/* Claude Node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Img src={staticFile('assets/puck_claude.png')} style={{ width: 84, height: 84 }} />
                <span style={{ fontFamily: INTER_FONT, fontSize: 20, fontWeight: 700, color: '#F1F5F9' }}>
                  Claude
                </span>
              </div>

              {/* Animated Connecting Flow Beam */}
              <div style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: '100%',
                    height: 4,
                    backgroundColor: '#334155',
                    borderRadius: 999,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      width: 80,
                      background: 'linear-gradient(90deg, transparent, #38BDF8, transparent)',
                      transform: `translateX(${((frame * 8) % 400) - 80}px)`,
                    }}
                  />
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 16, color: '#38BDF8', fontWeight: 600 }}>
                  AUDIO MCP STREAM
                </span>
              </div>

              {/* Krafto Node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 999,
                    backgroundColor: '#000000',
                    border: '2px solid #475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Img src={staticFile('krafto/logo_krafto.png')} style={{ width: 58, height: 58 }} />
                </div>
                <span style={{ fontFamily: INTER_FONT, fontSize: 20, fontWeight: 700, color: '#F1F5F9' }}>
                  Krafto Audio
                </span>
              </div>
            </div>

            {/* Glowing MCP Endpoint Badge */}
            <div
              style={{
                backgroundColor: '#030712',
                borderRadius: 16,
                padding: '18px 22px',
                border: '1.5px solid #1E293B',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 18, color: '#64748B' }}>
                  Server Endpoint:
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
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      backgroundColor: '#10B981',
                      boxShadow: `0 0 ${8 + pulse * 6}px #10B981`,
                    }}
                  />
                  CONNECTED
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: 27,
                  fontWeight: 700,
                  color: '#38BDF8',
                  letterSpacing: '0.02em',
                }}
              >
                {textProps.urlPill}
              </div>
            </div>
          </div>
        </div>

        {/* Live Audio Code Snippet Preview */}
        <div
          style={{
            position: 'absolute',
            top: 1020,
            width: 860,
            opacity: interpolate(frame, [35, 50], [0, 0.95], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '20px 28px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
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
                claude.injectSoundEffect(&apos;zephyr-ambience.wav&apos;)
              </span>
              <span style={{ fontFamily: INTER_FONT, fontSize: 15, fontWeight: 500, color: '#64748B' }}>
                Instant asset insertion directly into website &amp; video timeline
              </span>
            </div>
          </div>
        </div>
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
              top={170}
              baseSize={50}
              maxWidth={820}
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
      {/* 1. Master Audio Stems: Pristine Untouched ElevenLabs Voiceover + Music Bed */}
      <Audio
        src={staticFile('audio/krafto_audio_voiceover.wav')}
        volume={1.0}
      />
      <Audio
        src={staticFile('audio/channel_music_bed.wav')}
        volume={bgmVolume(frame)}
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

      {/* Scene 6: Claude MCP Setup & Workflow (1370..1819f) */}
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
