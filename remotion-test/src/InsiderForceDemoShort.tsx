import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Audio } from '@remotion/media';
import {
  BlurVignetteScene,
  CoralStarburst,
  CursorClickOverlay,
  ElevatedCard,
  KineticSentence,
  StudioCanvas,
} from './Primitives';

/** Shot 1 (0..75f): Hook compression + coral starbursts + hero prompt/motion card. */
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Signature 1-frame cold start (f000 black flash) -> 4-11f hero compression into white bezel
  const compress = spring({
    fps,
    frame: Math.max(0, frame - 1),
    config: { damping: 17, stiffness: 200, mass: 0.8 },
  });
  const cardScale = interpolate(compress, [0, 1], [1.09, 1]);
  const bezelPad = interpolate(compress, [0, 1], [0, 14]);
  const barProgress = interpolate(frame, [10, 65], [0.18, 0.92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  if (frame === 0) {
    return <AbsoluteFill style={{ backgroundColor: '#000000' }} />;
  }

  return (
    <BlurVignetteScene durationInFrames={75} fadeInFrames={0} fadeOutFrames={9}>
      {/* Cropped corner Claude terracotta starbursts */}
      <div style={{ position: 'absolute', left: -95, top: 270, opacity: 0.9 }}>
        <CoralStarburst size={250} color="#CF6E57" speedDegPerFrame={0.55} />
      </div>
      <div style={{ position: 'absolute', right: -100, top: 820, opacity: 0.85 }}>
        <CoralStarburst size={240} color="#CF6E57" speedDegPerFrame={-0.45} />
      </div>

      {/* Upper-Mid Stage (y: 410..930) */}
      <div
        style={{
          position: 'absolute',
          top: 415,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${cardScale.toFixed(4)})`,
        }}
      >
        <div
          style={{
            width: 880,
            padding: bezelPad,
            borderRadius: 26,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E7',
            boxShadow:
              '0 26px 56px -12px rgba(18, 22, 34, 0.16), 0 10px 22px -6px rgba(18, 22, 34, 0.08)',
          }}
        >
          <div
            style={{
              backgroundColor: '#13161D',
              borderRadius: 18,
              padding: '34px 36px',
              color: '#F8FAFC',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 26,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 99,
                    backgroundColor: '#CF6E57',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 23,
                    color: '#A1A1AA',
                  }}
                >
                  Claude Code • Motion Studio
                </span>
              </div>
              <div
                style={{
                  backgroundColor: '#CF6E57',
                  color: '#FFFFFF',
                  fontSize: 20,
                  fontWeight: 700,
                  padding: '6px 16px',
                  borderRadius: 999,
                }}
              >
                SKILL ACTIVE
              </div>
            </div>

            <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.28, marginBottom: 26 }}>
              "Build a clean 9:16 tech explainer Short in Remotion @ 30fps"
            </div>

            {/* Simulated timeline preview strip */}
            <div
              style={{
                backgroundColor: '#1E222D',
                borderRadius: 14,
                padding: '18px 20px',
                border: '1px solid #2D3241',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 20,
                  color: '#94A3B8',
                  marginBottom: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <span>Rendering keyframes...</span>
                <span style={{ color: '#3ECF8E', fontWeight: 700 }}>
                  {Math.round(barProgress * 100)}%
                </span>
              </div>
              <div
                style={{
                  height: 14,
                  backgroundColor: '#0F1117',
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(barProgress * 100).toFixed(1)}%`,
                    height: '100%',
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, #CF6E57 0%, #2563EB 100%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower-Mid Kinetic Caption Stage */}
      <KineticSentence
        top={1045}
        fontSize={56}
        words={[
          { text: 'Claude', startFrame: 3, bold: true },
          { text: 'Code', startFrame: 7, bold: true },
          { text: 'can', startFrame: 12 },
          { text: 'now', startFrame: 16 },
          { text: 'create', startFrame: 21 },
          { text: 'stunning', startFrame: 27, pill: true, bold: true },
          { text: 'animations.', startFrame: 35, bold: true },
        ]}
      />
    </BlurVignetteScene>
  );
};

/** Shot 2 (75..135f): Real live headless captured web screenshot wrapped in InsiderForce bezel. */
const LiveWebBridgeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    fps,
    frame,
    config: { damping: 18, stiffness: 205, mass: 0.78 },
  });
  const scale = interpolate(pop, [0, 1], [0.94, 1]) + Math.min(0.025, frame * 0.0004);
  const ty = interpolate(pop, [0, 1], [34, 0]);

  return (
    <BlurVignetteScene durationInFrames={60} fadeInFrames={7} fadeOutFrames={9}>
      <div
        style={{
          position: 'absolute',
          top: 330,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `translateY(${ty.toFixed(2)}px) scale(${scale.toFixed(4)})`,
        }}
      >
        <Img
          src={staticFile('assets/remotion_web_card.png')}
          style={{ width: 960, height: 'auto' }}
        />
      </div>

      <KineticSentence
        top={1085}
        fontSize={54}
        words={[
          { text: 'All', startFrame: 5 },
          { text: 'you', startFrame: 8 },
          { text: 'need', startFrame: 12 },
          { text: 'is', startFrame: 15 },
          { text: 'one', startFrame: 19, bold: true, underline: true },
          { text: 'skill', startFrame: 23, bold: true, underline: true },
          { text: 'to', startFrame: 29 },
          { text: 'unlock', startFrame: 33 },
          { text: 'it.', startFrame: 38, bold: true },
        ]}
      />
    </BlurVignetteScene>
  );
};

/** Shot 3 (135..205f): Dark macOS CLI Terminal + pointer cursor click interaction. */
const TerminalClickScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cmd = 'npx skills add remotion-dev/skills';
  const chars = Math.min(cmd.length, Math.floor(Math.max(0, frame - 6) / 1.1));
  const typed = cmd.slice(0, chars);
  const cursorBlink = Math.floor(frame / 10) % 2 === 0;

  // Click happens cleanly at local frame 44 (global f179)
  const clickLocal = 44;
  const buttonScale = interpolate(
    frame,
    [clickLocal, clickLocal + 2, clickLocal + 6],
    [1, 0.92, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const executed = frame >= clickLocal + 3;

  return (
    <BlurVignetteScene durationInFrames={70} fadeInFrames={7} fadeOutFrames={9}>
      <div
        style={{
          position: 'absolute',
          top: 430,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <ElevatedCard dark width={880} padding={0} borderRadius={22}>
          {/* macOS header bar */}
          <div
            style={{
              height: 52,
              backgroundColor: '#232327',
              borderBottom: '1px solid #323238',
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 22px',
            }}
          >
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: 99, backgroundColor: '#FF5F56' }} />
              <div style={{ width: 14, height: 14, borderRadius: 99, backgroundColor: '#FFBD2E' }} />
              <div style={{ width: 14, height: 14, borderRadius: 99, backgroundColor: '#27C93F' }} />
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 20,
                color: '#9CA3AF',
              }}
            >
              zsh — ~/workspace
            </span>
            <div style={{ width: 52 }} />
          </div>

          <div style={{ padding: '34px 36px 38px' }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 27,
                lineHeight: 1.5,
                color: '#F3F4F6',
                minHeight: 96,
              }}
            >
              <span style={{ color: '#3ECF8E', marginRight: 12 }}>$</span>
              <span>{typed}</span>
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 28,
                  backgroundColor: cursorBlink ? '#3ECF8E' : 'transparent',
                  verticalAlign: 'middle',
                  marginLeft: 4,
                }}
              />
            </div>

            <div
              style={{
                marginTop: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: executed ? '#3ECF8E' : '#94A3B8',
                }}
              >
                {executed ? '✓ Skill installed & active' : '• Ready to install'}
              </div>

              <div
                style={{
                  transform: `scale(${buttonScale.toFixed(3)})`,
                  backgroundColor: executed ? '#10B981' : '#2563EB',
                  color: '#FFFFFF',
                  fontSize: 24,
                  fontWeight: 700,
                  padding: '14px 30px',
                  borderRadius: 14,
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.32)',
                }}
              >
                {executed ? 'Activated ✓' : 'Run Install'}
              </div>
            </div>
          </div>
        </ElevatedCard>
      </div>

      {/* Cursor glides to the bottom-right Run Install button */}
      <CursorClickOverlay
        from={[640, 960]}
        to={[825, 692]}
        moveStartFrame={18}
        clickFrame={clickLocal}
      />

      <KineticSentence
        top={1060}
        fontSize={52}
        words={[
          { text: 'No', startFrame: 6, bold: true },
          { text: 'timeline', startFrame: 11 },
          { text: 'tweaking.', startFrame: 16 },
          { text: 'No', startFrame: 26, bold: true },
          { text: 'manual', startFrame: 31 },
          { text: 'keyframes.', startFrame: 37, pill: true, bold: true },
        ]}
      />
    </BlurVignetteScene>
  );
};

/** Shot 4 (205..290f): Orthogonal Node-Wire Graph + Staggered Coral Sparkle Checklist. */
const NodeWorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const wireDraw = interpolate(frame, [8, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const nodes = [
    { label: 'UI System', x: 140, color: '#2563EB', delay: 14 },
    { label: 'Motion', x: 430, color: '#CF6E57', delay: 18 },
    { label: 'Audio -2f', x: 720, color: '#10B981', delay: 22 },
  ];

  const bullets = [
    { text: 'Clean #F2F2F2 studio grid', start: 26 },
    { text: 'Snappy f+2 spring motion curves', start: 40 },
    { text: 'Pre-lapped -2f audio & SFX sync', start: 54 },
  ];

  return (
    <BlurVignetteScene durationInFrames={85} fadeInFrames={7} fadeOutFrames={9}>
      {/* Hub-to-3 orthogonal diagram (y: 380..760) */}
      <div style={{ position: 'absolute', top: 380, left: 0, right: 0, height: 390 }}>
        {/* SVG Orthogonal Elbow Wires */}
        <svg
          width="1080"
          height="390"
          style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        >
          {[250, 540, 830].map((targetX, i) => {
            const path =
              targetX === 540
                ? `M 540 112 L 540 230`
                : `M 540 112 L 540 165 L ${targetX} 165 L ${targetX} 230`;
            return (
              <path
                key={i}
                d={path}
                fill="none"
                stroke="#2563EB"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - wireDraw}
                opacity={0.85}
              />
            );
          })}
        </svg>

        {/* Hub Pill */}
        <div style={{ position: 'absolute', top: 24, left: 340 }}>
          <ElevatedCard width={400} padding={18} borderRadius={20} drift={false}>
            <div style={{ textAlign: 'center', fontSize: 30, fontWeight: 700, color: '#141416' }}>
              Claude Code Prompt
            </div>
          </ElevatedCard>
        </div>

        {/* 3 Target Node Squircle Cards */}
        {nodes.map((node, i) => {
          const hit = frame >= node.delay;
          return (
            <div key={i} style={{ position: 'absolute', top: 230, left: node.x }}>
              <ElevatedCard enterFrame={6 + i * 4} width={220} padding={18} borderRadius={20}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: hit ? node.color : '#E4E4E7',
                    margin: '0 auto 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  ✓
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: 25,
                    fontWeight: 700,
                    color: '#161921',
                  }}
                >
                  {node.label}
                </div>
              </ElevatedCard>
            </div>
          );
        })}
      </div>

      {/* Staggered Coral Sparkle Checklist */}
      <div
        style={{
          position: 'absolute',
          top: 880,
          left: 140,
          right: 140,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {bullets.map((b, i) => {
          const t = interpolate(frame - b.start, [0, 7], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const dy = interpolate(t, [0, 1], [18, 0]);
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                opacity: t,
                transform: `translateY(${dy.toFixed(2)}px)`,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E4E7',
                borderRadius: 18,
                padding: '22px 28px',
                boxShadow: '0 12px 26px -8px rgba(18,22,34,0.10)',
              }}
            >
              <span style={{ fontSize: 34, color: '#CF6E57', fontWeight: 800 }}>✦</span>
              <span style={{ fontSize: 36, fontWeight: 600, color: '#161921' }}>{b.text}</span>
            </div>
          );
        })}
      </div>
    </BlurVignetteScene>
  );
};

/** Shot 5 (290..350f): Progress Gauge Contrast (1% -> 99% Automated). */
const MetricGaugeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pct = Math.round(
    interpolate(frame, [4, 34], [1, 99], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    })
  );
  const radius = 128;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <BlurVignetteScene durationInFrames={60} fadeInFrames={7} fadeOutFrames={9}>
      <div
        style={{
          position: 'absolute',
          top: 420,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <ElevatedCard width={820} padding={42} borderRadius={26}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            {/* Circular Gauge Ring */}
            <div style={{ position: 'relative', width: 300, height: 300 }}>
              <svg width="300" height="300" viewBox="0 0 300 300">
                <circle
                  cx="150"
                  cy="150"
                  r={radius}
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="22"
                />
                <circle
                  cx="150"
                  cy="150"
                  r={radius}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="22"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 150 150)"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 72, fontWeight: 800, color: '#141416' }}>{pct}%</span>
                <span style={{ fontSize: 22, fontWeight: 600, color: '#10B981' }}>AUTOMATED</span>
              </div>
            </div>

            {/* Contrast Receipt Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div
                style={{
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  padding: '14px 22px',
                  borderRadius: 14,
                  fontSize: 28,
                  fontWeight: 700,
                  textDecoration: 'line-through',
                }}
              >
                12 hrs manual edit
              </div>
              <div
                style={{
                  backgroundColor: '#070B16',
                  color: '#FFFFFF',
                  padding: '16px 24px',
                  borderRadius: 14,
                  fontSize: 32,
                  fontWeight: 800,
                }}
              >
                60 sec render ✓
              </div>
            </div>
          </div>
        </ElevatedCard>
      </div>

      <KineticSentence
        top={1060}
        fontSize={54}
        words={[
          { text: 'Your', startFrame: 4 },
          { text: 'personal', startFrame: 8 },
          { text: 'motion', startFrame: 13, pill: true, bold: true },
          { text: 'studio', startFrame: 18, pill: true, bold: true },
          { text: 'in', startFrame: 24 },
          { text: 'seconds.', startFrame: 28, bold: true, underline: true },
        ]}
      />
    </BlurVignetteScene>
  );
};

/** Shot 6 (350..420f): Signature Comment Keyword + Hardcover Guide & Follower Gate Outro. */
const FollowerOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bookSpring = spring({
    fps,
    frame,
    config: { damping: 16, stiffness: 195, mass: 0.8 },
  });
  const tilt = interpolate(bookSpring, [0, 1], [-8, -2]);
  const scale = interpolate(bookSpring, [0, 1], [0.9, 1]);

  return (
    <BlurVignetteScene durationInFrames={70} fadeInFrames={7} fadeOutFrames={0}>
      <div
        style={{
          position: 'absolute',
          top: 410,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${scale.toFixed(4)}) rotate(${tilt.toFixed(2)}deg)`,
        }}
      >
        {/* Minimalist Hardcover Guide Mockup */}
        <div
          style={{
            width: 560,
            padding: '44px 40px',
            borderRadius: 24,
            backgroundColor: '#FFFFFF',
            border: '2px solid #18181B',
            boxShadow: '18px 24px 0px #18181B, 0 28px 56px rgba(0,0,0,0.16)',
            textAlign: 'center',
          }}
        >
          {/* Matte-black crowned emblem */}
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: 18,
              backgroundColor: '#141416',
              color: '#FFFFFF',
              margin: '0 auto 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 38,
              fontWeight: 800,
            }}
          >
            ♛
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#CF6E57',
              marginBottom: 10,
            }}
          >
            INSIDERFORCE PLAYBOOK
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, color: '#141416' }}>
            4 COMPLETE CLAUDE SKILLS
          </div>
          <div
            style={{
              marginTop: 26,
              display: 'inline-block',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontSize: 28,
              fontWeight: 800,
              padding: '14px 32px',
              borderRadius: 999,
            }}
          >
            COMMENT “SKILLS”
          </div>
        </div>
      </div>

      {frame < 36 ? (
        <KineticSentence
          top={1065}
          fontSize={56}
          words={[
            { text: 'Comment', startFrame: 3 },
            { text: 'SKILLS', startFrame: 8, pill: true, bold: true },
            { text: 'for', startFrame: 14 },
            { text: 'the', startFrame: 17 },
            { text: 'setup.', startFrame: 21, bold: true },
          ]}
        />
      ) : (
        <KineticSentence
          top={1065}
          fontSize={52}
          words={[
            { text: 'Make', startFrame: 36 },
            { text: 'sure', startFrame: 39 },
            { text: 'you', startFrame: 42 },
            { text: 'follow', startFrame: 45, bold: true },
            { text: 'InsiderForce.', startFrame: 49, bold: true, underline: true },
          ]}
        />
      )}
    </BlurVignetteScene>
  );
};

export const InsiderForceDemoShort: React.FC = () => {
  const frame = useCurrentFrame();
  const isOutro = frame >= 350;

  // Frame-accurate SFX cue timestamps (all pre-lapped -2f / -1f!)
  const whooshCues = [73, 133, 203, 288, 348];
  const wordPopCues = [26, 231, 245, 259, 307, 357];

  return (
    <StudioCanvas
      backgroundColor={isOutro ? '#ECECEC' : '#F2F2F2'}
      gridType="dots"
      watermark="insiderforce.io"
    >
      {/* Continuous 93 BPM ambient tech bed (-13dB headroom beneath speech) */}
      <Audio src={staticFile('audio/music_bed_93bpm.wav')} volume={0.18} loop />

      {/* Frame 0 Hook Slam SFX */}
      <Sequence from={0} durationInFrames={16}>
        <Audio src={staticFile('audio/sub_thud.wav')} volume={0.38} />
      </Sequence>
      <Sequence from={0} durationInFrames={16}>
        <Audio src={staticFile('audio/whoosh_soft.wav')} volume={0.28} />
      </Sequence>

      {/* Pre-lapped -2f Blur-Dissolve Whooshes */}
      {whooshCues.map((c) => (
        <Sequence key={`w-${c}`} from={c} durationInFrames={18}>
          <Audio src={staticFile('audio/whoosh_transition.wav')} volume={0.32} />
        </Sequence>
      ))}

      {/* Crisp Word Pops & Bullet Reveals */}
      {wordPopCues.map((c) => (
        <Sequence key={`p-${c}`} from={c} durationInFrames={8}>
          <Audio src={staticFile('audio/word_pop.wav')} volume={0.26} />
        </Sequence>
      ))}

      {/* Terminal Click SFX (-1f pre-lap for f179 click) */}
      <Sequence from={178} durationInFrames={8}>
        <Audio src={staticFile('audio/click_crisp.wav')} volume={0.44} />
      </Sequence>

      {/* Node Wire Connect & CTA Chimes */}
      <Sequence from={226} durationInFrames={22}>
        <Audio src={staticFile('audio/chime_reveal.wav')} volume={0.28} />
      </Sequence>
      <Sequence from={352} durationInFrames={22}>
        <Audio src={staticFile('audio/sub_thud.wav')} volume={0.34} />
      </Sequence>
      <Sequence from={353} durationInFrames={24}>
        <Audio src={staticFile('audio/chime_reveal.wav')} volume={0.30} />
      </Sequence>

      {/* Visual Scenes */}
      <Sequence from={0} durationInFrames={75}>
        <HookScene />
      </Sequence>
      <Sequence from={75} durationInFrames={60}>
        <LiveWebBridgeScene />
      </Sequence>
      <Sequence from={135} durationInFrames={70}>
        <TerminalClickScene />
      </Sequence>
      <Sequence from={205} durationInFrames={85}>
        <NodeWorkflowScene />
      </Sequence>
      <Sequence from={290} durationInFrames={60}>
        <MetricGaugeScene />
      </Sequence>
      <Sequence from={350} durationInFrames={70}>
        <FollowerOutroScene />
      </Sequence>
    </StudioCanvas>
  );
};
