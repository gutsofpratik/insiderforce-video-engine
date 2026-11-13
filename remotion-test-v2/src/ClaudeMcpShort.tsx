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
  RealIconBulletRow,
  StudioCanvas,
} from './Primitives';

function velocityBlurY(curY: number, prevY: number, factor = 0.55, cap = 9): number {
  return Math.min(cap, Math.abs(curY - prevY) * factor);
}

/** Shot 1 (0..118f): Cold start -> Floating 3D official Claude/GitHub medallions + synced Hook. */
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const springCfg = { damping: 16, stiffness: 205, mass: 0.78 };
  const claudeSpring = spring({ fps, frame: Math.max(0, frame - 2), config: springCfg });
  const claudePrev = spring({ fps, frame: Math.max(0, frame - 3), config: springCfg });
  const githubSpring = spring({ fps, frame: Math.max(0, frame - 10), config: springCfg });
  const githubPrev = spring({ fps, frame: Math.max(0, frame - 11), config: springCfg });

  const claudeY = interpolate(claudeSpring, [0, 1], [48, 0]);
  const claudeYPrev = interpolate(claudePrev, [0, 1], [48, 0]);
  const githubY = interpolate(githubSpring, [0, 1], [48, 0]);
  const githubYPrev = interpolate(githubPrev, [0, 1], [48, 0]);

  const claudeBlurY = frame >= 2 && frame < 14 ? velocityBlurY(claudeY, claudeYPrev) : 0;
  const githubBlurY = frame >= 10 && frame < 22 ? velocityBlurY(githubY, githubYPrev) : 0;

  const claudeFloatY = Math.sin(frame * 0.08) * 6;
  const githubFloatY = Math.cos(frame * 0.075) * 6;

  // Subtle connecting pulse between two medallions before MCP replaces copy-paste
  const arcDraw = interpolate(frame, [16, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <BlurVignetteScene durationInFrames={117} fadeInFrames={4} fadeOutFrames={7} exitMode="lens-blur">
      <AbsoluteFill>
        {/* Minimal floating real medallion pair in upper-mid composition */}
        <div
          style={{
            position: 'absolute',
            top: 410,
            left: 140,
            width: 800,
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 170,
          }}
        >
          <svg
            width={220}
            height={60}
            viewBox="0 0 220 60"
            style={{ position: 'absolute', left: 290, top: 120 }}
          >
            <path
              d="M 10 30 L 210 30"
              fill="none"
              stroke="#B4B6C0"
              strokeWidth={2.5}
              strokeDasharray="6 7"
              pathLength={1}
              strokeDashoffset={1 - arcDraw}
            />
          </svg>

          <DirectionalMotionBlur blurY={claudeBlurY}>
            <div
              style={{
                transform: `translateY(${(claudeY + claudeFloatY).toFixed(2)}px) scale(${interpolate(claudeSpring, [0, 1], [0.84, 1]).toFixed(4)})`,
                opacity: claudeSpring,
              }}
            >
              <Img
                src={staticFile('assets/puck_claude.png')}
                style={{ width: 196, height: 196, objectFit: 'contain' }}
              />
            </div>
          </DirectionalMotionBlur>

          <DirectionalMotionBlur blurY={githubBlurY}>
            <div
              style={{
                transform: `translateY(${(githubY + githubFloatY).toFixed(2)}px) scale(${interpolate(githubSpring, [0, 1], [0.84, 1]).toFixed(4)})`,
                opacity: githubSpring,
              }}
            >
              <Img
                src={staticFile('assets/puck_github.png')}
                style={{ width: 196, height: 196, objectFit: 'contain' }}
              />
            </div>
          </DirectionalMotionBlur>
        </div>

        {/* Exact voice-synced kinetic hook typography */}
        <KineticWordFlow
          top={810}
          maxWidth={850}
          baseSize={58}
          words={[
            { text: 'Most', startFrame: 1, weight: 'medium' },
            { text: 'developers', startFrame: 8, weight: 'medium' },
            { text: 'still', startFrame: 18, weight: 'medium', lineBreakAfter: true },
            { text: 'copy', startFrame: 28, weight: 'bold' },
            { text: 'and', startFrame: 39, weight: 'regular', muted: true },
            { text: 'paste', startFrame: 45, weight: 'bold' },
            { text: 'code', startFrame: 55, weight: 'medium', lineBreakAfter: true },
            { text: 'into', startFrame: 66, weight: 'regular', muted: true },
            { text: 'Claude', startFrame: 74, weight: 'heavy', size: 68, underline: true },
            { text: 'Code.', startFrame: 84, weight: 'heavy', italic: true, size: 68 },
          ]}
        />
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/** Shot 2 (112..182f): Pure Typographic Breather (47.4% real channel pacing). */
const BreatherTypoScene: React.FC = () => {
  // Local frames 0..68 align with global 111..179
  return (
    <BlurVignetteScene durationInFrames={68} fadeInFrames={7} fadeOutFrames={7} enterMode="lens-blur" exitMode="slide-up">
      <AbsoluteFill>
        <KineticWordFlow
          top={730}
          maxWidth={880}
          baseSize={54}
          words={[
            { text: 'Now', startFrame: 1, weight: 'regular', muted: true, size: 42 },
            { text: 'instead', startFrame: 5, weight: 'regular', muted: true, size: 42 },
            { text: 'of', startFrame: 8, weight: 'regular', muted: true, size: 42, lineBreakAfter: true },
            { text: 'switching', startFrame: 11, weight: 'heavy', size: 70 },
            { text: 'twenty', startFrame: 22, weight: 'heavy', size: 70, lineBreakAfter: true },
            { text: 'tabs', startFrame: 30, weight: 'heavy', size: 74 },
            { text: 'by', startFrame: 39, weight: 'medium', italic: true, size: 68 },
            { text: 'hand', startFrame: 43, weight: 'heavy', italic: true, size: 74, underline: true },
          ]}
        />
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/** Shot 3 (174..314f): Official 3D Medallion Hub + Orthogonal Graph + Real GitHub Screenshot. */
const McpGraphScene: React.FC = () => {
  const frame = useCurrentFrame(); // Local 0..140 -> global 174..314
  const { fps } = useVideoConfig();

  const nodeCfg = { damping: 16, stiffness: 225, mass: 0.75 };
  const claudeIn = spring({ fps, frame: Math.max(0, frame - 8), config: { damping: 18, stiffness: 220 } });
  const githubIn = spring({ fps, frame: Math.max(0, frame - 40), config: nodeCfg });
  const githubPrev = spring({ fps, frame: Math.max(0, frame - 41), config: nodeCfg });
  const supaIn = spring({ fps, frame: Math.max(0, frame - 61), config: nodeCfg });
  const supaPrev = spring({ fps, frame: Math.max(0, frame - 62), config: nodeCfg });
  const vercelIn = spring({ fps, frame: Math.max(0, frame - 94), config: nodeCfg });
  const vercelPrev = spring({ fps, frame: Math.max(0, frame - 95), config: nodeCfg });

  const wire1 = interpolate(frame, [34, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const wire2 = interpolate(frame, [55, 68], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const wire3 = interpolate(frame, [88, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const shotY = interpolate(githubIn, [0, 1], [44, 0]);
  const shotYPrev = interpolate(githubPrev, [0, 1], [44, 0]);
  const shotBlurY = frame >= 40 && frame < 52 ? velocityBlurY(shotY, shotYPrev) : 0;

  return (
    <BlurVignetteScene durationInFrames={140} fadeInFrames={7} fadeOutFrames={7} enterMode="slide-up" exitMode="lens-blur">
      <AbsoluteFill>
        {/* Top half: Claude Hub -> GitHub, Supabase, Vercel real 3D medallions */}
        <div
          style={{
            position: 'absolute',
            top: 255,
            left: 90,
            width: 900,
            height: 360,
          }}
        >
          <svg
            width={900}
            height={360}
            viewBox="0 0 900 360"
            style={{ position: 'absolute', inset: 0 }}
          >
            {/* Orthogonal bus lines matching minimalist engineering blueprints */}
            <path
              d="M 450 135 L 450 175 L 185 175 L 185 215"
              fill="none"
              stroke="#9EA2AE"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - wire1}
            />
            <path
              d="M 450 135 L 450 215"
              fill="none"
              stroke="#9EA2AE"
              strokeWidth={2.6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - wire2}
            />
            <path
              d="M 450 135 L 450 175 L 715 175 L 715 215"
              fill="none"
              stroke="#9EA2AE"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - wire3}
            />
          </svg>

          {/* Claude Top Center */}
          <div
            style={{
              position: 'absolute',
              left: 374,
              top: 0,
              transform: `scale(${interpolate(claudeIn, [0, 1], [0.78, 1]).toFixed(4)})`,
              opacity: claudeIn,
            }}
          >
            <Img src={staticFile('assets/puck_claude.png')} style={{ width: 152, height: 152 }} />
          </div>

          {/* Target Official Nodes with velocity directional blur */}
          {[
            { left: 109, s: githubIn, sp: githubPrev, start: 40, file: 'assets/puck_github.png' },
            { left: 374, s: supaIn, sp: supaPrev, start: 61, file: 'assets/puck_supabase.png' },
            { left: 639, s: vercelIn, sp: vercelPrev, start: 94, file: 'assets/puck_vercel.png' },
          ].map((node, i) => {
            const ny = interpolate(node.s, [0, 1], [30, 0]);
            const nyPrev = interpolate(node.sp, [0, 1], [30, 0]);
            const nBlurY = frame >= node.start && frame < node.start + 10 ? velocityBlurY(ny, nyPrev) : 0;
            return (
              <div key={i} style={{ position: 'absolute', left: node.left, top: 196 }}>
                <DirectionalMotionBlur blurY={nBlurY}>
                  <div
                    style={{
                      transform: `translateY(${ny.toFixed(2)}px) scale(${interpolate(node.s, [0, 1], [0.8, 1]).toFixed(4)})`,
                      opacity: node.s,
                    }}
                  >
                    <Img src={staticFile(node.file)} style={{ width: 152, height: 152 }} />
                  </div>
                </DirectionalMotionBlur>
              </div>
            );
          })}
        </div>

        {/* Real Tight GitHub MCP Repo Screenshot Framed Cleanly Below Hub (single pre-beveled capture) */}
        <div style={{ position: 'absolute', top: 605, left: 120, width: 840 }}>
          <DirectionalMotionBlur blurY={shotBlurY}>
            <div
              style={{
                width: 840,
                opacity: interpolate(frame, [38, 43], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                transform: `translateY(${shotY.toFixed(2)}px) scale(${interpolate(githubIn, [0, 1], [0.94, 1]).toFixed(4)})`,
              }}
            >
              <Img
                src={staticFile('assets/real_github_mcp.png')}
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </DirectionalMotionBlur>
        </div>

        {/* Synced Voice Captions */}
        <KineticWordFlow
          top={1210}
          maxWidth={880}
          baseSize={48}
          words={[
            { text: 'you', startFrame: 3, weight: 'regular', muted: true },
            { text: 'can', startFrame: 5, weight: 'regular', muted: true },
            { text: 'connect', startFrame: 8, weight: 'bold' },
            { text: 'Claude', startFrame: 16, weight: 'heavy' },
            { text: 'directly', startFrame: 26, weight: 'medium', lineBreakAfter: true },
            { text: 'to', startFrame: 38, weight: 'regular', muted: true },
            { text: 'GitHub,', startFrame: 42, weight: 'heavy', underline: true },
            { text: 'Supabase,', startFrame: 63, weight: 'heavy', underline: true },
            { text: 'and', startFrame: 92, weight: 'regular', muted: true },
            { text: 'Vercel', startFrame: 96, weight: 'heavy', underline: true, lineBreakAfter: true },
            { text: 'with', startFrame: 109, weight: 'regular', muted: true },
            { text: 'one', startFrame: 113, weight: 'bold', italic: true },
            { text: 'command.', startFrame: 119, weight: 'heavy', italic: true },
          ]}
        />
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/** Shot 4 (308..412f): REAL Recorded Terminal Video Footage + Synced Action Caption. */
const TerminalFootageScene: React.FC = () => {
  // Local 0..102 -> global 307..409
  return (
    <BlurVignetteScene durationInFrames={102} fadeInFrames={7} fadeOutFrames={7} enterMode="lens-blur" exitMode="slide-up">
      <AbsoluteFill>
        {/* Minimal pill tag above footage frame */}
        <div
          style={{
            position: 'absolute',
            top: 382,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 20px',
              borderRadius: 999,
              backgroundColor: '#FFFFFF',
              border: '1px solid #DFDFE6',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: '#3F3F46',
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: 999,
                backgroundColor: '#22C55E',
              }}
            />
            CLAUDE CODE CLI
          </div>
        </div>

        <div style={{ position: 'absolute', top: 448, left: 95 }}>
          <BeveledMediaFrame enterFrame={2} width={890} borderWidth={11} borderRadius={26}>
            <OffthreadVideo
              src={staticFile('footage/real_cli_session.mp4')}
              startFrom={24}
              muted
              style={{ width: '100%', display: 'block' }}
            />
          </BeveledMediaFrame>
        </div>

        <KineticWordFlow
          top={1135}
          maxWidth={860}
          baseSize={54}
          words={[
            { text: 'It', startFrame: 8, weight: 'regular', muted: true },
            { text: 'pulls', startFrame: 11, weight: 'bold' },
            { text: 'live', startFrame: 20, weight: 'heavy', italic: true },
            { text: 'issues,', startFrame: 35, weight: 'heavy', underline: true, lineBreakAfter: true },
            { text: 'updates', startFrame: 57, weight: 'bold' },
            { text: 'your', startFrame: 68, weight: 'regular', muted: true },
            { text: 'database,', startFrame: 72, weight: 'heavy' },
          ]}
        />
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/** Shot 5 (404..486f): REAL Live Website Scroll MP4 + Tactile Cursor Click. */
const LiveDocsFootageScene: React.FC = () => {
  // Local 0..80 -> global 403..483
  return (
    <BlurVignetteScene durationInFrames={80} fadeInFrames={7} fadeOutFrames={7} enterMode="slide-up" exitMode="lens-blur">
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            top: 382,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              backgroundColor: '#FFFFFF',
              border: '1px solid #DFDFE6',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '0.02em',
              color: '#3F3F46',
            }}
          >
            modelcontextprotocol.io
          </div>
        </div>

        <div style={{ position: 'absolute', top: 448, left: 95 }}>
          <BeveledMediaFrame enterFrame={2} width={890} borderWidth={11} borderRadius={26}>
            <OffthreadVideo
              src={staticFile('footage/real_mcp_scroll.mp4')}
              startFrom={18}
              muted
              style={{ width: '100%', display: 'block' }}
            />
          </BeveledMediaFrame>
        </div>

        <CursorClickOverlay
          from={[690, 790]}
          to={[525, 675]}
          moveStartFrame={12}
          clickFrame={31}
        />

        <KineticWordFlow
          top={1145}
          maxWidth={860}
          baseSize={54}
          words={[
            { text: 'and', startFrame: 1, weight: 'regular', muted: true },
            { text: 'ships', startFrame: 5, weight: 'bold' },
            { text: 'straight', startFrame: 15, weight: 'bold' },
            { text: 'to', startFrame: 27, weight: 'regular', muted: true, lineBreakAfter: true },
            { text: 'production', startFrame: 31, weight: 'heavy', size: 64 },
            { text: 'automatically.', startFrame: 48, weight: 'heavy', italic: true, size: 64, underline: true },
          ]}
        />
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/** Shot 6 (478..576f): Official Vector Icon Bullet Stack + Bold Statement. */
const RealIconChecklistScene: React.FC = () => {
  // Local 0..96 -> global 477..573
  return (
    <BlurVignetteScene durationInFrames={96} fadeInFrames={7} fadeOutFrames={7} enterMode="lens-blur" exitMode="lens-blur">
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            top: 495,
            left: 195,
            width: 690,
            display: 'flex',
            flexDirection: 'column',
            gap: 34,
          }}
        >
          <RealIconBulletRow
            iconSrc={staticFile('assets/icon_github.png')}
            label="Live GitHub issue sync"
            startFrame={4}
          />
          <RealIconBulletRow
            iconSrc={staticFile('assets/icon_supabase.png')}
            label="Direct Supabase migrations"
            startFrame={24}
          />
          <RealIconBulletRow
            iconSrc={staticFile('assets/icon_vercel.png')}
            label="Instant Vercel deploys"
            startFrame={42}
          />
        </div>

        <KineticWordFlow
          top={960}
          maxWidth={860}
          baseSize={64}
          words={[
            { text: 'Zero', startFrame: 3, weight: 'heavy', size: 68 },
            { text: 'glue', startFrame: 13, weight: 'bold', italic: true, size: 68 },
            { text: 'code.', startFrame: 22, weight: 'heavy', size: 68, lineBreakAfter: true },
            { text: 'Zero', startFrame: 43, weight: 'heavy', size: 68 },
            { text: 'manual', startFrame: 58, weight: 'bold', italic: true, size: 68 },
            { text: 'setup.', startFrame: 72, weight: 'heavy', size: 68, underline: true },
          ]}
        />
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/** Shot 7 (568..750f): Real 3D Playbook Book Mockup CTA + InsiderForce Lockup. */
const OutroCtaScene: React.FC = () => {
  const frame = useCurrentFrame(); // Local 0..182 -> global 568..750
  const { fps } = useVideoConfig();

  const bookCfg = { damping: 16, stiffness: 195, mass: 0.82 };
  const bookSpring = spring({ fps, frame: Math.max(0, frame - 4), config: bookCfg });
  const bookPrev = spring({ fps, frame: Math.max(0, frame - 5), config: bookCfg });
  const bookBaseY = interpolate(bookSpring, [0, 1], [62, 0]);
  const bookBasePrev = interpolate(bookPrev, [0, 1], [62, 0]);
  const bookBlurY = frame >= 4 && frame < 16 ? velocityBlurY(bookBaseY, bookBasePrev) : 0;
  const bookY = bookBaseY + Math.sin(frame * 0.06) * 5;
  const bookScale = interpolate(bookSpring, [0, 1], [0.88, 1]);

  // Subtle upward transition around f98 ("Make sure you follow InsiderForce")
  const lockupIn = spring({
    fps,
    frame: Math.max(0, frame - 98),
    config: { damping: 18, stiffness: 210 },
  });
  const lockupPrev = spring({
    fps,
    frame: Math.max(0, frame - 99),
    config: { damping: 18, stiffness: 210 },
  });
  const lockupY = interpolate(lockupIn, [0, 1], [28, 0]);
  const lockupYPrev = interpolate(lockupPrev, [0, 1], [28, 0]);
  const lockupBlurY = frame >= 98 && frame < 108 ? velocityBlurY(lockupY, lockupYPrev) : 0;

  const bookFade = interpolate(frame, [92, 102], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <BlurVignetteScene durationInFrames={183} fadeInFrames={7} fadeOutFrames={10} enterMode="lens-blur" exitMode="lens-blur">
      <AbsoluteFill>
        {/* Phase A: 3D Playbook CTA (0..102f local) */}
        {bookFade > 0.01 ? (
          <AbsoluteFill style={{ opacity: bookFade }}>
            <div style={{ position: 'absolute', top: 345, width: '100%' }}>
              <DirectionalMotionBlur blurY={bookBlurY}>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    transform: `translateY(${bookY.toFixed(2)}px) scale(${bookScale.toFixed(4)})`,
                  }}
                >
                  <Img
                    src={staticFile('assets/real_mcp_book.png')}
                    style={{ height: 590, objectFit: 'contain' }}
                  />
                </div>
              </DirectionalMotionBlur>
            </div>

            <KineticWordFlow
              top={1030}
              maxWidth={860}
              baseSize={52}
              words={[
                { text: 'Comment', startFrame: 4, weight: 'bold', size: 60 },
                { text: '"MCP"', startFrame: 12, weight: 'heavy', italic: true, size: 62, highlightPill: true, lineBreakAfter: true },
                { text: 'and', startFrame: 35, weight: 'regular', muted: true },
                { text: 'I’ll', startFrame: 42, weight: 'regular', muted: true },
                { text: 'send', startFrame: 47, weight: 'medium' },
                { text: 'you', startFrame: 55, weight: 'medium' },
                { text: 'the', startFrame: 58, weight: 'regular', muted: true, lineBreakAfter: true },
                { text: 'exact', startFrame: 60, weight: 'bold' },
                { text: 'setup', startFrame: 71, weight: 'bold' },
                { text: 'guide.', startFrame: 80, weight: 'heavy', italic: true },
              ]}
            />
          </AbsoluteFill>
        ) : null}

        {/* Phase B: Clean Studio Follow End-Card (98..182f local) */}
        {frame >= 96 ? (
          <AbsoluteFill style={{ opacity: lockupIn }}>
            <DirectionalMotionBlur blurY={lockupBlurY}>
              <div
                style={{
                  width: 1080,
                  height: 1920,
                  transform: `translateY(${lockupY.toFixed(2)}px) scale(${interpolate(lockupIn, [0, 1], [0.95, 1]).toFixed(4)})`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: 150,
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: '18px 34px',
                    borderRadius: 999,
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #DCDEE6',
                    boxShadow: '12px 18px 38px rgba(16, 18, 28, 0.14)',
                    marginBottom: 42,
                  }}
                >
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 999,
                      backgroundColor: '#111216',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Img src={staticFile('assets/icon_claude.png')} style={{ width: 28, height: 28 }} />
                  </div>
                  <span
                    style={{
                      fontFamily: INTER_FONT,
                      fontSize: 38,
                      fontWeight: 700,
                      letterSpacing: '-0.04em',
                      color: '#141416',
                    }}
                  >
                    InsiderForce
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: INTER_FONT,
                    fontSize: 44,
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    color: '#52525B',
                  }}
                >
                  Make sure you follow
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: INTER_ITALIC_FONT,
                    fontStyle: 'italic',
                    fontSize: 74,
                    fontWeight: 700,
                    letterSpacing: '-0.05em',
                    color: '#141416',
                  }}
                >
                  InsiderForce
                </div>
              </div>
            </DirectionalMotionBlur>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

export const ClaudeMcpShort: React.FC = () => {
  const frame = useCurrentFrame();

  // Dynamic voice-aware music ducking matching InsiderForce's measured 5-band -29..-31 dB floor
  // Ducks subtly down to ~0.46 during dense speech and breathes up cleanly in cut transitions & outro
  const musicVol = interpolate(
    frame,
    [0, 8, 16, 108, 116, 122, 304, 312, 320, 564, 574, 586, 706, 722, 742, 750],
    [0.54, 0.56, 0.48, 0.48, 0.58, 0.48, 0.48, 0.58, 0.48, 0.48, 0.58, 0.48, 0.48, 0.62, 0.25, 0.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Authentic ~125 events/min stereo SFX density pre-lapped -2 frames on transitions & spoken punches
  const sfxCues: Array<{ from: number; file: string; volume: number }> = [
    // Shot 1 (0..118f): Hook entrance + copy/paste/Claude Code punches
    { from: 0, file: 'audio/whoosh_wipe.wav', volume: 0.72 },
    { from: 1, file: 'audio/pop_woody.wav', volume: 0.58 },
    { from: 8, file: 'audio/pop_woody.wav', volume: 0.58 },
    { from: 26, file: 'audio/text_tick.wav', volume: 0.42 },
    { from: 43, file: 'audio/text_tick.wav', volume: 0.40 },
    { from: 72, file: 'audio/sub_impact.wav', volume: 0.78 },
    { from: 82, file: 'audio/text_tick.wav', volume: 0.48 },
    { from: 83, file: 'audio/chime_warm.wav', volume: 0.44 },

    // Shot 2 (112..182f): Switching 20 tabs by hand
    { from: 110, file: 'audio/whoosh_wipe.wav', volume: 0.78 },
    { from: 121, file: 'audio/text_tick.wav', volume: 0.44 },
    { from: 132, file: 'audio/text_tick.wav', volume: 0.46 },
    { from: 140, file: 'audio/text_tick.wav', volume: 0.48 },
    { from: 153, file: 'audio/sub_impact.wav', volume: 0.72 },
    { from: 154, file: 'audio/whoosh_air.wav', volume: 0.52 },

    // Shot 3 (174..314f): Orthogonal graph nodes + tight GitHub MCP repo card
    { from: 172, file: 'audio/whoosh_wipe.wav', volume: 0.80 },
    { from: 180, file: 'audio/pop_woody.wav', volume: 0.62 },
    { from: 198, file: 'audio/text_tick.wav', volume: 0.40 },
    { from: 212, file: 'audio/whoosh_air.wav', volume: 0.58 },
    { from: 214, file: 'audio/pop_woody.wav', volume: 0.68 },
    { from: 235, file: 'audio/pop_woody.wav', volume: 0.68 },
    { from: 268, file: 'audio/pop_woody.wav', volume: 0.68 },
    { from: 285, file: 'audio/text_tick.wav', volume: 0.44 },
    { from: 291, file: 'audio/sub_impact.wav', volume: 0.74 },

    // Shot 4 (308..412f): Real CLI session recording
    { from: 306, file: 'audio/whoosh_wipe.wav', volume: 0.82 },
    { from: 309, file: 'audio/sub_impact.wav', volume: 0.72 },
    { from: 317, file: 'audio/text_tick.wav', volume: 0.44 },
    { from: 326, file: 'audio/text_tick.wav', volume: 0.46 },
    { from: 341, file: 'audio/click_tactile.wav', volume: 0.68 },
    { from: 363, file: 'audio/text_tick.wav', volume: 0.44 },
    { from: 378, file: 'audio/sub_impact.wav', volume: 0.74 },

    // Shot 5 (404..486f): Live Docs scroll MP4 + mouse click
    { from: 402, file: 'audio/whoosh_air.wav', volume: 0.74 },
    { from: 407, file: 'audio/text_tick.wav', volume: 0.42 },
    { from: 417, file: 'audio/text_tick.wav', volume: 0.44 },
    { from: 433, file: 'audio/click_tactile.wav', volume: 0.82 },
    { from: 435, file: 'audio/sub_impact.wav', volume: 0.68 },
    { from: 450, file: 'audio/text_tick.wav', volume: 0.48 },
    { from: 451, file: 'audio/chime_warm.wav', volume: 0.50 },

    // Shot 6 (478..576f): Official Vector Icon bullet checklist
    { from: 476, file: 'audio/whoosh_wipe.wav', volume: 0.80 },
    { from: 480, file: 'audio/pop_woody.wav', volume: 0.68 },
    { from: 498, file: 'audio/text_tick.wav', volume: 0.46 },
    { from: 500, file: 'audio/pop_woody.wav', volume: 0.68 },
    { from: 518, file: 'audio/pop_woody.wav', volume: 0.68 },
    { from: 534, file: 'audio/text_tick.wav', volume: 0.46 },
    { from: 548, file: 'audio/sub_impact.wav', volume: 0.76 },
    { from: 549, file: 'audio/chime_warm.wav', volume: 0.48 },

    // Shot 7 (568..750f): 3D MCP Playbook CTA + Follow InsiderForce Lockup
    { from: 566, file: 'audio/whoosh_wipe.wav', volume: 0.82 },
    { from: 570, file: 'audio/sub_impact.wav', volume: 0.78 },
    { from: 571, file: 'audio/chime_warm.wav', volume: 0.56 },
    { from: 578, file: 'audio/pop_woody.wav', volume: 0.66 },
    { from: 613, file: 'audio/text_tick.wav', volume: 0.44 },
    { from: 626, file: 'audio/text_tick.wav', volume: 0.46 },
    { from: 646, file: 'audio/sub_impact.wav', volume: 0.68 },
    { from: 663, file: 'audio/whoosh_air.wav', volume: 0.70 },
    { from: 665, file: 'audio/pop_woody.wav', volume: 0.62 },
    { from: 688, file: 'audio/chime_warm.wav', volume: 0.62 },
    { from: 690, file: 'audio/sub_impact.wav', volume: 0.64 },
  ];

  return (
    <StudioCanvas backgroundColor="#F2F2F2" gridType="arch-dots" watermark="insiderforce.io">
      {/* Studio Voiceover (calibrated at 0.98 so transient sub+VO sums never clip 0dBFS) */}
      <Audio src={staticFile('audio/voiceover.wav')} volume={0.98} />

      {/* Balanced 5-Band 93 BPM Music Bed */}
      <Audio src={staticFile('audio/music_bed_modern.wav')} volume={musicVol} />

      {/* Crisp Organic SFX Layer */}
      {sfxCues.map((cue, idx) => (
        <Sequence key={idx} from={cue.from} durationInFrames={45} layout="none">
          <Audio src={staticFile(cue.file)} volume={cue.volume} />
        </Sequence>
      ))}

      {/* Visual Sequences (6f blurred/whipped transition crossfades matched to 420ms whoosh_wipe) */}
      <Sequence from={0} durationInFrames={117}>
        <HookScene />
      </Sequence>
      <Sequence from={111} durationInFrames={68}>
        <BreatherTypoScene />
      </Sequence>
      <Sequence from={173} durationInFrames={140}>
        <McpGraphScene />
      </Sequence>
      <Sequence from={307} durationInFrames={102}>
        <TerminalFootageScene />
      </Sequence>
      <Sequence from={403} durationInFrames={80}>
        <LiveDocsFootageScene />
      </Sequence>
      <Sequence from={477} durationInFrames={96}>
        <RealIconChecklistScene />
      </Sequence>
      <Sequence from={567} durationInFrames={183}>
        <OutroCtaScene />
      </Sequence>
    </StudioCanvas>
  );
};
