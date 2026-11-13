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
  highlightSweep: z.boolean().optional(),
  highlightSweepColor: z.string().optional(),
  highlightSweepTextColor: z.string().optional(),
  lineBreakAfter: z.boolean().optional(),
});

export const fontBadgeSchema = z.object({
  num: z.string(),
  name: z.string(),
  tagline: z.string(),
});

/**
 * Full Remotion Studio editable Text Layer schema for KraftoMcpShort.
 */
export const kraftoMcpShortSchema = z.object({
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
    phase1Words: z.array(kineticWordSchema),
    phase2Words: z.array(kineticWordSchema),
  }),
  scene3IronMaiden: z.object({
    badge: fontBadgeSchema,
    phase1Words: z.array(kineticWordSchema),
    phase2Words: z.array(kineticWordSchema),
  }),
  scene4StopD: z.object({
    badge: fontBadgeSchema,
    phase1Words: z.array(kineticWordSchema),
    phase2Words: z.array(kineticWordSchema),
  }),
  scene5AardvarkCafe: z.object({
    badge: fontBadgeSchema,
    phase1Words: z.array(kineticWordSchema),
    phase2Words: z.array(kineticWordSchema),
  }),
  scene6Setup: z.object({
    words: z.array(kineticWordSchema),
    urlPill: z.string(),
  }),
  scene7Outro: z.object({
    words: z.array(kineticWordSchema),
  }),
});

export type KraftoMcpShortProps = z.infer<typeof kraftoMcpShortSchema>;

export const KRAFTO_MCP_DEFAULT_PROPS: KraftoMcpShortProps = {
  showTextLayer: true,
  branding: {
    watermark: '', // User constraint: zero insiderforce watermark
    channelName: 'Krafto',
    followButtonText: 'Follow',
    followSubtext: 'for more creative AI workflows',
  },

  // Scene 1 Hook (global 0..183f) - local 0..183f
  scene1Hook: {
    words: [
      { text: 'Most', startFrame: 0, weight: 'medium', muted: true },
      { text: 'developers', startFrame: 9, weight: 'bold', muted: true },
      { text: 'and', startFrame: 25, weight: 'medium', muted: true },
      { text: 'designers', startFrame: 29, weight: 'bold', lineBreakAfter: true },
      { text: 'still', startFrame: 46, weight: 'medium', muted: true },
      { text: 'waste', startFrame: 59, weight: 'bold', underline: true },
      { text: 'hours', startFrame: 72, weight: 'bold' },
      { text: 'hunting for', startFrame: 85, weight: 'medium', muted: true },
      { text: 'fonts', startFrame: 101, weight: 'bold', lineBreakAfter: true },
      { text: 'and end up with', startFrame: 115, weight: 'medium', muted: true },
      { text: 'generic', startFrame: 139, weight: 'heavy', highlightSweep: true },
      { text: 'typography.', startFrame: 156, weight: 'heavy', highlightSweep: true },
    ],
  },

  // Scene 2 Reveal & Dashboard (global 183..520f) - local 0..337f
  scene2Reveal: {
    phase1Words: [
      { text: 'But', startFrame: 3, weight: 'medium', muted: true },
      { text: 'Krafto', startFrame: 4, weight: 'bold' },
      { text: 'just released an official', startFrame: 18, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'Claude', startFrame: 60, weight: 'heavy', highlightSweep: true },
      { text: 'M-C-P', startFrame: 74, weight: 'heavy', highlightSweep: true },
      { text: 'server', startFrame: 89, weight: 'bold', lineBreakAfter: true },
      { text: 'that turns Claude into your', startFrame: 109, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'personal creative font library.', startFrame: 140, weight: 'bold', underline: true },
    ],
    phase2Words: [
      { text: 'Here are', startFrame: 202, weight: 'medium', muted: true },
      { text: 'three', startFrame: 213, weight: 'heavy', highlightSweep: true },
      { text: 'stunning', startFrame: 223, weight: 'heavy', highlightSweep: true },
      { text: 'Krafto', startFrame: 239, weight: 'bold' },
      { text: 'fonts', startFrame: 254, weight: 'bold', lineBreakAfter: true },
      { text: 'you can connect to your workflow', startFrame: 265, weight: 'medium', muted: true },
      { text: 'right now.', startFrame: 320, weight: 'heavy', underline: true },
    ],
  },

  // Scene 3 Font 1: Iron Maiden (global 520..842f) - local 0..322f
  scene3IronMaiden: {
    badge: {
      num: '01',
      name: 'Iron Maiden',
      tagline: 'High-Voltage Heavy Metal Typeface',
    },
    phase1Words: [
      { text: 'When you need', startFrame: 49, weight: 'medium', muted: true },
      { text: 'high-voltage', startFrame: 58, weight: 'heavy', highlightSweep: true },
      { text: 'headlines', startFrame: 80, weight: 'heavy', highlightSweep: true, lineBreakAfter: true },
      { text: 'with raw character & heavy metal attitude,', startFrame: 96, weight: 'medium', muted: true },
    ],
    phase2Words: [
      { text: 'Iron Maiden', startFrame: 170, weight: 'bold' },
      { text: 'transforms boring hero sections into', startFrame: 187, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'bold,', startFrame: 255, weight: 'heavy', highlightSweep: true },
      { text: 'unforgettable', startFrame: 274, weight: 'heavy', underline: true },
      { text: 'statements.', startFrame: 297, weight: 'heavy' },
    ],
  },

  // Scene 4 Font 2: StopD (global 842..1133f) - local 0..291f
  scene4StopD: {
    badge: {
      num: '02',
      name: 'Stop-D',
      tagline: 'Futuristic Tech Stencil Typeface',
    },
    phase1Words: [
      { text: 'A razor-sharp,', startFrame: 50, weight: 'bold', muted: true, lineBreakAfter: true },
      { text: 'futuristic', startFrame: 71, weight: 'heavy', highlightSweep: true },
      { text: 'stencil', startFrame: 93, weight: 'heavy', highlightSweep: true, lineBreakAfter: true },
      { text: 'typeface engineered for modern tech brands,', startFrame: 107, weight: 'medium', muted: true },
    ],
    phase2Words: [
      { text: 'web apps, and dashboards that demand', startFrame: 178, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'immediate', startFrame: 237, weight: 'heavy', highlightSweep: true },
      { text: 'visual', startFrame: 254, weight: 'heavy', highlightSweep: true },
      { text: 'authority.', startFrame: 269, weight: 'heavy', underline: true },
    ],
  },

  // Scene 5 Font 3: Aardvark Cafe (global 1133..1455f) - local 0..322f
  scene5AardvarkCafe: {
    badge: {
      num: '03',
      name: 'Aardvark Cafe',
      tagline: 'Timeless Retro Editorial Typeface',
    },
    phase1Words: [
      { text: 'When you want', startFrame: 57, weight: 'medium', muted: true },
      { text: 'warm', startFrame: 67, weight: 'heavy', highlightSweep: true },
      { text: 'retro', startFrame: 79, weight: 'heavy', highlightSweep: true },
      { text: 'charm', startFrame: 92, weight: 'heavy', highlightSweep: true, lineBreakAfter: true },
      { text: 'and editorial craftsmanship,', startFrame: 103, weight: 'medium', muted: true },
    ],
    phase2Words: [
      { text: 'Aardvark Cafe delivers timeless personality', startFrame: 158, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'that makes any creative project look', startFrame: 231, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'custom', startFrame: 287, weight: 'heavy', highlightSweep: true },
      { text: 'designed.', startFrame: 300, weight: 'heavy', highlightSweep: true },
    ],
  },

  // Scene 6 Setup & MCP Endpoint (global 1455..1749f) - local 0..294f
  scene6Setup: {
    words: [
      { text: 'Best part:', startFrame: 0, weight: 'bold', muted: true },
      { text: 'connect the', startFrame: 22, weight: 'medium', muted: true },
      { text: 'Krafto', startFrame: 31, weight: 'heavy' },
      { text: 'MCP', startFrame: 45, weight: 'heavy', highlightSweep: true, lineBreakAfter: true },
      { text: 'to let Claude search and style your', startFrame: 193, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'typography', startFrame: 243, weight: 'heavy', highlightSweep: true },
      { text: 'automatically.', startFrame: 264, weight: 'heavy', underline: true },
    ],
    urlPill: 'mcp.trykrafto.xyz/mcp',
  },

  // Scene 7 Outro CTA (global 1749..1980f) - local 0..231f
  scene7Outro: {
    words: [
      { text: 'Comment', startFrame: 3, weight: 'heavy' },
      { text: 'Krafto', startFrame: 8, weight: 'heavy', highlightSweep: true, lineBreakAfter: true },
      { text: 'below for the setup guide', startFrame: 25, weight: 'medium', muted: true, lineBreakAfter: true },
      { text: 'and font pack.', startFrame: 65, weight: 'bold' },
    ],
  },
};
