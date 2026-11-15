import { z } from 'zod';
import { KineticWordProps } from './Primitives';

export const kineticWordSchema = z.object({
  text: z.string(),
  startFrame: z.number().min(0),
  weight: z.enum(['regular', 'medium', 'semibold', 'bold', 'heavy']).optional(),
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

export const kraftoMotionShortSchema = z.object({
  showTextLayer: z.boolean().default(true),
  branding: z.object({
    channelName: z.string().default('Krafto'),
    followButtonText: z.string().default('Follow'),
    followSubtext: z.string().default('Motion Graphics · MOGRT Pack'),
    watermark: z.string().default(''),
  }),
});

export type KraftoMotionShortProps = z.infer<typeof kraftoMotionShortSchema> & {
  scene1Hook: {
    phase1Words: KineticWordProps[];
    phase2Words: KineticWordProps[];
  };
  scene2Reveal: {
    phase1Words: KineticWordProps[];
    phase2Words: KineticWordProps[];
  };
  scene3Scribbles: {
    badge: { num: string; name: string; format: string };
    phase1Words: KineticWordProps[];
    phase2Words: KineticWordProps[];
  };
  scene4Typography: {
    badge: { num: string; name: string; format: string };
    phase1Words: KineticWordProps[];
    phase2Words: KineticWordProps[];
  };
  scene5Accents: {
    badge: { num: string; name: string; format: string };
    phase1Words: KineticWordProps[];
    phase2Words: KineticWordProps[];
  };
  scene6Workflow: {
    phase1Words: KineticWordProps[];
    phase2Words: KineticWordProps[];
  };
  scene7Outro: {
    phase1Words: KineticWordProps[];
    phase2Words: KineticWordProps[];
  };
};

export const KRAFTO_MOTION_DEFAULT_PROPS: KraftoMotionShortProps = {
  showTextLayer: true,
  branding: {
    channelName: 'Krafto',
    followButtonText: 'Follow',
    followSubtext: 'Motion Graphics · MOGRT Pack',
    watermark: '',
  },
  scene1Hook: {
    phase1Words: [
  {
    "text": "Most",
    "startFrame": 0,
    "weight": "bold",
    "size": 54
  },
  {
    "text": "editors",
    "startFrame": 9.3,
    "weight": "medium",
    "size": 54,
    "muted": true
  },
  {
    "text": "still",
    "startFrame": 25.5,
    "weight": "medium",
    "size": 54
  },
  {
    "text": "spend",
    "startFrame": 37.1,
    "weight": "medium",
    "size": 54
  },
  {
    "text": "hours",
    "startFrame": 48.7,
    "weight": "bold",
    "size": 54,
    "lineBreakAfter": true
  },
  {
    "text": "keyframing",
    "startFrame": 60.3,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "motion",
    "startFrame": 83.5,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "graphics",
    "startFrame": 97.4,
    "weight": "bold",
    "size": 54
  },
  {
    "text": "from",
    "startFrame": 115.9,
    "weight": "medium",
    "size": 54,
    "muted": true
  },
  {
    "text": "scratch,",
    "startFrame": 125.2,
    "weight": "bold",
    "size": 54
  }
],
    phase2Words: [
  {
    "text": "only",
    "startFrame": 0.3,
    "weight": "medium",
    "size": 54,
    "muted": true
  },
  {
    "text": "to",
    "startFrame": 10.2,
    "weight": "medium",
    "size": 54,
    "muted": true
  },
  {
    "text": "end",
    "startFrame": 15.2,
    "weight": "medium",
    "size": 54
  },
  {
    "text": "up",
    "startFrame": 22.6,
    "weight": "medium",
    "size": 54
  },
  {
    "text": "with",
    "startFrame": 27.5,
    "weight": "medium",
    "size": 54,
    "muted": true,
    "lineBreakAfter": true
  },
  {
    "text": "stiff,",
    "startFrame": 37.4,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "generic",
    "startFrame": 49.7,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "animations.",
    "startFrame": 67,
    "weight": "bold",
    "size": 54
  }
],
  },
  scene2Reveal: {
    phase1Words: [
  {
    "text": "Krafto",
    "startFrame": 0.6,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "just",
    "startFrame": 13.7,
    "weight": "medium",
    "size": 54
  },
  {
    "text": "dropped",
    "startFrame": 22.5,
    "weight": "bold",
    "size": 54
  },
  {
    "text": "a",
    "startFrame": 37.8,
    "weight": "medium",
    "size": 54,
    "muted": true
  },
  {
    "text": "massive",
    "startFrame": 40,
    "weight": "bold",
    "size": 54,
    "lineBreakAfter": true
  },
  {
    "text": "motion",
    "startFrame": 55.3,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "graphics",
    "startFrame": 68.5,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "library",
    "startFrame": 86,
    "weight": "bold",
    "size": 54
  }
],
    phase2Words: [
  {
    "text": "Instant",
    "startFrame": 0,
    "weight": "bold",
    "size": 54
  },
  {
    "text": "drag",
    "startFrame": 10.2,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "and",
    "startFrame": 16.2,
    "weight": "medium",
    "size": 54,
    "muted": true
  },
  {
    "text": "drop",
    "startFrame": 20.8,
    "weight": "heavy",
    "size": 54,
    "lineBreakAfter": true,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "animations",
    "startFrame": 26.8,
    "weight": "bold",
    "size": 54
  },
  {
    "text": "with",
    "startFrame": 41.8,
    "weight": "medium",
    "size": 54,
    "muted": true
  },
  {
    "text": "transparent",
    "startFrame": 47.8,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "alpha",
    "startFrame": 64.4,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "channels,",
    "startFrame": 71.9,
    "weight": "bold",
    "size": 54
  }
],
  },
  scene3Scribbles: {
    badge: {
      num: '01',
      name: 'Glowing Scribbles',
      format: 'MOGRT · 4K Alpha',
    },
    phase1Words: [
  {
    "text": "First",
    "startFrame": 1.4,
    "weight": "bold",
    "size": 54
  },
  {
    "text": "is",
    "startFrame": 52.1,
    "weight": "medium",
    "size": 54,
    "muted": true
  },
  {
    "text": "the",
    "startFrame": 57.5,
    "weight": "medium",
    "size": 54,
    "muted": true,
    "lineBreakAfter": true
  },
  {
    "text": "Glowing",
    "startFrame": 65.6,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "Scribbles",
    "startFrame": 84.6,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "pack.",
    "startFrame": 108.9,
    "weight": "bold",
    "size": 54
  }
],
    phase2Words: [
  {
    "text": "Hand-drawn",
    "startFrame": 0,
    "weight": "bold",
    "size": 52
  },
  {
    "text": "electric",
    "startFrame": 22.2,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "zigzag",
    "startFrame": 40.2,
    "weight": "heavy",
    "size": 52,
    "lineBreakAfter": true,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "bursts",
    "startFrame": 53.8,
    "weight": "bold",
    "size": 52
  },
  {
    "text": "and",
    "startFrame": 67.3,
    "weight": "medium",
    "size": 52,
    "muted": true
  },
  {
    "text": "kinetic",
    "startFrame": 74.1,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "accents",
    "startFrame": 89.9,
    "weight": "bold",
    "size": 52
  }
],
  },
  scene4Typography: {
    badge: {
      num: '02',
      name: 'Neon Kinetic Typography',
      format: 'MOGRT · Customizable Glow',
    },
    phase1Words: [
  {
    "text": "Second",
    "startFrame": 2.1,
    "weight": "bold",
    "size": 54
  },
  {
    "text": "is",
    "startFrame": 19.1,
    "weight": "medium",
    "size": 54,
    "muted": true,
    "lineBreakAfter": true
  },
  {
    "text": "Neon",
    "startFrame": 24.7,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "Kinetic",
    "startFrame": 36,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "Typography.",
    "startFrame": 55.8,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  }
],
    phase2Words: [
  {
    "text": "Bold",
    "startFrame": 0,
    "weight": "bold",
    "size": 52
  },
  {
    "text": "animated",
    "startFrame": 8.9,
    "weight": "bold",
    "size": 52
  },
  {
    "text": "headline",
    "startFrame": 26.8,
    "weight": "heavy",
    "size": 52,
    "lineBreakAfter": true,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "templates",
    "startFrame": 44.8,
    "weight": "bold",
    "size": 52
  },
  {
    "text": "with",
    "startFrame": 64.9,
    "weight": "medium",
    "size": 52,
    "muted": true
  },
  {
    "text": "customizable",
    "startFrame": 73.9,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "glow,",
    "startFrame": 100.8,
    "weight": "bold",
    "size": 52
  }
],
  },
  scene5Accents: {
    badge: {
      num: '03',
      name: 'Hand-Drawn Accent Bursts',
      format: 'Vector Sparks · MOGRT',
    },
    phase1Words: [
  {
    "text": "Third",
    "startFrame": 2.3,
    "weight": "bold",
    "size": 54
  },
  {
    "text": "are",
    "startFrame": 15.6,
    "weight": "medium",
    "size": 54,
    "muted": true,
    "lineBreakAfter": true
  },
  {
    "text": "Hand-Drawn",
    "startFrame": 23.6,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "Accent",
    "startFrame": 50.3,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "Bursts.",
    "startFrame": 66.3,
    "weight": "bold",
    "size": 54
  }
],
    phase2Words: [
  {
    "text": "Clean",
    "startFrame": 0.2,
    "weight": "bold",
    "size": 52
  },
  {
    "text": "vector",
    "startFrame": 11.1,
    "weight": "bold",
    "size": 52
  },
  {
    "text": "sparks,",
    "startFrame": 24.2,
    "weight": "heavy",
    "size": 52,
    "lineBreakAfter": true,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "diamonds,",
    "startFrame": 37.2,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "and",
    "startFrame": 54.7,
    "weight": "medium",
    "size": 52,
    "muted": true
  },
  {
    "text": "pointer",
    "startFrame": 61.2,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "sweeps",
    "startFrame": 76.5,
    "weight": "bold",
    "size": 52
  }
],
  },
  scene6Workflow: {
    phase1Words: [
  {
    "text": "Every",
    "startFrame": 2.3,
    "weight": "medium",
    "size": 52
  },
  {
    "text": "asset",
    "startFrame": 15.1,
    "weight": "bold",
    "size": 52
  },
  {
    "text": "comes",
    "startFrame": 27.8,
    "weight": "medium",
    "size": 52
  },
  {
    "text": "as",
    "startFrame": 40.6,
    "weight": "medium",
    "size": 52,
    "muted": true
  },
  {
    "text": "an",
    "startFrame": 45.7,
    "weight": "medium",
    "size": 52,
    "muted": true,
    "lineBreakAfter": true
  },
  {
    "text": "editable",
    "startFrame": 50.8,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "MOGRT",
    "startFrame": 71.2,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "and",
    "startFrame": 83.9,
    "weight": "medium",
    "size": 52,
    "muted": true
  },
  {
    "text": "transparent",
    "startFrame": 91.6,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "alpha",
    "startFrame": 119.6,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "overlay.",
    "startFrame": 132.4,
    "weight": "bold",
    "size": 52
  }
],
    phase2Words: [
  {
    "text": "Drop",
    "startFrame": 0.2,
    "weight": "bold",
    "size": 52
  },
  {
    "text": "them",
    "startFrame": 9.4,
    "weight": "medium",
    "size": 52,
    "muted": true
  },
  {
    "text": "straight",
    "startFrame": 18.6,
    "weight": "medium",
    "size": 52
  },
  {
    "text": "into",
    "startFrame": 37,
    "weight": "medium",
    "size": 52,
    "muted": true,
    "lineBreakAfter": true
  },
  {
    "text": "Premiere",
    "startFrame": 46.3,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "Pro,",
    "startFrame": 64.7,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "DaVinci,",
    "startFrame": 71.6,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "or",
    "startFrame": 87.8,
    "weight": "medium",
    "size": 52,
    "muted": true
  },
  {
    "text": "code",
    "startFrame": 92.4,
    "weight": "bold",
    "size": 52
  },
  {
    "text": "timelines",
    "startFrame": 101.6,
    "weight": "bold",
    "size": 52
  }
],
  },
  scene7Outro: {
    phase1Words: [
  {
    "text": "Comment",
    "startFrame": 2,
    "weight": "heavy",
    "size": 56,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "Motion",
    "startFrame": 17.3,
    "weight": "heavy",
    "size": 56,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "below",
    "startFrame": 30.3,
    "weight": "bold",
    "size": 54,
    "lineBreakAfter": true
  },
  {
    "text": "to",
    "startFrame": 41.2,
    "weight": "medium",
    "size": 52,
    "muted": true
  },
  {
    "text": "get",
    "startFrame": 45.6,
    "weight": "medium",
    "size": 52
  },
  {
    "text": "the",
    "startFrame": 52.1,
    "weight": "medium",
    "size": 52,
    "muted": true
  },
  {
    "text": "setup",
    "startFrame": 58.7,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "guide",
    "startFrame": 69.6,
    "weight": "bold",
    "size": 52
  },
  {
    "text": "and",
    "startFrame": 80.5,
    "weight": "medium",
    "size": 52,
    "muted": true
  },
  {
    "text": "the",
    "startFrame": 87,
    "weight": "medium",
    "size": 52,
    "muted": true
  },
  {
    "text": "full",
    "startFrame": 93.6,
    "weight": "bold",
    "size": 52
  },
  {
    "text": "motion",
    "startFrame": 102.3,
    "weight": "heavy",
    "size": 52,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "pack.",
    "startFrame": 115.4,
    "weight": "bold",
    "size": 52
  }
],
    phase2Words: [
  {
    "text": "And",
    "startFrame": 0,
    "weight": "medium",
    "size": 54,
    "muted": true
  },
  {
    "text": "make",
    "startFrame": 5.9,
    "weight": "medium",
    "size": 54
  },
  {
    "text": "sure",
    "startFrame": 13.7,
    "weight": "medium",
    "size": 54
  },
  {
    "text": "you",
    "startFrame": 21.6,
    "weight": "medium",
    "size": 54,
    "muted": true,
    "lineBreakAfter": true
  },
  {
    "text": "follow",
    "startFrame": 27.5,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "Krafto",
    "startFrame": 39.2,
    "weight": "heavy",
    "size": 54,
    "highlightSweep": true,
    "highlightSweepColor": "#000000",
    "highlightSweepTextColor": "#FFFFFF"
  },
  {
    "text": "for",
    "startFrame": 51,
    "weight": "medium",
    "size": 54,
    "muted": true
  },
  {
    "text": "the",
    "startFrame": 56.9,
    "weight": "medium",
    "size": 54,
    "muted": true
  },
  {
    "text": "next",
    "startFrame": 62.8,
    "weight": "bold",
    "size": 54
  },
  {
    "text": "drop.",
    "startFrame": 70.6,
    "weight": "bold",
    "size": 54
  }
],
  },
};
