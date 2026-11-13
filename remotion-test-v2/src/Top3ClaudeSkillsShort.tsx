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
import {
  TOP3_CLAUDE_SKILLS_DEFAULT_PROPS,
  Top3ClaudeSkillsProps,
} from './top3SkillsTextLayer';

/** Pill header badge shared by the 3 featured skill scenes (InsiderForce numbered chapter style). */
const SkillChapterBadge: React.FC<{
  indexLabel: string;
  skillSlug: string;
  puckSrc: string;
  startFrame: number;
}> = ({ indexLabel, skillSlug, puckSrc, startFrame }) => {
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
      <Img src={staticFile(puckSrc)} style={{ width: 66, height: 66, objectFit: 'contain' }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span
          style={{
            fontFamily: INTER_FONT,
            fontSize: 28,
            fontWeight: 800,
            color: '#D97757',
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
          {skillSlug}
        </span>
      </div>
    </div>
  );
};

/**
 * Scene 1 (0..154f): Cold Hook — Stop pasting giant prompts into Claude Code every day.
 */
const HookScene: React.FC<{
  textProps: Top3ClaudeSkillsProps['scene1Hook'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const puckClaudePop = spring({ frame, fps, config: { damping: 15, stiffness: 220, mass: 0.7 } });
  const puckGitPop = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 15, stiffness: 220, mass: 0.7 },
  });
  const cardPop = spring({
    frame: Math.max(0, frame - 36),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.8 },
  });

  const floatA = Math.sin(frame * 0.09) * 6;
  const floatB = Math.cos(frame * 0.08) * 6;

  return (
    <BlurVignetteScene
      durationInFrames={166}
      fadeInFrames={0}
      fadeOutFrames={12}
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {/* Raised 3D official brand medallions */}
        <div
          style={{
            position: 'absolute',
            top: 230,
            width: 820,
            display: 'flex',
            justifyContent: 'center',
            gap: 54,
            alignItems: 'center',
          }}
        >
          <DirectionalMotionBlur blurY={puckClaudePop < 0.99 ? (1 - puckClaudePop) * 8 : 0}>
            <Img
              src={staticFile('skills_v4/icons/puck_claude.png')}
              style={{
                width: 176,
                height: 176,
                transform: `translateY(${(1 - puckClaudePop) * 32 + floatA}px) scale(${0.7 + puckClaudePop * 0.3})`,
                opacity: interpolate(frame, [0, 6], [0, 1], { extrapolateRight: 'clamp' }),
              }}
            />
          </DirectionalMotionBlur>
          <DirectionalMotionBlur blurY={puckGitPop < 0.99 ? (1 - puckGitPop) * 8 : 0}>
            <Img
              src={staticFile('skills_v4/icons/puck_anthropic.png')}
              style={{
                width: 176,
                height: 176,
                transform: `translateY(${(1 - puckGitPop) * 32 + floatB}px) scale(${0.7 + puckGitPop * 0.3})`,
                opacity: interpolate(frame, [8, 14], [0, 1], { extrapolateRight: 'clamp' }),
              }}
            />
          </DirectionalMotionBlur>
        </div>

        {/* Editable Kinetic Text Layer synced to skills_word_timings.json (0..143f) */}
        {showTextLayer ? (
          <Sequence name="Text Layer · Hook" layout="none">
            <KineticWordFlow
              top={455}
              baseSize={64}
              maxWidth={880}
              words={textProps.words}
            />
          </Sequence>
        ) : null}

        {/* Real cropped GitHub anthropics/skills preview peeking at bottom */}
        <div
          style={{
            position: 'absolute',
            top: 930,
            transform: `translateY(${(1 - cardPop) * 44}px) scale(${0.92 + cardPop * 0.08})`,
            opacity: interpolate(frame, [36, 46], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <BeveledMediaFrame width={880} borderWidth={12} borderRadius={22} drift>
            <Img
              src={staticFile('skills_v4/web/anthropics_skills_repo.png')}
              style={{ width: '100%', display: 'block' }}
            />
          </BeveledMediaFrame>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 2 (148..374f): Anthropic Agent Skills Reveal (SKILL.md playbooks).
 */
const AgentSkillsRevealScene: React.FC<{
  textProps: Top3ClaudeSkillsProps['scene2Reveal'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  // Global 154..374 -> local 0..220
  const driftX = interpolate(frame, [0, 220], [-8, 10]);

  return (
    <BlurVignetteScene
      durationInFrames={220}
      fadeInFrames={12}
      fadeOutFrames={12}
      enterMode="lens-blur"
      exitMode="slide-up"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {showTextLayer ? (
          <Sequence name="Text Layer · Agent Skills Reveal" layout="none">
            <KineticWordFlow
              top={265}
              baseSize={68}
              maxWidth={900}
              words={textProps.words}
            />
          </Sequence>
        ) : null}

        {/* Floating Claude & GitHub pucks */}
        <Img
          src={staticFile('skills_v4/icons/puck_github.png')}
          style={{
            position: 'absolute',
            left: 88,
            top: 760,
            width: 116,
            height: 116,
            transform: `translate(${driftX}px, ${Math.sin(frame * 0.09) * 7}px)`,
            zIndex: 6,
          }}
        />
        <Img
          src={staticFile('skills_v4/icons/puck_claude.png')}
          style={{
            position: 'absolute',
            right: 88,
            top: 745,
            width: 120,
            height: 120,
            transform: `translate(${-driftX}px, ${Math.cos(frame * 0.08) * 7}px)`,
            zIndex: 6,
          }}
        />

        {/* Real cropped agentskills.io overview showing folder structure SKILL.md */}
        <div style={{ position: 'absolute', top: 820 }}>
          <BeveledMediaFrame enterFrame={10} width={890} borderWidth={12} borderRadius={22} drift>
            <Img
              src={staticFile('skills_v4/web/agentskills_home.png')}
              style={{ width: '100%', display: 'block' }}
            />
          </BeveledMediaFrame>
        </div>

        <CursorClickOverlay
          from={[760, 1460]}
          to={[530, 1140]}
          moveStartFrame={54}
          clickFrame={80}
        />
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 3 (362..458f): Visual Roadmap ("Top 3 Skills Right Now").
 */
const Top3RoadmapScene: React.FC<{
  textProps: Top3ClaudeSkillsProps['scene3Roadmap'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = textProps.items;

  return (
    <BlurVignetteScene
      durationInFrames={96}
      fadeInFrames={12}
      fadeOutFrames={12}
      enterMode="slide-up"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {showTextLayer ? (
          <Sequence name="Text Layer · Top 3 Roadmap" layout="none">
            <KineticWordFlow
              top={320}
              baseSize={74}
              maxWidth={900}
              words={textProps.words}
            />
          </Sequence>
        ) : null}

        <div
          style={{
            position: 'absolute',
            top: 660,
            width: 820,
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          {items.map((it) => {
            const p = spring({
              frame: Math.max(0, frame - it.delay),
              fps,
              config: { damping: 16, stiffness: 215, mass: 0.72 },
            });
            return (
              <div
                key={it.slug}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 28,
                  padding: '24px 34px',
                  border: '1.5px solid #E2E5EB',
                  boxShadow: '0 14px 32px rgba(15, 23, 42, 0.08)',
                  transform: `translateY(${(1 - p) * 26}px) scale(${0.92 + p * 0.08})`,
                  opacity: interpolate(frame - it.delay, [0, 6], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                  <Img src={staticFile(it.icon)} style={{ width: 84, height: 84 }} />
                  <span
                    style={{
                      fontFamily: INTER_FONT,
                      fontSize: 42,
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      color: '#141416',
                    }}
                  >
                    {it.slug}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: INTER_FONT,
                    fontSize: 34,
                    fontWeight: 800,
                    color: '#D97757',
                  }}
                >
                  {it.num}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 4 (454..928f): Skill #1 — frontend-design (SKILL.md + live agentskills scroll + checklists).
 */
const FrontendDesignScene: React.FC<{
  textProps: Top3ClaudeSkillsProps['scene4FrontendDesign'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  // Local 3..462 corresponds to global 457..916
  const showSecondMedia = frame >= 240;
  const phaseATy = interpolate(frame, [232, 244], [0, -34], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phaseAOpa = interpolate(frame, [232, 242], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phaseBTy = interpolate(frame, [238, 250], [34, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phaseBOpa = interpolate(frame, [238, 248], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <BlurVignetteScene
      durationInFrames={474}
      fadeInFrames={12}
      fadeOutFrames={12}
      enterMode="lens-blur"
      exitMode="slide-up"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {showTextLayer ? (
          <Sequence name="Text Layer · Skill 01 Badge & Headline" layout="none">
            <div style={{ position: 'absolute', top: 196 }}>
              <SkillChapterBadge
                indexLabel={textProps.badgeIndex}
                skillSlug={textProps.badgeSlug}
                puckSrc="skills_v4/icons/puck_react.png"
                startFrame={2}
              />
            </div>

            {frame < 169 ? (
              <KineticWordFlow
                top={335}
                baseSize={62}
                maxWidth={880}
                words={textProps.phase1Words}
              />
            ) : (
              <KineticWordFlow
                top={335}
                baseSize={64}
                maxWidth={900}
                words={textProps.phase2Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Supporting Tailwind + Claude pucks */}
        <Img
          src={staticFile('skills_v4/icons/puck_tailwind.png')}
          style={{
            position: 'absolute',
            right: 84,
            top: 660,
            width: 110,
            height: 110,
            transform: `translateY(${Math.sin(frame * 0.08) * 7}px)`,
            zIndex: 6,
          }}
        />

        {/* Phase A: Real GitHub SKILL.md card */}
        {frame < 246 ? (
          <div
            style={{
              position: 'absolute',
              top: 710,
              transform: `translateY(${phaseATy}px)`,
              opacity: phaseAOpa,
            }}
          >
            <BeveledMediaFrame enterFrame={10} width={890} borderWidth={12} borderRadius={22} drift>
              <Img
                src={staticFile('skills_v4/web/frontend_design_skill.png')}
                style={{ width: '100%', display: 'block' }}
              />
            </BeveledMediaFrame>
          </div>
        ) : null}

        {/* Phase B: Real headless web-scroll MP4 + icon feature rows */}
        {showSecondMedia ? (
          <div
            style={{
              position: 'absolute',
              top: 700,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 26,
              transform: `translateY(${phaseBTy}px)`,
              opacity: phaseBOpa,
            }}
          >
            <BeveledMediaFrame enterFrame={240} width={870} borderWidth={12} borderRadius={22}>
              <OffthreadVideo
                src={staticFile('skills_v4/footage/agentskills_scroll.mp4')}
                style={{ width: '100%', display: 'block' }}
                muted
              />
            </BeveledMediaFrame>
            {showTextLayer ? (
              <div style={{ width: 820, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <RealIconBulletRow
                  iconSrc={staticFile('skills_v4/icons/icon_react.png')}
                  label={textProps.bullet1}
                  startFrame={254}
                />
                <RealIconBulletRow
                  iconSrc={staticFile('skills_v4/icons/icon_tailwind.png')}
                  label={textProps.bullet2}
                  startFrame={288}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        <CursorClickOverlay
          from={[780, 1280]}
          to={[500, 960]}
          moveStartFrame={84}
          clickFrame={116}
        />
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 5 (908..1297f): Skill #2 — webapp-testing (Playwright live browser checks).
 */
const WebappTestingScene: React.FC<{
  textProps: Top3ClaudeSkillsProps['scene5WebappTesting'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  // Local 0..389 corresponds to global 908..1297
  const showLiveScroll = frame >= 150;

  return (
    <BlurVignetteScene
      durationInFrames={389}
      fadeInFrames={12}
      fadeOutFrames={12}
      enterMode="slide-up"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {showTextLayer ? (
          <Sequence name="Text Layer · Skill 02 Badge & Headline" layout="none">
            <div style={{ position: 'absolute', top: 196 }}>
              <SkillChapterBadge
                indexLabel={textProps.badgeIndex}
                skillSlug={textProps.badgeSlug}
                puckSrc="skills_v4/icons/puck_playwright.png"
                startFrame={4}
              />
            </div>

            {frame < 148 ? (
              <KineticWordFlow
                top={335}
                baseSize={64}
                maxWidth={900}
                words={textProps.phase1Words}
              />
            ) : (
              <KineticWordFlow
                top={335}
                baseSize={64}
                maxWidth={900}
                words={textProps.phase2Words}
              />
            )}
          </Sequence>
        ) : null}

        {/* Phase A: Official SKILL.md proof card */}
        {!showLiveScroll ? (
          <div style={{ position: 'absolute', top: 715 }}>
            <BeveledMediaFrame enterFrame={12} width={890} borderWidth={12} borderRadius={22} drift>
              <Img
                src={staticFile('skills_v4/web/webapp_testing_skill.png')}
                style={{ width: '100%', display: 'block' }}
              />
            </BeveledMediaFrame>
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 700,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <BeveledMediaFrame enterFrame={150} width={870} borderWidth={12} borderRadius={22}>
              <OffthreadVideo
                src={staticFile('skills_v4/footage/playwright_scroll.mp4')}
                style={{ width: '100%', display: 'block' }}
                muted
              />
            </BeveledMediaFrame>

            {showTextLayer ? (
              <div style={{ width: 820, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <RealIconBulletRow
                  iconSrc={staticFile('skills_v4/icons/icon_playwright.png')}
                  label={textProps.bullet1}
                  startFrame={181}
                />
                <RealIconBulletRow
                  iconSrc={staticFile('skills_v4/icons/icon_claude.png')}
                  label={textProps.bullet2}
                  startFrame={270}
                />
              </div>
            ) : null}
          </div>
        )}

        <CursorClickOverlay
          from={[770, 1340]}
          to={[470, 960]}
          moveStartFrame={204}
          clickFrame={234}
        />
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 6 (1285..1674f): Skill #3 — mcp-builder (Node architecture diagram + SKILL.md).
 */
const McpBuilderScene: React.FC<{
  textProps: Top3ClaudeSkillsProps['scene6McpBuilder'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  // Local 0..389 corresponds to global 1285..1674
  const { fps } = useVideoConfig();

  const wireProgress = interpolate(frame, [65, 130], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const nodeLeftPop = spring({ frame: Math.max(0, frame - 62), fps, config: { damping: 16, stiffness: 205 } });
  const nodeMidPop = spring({ frame: Math.max(0, frame - 88), fps, config: { damping: 16, stiffness: 205 } });
  const nodeRightPop = spring({ frame: Math.max(0, frame - 112), fps, config: { damping: 16, stiffness: 205 } });

  return (
    <BlurVignetteScene
      durationInFrames={389}
      fadeInFrames={12}
      fadeOutFrames={12}
      enterMode="lens-blur"
      exitMode="slide-up"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {showTextLayer ? (
          <Sequence name="Text Layer · Skill 03 Badge & Headline" layout="none">
            <div style={{ position: 'absolute', top: 196 }}>
              <SkillChapterBadge
                indexLabel={textProps.badgeIndex}
                skillSlug={textProps.badgeSlug}
                puckSrc="skills_v4/icons/puck_modelcontextprotocol.png"
                startFrame={4}
              />
            </div>

            <KineticWordFlow
              top={335}
              baseSize={64}
              maxWidth={900}
              words={textProps.words}
            />
          </Sequence>
        ) : null}

        {/* Orthogonal InsiderForce connector graph with real 3D pucks */}
        <div style={{ position: 'absolute', top: 615, width: 860, height: 210 }}>
          <svg width="860" height="210" viewBox="0 0 860 210" style={{ position: 'absolute', inset: 0 }}>
            <path
              d="M 150 105 L 430 105 L 710 105"
              stroke="#CBD5E1"
              strokeWidth="4"
              strokeDasharray="10 8"
              fill="none"
              pathLength={1}
              strokeDashoffset={1 - wireProgress}
            />
          </svg>
          <Img
            src={staticFile('skills_v4/icons/puck_claude.png')}
            style={{
              position: 'absolute',
              left: 70,
              top: 25,
              width: 160,
              height: 160,
              transform: `scale(${0.7 + nodeLeftPop * 0.3})`,
              opacity: nodeLeftPop,
            }}
          />
          <Img
            src={staticFile('skills_v4/icons/puck_modelcontextprotocol.png')}
            style={{
              position: 'absolute',
              left: 350,
              top: 25,
              width: 160,
              height: 160,
              transform: `scale(${0.7 + nodeMidPop * 0.3})`,
              opacity: nodeMidPop,
            }}
          />
          <Img
            src={staticFile('skills_v4/icons/puck_typescript.png')}
            style={{
              position: 'absolute',
              left: 630,
              top: 10,
              width: 120,
              height: 120,
              transform: `scale(${0.7 + nodeRightPop * 0.3})`,
              opacity: nodeRightPop,
            }}
          />
          <Img
            src={staticFile('skills_v4/icons/puck_python.png')}
            style={{
              position: 'absolute',
              left: 660,
              top: 90,
              width: 120,
              height: 120,
              transform: `scale(${0.7 + nodeRightPop * 0.3})`,
              opacity: nodeRightPop,
            }}
          />
        </div>

        {/* Real cropped mcp-builder SKILL.md proof */}
        <div style={{ position: 'absolute', top: 840 }}>
          <BeveledMediaFrame enterFrame={48} width={885} borderWidth={12} borderRadius={22} drift>
            <Img
              src={staticFile('skills_v4/web/mcp_builder_skill.png')}
              style={{ width: '100%', display: 'block' }}
            />
          </BeveledMediaFrame>
        </div>
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 7 (1662..1879f): One-command terminal install MP4 (`npx skills add anthropics/skills`).
 */
const TerminalSetupScene: React.FC<{
  textProps: Top3ClaudeSkillsProps['scene7Terminal'];
  showTextLayer: boolean;
}> = ({ textProps, showTextLayer }) => {
  const frame = useCurrentFrame();
  // Local 0..217 corresponds to global 1662..1879

  return (
    <BlurVignetteScene
      durationInFrames={217}
      fadeInFrames={12}
      fadeOutFrames={12}
      enterMode="slide-up"
      exitMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {showTextLayer ? (
          <Sequence name="Text Layer · Setup Command" layout="none">
            <KineticWordFlow
              top={270}
              baseSize={66}
              maxWidth={900}
              words={textProps.words}
            />
          </Sequence>
        ) : null}

        {/* Real executed terminal recording MP4 */}
        <div style={{ position: 'absolute', top: 645 }}>
          <BeveledMediaFrame enterFrame={10} width={895} borderWidth={12} borderRadius={24} drift>
            <OffthreadVideo
              src={staticFile('skills_v4/footage/terminal_skills_cli.mp4')}
              style={{ width: '100%', display: 'block' }}
              muted
            />
          </BeveledMediaFrame>
        </div>

        {/* Floating command badge below terminal */}
        {showTextLayer ? (
          <div
            style={{
              position: 'absolute',
              top: 1270,
              backgroundColor: '#141416',
              color: '#FFFFFF',
              borderRadius: 999,
              padding: '18px 34px',
              fontFamily: INTER_FONT,
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              boxShadow: '0 16px 34px rgba(15, 23, 42, 0.16)',
              opacity: interpolate(frame, [28, 38], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            {textProps.commandPill}
          </div>
        ) : null}

        <CursorClickOverlay
          from={[790, 1460]}
          to={[540, 1295]}
          moveStartFrame={64}
          clickFrame={92}
        />
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

/**
 * Scene 8 (1867..2100f): Comment "SKILLS" + 3D Playbook + InsiderForce Follow Lockup.
 */
const OutroCtaScene: React.FC<{
  textProps: Top3ClaudeSkillsProps['scene8Outro'];
  branding: Top3ClaudeSkillsProps['branding'];
  showTextLayer: boolean;
}> = ({ textProps, branding, showTextLayer }) => {
  const frame = useCurrentFrame();
  // Local 0..233 corresponds to global 1867..2100
  const { fps } = useVideoConfig();

  const bookPop = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 16, stiffness: 175, mass: 0.85 },
  });
  const bookTilt = Math.sin(frame * 0.05) * 2.2;
  const bookY = Math.sin(frame * 0.08) * 6;
  const followPop = spring({
    frame: Math.max(0, frame - 142),
    fps,
    config: { damping: 16, stiffness: 205, mass: 0.7 },
  });

  return (
    <BlurVignetteScene
      durationInFrames={233}
      fadeInFrames={12}
      fadeOutFrames={0}
      enterMode="lens-blur"
    >
      <AbsoluteFill style={{ alignItems: 'center' }}>
        {showTextLayer ? (
          <Sequence name="Text Layer · Outro CTA" layout="none">
            <KineticWordFlow
              top={230}
              baseSize={68}
              maxWidth={900}
              words={textProps.words}
            />
          </Sequence>
        ) : null}

        {/* Real rendered 3D hardcover Playbook */}
        <DirectionalMotionBlur blurY={bookPop < 0.99 ? (1 - bookPop) * 8 : 0}>
          <Img
            src={staticFile('skills_v4/skills_playbook_book.png')}
            style={{
              position: 'absolute',
              top: 470,
              left: 195,
              width: 690,
              height: 'auto',
              transform: `translateY(${(1 - bookPop) * 44 + bookY}px) scale(${0.86 + bookPop * 0.14}) rotate(${bookTilt}deg)`,
              opacity: interpolate(frame, [4, 16], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          />
        </DirectionalMotionBlur>

        {/* Bottom InsiderForce Follow Pill + Handle Lockup (136..233f) */}
        {frame >= 136 ? (
          <div
            style={{
              position: 'absolute',
              top: 1380,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              transform: `translateY(${(1 - followPop) * 24}px) scale(${0.92 + followPop * 0.08})`,
              opacity: interpolate(frame, [136, 146], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 18,
                backgroundColor: '#FFFFFF',
                borderRadius: 999,
                padding: '14px 36px 14px 18px',
                border: '1.5px solid #D9DCE3',
                boxShadow: '0 14px 34px rgba(15, 23, 42, 0.12)',
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
                <Img src={staticFile('skills_v4/icons/icon_claude.png')} style={{ width: 28, height: 28 }} />
              </div>
              <span
                style={{
                  fontFamily: INTER_FONT,
                  fontSize: 36,
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  color: '#141416',
                }}
              >
                {branding.channelName}
              </span>
              <span
                style={{
                  backgroundColor: '#141416',
                  color: '#FFFFFF',
                  borderRadius: 999,
                  padding: '8px 20px',
                  fontFamily: INTER_FONT,
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {branding.followButtonText}
              </span>
            </div>

            <div
              style={{
                fontFamily: INTER_ITALIC_FONT,
                fontStyle: 'italic',
                fontSize: 34,
                fontWeight: 700,
                color: '#52525B',
                letterSpacing: '-0.02em',
              }}
            >
              {branding.followSubtext}
            </div>
          </div>
        ) : null}

        <CursorClickOverlay
          from={[780, 1660]}
          to={[668, 1422]}
          moveStartFrame={148}
          clickFrame={180}
        />
      </AbsoluteFill>
    </BlurVignetteScene>
  );
};

export const Top3ClaudeSkillsShort: React.FC<Partial<Top3ClaudeSkillsProps>> = (rawProps) => {
  const props: Top3ClaudeSkillsProps = {
    ...TOP3_CLAUDE_SKILLS_DEFAULT_PROPS,
    ...rawProps,
  };
  const frame = useCurrentFrame();

  // Dynamic voice-aware ducking on the real @InsiderForce YouTube background music (synced to ElevenLabs voiceover)
  const musicVol = interpolate(
    frame,
    [0, 10, 152, 162, 360, 370, 444, 454, 906, 916, 1283, 1293, 1660, 1670, 1865, 1875, 2068, 2088, 2100],
    [0.50, 0.40, 0.40, 0.52, 0.40, 0.52, 0.40, 0.52, 0.40, 0.52, 0.40, 0.52, 0.40, 0.52, 0.40, 0.54, 0.56, 0.18, 0.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Authentic ~125-140 events/min pre-lapped (-2f) stereo SFX timeline (pre-mixed into audio/skills_sfx_stem.wav)

  return (
    <StudioCanvas
      backgroundColor="#F2F2F2"
      gridType="arch-dots"
      watermark={props.showTextLayer ? props.branding.watermark : ''}
    >
      {/* Mastered ElevenLabs Narration (cut & broadcast-EQ'd to InsiderForce pacing) */}
      <Audio src={staticFile('audio/skills_voiceover.wav')} volume={0.94} />

      {/* Original @InsiderForce Background Music (cut cleanly from YouTube source) */}
      <Audio src={staticFile('audio/channel_music_bed.wav')} volume={musicVol} />

      {/* Pre-mixed 58-cue Pre-Lapped (-2f) Stereo SFX Stem (eliminates 58 dynamic mid-playback Audio mounts) */}
      <Audio src={staticFile('audio/skills_sfx_stem.wav')} />

      {/* Overlapping Sequences with 12f blurred / whipped visual transitions */}
      <Sequence name="Scene 1 · Hook" from={0} durationInFrames={166}>
        <HookScene textProps={props.scene1Hook} showTextLayer={props.showTextLayer} />
      </Sequence>
      <Sequence name="Scene 2 · Agent Skills Reveal" from={154} durationInFrames={220}>
        <AgentSkillsRevealScene textProps={props.scene2Reveal} showTextLayer={props.showTextLayer} />
      </Sequence>
      <Sequence name="Scene 3 · Top 3 Roadmap" from={362} durationInFrames={96}>
        <Top3RoadmapScene textProps={props.scene3Roadmap} showTextLayer={props.showTextLayer} />
      </Sequence>
      <Sequence name="Scene 4 · Skill 01 frontend-design" from={446} durationInFrames={474}>
        <FrontendDesignScene textProps={props.scene4FrontendDesign} showTextLayer={props.showTextLayer} />
      </Sequence>
      <Sequence name="Scene 5 · Skill 02 webapp-testing" from={908} durationInFrames={389}>
        <WebappTestingScene textProps={props.scene5WebappTesting} showTextLayer={props.showTextLayer} />
      </Sequence>
      <Sequence name="Scene 6 · Skill 03 mcp-builder" from={1285} durationInFrames={389}>
        <McpBuilderScene textProps={props.scene6McpBuilder} showTextLayer={props.showTextLayer} />
      </Sequence>
      <Sequence name="Scene 7 · Setup CLI" from={1662} durationInFrames={217}>
        <TerminalSetupScene textProps={props.scene7Terminal} showTextLayer={props.showTextLayer} />
      </Sequence>
      <Sequence name="Scene 8 · Playbook CTA" from={1867} durationInFrames={233}>
        <OutroCtaScene textProps={props.scene8Outro} branding={props.branding} showTextLayer={props.showTextLayer} />
      </Sequence>
    </StudioCanvas>
  );
};
