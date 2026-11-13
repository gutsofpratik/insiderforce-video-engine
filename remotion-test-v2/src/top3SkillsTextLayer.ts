import { z } from 'zod';

/** Editable schema for a single animated word inside KineticWordFlow. */
export const kineticWordSchema = z.object({
  text: z.string(),
  startFrame: z.number().int().min(0),
  weight: z.enum(['regular', 'medium', 'bold', 'heavy']).optional(),
  italic: z.boolean().optional(),
  muted: z.boolean().optional(),
  size: z.number().optional(),
  underline: z.boolean().optional(),
  highlightPill: z.boolean().optional(),
  lineBreakAfter: z.boolean().optional(),
});

export const roadmapItemTextSchema = z.object({
  num: z.string(),
  slug: z.string(),
  icon: z.string(),
  delay: z.number().int().min(0),
});

/**
 * Full Remotion Studio editable Text Layer schema for Top3ClaudeSkillsShort.
 * Open the Composition Props panel in Remotion Studio to edit any text live.
 */
export const top3ClaudeSkillsSchema = z.object({
  showTextLayer: z.boolean(),
  branding: z.object({
    watermark: z.string(),
    channelName: z.string(),
    followButtonText: z.string(),
    followSubtext: z.string(),
  }),
  scene1Hook: z.object({
    words: z.array(kineticWordSchema),
  }),
  scene2Reveal: z.object({
    words: z.array(kineticWordSchema),
  }),
  scene3Roadmap: z.object({
    words: z.array(kineticWordSchema),
    items: z.array(roadmapItemTextSchema),
  }),
  scene4FrontendDesign: z.object({
    badgeIndex: z.string(),
    badgeSlug: z.string(),
    phase1Words: z.array(kineticWordSchema),
    phase2Words: z.array(kineticWordSchema),
    bullet1: z.string(),
    bullet2: z.string(),
  }),
  scene5WebappTesting: z.object({
    badgeIndex: z.string(),
    badgeSlug: z.string(),
    phase1Words: z.array(kineticWordSchema),
    phase2Words: z.array(kineticWordSchema),
    bullet1: z.string(),
    bullet2: z.string(),
  }),
  scene6McpBuilder: z.object({
    badgeIndex: z.string(),
    badgeSlug: z.string(),
    words: z.array(kineticWordSchema),
  }),
  scene7Terminal: z.object({
    words: z.array(kineticWordSchema),
    commandPill: z.string(),
  }),
  scene8Outro: z.object({
    words: z.array(kineticWordSchema),
  }),
});

export type Top3ClaudeSkillsProps = z.infer<typeof top3ClaudeSkillsSchema>;

export const TOP3_CLAUDE_SKILLS_DEFAULT_PROPS: Top3ClaudeSkillsProps = {
  showTextLayer: true,
  branding: {
    watermark: 'insiderforce.io',
    channelName: 'InsiderForce',
    followButtonText: 'Follow',
    followSubtext: 'for more AI workflows',
  },
  scene1Hook: {
    words: [
      { text: 'Most', startFrame: 0, weight: 'medium', muted: true },
      { text: 'developers', startFrame: 6, weight: 'bold', muted: true },
      { text: 'still', startFrame: 29, weight: 'medium', muted: true },
      { text: 'paste', startFrame: 37, weight: 'bold', underline: true, lineBreakAfter: true },
      { text: 'the same', startFrame: 48, weight: 'medium', muted: true },
      { text: 'giant prompts', startFrame: 68, weight: 'bold', lineBreakAfter: true },
      { text: 'into', startFrame: 93, weight: 'medium', muted: true },
      { text: 'Claude', startFrame: 98, weight: 'heavy', highlightPill: true },
      { text: 'Code', startFrame: 109, weight: 'heavy', highlightPill: true, lineBreakAfter: true },
      { text: 'every', startFrame: 122, weight: 'medium', muted: true },
      { text: 'single', startFrame: 132, weight: 'medium', muted: true },
      { text: 'day.', startFrame: 145, weight: 'bold' },
    ],
  },
  scene2Reveal: {
    words: [
      { text: 'But', startFrame: 9, weight: 'medium', muted: true },
      { text: 'Anthropic', startFrame: 11, weight: 'bold' },
      { text: 'released', startFrame: 47, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'Agent', startFrame: 67, weight: 'heavy', highlightPill: true },
      { text: 'Skills', startFrame: 77, weight: 'heavy', highlightPill: true, lineBreakAfter: true },
      { text: 'SKILL.md', startFrame: 110, weight: 'bold', italic: true },
      { text: 'playbooks', startFrame: 136, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'upgrading', startFrame: 159, weight: 'medium', muted: true },
      { text: 'Claude', startFrame: 173, weight: 'bold' },
      { text: 'automatically.', startFrame: 186, weight: 'bold', underline: true },
    ],
  },
  scene3Roadmap: {
    words: [
      { text: 'Top', startFrame: 20, weight: 'heavy', highlightPill: true },
      { text: 'three', startFrame: 28, weight: 'heavy', highlightPill: true },
      { text: 'skills', startFrame: 36, weight: 'bold', lineBreakAfter: true },
      { text: 'to', startFrame: 48, weight: 'medium', muted: true },
      { text: 'connect', startFrame: 52, weight: 'bold', underline: true },
      { text: 'now:', startFrame: 65, weight: 'bold' },
    ],
    items: [
      { num: '01', slug: 'frontend-design', icon: 'skills_v4/icons/puck_react.png', delay: 14 },
      { num: '02', slug: 'webapp-testing', icon: 'skills_v4/icons/puck_playwright.png', delay: 24 },
      { num: '03', slug: 'mcp-builder', icon: 'skills_v4/icons/puck_modelcontextprotocol.png', delay: 34 },
    ],
  },
  scene4FrontendDesign: {
    badgeIndex: '01',
    badgeSlug: 'frontend-design',
    phase1Words: [
      { text: 'Normally,', startFrame: 61, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'AI UIs', startFrame: 79, weight: 'bold' },
      { text: 'look', startFrame: 109, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'generic', startFrame: 116, weight: 'heavy', highlightPill: true },
      { text: '& templated.', startFrame: 137, weight: 'bold', underline: true },
    ],
    phase2Words: [
      { text: 'Strict', startFrame: 202, weight: 'bold' },
      { text: 'design', startFrame: 207, weight: 'bold' },
      { text: 'systems,', startFrame: 219, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'bold', startFrame: 238, weight: 'heavy', highlightPill: true },
      { text: 'typography,', startFrame: 251, weight: 'heavy', highlightPill: true, lineBreakAfter: true },
      { text: 'and', startFrame: 287, weight: 'medium', muted: true },
      { text: 'motion.', startFrame: 290, weight: 'bold' },
      { text: 'Custom-built.', startFrame: 435, weight: 'bold', underline: true },
    ],
    bullet1: 'Cohesive palette & hierarchy rules',
    bullet2: 'Production typography & micro-motion',
  },
  scene5WebappTesting: {
    badgeIndex: '02',
    badgeSlug: 'webapp-testing',
    phase1Words: [
      { text: 'Instead', startFrame: 58, weight: 'medium', muted: true },
      { text: 'of', startFrame: 63, weight: 'medium', muted: true },
      { text: 'guessing', startFrame: 68, weight: 'bold', underline: true, lineBreakAfter: true },
      { text: 'if your UI', startFrame: 92, weight: 'medium', muted: true },
      { text: 'actually', startFrame: 110, weight: 'bold' },
      { text: 'works...', startFrame: 126, weight: 'bold' },
    ],
    phase2Words: [
      { text: 'Spins up', startFrame: 163, weight: 'bold' },
      { text: 'Playwright', startFrame: 181, weight: 'heavy', highlightPill: true, lineBreakAfter: true },
      { text: 'clicks flows,', startFrame: 234, weight: 'medium', muted: true },
      { text: 'catches', startFrame: 307, weight: 'bold' },
      { text: 'bugs.', startFrame: 335, weight: 'bold', underline: true },
    ],
    bullet1: 'Drives live Chromium & clicks flows',
    bullet2: 'Captures screenshots & console errors',
  },
  scene6McpBuilder: {
    badgeIndex: '03',
    badgeSlug: 'mcp-builder',
    words: [
      { text: 'Scaffold', startFrame: 234, weight: 'bold' },
      { text: 'clean', startFrame: 251, weight: 'bold', lineBreakAfter: true },
      { text: 'TypeScript', startFrame: 261, weight: 'bold', underline: true },
      { text: 'or', startFrame: 284, weight: 'medium', muted: true },
      { text: 'Python', startFrame: 288, weight: 'bold', underline: true, lineBreakAfter: true },
      { text: 'MCP', startFrame: 301, weight: 'heavy', highlightPill: true },
      { text: 'servers.', startFrame: 318, weight: 'heavy', highlightPill: true },
    ],
  },
  scene7Terminal: {
    words: [
      { text: 'Run', startFrame: 26, weight: 'bold', muted: true },
      { text: 'one command', startFrame: 32, weight: 'heavy', highlightPill: true, lineBreakAfter: true },
      { text: 'to install', startFrame: 144, weight: 'medium', muted: true },
      { text: 'all three', startFrame: 156, weight: 'bold', underline: true },
      { text: 'in seconds.', startFrame: 172, weight: 'bold' },
    ],
    commandPill: '$ npx skills add anthropics/skills',
  },
  scene8Outro: {
    words: [
      { text: 'Comment', startFrame: 8, weight: 'bold' },
      { text: '“SKILLS”', startFrame: 14, weight: 'heavy', highlightPill: true, lineBreakAfter: true },
      { text: 'for the', startFrame: 69, weight: 'medium', muted: true },
      { text: 'Claude', startFrame: 91, weight: 'bold' },
      { text: 'Skills Pack.', startFrame: 113, weight: 'bold', underline: true },
    ],
  },
};
