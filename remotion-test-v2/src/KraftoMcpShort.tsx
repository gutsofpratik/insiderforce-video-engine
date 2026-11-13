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
  DirectionalMotionBlur,
  INTER_FONT,
  INTER_ITALIC_FONT,
  KineticWordFlow,
  StudioCanvas,
} from './Primitives';
import {
  KRAFTO_MCP_DEFAULT_PROPS,
  KraftoMcpShortProps,
} from './kraftoTextLayer';

/** Pill header badge for Krafto fonts. */
const KraftoFontBadge: React.FC<{
  indexLabel: string;
  fontName: string;
  tagline?: string;
  startFrame: number;
}> = ({ indexLabel, fontName, tagline, startFrame }) => {
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
            fontSize: 28,
            fontWeight: 800,
            color: '#141416',
            letterSpacing: '-0.03em',
          }}
        >
          {indexLabel}
        </span>
        <span
          style={{
            fontFamily: INTER_FONT,
            fontSize: 34,
            fontWeight: 700,
            color: '#141416',
            letterSpacing: '-0.03em',
          }}
        >
          {fontName}
        </span>
      </div>
    </div>
  );
};

/**
 * Scene 1 (0..183f): Hook — Stop wasting hours hunting for fonts and generic typography.
 */
const HookScene: React.FC<{
  textProps: KraftoMcpShortProps['scene1Hook'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const puckPop = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 15, stiffness: 180, mass: 0.8 },
  });
  const heroCardPop = spring({
    frame: Math.max(0, frame - 42),
    fps,
    config: { damping: 16, stiffness: 190, mass: 0.75 },
  });

  const floatY = Math.sin(frame * 0.07) * 5;
  const floatTilt = Math.sin(frame * 0.045) * 1.8;

  return (
    <BlurVignetteScene
      durationInFrames={183}
      fadeInFrames={6}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Kinetic Hook Narration */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Hook" layout="none">
            <KineticWordFlow
              top={220}
              baseSize={58}
              maxWidth={920}
              words={textProps.words}
            />
          </Sequence>
        ) : null}

        {/* Dual Floating 3D Emblem Hub: Claude + Krafto */}
        <div
          style={{
            position: 'absolute',
            top: 520,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            transform: `translateY(${(1 - puckPop) * 36 + floatY}px) scale(${0.9 + puckPop * 0.1}) rotate(${floatTilt}deg)`,
            opacity: interpolate(frame, [2, 12], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          {/* Claude Puck */}
          <div style={{ position: 'relative' }}>
            <Img
              src={staticFile('assets/puck_claude.png')}
              style={{ width: 140, height: 140, objectFit: 'contain' }}
            />
          </div>

          {/* Plus Connection Badge */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E2E4EC',
              boxShadow: '0 8px 18px rgba(15,23,42,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: INTER_FONT,
              fontSize: 26,
              fontWeight: 800,
              color: '#64748B',
            }}
          >
            +
          </div>

          {/* Krafto Puck */}
          <div style={{ position: 'relative' }}>
            <Img
              src={staticFile('krafto/puck_krafto.png')}
              style={{ width: 140, height: 140, objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Hero Preview Card from trykrafto.xyz/mcp */}
        <div
          style={{
            position: 'absolute',
            top: 730,
            transform: `translateY(${(1 - heroCardPop) * 40}px) scale(${0.94 + heroCardPop * 0.06})`,
            opacity: interpolate(frame, [40, 52], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={42} width={880} borderWidth={8} borderRadius={20}>
            <Img
              src={staticFile('krafto/krafto_mcp_hero.png')}
              style={{
                width: 864,
                height: 520,
                objectFit: 'cover',
                objectPosition: 'top center',
              }}
            />
          </BeveledMediaFrame>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 2 (183..520f): Reveal & Dashboard — Claude MCP Server turns Claude into your font library.
 */
const RevealDashboardScene: React.FC<{
  textProps: KraftoMcpShortProps['scene2Reveal'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: 0..195f | Phase 2: 195..337f
  const isPhase2 = frame >= 195;
  const dashPop = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.8 },
  });

  const zoomScale = interpolate(frame, [0, 337], [1.0, 1.045], {
    easing: Easing.out(Easing.quad),
  });

  return (
    <BlurVignetteScene
      durationInFrames={337}
      fadeInFrames={10}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="slide-up"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Header Category Tag */}
        <div
          style={{
            position: 'absolute',
            top: 90,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: '#FFFFFF',
            borderRadius: 999,
            padding: '8px 22px 8px 14px',
            border: '1.5px solid #E2E5EB',
            boxShadow: '0 8px 18px rgba(15,23,42,0.06)',
            opacity: interpolate(frame, [0, 8, 75, 90], [0, 1, 1, 0], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: '#10B981',
              boxShadow: '0 0 10px #10B981',
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
            OFFICIAL CLAUDE MCP INTEGRATION
          </span>
        </div>

        {/* Kinetic Captions */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Reveal" layout="none">
            {!isPhase2 ? (
              <KineticWordFlow
                top={175}
                baseSize={52}
                maxWidth={920}
                words={textProps.phase1Words}
              />
            ) : (
              <KineticWordFlow
                top={175}
                baseSize={54}
                maxWidth={920}
                words={textProps.phase2Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Real Krafto MCP Live Smooth Scrolling Footage */}
        <div
          style={{
            position: 'absolute',
            top: 550,
            transform: `translateY(${(1 - dashPop) * 38}px) scale(${zoomScale})`,
            opacity: interpolate(frame, [6, 18], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={8} width={900} borderWidth={10} borderRadius={24}>
            <OffthreadVideo
              src={staticFile('krafto/krafto_mcp_scroll.mp4')}
              style={{
                width: 880,
                height: 700,
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
 * Scene 3 (520..842f): Font 1 — Iron Maiden.
 */
const FontIronMaidenScene: React.FC<{
  textProps: KraftoMcpShortProps['scene3IronMaiden'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isPhase2 = frame >= 165;
  const framePop = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.78 },
  });

  const drift = Math.sin(frame * 0.04) * 4;

  return (
    <BlurVignetteScene
      durationInFrames={322}
      fadeInFrames={10}
      fadeOutFrames={10}
      enterMode="slide-up"
      exitMode="slide-up"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Top Font Badge */}
        <div style={{ position: 'absolute', top: 125 }}>
          <KraftoFontBadge
            indexLabel={textProps.badge.num}
            fontName={textProps.badge.name}
            tagline={textProps.badge.tagline}
            startFrame={2}
          />
        </div>

        {/* Kinetic Word Flow */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Iron Maiden" layout="none">
            {!isPhase2 ? (
              <KineticWordFlow
                top={225}
                baseSize={54}
                maxWidth={920}
                words={textProps.phase1Words}
              />
            ) : (
              <KineticWordFlow
                top={225}
                baseSize={54}
                maxWidth={920}
                words={textProps.phase2Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Real Specimen Capture: Iron Maiden */}
        <div
          style={{
            position: 'absolute',
            top: 550,
            transform: `translateY(${(1 - framePop) * 42 + drift}px) scale(${0.92 + framePop * 0.08})`,
            opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={10} width={900} borderWidth={10} borderRadius={24}>
            <Img
              src={staticFile('krafto/font_iron_maiden.png')}
              style={{
                width: 880,
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
 * Scene 4 (842..1133f): Font 2 — StopD.
 */
const FontStopDScene: React.FC<{
  textProps: KraftoMcpShortProps['scene4StopD'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isPhase2 = frame >= 170;
  const framePop = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.78 },
  });

  const drift = Math.sin(frame * 0.04) * 4;

  return (
    <BlurVignetteScene
      durationInFrames={291}
      fadeInFrames={10}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="slide-up"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Top Font Badge */}
        <div style={{ position: 'absolute', top: 125 }}>
          <KraftoFontBadge
            indexLabel={textProps.badge.num}
            fontName={textProps.badge.name}
            tagline={textProps.badge.tagline}
            startFrame={2}
          />
        </div>

        {/* Kinetic Word Flow */}
        {showTextLayer ? (
          <Sequence name="Text Layer · StopD" layout="none">
            {!isPhase2 ? (
              <KineticWordFlow
                top={225}
                baseSize={54}
                maxWidth={920}
                words={textProps.phase1Words}
              />
            ) : (
              <KineticWordFlow
                top={225}
                baseSize={54}
                maxWidth={920}
                words={textProps.phase2Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Real Specimen Capture: StopD */}
        <div
          style={{
            position: 'absolute',
            top: 550,
            transform: `translateY(${(1 - framePop) * 42 + drift}px) scale(${0.92 + framePop * 0.08})`,
            opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={10} width={900} borderWidth={10} borderRadius={24}>
            <Img
              src={staticFile('krafto/font_stopd.png')}
              style={{
                width: 880,
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
 * Scene 5 (1133..1455f): Font 3 — Aardvark Cafe.
 */
const FontAardvarkCafeScene: React.FC<{
  textProps: KraftoMcpShortProps['scene5AardvarkCafe'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isPhase2 = frame >= 150;
  const framePop = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.78 },
  });

  const drift = Math.sin(frame * 0.04) * 4;

  return (
    <BlurVignetteScene
      durationInFrames={322}
      fadeInFrames={10}
      fadeOutFrames={10}
      enterMode="slide-up"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Top Font Badge */}
        <div style={{ position: 'absolute', top: 125 }}>
          <KraftoFontBadge
            indexLabel={textProps.badge.num}
            fontName={textProps.badge.name}
            tagline={textProps.badge.tagline}
            startFrame={2}
          />
        </div>

        {/* Kinetic Word Flow */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Aardvark Cafe" layout="none">
            {!isPhase2 ? (
              <KineticWordFlow
                top={225}
                baseSize={54}
                maxWidth={920}
                words={textProps.phase1Words}
              />
            ) : (
              <KineticWordFlow
                top={225}
                baseSize={54}
                maxWidth={920}
                words={textProps.phase2Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Real Specimen Capture: Aardvark Cafe */}
        <div
          style={{
            position: 'absolute',
            top: 550,
            transform: `translateY(${(1 - framePop) * 42 + drift}px) scale(${0.92 + framePop * 0.08})`,
            opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={10} width={900} borderWidth={10} borderRadius={24}>
            <Img
              src={staticFile('krafto/font_aardvark_cafe.png')}
              style={{
                width: 880,
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
 * Scene 6 (1455..1749f): Claude MCP Endpoint Setup (`mcp.trykrafto.xyz/mcp`).
 */
const SetupScene: React.FC<{
  textProps: KraftoMcpShortProps['scene6Setup'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardPop = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.8 },
  });

  const pulse = (Math.sin(frame * 0.15) + 1) * 0.5;

  return (
    <BlurVignetteScene
      durationInFrames={294}
      fadeInFrames={10}
      fadeOutFrames={10}
      enterMode="lens-blur"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Kinetic Word Flow */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Setup" layout="none">
            <KineticWordFlow
              top={210}
              baseSize={56}
              maxWidth={920}
              words={textProps.words}
            />
          </Sequence>
        ) : null}

        {/* MCP Connection Terminal Card */}
        <div
          style={{
            position: 'absolute',
            top: 540,
            width: 880,
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
              padding: '32px 36px',
            }}
          >
            {/* Terminal Top Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 20,
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

            {/* Hub Flow Node Illustration: Claude -> URL -> Krafto */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '36px 16px 28px',
              }}
            >
              {/* Claude Node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <Img src={staticFile('assets/puck_claude.png')} style={{ width: 88, height: 88 }} />
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
                  MCP STREAM
                </span>
              </div>

              {/* Krafto Node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 999,
                    backgroundColor: '#000000',
                    border: '2px solid #475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Img src={staticFile('krafto/logo_krafto.png')} style={{ width: 62, height: 62 }} />
                </div>
                <span style={{ fontFamily: INTER_FONT, fontSize: 20, fontWeight: 700, color: '#F1F5F9' }}>
                  Krafto
                </span>
              </div>
            </div>

            {/* Glowing MCP Endpoint Badge */}
            <div
              style={{
                backgroundColor: '#030712',
                borderRadius: 16,
                padding: '20px 24px',
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
                  wordBreak: 'break-all',
                }}
              >
                {textProps.urlPill}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard preview peek below */}
        <div
          style={{
            position: 'absolute',
            top: 1080,
            opacity: interpolate(frame, [40, 56], [0, 0.85], { extrapolateRight: 'clamp' }),
          }}
        >
          <BeveledMediaFrame enterFrame={40} width={880} borderWidth={8} borderRadius={18}>
            <Img
              src={staticFile('krafto/krafto_mcp_dashboard.png')}
              style={{ width: 864, height: 260, objectFit: 'cover', objectPosition: 'center 40%' }}
            />
          </BeveledMediaFrame>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 7 (1749..1980f): Outro CTA — Comment Krafto + Follow Krafto Pill Lockup.
 */
const OutroCtaScene: React.FC<{
  textProps: KraftoMcpShortProps['scene7Outro'];
  branding: KraftoMcpShortProps['branding'];
  showTextLayer: boolean;
}> = ({ textProps, branding, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fanPop = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 16, stiffness: 180, mass: 0.8 },
  });

  const followPop = spring({
    frame: Math.max(0, frame - 85),
    fps,
    config: { damping: 16, stiffness: 210, mass: 0.7 },
  });

  return (
    <BlurVignetteScene
      durationInFrames={231}
      fadeInFrames={12}
      fadeOutFrames={0}
      enterMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Kinetic CTA Narration: Comment Krafto */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Outro CTA" layout="none">
            <KineticWordFlow
              top={190}
              baseSize={58}
              maxWidth={920}
              words={textProps.words}
            />
          </Sequence>
        ) : null}

        {/* 3D Stack / Fan of the 3 Featured Fonts */}
        <div
          style={{
            position: 'absolute',
            top: 500,
            width: 880,
            height: 480,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${(1 - fanPop) * 44}px) scale(${0.88 + fanPop * 0.12})`,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          {/* Card 1: Iron Maiden (tilted left) */}
          <div
            style={{
              position: 'absolute',
              width: 520,
              height: 340,
              borderRadius: 20,
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E4EC',
              boxShadow: '0 16px 36px rgba(15,23,42,0.14)',
              transform: 'translateX(-120px) rotate(-6deg)',
              overflow: 'hidden',
              padding: 10,
            }}
          >
            <Img
              src={staticFile('krafto/font_iron_maiden.png')}
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#0B0D13', borderRadius: 12 }}
            />
          </div>

          {/* Card 2: StopD (tilted right) */}
          <div
            style={{
              position: 'absolute',
              width: 520,
              height: 340,
              borderRadius: 20,
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E4EC',
              boxShadow: '0 18px 40px rgba(15,23,42,0.16)',
              transform: 'translateX(120px) rotate(6deg)',
              overflow: 'hidden',
              padding: 10,
            }}
          >
            <Img
              src={staticFile('krafto/font_stopd.png')}
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#0B0D13', borderRadius: 12 }}
            />
          </div>

          {/* Card 3: Aardvark Cafe (centered front) */}
          <div
            style={{
              position: 'absolute',
              width: 550,
              height: 360,
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
              src={staticFile('krafto/font_aardvark_cafe.png')}
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#0B0D13', borderRadius: 14 }}
            />
          </div>
        </div>

        {/* Bottom "Follow Krafto" Pill Lockup with official circular Krafto logo */}
        {frame >= 80 ? (
          <div
            style={{
              position: 'absolute',
              top: 1220,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              transform: `translateY(${(1 - followPop) * 24}px) scale(${0.92 + followPop * 0.08})`,
              opacity: interpolate(frame, [80, 92], [0, 1], { extrapolateRight: 'clamp' }),
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
        {frame >= 95 ? (
          <CursorClickOverlay
            from={[840, 1500]}
            to={[700, 1265]}
            moveStartFrame={96}
            clickFrame={116}
          />
        ) : null}
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Main Short Composition: Krafto × Claude MCP (1080×1920 @ 30fps · 1980 frames · 66.0s)
 */
export const KraftoMcpShort: React.FC<KraftoMcpShortProps> = (rawProps) => {
  const props = { ...KRAFTO_MCP_DEFAULT_PROPS, ...rawProps };
  const frame = useCurrentFrame();

  // BGM Ducking curve: 0.16 during speech, swells to 0.22 at transitions, fades at outro
  const bgmVolume = (f: number) => {
    if (f < 10) return interpolate(f, [0, 10], [0, 0.16]);
    if (f >= 1920) return interpolate(f, [1920, 1980], [0.16, 0], { extrapolateRight: 'clamp' });
    // Transition swells around scene cuts
    const cuts = [183, 520, 842, 1133, 1455, 1749];
    for (const cut of cuts) {
      if (Math.abs(f - cut) <= 8) return 0.22;
    }
    return 0.16;
  };

  return (
    <StudioCanvas
      backgroundColor="#F1F3F6"
      gridType="arch-dots"
      watermark={props.branding.watermark} // Clean: empty string hides watermark
    >
      {/* 1. Master Audio Stems: Voiceover + Music Bed */}
      <Audio
        src={staticFile('audio/krafto_voiceover.wav')}
        volume={1.0}
      />
      <Audio
        src={staticFile('audio/channel_music_bed.wav')}
        volume={bgmVolume(frame)}
      />
      {/* SFX stem with frame-accurate cues */}
      <Audio
        src={staticFile('audio/krafto_sfx_stem.wav')}
        volume={0.88}
      />

      {/* 2. Visual Narrative Scenes */}
      {/* Scene 1: Hook (0..183f) */}
      <Sequence from={0} durationInFrames={183} name="Scene 1 · Hook">
        <HookScene textProps={props.scene1Hook} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 2: Reveal & Dashboard (183..520f) */}
      <Sequence from={183} durationInFrames={337} name="Scene 2 · Reveal & Dashboard">
        <RevealDashboardScene textProps={props.scene2Reveal} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 3: Font 1 — Iron Maiden (520..842f) */}
      <Sequence from={520} durationInFrames={322} name="Scene 3 · Font 1 Iron Maiden">
        <FontIronMaidenScene textProps={props.scene3IronMaiden} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 4: Font 2 — StopD (842..1133f) */}
      <Sequence from={842} durationInFrames={291} name="Scene 4 · Font 2 StopD">
        <FontStopDScene textProps={props.scene4StopD} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 5: Font 3 — Aardvark Cafe (1133..1455f) */}
      <Sequence from={1133} durationInFrames={322} name="Scene 5 · Font 3 Aardvark Cafe">
        <FontAardvarkCafeScene textProps={props.scene5AardvarkCafe} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 6: Setup & MCP Endpoint (1455..1749f) */}
      <Sequence from={1455} durationInFrames={294} name="Scene 6 · Setup MCP">
        <SetupScene textProps={props.scene6Setup} showTextLayer={props.showTextLayer} />
      </Sequence>

      {/* Scene 7: Outro CTA (1749..1980f) */}
      <Sequence from={1749} durationInFrames={231} name="Scene 7 · Outro CTA">
        <OutroCtaScene textProps={props.scene7Outro} branding={props.branding} showTextLayer={props.showTextLayer} />
      </Sequence>
    </StudioCanvas>
  );
};
