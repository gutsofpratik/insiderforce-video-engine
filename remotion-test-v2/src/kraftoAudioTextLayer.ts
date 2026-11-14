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

export const kraftoAudioShortSchema = z.object({
  showTextLayer: z.boolean().default(true),
  branding: z.object({
    channelName: z.string().default('Krafto'),
    followButtonText: z.string().default('Follow'),
    followSubtext: z.string().default('Sound Effects · Audio Pack'),
    watermark: z.string().default(''),
  }),
});

export type KraftoAudioShortProps = z.infer<typeof kraftoAudioShortSchema> & {
  scene1Hook: { words: KineticWordProps[] };
  scene2Reveal: {
    phase1Words: KineticWordProps[];
    phase2Words: KineticWordProps[];
  };
  scene3Zephyr: {
    badge: { num: string; name: string; tagline: string };
    phase1Words: KineticWordProps[];
    phase2Words: KineticWordProps[];
    phase3Words: KineticWordProps[];
  };
  scene4Echo: {
    badge: { num: string; name: string; tagline: string };
    phase1Words: KineticWordProps[];
    phase2Words: KineticWordProps[];
    phase3Words: KineticWordProps[];
  };
  scene5Tide: {
    badge: { num: string; name: string; tagline: string };
    phase1Words: KineticWordProps[];
    phase2Words: KineticWordProps[];
  };
  scene6Setup: {
    phase1Words: KineticWordProps[];
    phase2Words: KineticWordProps[];
    phase3Words: KineticWordProps[];
    phase4Words: KineticWordProps[];
    urlPill: string;
  };
  scene7Outro: {
    words: KineticWordProps[];
  };
};

export const KRAFTO_AUDIO_DEFAULT_PROPS: KraftoAudioShortProps = {
  showTextLayer: true,
  branding: {
    channelName: 'Krafto',
    followButtonText: 'Follow',
    followSubtext: 'Sound Effects · Audio Pack',
    watermark: '',
  },
  scene1Hook: {
    words: [
    {
        "text": "Stop",
        "startFrame": 0.0,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "wasting",
        "startFrame": 8.6,
        "weight": "medium",
        "size": 52,
        "muted": true
    },
    {
        "text": "hours",
        "startFrame": 23.8,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "digging",
        "startFrame": 34.6,
        "weight": "medium",
        "size": 52,
        "muted": true
    },
    {
        "text": "through",
        "startFrame": 49.7,
        "weight": "medium",
        "size": 52,
        "muted": true,
        "lineBreakAfter": true
    },
    {
        "text": "bloated",
        "startFrame": 64.8,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "stock",
        "startFrame": 79.9,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "sites",
        "startFrame": 90.7,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "for",
        "startFrame": 101.5,
        "weight": "medium",
        "size": 52,
        "muted": true
    },
    {
        "text": "sound",
        "startFrame": 108.0,
        "weight": "bold",
        "size": 54
    },
    {
        "text": "effects.",
        "startFrame": 118.8,
        "weight": "bold",
        "size": 54,
        "underline": true
    }
],
  },
  scene2Reveal: {
    phase1Words: [
    {
        "text": "Krafto",
        "startFrame": 0.0,
        "weight": "heavy",
        "size": 52
    },
    {
        "text": "just",
        "startFrame": 12.5,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "launched",
        "startFrame": 21.0,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "an",
        "startFrame": 37.9,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "official",
        "startFrame": 42.1,
        "weight": "bold",
        "size": 50,
        "lineBreakAfter": true
    },
    {
        "text": "audio",
        "startFrame": 59.0,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "library",
        "startFrame": 69.6,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "built",
        "startFrame": 84.3,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "specifically",
        "startFrame": 94.9,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "for",
        "startFrame": 120.2,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "modern",
        "startFrame": 126.6,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "creators.",
        "startFrame": 139.3,
        "weight": "heavy",
        "size": 54,
        "underline": true
    }
],
    phase2Words: [
    {
        "text": "Every",
        "startFrame": 0.0,
        "weight": "bold",
        "size": 48
    },
    {
        "text": "track",
        "startFrame": 11.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "is",
        "startFrame": 22.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "a",
        "startFrame": 26.5,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "pristine",
        "startFrame": 28.7,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "32-bit",
        "startFrame": 46.3,
        "weight": "heavy",
        "size": 54,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "Float",
        "startFrame": 77.3,
        "weight": "heavy",
        "size": 54,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF",
        "lineBreakAfter": true
    },
    {
        "text": "stereo",
        "startFrame": 88.3,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "WAV",
        "startFrame": 99.6,
        "weight": "heavy",
        "size": 52
    },
    {
        "text": "with",
        "startFrame": 108.2,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "personal",
        "startFrame": 117.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "&",
        "startFrame": 134.7,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "commercial",
        "startFrame": 141.3,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "rights",
        "startFrame": 163.4,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "included.",
        "startFrame": 176.7,
        "weight": "heavy",
        "size": 54,
        "underline": true
    }
],
  },
  scene3Zephyr: {
    badge: {
      num: '01',
      name: 'Zephyr Ambience',
      tagline: 'Airy High-Frequency Atmosphere',
    },
    phase1Words: [
    {
        "text": "First",
        "startFrame": 0.0,
        "weight": "bold",
        "size": 48
    },
    {
        "text": "is",
        "startFrame": 15.0,
        "weight": "medium",
        "size": 48,
        "muted": true,
        "lineBreakAfter": true
    },
    {
        "text": "Zephyr",
        "startFrame": 21.0,
        "weight": "heavy",
        "size": 60,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "Ambience.",
        "startFrame": 39.0,
        "weight": "heavy",
        "size": 60,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    }
],
    phase2Words: [
    {
        "text": "An",
        "startFrame": 0.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "airy,",
        "startFrame": 4.3,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "high-frequency",
        "startFrame": 13.0,
        "weight": "heavy",
        "size": 54,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "atmospheric",
        "startFrame": 43.4,
        "weight": "bold",
        "size": 50,
        "lineBreakAfter": true
    },
    {
        "text": "texture",
        "startFrame": 67.2,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "that",
        "startFrame": 82.4,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "gives",
        "startFrame": 91.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "tech",
        "startFrame": 101.9,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "explainers",
        "startFrame": 110.6,
        "weight": "heavy",
        "size": 54,
        "underline": true
    }
],
    phase3Words: [
    {
        "text": "and",
        "startFrame": 0.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "motion",
        "startFrame": 6.1,
        "weight": "heavy",
        "size": 54,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "graphics",
        "startFrame": 19.1,
        "weight": "heavy",
        "size": 54,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF",
        "lineBreakAfter": true
    },
    {
        "text": "instant",
        "startFrame": 36.5,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "depth",
        "startFrame": 51.7,
        "weight": "heavy",
        "size": 54
    },
    {
        "text": "without",
        "startFrame": 62.5,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "cluttering",
        "startFrame": 77.7,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "dialogue.",
        "startFrame": 99.4,
        "weight": "heavy",
        "size": 54,
        "underline": true
    }
],
  },
  scene4Echo: {
    badge: {
      num: '02',
      name: 'Echo Ambience',
      tagline: 'Spatial Cinematic Pulse & Decay',
    },
    phase1Words: [
    {
        "text": "Second",
        "startFrame": 0.0,
        "weight": "bold",
        "size": 48
    },
    {
        "text": "is",
        "startFrame": 22.6,
        "weight": "medium",
        "size": 48,
        "muted": true,
        "lineBreakAfter": true
    },
    {
        "text": "Echo",
        "startFrame": 28.6,
        "weight": "heavy",
        "size": 60,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "Ambience.",
        "startFrame": 40.5,
        "weight": "heavy",
        "size": 60,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    }
],
    phase2Words: [
    {
        "text": "A",
        "startFrame": 0.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "spatial",
        "startFrame": 2.5,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "cinematic",
        "startFrame": 20.5,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "pulse",
        "startFrame": 43.6,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF",
        "lineBreakAfter": true
    },
    {
        "text": "with",
        "startFrame": 56.4,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "natural",
        "startFrame": 66.7,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "stereo",
        "startFrame": 84.7,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "decay,",
        "startFrame": 100.1,
        "weight": "heavy",
        "size": 54,
        "underline": true
    }
],
    phase3Words: [
    {
        "text": "Perfect",
        "startFrame": 0.0,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "for",
        "startFrame": 13.7,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "scene",
        "startFrame": 19.6,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "transitions,",
        "startFrame": 29.4,
        "weight": "heavy",
        "size": 54,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF",
        "lineBreakAfter": true
    },
    {
        "text": "UI",
        "startFrame": 54.9,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "reveals,",
        "startFrame": 60.9,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "and",
        "startFrame": 81.8,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "card",
        "startFrame": 90.7,
        "weight": "heavy",
        "size": 54
    },
    {
        "text": "snaps.",
        "startFrame": 102.7,
        "weight": "heavy",
        "size": 54,
        "underline": true
    }
],
  },
  scene5Tide: {
    badge: {
      num: '03',
      name: 'Tide Ambience',
      tagline: 'Dynamic Low-End Weight & Swell',
    },
    phase1Words: [
    {
        "text": "Third",
        "startFrame": 0.0,
        "weight": "bold",
        "size": 48
    },
    {
        "text": "is",
        "startFrame": 20.4,
        "weight": "medium",
        "size": 48,
        "muted": true,
        "lineBreakAfter": true
    },
    {
        "text": "Tide",
        "startFrame": 26.5,
        "weight": "heavy",
        "size": 60,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "Ambience.",
        "startFrame": 38.6,
        "weight": "heavy",
        "size": 60,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    }
],
    phase2Words: [
    {
        "text": "A",
        "startFrame": 0.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "dynamic",
        "startFrame": 2.4,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "low-end",
        "startFrame": 19.3,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "swell",
        "startFrame": 36.2,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF",
        "lineBreakAfter": true
    },
    {
        "text": "that",
        "startFrame": 48.2,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "brings",
        "startFrame": 57.9,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "organic",
        "startFrame": 72.4,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "weight",
        "startFrame": 89.3,
        "weight": "heavy",
        "size": 54,
        "underline": true
    },
    {
        "text": "to",
        "startFrame": 103.8,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "visual",
        "startFrame": 108.6,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "impacts",
        "startFrame": 123.1,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "&",
        "startFrame": 140.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "cuts.",
        "startFrame": 147.2,
        "weight": "heavy",
        "size": 54
    }
],
  },
  scene6Setup: {
    urlPill: 'mcp.trykrafto.xyz/mcp',
    phase1Words: [
    {
        "text": "And",
        "startFrame": 0.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "here",
        "startFrame": 7.8,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "is",
        "startFrame": 18.2,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "the",
        "startFrame": 23.4,
        "weight": "medium",
        "size": 48,
        "muted": true,
        "lineBreakAfter": true
    },
    {
        "text": "cheat",
        "startFrame": 31.2,
        "weight": "heavy",
        "size": 62,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "code.",
        "startFrame": 44.2,
        "weight": "heavy",
        "size": 62,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    }
],
    phase2Words: [
    {
        "text": "With",
        "startFrame": 0.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "Krafto's",
        "startFrame": 9.3,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "official",
        "startFrame": 27.8,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "MCP",
        "startFrame": 46.3,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "server,",
        "startFrame": 53.2,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF",
        "lineBreakAfter": true
    },
    {
        "text": "you",
        "startFrame": 67.1,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "can",
        "startFrame": 74.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "connect",
        "startFrame": 81.0,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "this",
        "startFrame": 97.1,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "directly",
        "startFrame": 106.4,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "to",
        "startFrame": 124.9,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "Claude.",
        "startFrame": 129.5,
        "weight": "heavy",
        "size": 56,
        "underline": true
    }
],
    phase3Words: [
    {
        "text": "Claude",
        "startFrame": 0.0,
        "weight": "heavy",
        "size": 52
    },
    {
        "text": "can",
        "startFrame": 12.4,
        "weight": "medium",
        "size": 46,
        "muted": true
    },
    {
        "text": "search,",
        "startFrame": 18.6,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "audition,",
        "startFrame": 30.9,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "&",
        "startFrame": 47.4,
        "weight": "medium",
        "size": 46,
        "muted": true
    },
    {
        "text": "pull",
        "startFrame": 53.6,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "sound",
        "startFrame": 72.1,
        "weight": "medium",
        "size": 46,
        "muted": true
    },
    {
        "text": "effects",
        "startFrame": 82.4,
        "weight": "medium",
        "size": 46,
        "muted": true,
        "lineBreakAfter": true
    },
    {
        "text": "straight",
        "startFrame": 96.9,
        "weight": "bold",
        "size": 50
    },
    {
        "text": "into",
        "startFrame": 113.4,
        "weight": "medium",
        "size": 46,
        "muted": true
    },
    {
        "text": "your",
        "startFrame": 121.6,
        "weight": "medium",
        "size": 46,
        "muted": true
    },
    {
        "text": "website",
        "startFrame": 129.9,
        "weight": "heavy",
        "size": 54,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "code",
        "startFrame": 144.3,
        "weight": "heavy",
        "size": 54,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    }
],
    phase4Words: [
    {
        "text": "or",
        "startFrame": 0.0,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "video",
        "startFrame": 4.2,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "timeline",
        "startFrame": 14.5,
        "weight": "heavy",
        "size": 56,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF",
        "lineBreakAfter": true
    },
    {
        "text": "without",
        "startFrame": 30.9,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "leaving",
        "startFrame": 45.4,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "your",
        "startFrame": 59.8,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "workspace.",
        "startFrame": 68.0,
        "weight": "heavy",
        "size": 54,
        "underline": true
    }
],
  },
  scene7Outro: {
    words: [
    {
        "text": "Comment",
        "startFrame": 0.0,
        "weight": "heavy",
        "size": 56
    },
    {
        "text": "Krafto",
        "startFrame": 15.8,
        "weight": "heavy",
        "size": 60,
        "highlightSweep": true,
        "highlightSweepColor": "#000000",
        "highlightSweepTextColor": "#FFFFFF"
    },
    {
        "text": "below",
        "startFrame": 29.3,
        "weight": "medium",
        "size": 48,
        "muted": true,
        "lineBreakAfter": true
    },
    {
        "text": "to",
        "startFrame": 40.6,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "get",
        "startFrame": 45.1,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "the",
        "startFrame": 51.9,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "setup",
        "startFrame": 58.6,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "guide",
        "startFrame": 69.9,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "&",
        "startFrame": 81.2,
        "weight": "medium",
        "size": 48,
        "muted": true
    },
    {
        "text": "audio",
        "startFrame": 87.9,
        "weight": "bold",
        "size": 52
    },
    {
        "text": "pack.",
        "startFrame": 99.1,
        "weight": "heavy",
        "size": 54,
        "underline": true
    }
],
  },
};
